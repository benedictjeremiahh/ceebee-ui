import { describe, expect, it } from 'vitest';
import { buildHealthReport, DEPLOYMENT_KEY } from './health';
import { UI_MANIFEST } from './ui-manifest.generated';
import type { UiManifest } from './ui-manifest';

const manifest: UiManifest = {
  name: '@ceebee/ui',
  version: '0.4.1',
  skins: ['astra', 'clarity', 'moodboard'],
  exports: { server: 28, client: 74 },
};

function check(input: UiManifest, key: string) {
  return buildHealthReport(input, {}).checks.find((candidate) => candidate.key === key);
}

describe('docs health report', () => {
  it('reports the generated manifest as healthy', () => {
    const report = buildHealthReport(manifest, {}, new Date('2026-08-23T00:00:00Z'));
    expect(report.schemaVersion).toBe(1);
    expect(report.deploymentKey).toBe(DEPLOYMENT_KEY);
    expect(report.checks.every((candidate) => candidate.status === 'healthy')).toBe(true);
  });

  it('calls a build without Skins critical, because the docs would render unstyled', () => {
    expect(check({ ...manifest, skins: [] }, 'documentation_render')?.status).toBe('critical');
  });

  it('calls an empty export surface critical', () => {
    expect(check({ ...manifest, exports: { server: 0, client: 0 } }, 'documentation_render')?.status)
      .toBe('critical');
  });

  it('rejects a version that is not semver', () => {
    expect(check({ ...manifest, version: 'next' }, 'package_metadata')?.status).toBe('critical');
    expect(check({ ...manifest, version: '1.0.0-beta.2' }, 'package_metadata')?.status).toBe('healthy');
  });

  it('publishes version, export surface, and Skin count as metrics', () => {
    const metrics = Object.fromEntries(
      buildHealthReport(manifest, {}).metrics.map((metric) => [metric.key, metric.value]),
    );
    expect(metrics.package_version).toBe('0.4.1');
    expect(metrics.exported_components).toBe(102);
    expect(metrics.available_skins).toBe(3);
  });

  it('describes the package the docs were actually built against', () => {
    expect(UI_MANIFEST.name).toBe('@ceebee/ui');
    expect(buildHealthReport().checks.every((candidate) => candidate.status === 'healthy')).toBe(true);
  });
});
