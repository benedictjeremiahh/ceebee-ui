import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key resultGalleryKey = Key('result-gallery');
const Key resultPrimaryActionKey = Key('result-primary-action');

Key resultStatusKey(CbResultStatus status) =>
    Key('result-status-${status.name}');

class ResultGallery extends StatefulWidget {
  const ResultGallery({super.key, this.motion = true});

  final bool motion;

  @override
  State<ResultGallery> createState() => _ResultGalleryState();
}

class _ResultGalleryState extends State<ResultGallery> {
  CbResultStatus _status = CbResultStatus.success;
  String? _actionMessage;

  @override
  Widget build(BuildContext context) {
    final _ResultContent content = _contentFor(_status);
    return Column(
      key: resultGalleryKey,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Text(
          'Operation results',
          style: Theme.of(context).textTheme.displaySmall,
        ),
        const SizedBox(height: CbStructure.space2),
        Text(
          'Result communicates a consequential outcome. The app still owns every action and next step.',
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        const SizedBox(height: CbStructure.space4),
        Wrap(
          spacing: CbStructure.space2,
          runSpacing: CbStructure.space2,
          children: <Widget>[
            for (final CbResultStatus status in CbResultStatus.values)
              ChoiceChip(
                key: resultStatusKey(status),
                label: Text(_statusName(status)),
                selected: _status == status,
                onSelected: (bool selected) {
                  if (!selected) return;
                  setState(() {
                    _status = status;
                    _actionMessage = null;
                  });
                },
              ),
          ],
        ),
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          padding: CbPad.none,
          child: LayoutBuilder(
            builder: (BuildContext context, BoxConstraints constraints) {
              final Widget result = CbResult(
                status: _status,
                title: content.title,
                semanticLabel: content.semanticLabel,
                description: content.description,
                actions: <Widget>[
                  FilledButton.icon(
                    key: resultPrimaryActionKey,
                    onPressed: () => setState(
                      () => _actionMessage = content.primaryConfirmation,
                    ),
                    icon: Icon(content.primaryIcon),
                    label: Text(content.primaryAction),
                  ),
                  OutlinedButton(
                    onPressed: () => setState(
                      () => _actionMessage = 'Details opened by the app.',
                    ),
                    child: const Text('Review details'),
                  ),
                ],
                details: _ResultDetails(
                  nextStep: content.nextStep,
                  actionMessage: _actionMessage,
                ),
              );
              final Widget loading = CbResultSkeleton(
                descriptionLines: 2,
                actionCount: 2,
                detailLines: 2,
                motion: widget.motion,
              );
              if (constraints.maxWidth < CbStructure.space8 * 8) {
                return Column(
                  children: <Widget>[
                    result,
                    const Divider(height: CbStructure.space1),
                    loading,
                  ],
                );
              }
              return IntrinsicHeight(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    Expanded(child: result),
                    const VerticalDivider(width: CbStructure.space1),
                    Expanded(child: loading),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _ResultDetails extends StatelessWidget {
  const _ResultDetails({required this.nextStep, this.actionMessage});

  final String nextStep;
  final String? actionMessage;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      Text('What happens next', style: Theme.of(context).textTheme.titleSmall),
      const SizedBox(height: CbStructure.space2),
      Text(actionMessage ?? nextStep),
    ],
  );
}

class _ResultContent {
  const _ResultContent({
    required this.title,
    required this.semanticLabel,
    required this.description,
    required this.primaryAction,
    required this.primaryIcon,
    required this.primaryConfirmation,
    required this.nextStep,
  });

  final String title;
  final String semanticLabel;
  final String description;
  final String primaryAction;
  final IconData primaryIcon;
  final String primaryConfirmation;
  final String nextStep;
}

_ResultContent _contentFor(CbResultStatus status) => switch (status) {
  CbResultStatus.info => const _ResultContent(
    title: 'Transfer scheduled',
    semanticLabel: 'Information: transfer scheduled',
    description: 'The transfer will begin when the processing window opens.',
    primaryAction: 'View schedule',
    primaryIcon: Icons.calendar_today_outlined,
    primaryConfirmation: 'Schedule opened by the app.',
    nextStep: 'No action is required before the scheduled time.',
  ),
  CbResultStatus.success => const _ResultContent(
    title: 'Transfer complete',
    semanticLabel: 'Success: transfer complete',
    description: 'The recipient received the full transfer amount.',
    primaryAction: 'View receipt',
    primaryIcon: Icons.receipt_long_outlined,
    primaryConfirmation: 'Receipt opened by the app.',
    nextStep: 'A receipt is available in transfer history.',
  ),
  CbResultStatus.warning => const _ResultContent(
    title: 'Transfer needs review',
    semanticLabel: 'Warning: transfer needs review',
    description: 'Confirm the recipient details before processing continues.',
    primaryAction: 'Review transfer',
    primaryIcon: Icons.manage_search_outlined,
    primaryConfirmation: 'Transfer review opened by the app.',
    nextStep: 'Processing remains paused until the details are confirmed.',
  ),
  CbResultStatus.error => const _ResultContent(
    title: 'Transfer failed',
    semanticLabel: 'Error: transfer failed',
    description: 'No funds moved. Check the connection before trying again.',
    primaryAction: 'Try again',
    primaryIcon: Icons.refresh,
    primaryConfirmation: 'Retry started by the app.',
    nextStep: 'The original transfer remains safe to retry.',
  ),
};

String _statusName(CbResultStatus status) => switch (status) {
  CbResultStatus.info => 'Info',
  CbResultStatus.success => 'Success',
  CbResultStatus.warning => 'Warning',
  CbResultStatus.error => 'Error',
};
