#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const options = parseArguments(process.argv.slice(2));
const repository = options.repo ?? await currentRepository();
const runs = await ghJson([
  'run', 'list',
  '--repo', repository,
  '--limit', '1000',
  '--created', `${options.since}..${options.until}`,
  '--json', 'databaseId,name,event,conclusion,createdAt,status,url',
]);
const completedRuns = runs.filter((run) => run.status === 'completed');
const jobs = (await mapLimited(completedRuns, 8, async (run) => {
  const detail = await ghJson([
    'run', 'view', String(run.databaseId),
    '--repo', repository,
    '--json', 'jobs',
  ]);
  return detail.jobs.map((job) => ({ ...job, run }));
})).flat();

const report = buildReport(repository, completedRuns, jobs, options);
if (options.json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  printMarkdown(report);
}

function parseArguments(args) {
  const today = new Date();
  const defaultUntil = today.toISOString().slice(0, 10);
  const defaultSinceDate = new Date(today);
  defaultSinceDate.setUTCDate(defaultSinceDate.getUTCDate() - 13);
  const parsed = {
    since: defaultSinceDate.toISOString().slice(0, 10),
    until: defaultUntil,
    repo: undefined,
    json: false,
  };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--') continue;
    if (argument === '--json') parsed.json = true;
    else if (argument === '--since') parsed.since = requiredValue(args, ++index, argument);
    else if (argument === '--until') parsed.until = requiredValue(args, ++index, argument);
    else if (argument === '--repo') parsed.repo = requiredValue(args, ++index, argument);
    else throw new Error(`Unknown argument: ${argument}`);
  }
  for (const [name, value] of [['since', parsed.since], ['until', parsed.until]]) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`--${name} must be YYYY-MM-DD`);
  }
  if (parsed.since > parsed.until) throw new Error('--since must not be after --until');
  return parsed;
}

function requiredValue(args, index, option) {
  const value = args[index];
  if (!value || value.startsWith('--')) throw new Error(`${option} requires a value`);
  return value;
}

async function currentRepository() {
  const result = await ghJson(['repo', 'view', '--json', 'nameWithOwner']);
  return result.nameWithOwner;
}

async function ghJson(args) {
  const { stdout } = await exec('gh', args, { maxBuffer: 64 * 1024 * 1024 });
  return JSON.parse(stdout);
}

async function mapLimited(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

function increment(map, key) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function sortedCounts(map) {
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
}

function buildReport(repo, reportRuns, reportJobs, range) {
  const jobConclusions = new Map();
  const failuresByWorkflow = new Map();
  const failuresByJob = new Map();
  const failuresByEvent = new Map();
  const failuresByStep = new Map();

  for (const job of reportJobs) {
    increment(jobConclusions, job.conclusion ?? 'unknown');
    if (job.conclusion !== 'failure') continue;
    increment(failuresByWorkflow, job.run.name);
    increment(failuresByJob, `${job.run.name} / ${job.name}`);
    increment(failuresByEvent, job.run.event);
    const failedSteps = job.steps.filter((step) => step.conclusion === 'failure');
    if (failedSteps.length === 0) increment(failuresByStep, `${job.run.name} / ${job.name} / unreported step`);
    for (const step of failedSteps) {
      increment(failuresByStep, `${job.run.name} / ${job.name} / ${step.name}`);
    }
  }

  const failedJobs = reportJobs.filter((job) => job.conclusion === 'failure').length;
  return {
    generatedAt: new Date().toISOString(),
    repository: repo,
    since: range.since,
    until: range.until,
    runs: reportRuns.length,
    jobs: reportJobs.length,
    failedJobs,
    failureRate: reportJobs.length === 0 ? 0 : failedJobs / reportJobs.length,
    jobConclusions: sortedCounts(jobConclusions),
    failuresByWorkflow: sortedCounts(failuresByWorkflow),
    failuresByJob: sortedCounts(failuresByJob),
    failuresByEvent: sortedCounts(failuresByEvent),
    failuresByStep: sortedCounts(failuresByStep),
  };
}

function printMarkdown(report) {
  console.log(`# Actions reliability — ${report.repository}`);
  console.log(`\nGenerated: ${report.generatedAt}`);
  console.log(`\nWindow: ${report.since} through ${report.until}`);
  console.log(`\n${report.runs} completed runs, ${report.jobs} jobs, ${report.failedJobs} failed jobs (${(report.failureRate * 100).toFixed(1)}%).`);
  printCounts('Job conclusions', report.jobConclusions);
  printCounts('Failures by workflow', report.failuresByWorkflow);
  printCounts('Failures by job', report.failuresByJob);
  printCounts('Failures by event', report.failuresByEvent);
  printCounts('Failures by step', report.failuresByStep);
}

function printCounts(title, rows) {
  console.log(`\n## ${title}\n`);
  console.log('| Item | Count |');
  console.log('| --- | ---: |');
  if (rows.length === 0) console.log('| None | 0 |');
  for (const row of rows) console.log(`| ${row.name.replaceAll('|', '\\|')} | ${row.count} |`);
}
