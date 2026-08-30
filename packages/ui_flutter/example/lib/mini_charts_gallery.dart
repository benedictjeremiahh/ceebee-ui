import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key miniChartsGalleryKey = Key('mini-charts-gallery');

class MiniChartsGallery extends StatelessWidget {
  const MiniChartsGallery({super.key});

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;
    return Column(
      key: miniChartsGalleryKey,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Text('Mini charts', style: type.displaySmall),
        const SizedBox(height: CbStructure.space2),
        Text(
          'Ceebee-owned painters summarize proportion, trend, and count without pretending to be full analytical charts.',
          style: type.bodyLarge,
        ),
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          variant: CbSurfaceVariant.tinted,
          tone: CbTone.brand,
          padding: CbPad.lg,
          child: LayoutBuilder(
            builder: (BuildContext context, BoxConstraints constraints) {
              final bool wide = constraints.maxWidth >= CbStructure.space8 * 9;
              if (wide) {
                return const IntrinsicHeight(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: <Widget>[
                      Expanded(child: _ReleaseShare()),
                      SizedBox(width: CbStructure.space5),
                      VerticalDivider(),
                      SizedBox(width: CbStructure.space5),
                      Expanded(child: _ReleaseSignals()),
                    ],
                  ),
                );
              }
              return const Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  _ReleaseShare(),
                  SizedBox(height: CbStructure.space5),
                  Divider(),
                  SizedBox(height: CbStructure.space5),
                  _ReleaseSignals(),
                ],
              );
            },
          ),
        ),
        const SizedBox(height: CbStructure.space4),
        const _LoadingCompanions(),
      ],
    );
  }
}

class _ReleaseShare extends StatelessWidget {
  const _ReleaseShare();

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      Text(
        'Release composition',
        style: Theme.of(context).textTheme.titleLarge,
      ),
      const SizedBox(height: CbStructure.space2),
      Text(
        '42 changes reviewed',
        style: Theme.of(context).textTheme.bodyMedium,
      ),
      const SizedBox(height: CbStructure.space4),
      Row(
        children: <Widget>[
          CbDonut(
            semanticLabel: 'Release composition: 24 features, 12 fixes, and 6 documentation changes',
            slices: const <CbDonutSlice>[
              CbDonutSlice(value: 24, label: 'Features'),
              CbDonutSlice(value: 12, label: 'Fixes'),
              CbDonutSlice(value: 6, label: 'Documentation'),
            ],
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                Text('42', style: Theme.of(context).textTheme.headlineSmall),
                Text('total', style: Theme.of(context).textTheme.bodySmall),
              ],
            ),
          ),
          const SizedBox(width: CbStructure.space4),
          const Expanded(
            child: Column(
              children: <Widget>[
                _ShareRow(
                  hue: CbDecorHue.violet,
                  label: 'Features',
                  value: '24',
                ),
                SizedBox(height: CbStructure.space3),
                _ShareRow(hue: CbDecorHue.blue, label: 'Fixes', value: '12'),
                SizedBox(height: CbStructure.space3),
                _ShareRow(
                  hue: CbDecorHue.teal,
                  label: 'Documentation',
                  value: '6',
                ),
              ],
            ),
          ),
        ],
      ),
    ],
  );
}

class _ShareRow extends StatelessWidget {
  const _ShareRow({
    required this.hue,
    required this.label,
    required this.value,
  });

  final CbDecorHue hue;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) => Row(
    children: <Widget>[
      DecoratedBox(
        decoration: BoxDecoration(
          color: context.cb.accent(hue: hue).toColor(),
          borderRadius: BorderRadius.circular(CbStructure.radiusFull),
        ),
        child: const SizedBox.square(dimension: CbStructure.space2),
      ),
      const SizedBox(width: CbStructure.space2),
      Expanded(child: Text(label)),
      Text(value, style: Theme.of(context).textTheme.titleSmall),
    ],
  );
}

class _ReleaseSignals extends StatelessWidget {
  const _ReleaseSignals();

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: <Widget>[
      Text('Release signals', style: Theme.of(context).textTheme.titleLarge),
      const SizedBox(height: CbStructure.space4),
      const _SignalRow(
        title: 'Review throughput',
        summary: '18 → 31 per day',
        chart: CbSparkline(
          values: <double>[18, 21, 20, 24, 27, 26, 31],
          semanticLabel: 'Review throughput rose from 18 to 31 changes per day',
          size: CbSize.lg,
          filled: true,
        ),
      ),
      const SizedBox(height: CbStructure.space5),
      const _SignalRow(
        title: 'Fixes by package',
        summary: 'UI leads with 12',
        chart: CbBarMini(
          values: <double>[4, 7, 12, 5, 9],
          semanticLabel: 'Fixes by package: 4, 7, 12, 5, and 9',
          size: CbSize.lg,
          hue: CbDecorHue.teal,
        ),
      ),
    ],
  );
}

class _SignalRow extends StatelessWidget {
  const _SignalRow({
    required this.title,
    required this.summary,
    required this.chart,
  });

  final String title;
  final String summary;
  final Widget chart;

  @override
  Widget build(BuildContext context) => Row(
    children: <Widget>[
      Expanded(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(title, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: CbStructure.space1),
            Text(summary, style: Theme.of(context).textTheme.bodySmall),
          ],
        ),
      ),
      const SizedBox(width: CbStructure.space4),
      chart,
    ],
  );
}

class _LoadingCompanions extends StatelessWidget {
  const _LoadingCompanions();

  @override
  Widget build(BuildContext context) => CbSurface(
    elevation: CbElevation.none,
    padding: CbPad.md,
    child: Wrap(
      spacing: CbStructure.space5,
      runSpacing: CbStructure.space4,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: <Widget>[
        SizedBox(
          width: CbStructure.space8 * 3,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                'Loading companions',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: CbStructure.space1),
              Text(
                'Static by design, with the same final geometry.',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ],
          ),
        ),
        const CbDonutSkeleton(size: CbSize.sm),
        const CbSparklineSkeleton(size: CbSize.sm),
        const CbBarMiniSkeleton(size: CbSize.sm),
      ],
    ),
  );
}
