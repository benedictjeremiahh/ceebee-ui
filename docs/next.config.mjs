import createMDX from '@next/mdx';

const withMDX = createMDX({ extension: /\.mdx?$/ });

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next writes its own AGENTS.md/CLAUDE.md here; this repo already has one authoring
  // contract at the root and two files named AGENTS.md would mean two different things.
  agentRules: false,
  pageExtensions: ['ts', 'tsx', 'mdx'],
  transpilePackages: ['@ceebee/ui'],
};

export default withMDX(nextConfig);
