import createMDX from '@next/mdx';

// Without gfm, every markdown table in the docs renders as literal text full of pipe characters.
const withMDX = createMDX({
  extension: /\.mdx?$/,
  // Turbopack needs the plugin named rather than imported: loader options must stay serializable.
  options: { remarkPlugins: [['remark-gfm', {}]] },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next writes its own AGENTS.md/CLAUDE.md here; this repo already has one authoring
  // contract at the root and two files named AGENTS.md would mean two different things.
  agentRules: false,
  pageExtensions: ['ts', 'tsx', 'mdx'],
  transpilePackages: ['@ceebee/ui'],
};

export default withMDX(nextConfig);
