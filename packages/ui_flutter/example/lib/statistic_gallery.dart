import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key statisticGalleryKey = Key('statistic-gallery');
const Key statisticUsdKey = Key('statistic-usd');
const Key statisticIdrKey = Key('statistic-idr');

class StatisticGallery extends StatefulWidget {
  const StatisticGallery({super.key, this.motion = true});

  final bool motion;

  @override
  State<StatisticGallery> createState() => _StatisticGalleryState();
}

class _StatisticGalleryState extends State<StatisticGallery> {
  bool _useIdr = false;

  @override
  Widget build(BuildContext context) => Column(
    key: statisticGalleryKey,
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: <Widget>[
      Text('Statistics', style: Theme.of(context).textTheme.displaySmall),
      const SizedBox(height: CbStructure.space2),
      Text(
        'Statistic highlights an app-formatted value without taking ownership of locale or data.',
        style: Theme.of(context).textTheme.bodyLarge,
      ),
      const SizedBox(height: CbStructure.space4),
      Align(
        alignment: AlignmentDirectional.centerStart,
        child: SegmentedButton<bool>(
          segments: const <ButtonSegment<bool>>[
            ButtonSegment<bool>(
              value: false,
              label: Text('USD'),
              icon: Icon(Icons.attach_money),
            ),
            ButtonSegment<bool>(
              value: true,
              label: Text('IDR'),
              icon: Icon(Icons.currency_exchange),
            ),
          ],
          selected: <bool>{_useIdr},
          onSelectionChanged: (Set<bool> selection) =>
              setState(() => _useIdr = selection.single),
        ),
      ),
      const SizedBox(height: CbStructure.space5),
      LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final Widget hero = CbSurface(
            variant: CbSurfaceVariant.tinted,
            tone: CbTone.brand,
            padding: CbPad.lg,
            child: CbStatistic(
              label: 'Monthly revenue',
              value: _useIdr ? 'Rp 2.145.000.000' : r'$128,930',
              semanticValue: _useIdr
                  ? 'two billion one hundred forty-five million rupiah'
                  : 'one hundred twenty-eight thousand nine hundred thirty US dollars',
              prefix: const Icon(Icons.account_balance_wallet_outlined),
              description: _useIdr
                  ? 'Rp 208.000.000 more than last month'
                  : r'$12,480 more than last month',
              tone: CbTone.brand,
            ),
          );
          final Widget supporting = CbSurface(
            child: IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  const Expanded(
                    child: CbStatistic(
                      label: 'Completion rate',
                      value: '93.2',
                      semanticValue: 'ninety-three point two percent',
                      suffix: Text('%'),
                      description: 'Across 184 transfers',
                    ),
                  ),
                  const VerticalDivider(width: CbStructure.space5),
                  const Expanded(
                    child: CbStatistic(
                      label: 'Open invoices',
                      value: '18',
                      semanticValue: 'eighteen open invoices',
                      prefix: Icon(Icons.receipt_long_outlined),
                      description: '4 due this week',
                    ),
                  ),
                ],
              ),
            ),
          );
          final Widget loading = CbSurface(
            child: CbStatisticSkeleton(
              description: true,
              motion: widget.motion,
            ),
          );
          if (constraints.maxWidth < CbStructure.space8 * 8) {
            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                hero,
                const SizedBox(height: CbStructure.space4),
                supporting,
                const SizedBox(height: CbStructure.space4),
                loading,
              ],
            );
          }
          return Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              IntrinsicHeight(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    Expanded(flex: 3, child: hero),
                    const SizedBox(width: CbStructure.space4),
                    Expanded(flex: 2, child: supporting),
                  ],
                ),
              ),
              const SizedBox(height: CbStructure.space4),
              loading,
            ],
          );
        },
      ),
    ],
  );
}
