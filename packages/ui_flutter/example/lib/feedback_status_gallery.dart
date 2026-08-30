import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key galleryBannerTriggerKey = Key('gallery-banner-trigger');
const Key galleryMessageTriggerKey = Key('gallery-message-trigger');
const Key galleryDialogTriggerKey = Key('gallery-dialog-trigger');

class FeedbackStatusGallery extends StatefulWidget {
  const FeedbackStatusGallery({super.key, this.animateStatus = true});

  final bool animateStatus;

  @override
  State<FeedbackStatusGallery> createState() => _FeedbackStatusGalleryState();
}

class _FeedbackStatusGalleryState extends State<FeedbackStatusGallery> {
  String _persistentStatus = 'No recent action';

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Text('Feedback and status', style: type.displaySmall),
        const SizedBox(height: CbStructure.space2),
        Text(
          'Material owns announcements, transient messages, decisions, progress, and contextual help. Ceebee supplies the active Skin.',
          style: type.bodyLarge,
        ),
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          padding: CbPad.lg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text('Announcements', style: type.titleLarge),
              const SizedBox(height: CbStructure.space2),
              Text(
                'A banner stays visible for information that affects the whole screen. A message confirms a short-lived action.',
                style: type.bodyMedium,
              ),
              const SizedBox(height: CbStructure.space4),
              Wrap(
                spacing: CbStructure.space3,
                runSpacing: CbStructure.space3,
                children: <Widget>[
                  FilledButton.icon(
                    key: galleryBannerTriggerKey,
                    onPressed: _showBanner,
                    icon: const Icon(Icons.campaign_outlined),
                    label: const Text('Show banner'),
                  ),
                  OutlinedButton.icon(
                    key: galleryMessageTriggerKey,
                    onPressed: _showMessage,
                    icon: const Icon(Icons.notifications_outlined),
                    label: const Text('Show message'),
                  ),
                ],
              ),
              const SizedBox(height: CbStructure.space3),
              Text('Current status: $_persistentStatus', style: type.bodySmall),
            ],
          ),
        ),
        const SizedBox(height: CbStructure.space4),
        CbSurface(
          padding: CbPad.lg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text('Decisions', style: type.titleLarge),
              const SizedBox(height: CbStructure.space2),
              Text(
                'Dialogs interrupt only when the user must confirm or cancel a focused decision.',
                style: type.bodyMedium,
              ),
              const SizedBox(height: CbStructure.space4),
              FilledButton(
                key: galleryDialogTriggerKey,
                onPressed: _showDeleteDialog,
                child: const Text('Review deletion'),
              ),
            ],
          ),
        ),
        const SizedBox(height: CbStructure.space4),
        CbSurface(
          padding: CbPad.lg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text('Progress and loading', style: type.titleLarge),
              const SizedBox(height: CbStructure.space2),
              Text(
                'Determinate progress reports known completion. An indeterminate spinner communicates active work.',
                style: type.bodyMedium,
              ),
              const SizedBox(height: CbStructure.space4),
              const Text('Uploading assets · 65%'),
              const SizedBox(height: CbStructure.space2),
              const LinearProgressIndicator(
                value: 0.65,
                semanticsLabel: 'Uploading assets',
                semanticsValue: '65%',
              ),
              const SizedBox(height: CbStructure.space4),
              Row(
                children: <Widget>[
                  CircularProgressIndicator(
                    value: widget.animateStatus ? null : 0.25,
                    semanticsLabel: 'Syncing workspace',
                  ),
                  const SizedBox(width: CbStructure.space3),
                  const Expanded(child: Text('Syncing workspace…')),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: CbStructure.space4),
        CbSurface(
          padding: CbPad.lg,
          child: Row(
            children: <Widget>[
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text('Contextual help', style: type.titleLarge),
                    const SizedBox(height: CbStructure.space2),
                    Text(
                      'Hover or long-press the icon to reveal its tooltip.',
                      style: type.bodyMedium,
                    ),
                  ],
                ),
              ),
              const Tooltip(
                message: 'Copy workspace link',
                child: IconButton(
                  onPressed: _ignoreAction,
                  icon: Icon(Icons.link),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _showBanner() {
    final ScaffoldMessengerState messenger = ScaffoldMessenger.of(context);
    messenger
      ..hideCurrentMaterialBanner()
      ..showMaterialBanner(
        MaterialBanner(
          leading: const Icon(Icons.system_update_outlined),
          content: const Text('A newer workspace version is available.'),
          actions: <Widget>[
            TextButton(
              onPressed: messenger.hideCurrentMaterialBanner,
              child: const Text('Dismiss'),
            ),
            FilledButton(
              onPressed: () {
                messenger.hideCurrentMaterialBanner();
                setState(() => _persistentStatus = 'Update scheduled');
              },
              child: const Text('Schedule update'),
            ),
          ],
        ),
      );
  }

  void _showMessage() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text('Draft moved to archive'),
        action: SnackBarAction(
          label: 'Undo',
          onPressed: () => setState(() => _persistentStatus = 'Draft restored'),
        ),
      ),
    );
    setState(() => _persistentStatus = 'Draft archived');
  }

  Future<void> _showDeleteDialog() async {
    final bool? deleted = await showDialog<bool>(
      context: context,
      builder: (BuildContext dialogContext) => AlertDialog(
        title: Row(
          children: <Widget>[
            const Expanded(child: Text('Delete local draft?')),
            IconButton(
              tooltip: 'Close dialog',
              onPressed: () => Navigator.pop(dialogContext, false),
              icon: const Icon(Icons.close),
            ),
          ],
        ),
        content: const Text(
          'The draft “Release notes” will be removed from this device. This action cannot be undone.',
        ),
        actions: <Widget>[
          TextButton(
            onPressed: () => Navigator.pop(dialogContext, false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(dialogContext, true),
            child: const Text('Delete draft'),
          ),
        ],
      ),
    );

    if (!mounted || deleted != true) return;
    setState(() => _persistentStatus = 'Draft deleted');
  }
}

void _ignoreAction() {}
