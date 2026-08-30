import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key timelineGalleryKey = Key('timeline-gallery');
const Key timelineCompleteKey = Key('timeline-complete');

class TimelineGallery extends StatefulWidget {
  const TimelineGallery({super.key, this.motion = true});

  final bool motion;

  @override
  State<TimelineGallery> createState() => _TimelineGalleryState();
}

class _TimelineGalleryState extends State<TimelineGallery> {
  bool _reviewComplete = false;

  @override
  Widget build(BuildContext context) => Column(
    key: timelineGalleryKey,
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: <Widget>[
      Text(
        'Activity timeline',
        style: Theme.of(context).textTheme.displaySmall,
      ),
      const SizedBox(height: CbStructure.space2),
      Text(
        'Timeline presents an app-ordered history without owning progress or navigation state.',
        style: Theme.of(context).textTheme.bodyLarge,
      ),
      const SizedBox(height: CbStructure.space5),
      CbSurface(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Row(
              children: <Widget>[
                Expanded(
                  child: Text(
                    'Transfer CB-2984',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ),
                TextButton.icon(
                  key: timelineCompleteKey,
                  onPressed: () =>
                      setState(() => _reviewComplete = !_reviewComplete),
                  icon: Icon(
                    _reviewComplete ? Icons.undo : Icons.task_alt_outlined,
                  ),
                  label: Text(_reviewComplete ? 'Reset' : 'Complete review'),
                ),
              ],
            ),
            const SizedBox(height: CbStructure.space5),
            CbTimeline(
              motion: widget.motion,
              items: <CbTimelineItem>[
                const CbTimelineItem(
                  title: 'Transfer created',
                  timestamp: '09:32',
                  content: Text('The request passed account validation.'),
                ),
                const CbTimelineItem(
                  title: 'Identity verified',
                  timestamp: '09:36',
                  tone: CbTone.success,
                  marker: Icon(Icons.verified_outlined),
                  content: Text('Recipient details matched the bank record.'),
                ),
                CbTimelineItem(
                  title: _reviewComplete
                      ? 'Risk review completed'
                      : 'Risk review in progress',
                  timestamp: '09:41',
                  tone: _reviewComplete ? CbTone.success : CbTone.warning,
                  pending: !_reviewComplete,
                  semanticLabel: _reviewComplete
                      ? 'Risk review completed at 09:41'
                      : 'Risk review in progress since 09:41',
                  content: Text(
                    _reviewComplete
                        ? 'Automated checks found no additional risk.'
                        : 'Automated checks are reviewing this transfer.',
                  ),
                ),
                const CbTimelineItem(
                  title: 'Recipient notification queued',
                  timestamp: 'Next',
                  tone: CbTone.neutral,
                  content: Text('The app will notify Ari after settlement.'),
                ),
              ],
            ),
          ],
        ),
      ),
      const SizedBox(height: CbStructure.space4),
      CbSurface(
        variant: CbSurfaceVariant.tinted,
        child: CbTimelineSkeleton(
          itemCount: 4,
          timestamps: true,
          motion: widget.motion,
        ),
      ),
    ],
  );
}
