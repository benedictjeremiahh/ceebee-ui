import { defineConfig } from 'tsup';

// The server and client builds stay separate so their chunks cannot carry the
// "use client" directive across the boundary.
export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    clean: true,
    treeshake: true,
    external: ['react', 'react-dom'],
  },
  {
    entry: {
      client: 'src/client.ts',
      // Keep large runtimes separate from the helpers also used by eagerly loaded UI.
      'internal/expression-editor': 'src/form/expression-editor/expression-editor.tsx',
      'internal/worksheet': 'src/data/worksheet/worksheet.tsx',
      'internal/schedule': 'src/data/schedule/schedule.tsx',
      'internal/diagram': 'src/data/diagram/diagram.tsx',
      'internal/diagram-editor': 'src/data/diagram/diagram-editor.tsx',
      'internal/focus-recovery': 'src/focus/focus-recovery/focus-recovery.tsx',
      'internal/css-probe': 'src/lib/css-probe.ts',
      'internal/cn': 'src/lib/cn.ts',
      'internal/media-query': 'src/lib/use-media-query.ts',
      'internal/region-fullscreen': 'src/lib/use-region-fullscreen.ts',
      'internal/time-series-math': 'src/data/time-series/time-series.math.ts',
      'internal/pan-zoom-skeleton': 'src/data/pan-zoom-canvas/pan-zoom-canvas.skeleton.tsx',
    },
    format: ['esm'],
    splitting: true,
    dts: { entry: ['src/client.ts'] },
    clean: false,
    treeshake: true,
    banner: { js: '"use client";' },
    external: ['react', 'react-dom', 'motion', '@base-ui/react', 'lucide-react', 'antd', '@ant-design/cssinjs', '@xyflow/react', 'lightweight-charts', 'react-organizational-chart'],
  },
]);
