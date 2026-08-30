// What the documentation deployment can honestly say about itself.
//
// The docs site exists to render the library, so its health is the two things that make rendering
// possible: a library surface to import and the Skins the pages are styled with. Everything else a
// visitor would notice — a broken page, a wrong example — is a build failure, not a runtime state
// this endpoint could observe.
import { UI_MANIFEST } from './ui-manifest.generated';
import type { UiManifest } from './ui-manifest';
import type { HealthReport } from '@ceebee/health-contract';

export type { HealthCheck, HealthReport, HealthStatus, ProductMetric } from '@ceebee/health-contract';

export const DEPLOYMENT_KEY = 'ceebee-ui-docs';

const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

export function buildHealthReport(
  manifest: UiManifest = UI_MANIFEST,
  env: Record<string, string | undefined> = process.env,
  now: Date = new Date(),
): HealthReport {
  const surface = manifest.exports.server + manifest.exports.client;
  const renderable = surface > 0 && manifest.skins.length > 0;
  const metadataValid = manifest.name === '@ceebee/ui' && SEMVER.test(manifest.version);

  return {
    schemaVersion: 1,
    deploymentKey: DEPLOYMENT_KEY,
    generatedAt: now.toISOString(),
    revision: revision(env),
    checks: [
      {
        key: 'documentation_render',
        label: 'Dokumentasi',
        status: renderable ? 'healthy' : 'critical',
        summary: renderable
          ? `Dokumentasi dibangun dengan ${surface} export dan ${manifest.skins.length} Skin.`
          : surface === 0
            ? 'Library tidak mengekspor apa pun, sehingga halaman dokumentasi tidak dapat dirender.'
            : 'Skin tidak ikut terbawa ke build, sehingga dokumentasi tampil tanpa Skin.',
      },
      {
        key: 'package_metadata',
        label: 'Metadata package',
        status: metadataValid ? 'healthy' : 'critical',
        summary: metadataValid
          ? `Package ${manifest.name} versi ${manifest.version}.`
          : 'Nama atau versi package tidak valid, sehingga rilis tidak dapat dipercaya.',
      },
    ],
    metrics: [
      {
        key: 'package_version',
        label: 'Versi package',
        value: manifest.version,
        format: 'text',
        group: 'Library',
        description: 'Versi @ceebee/ui yang dipakai build dokumentasi ini.',
        order: 10,
      },
      {
        key: 'exported_components',
        label: 'Export publik',
        value: surface,
        format: 'number',
        group: 'Library',
        description: 'Jumlah nilai yang diekspor entry server dan client.',
        order: 20,
      },
      {
        key: 'available_skins',
        label: 'Skin tersedia',
        value: manifest.skins.length,
        format: 'number',
        group: 'Library',
        description: 'Jumlah Skin yang dapat dipilih di dokumentasi.',
        order: 30,
      },
    ],
  };
}

function revision(env: Record<string, string | undefined>) {
  const commit = env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);
  const message = env.VERCEL_GIT_COMMIT_MESSAGE?.split('\n')[0]?.trim().slice(0, 120);
  return {
    commit: commit || 'unknown',
    message: message || 'Deployment revision tidak tersedia di runtime ini.',
  };
}
