import 'dart:convert';

import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';

const String _performancePrefix = 'CB_GLASS_PERF';
const int _surfaceCount = 12;

void main() {
  final IntegrationTestWidgetsFlutterBinding binding =
      IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  binding.framePolicy = LiveTestWidgetsFlutterBindingFramePolicy.fullyLive;

  testWidgets('compares independent and grouped glass raster cost', (
    WidgetTester tester,
  ) async {
    final List<_BenchmarkMode> sequence = <_BenchmarkMode>[
      _BenchmarkMode.independent,
      _BenchmarkMode.grouped,
      _BenchmarkMode.grouped,
      _BenchmarkMode.independent,
    ];

    for (int index = 0; index < sequence.length; index += 1) {
      final _BenchmarkMode mode = sequence[index];
      await tester.pumpWidget(_GlassPerformanceApp(mode: mode));
      await tester.pump();
      await Future<void>.delayed(CbMotionTokens.deliberate * 3);

      final String reportKey = '${mode.name}_${index + 1}';
      await binding.watchPerformance(() async {
        await Future<void>.delayed(CbMotionTokens.deliberate * 8);
      }, reportKey: reportKey);

      final Object? report = binding.reportData?[reportKey];
      expect(report, isA<Map<String, dynamic>>());
      final Map<String, dynamic> metrics = report! as Map<String, dynamic>;
      // Stable machine-readable output; the runner stores it outside the repo.
      // ignore: avoid_print
      print(
        '$_performancePrefix ${jsonEncode(<String, Object?>{'mode': mode.name, 'sample': index + 1, 'frameCount': metrics['frame_count'], 'buildAverageMs': metrics['average_frame_build_time_millis'], 'rasterAverageMs': metrics['average_frame_rasterizer_time_millis'], 'rasterP90Ms': metrics['90th_percentile_frame_rasterizer_time_millis'], 'rasterP99Ms': metrics['99th_percentile_frame_rasterizer_time_millis'], 'rasterWorstMs': metrics['worst_frame_rasterizer_time_millis'], 'missedRasterBudget': metrics['missed_frame_rasterizer_budget_count']})}',
      );
    }
  });
}

enum _BenchmarkMode { independent, grouped }

class _GlassPerformanceApp extends StatelessWidget {
  const _GlassPerformanceApp({required this.mode});

  final _BenchmarkMode mode;

  @override
  Widget build(BuildContext context) => MaterialApp(
    debugShowCheckedModeBanner: false,
    theme: cbThemeData(skin: CbSkin.ceebee, brightness: Brightness.dark),
    home: _GlassPerformanceScene(mode: mode),
  );
}

class _GlassPerformanceScene extends StatefulWidget {
  const _GlassPerformanceScene({required this.mode});

  final _BenchmarkMode mode;

  @override
  State<_GlassPerformanceScene> createState() => _GlassPerformanceSceneState();
}

class _GlassPerformanceSceneState extends State<_GlassPerformanceScene>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: CbMotionTokens.deliberate * 4,
  )..repeat(reverse: true);

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final CbSkinTokens tokens = context.cb;
    Widget surfaces = GridView.count(
      padding: const EdgeInsets.all(CbStructure.space4),
      crossAxisCount: 3,
      mainAxisSpacing: CbStructure.space3,
      crossAxisSpacing: CbStructure.space3,
      children: List<Widget>.generate(
        _surfaceCount,
        (int index) => CbSurface(
          variant: CbSurfaceVariant.glass,
          glassStyle: index.isEven ? CbGlassStyle.regular : CbGlassStyle.clear,
          padding: CbPad.sm,
          child: Center(
            child: Text(
              '${index + 1}',
              style: Theme.of(context).textTheme.titleLarge,
            ),
          ),
        ),
      ),
    );
    if (widget.mode == _BenchmarkMode.grouped) {
      surfaces = BackdropGroup(child: surfaces);
    }

    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: <Widget>[
          ColoredBox(color: tokens.surface.toColor()),
          AnimatedBuilder(
            animation: _controller,
            builder: (BuildContext context, Widget? child) => Stack(
              children: <Widget>[
                Positioned(
                  top: CbStructure.space8,
                  left:
                      -CbStructure.space8 +
                      (_controller.value * CbStructure.space8 * 3),
                  child: _BenchmarkOrb(color: tokens.decorRose.toColor()),
                ),
                Positioned(
                  right:
                      -CbStructure.space8 +
                      (_controller.value * CbStructure.space8 * 2),
                  bottom: CbStructure.space8 * 2,
                  child: _BenchmarkOrb(color: tokens.decorTeal.toColor()),
                ),
              ],
            ),
          ),
          SafeArea(
            child: Column(
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.fromLTRB(
                    CbStructure.space4,
                    CbStructure.space3,
                    CbStructure.space4,
                    CbStructure.space1,
                  ),
                  child: Text(
                    '${widget.mode.name} · $_surfaceCount glass surfaces',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ),
                Expanded(child: surfaces),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _BenchmarkOrb extends StatelessWidget {
  const _BenchmarkOrb({required this.color});

  final Color color;

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: BoxDecoration(color: color, shape: BoxShape.circle),
    child: const SizedBox.square(dimension: CbStructure.space8 * 4),
  );
}
