import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key descriptionsGalleryKey = Key('descriptions-gallery');
const Key descriptionsEditKey = Key('descriptions-edit');

class DescriptionsGallery extends StatefulWidget {
  const DescriptionsGallery({super.key, this.motion = true});

  final bool motion;

  @override
  State<DescriptionsGallery> createState() => _DescriptionsGalleryState();
}

class _DescriptionsGalleryState extends State<DescriptionsGallery> {
  bool _reviewed = false;

  @override
  Widget build(BuildContext context) => Column(
    key: descriptionsGalleryKey,
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: <Widget>[
      Text('Descriptions', style: Theme.of(context).textTheme.displaySmall),
      const SizedBox(height: CbStructure.space2),
      Text(
        'Descriptions keeps an ordered record readable while the app owns values and actions.',
        style: Theme.of(context).textTheme.bodyLarge,
      ),
      const SizedBox(height: CbStructure.space5),
      CbSurface(
        child: CbDescriptions(
          title: 'Transfer summary',
          action: TextButton.icon(
            key: descriptionsEditKey,
            onPressed: () => setState(() => _reviewed = !_reviewed),
            icon: Icon(_reviewed ? Icons.undo : Icons.edit_outlined),
            label: Text(_reviewed ? 'Reset' : 'Review'),
          ),
          items: <CbDescriptionItem>[
            const CbDescriptionItem(
              label: 'Recipient',
              value: Text('Ari Putra'),
            ),
            CbDescriptionItem(
              label: 'Status',
              semanticValue: _reviewed
                  ? 'Reviewed and ready'
                  : 'Ready for review',
              value: Align(
                alignment: AlignmentDirectional.centerStart,
                child: Chip(
                  avatar: Icon(
                    _reviewed ? Icons.check_circle_outline : Icons.schedule,
                  ),
                  label: Text(_reviewed ? 'Reviewed' : 'Ready for review'),
                ),
              ),
            ),
            const CbDescriptionItem(
              label: 'Amount',
              value: Text('Rp 12.893.000'),
              semanticValue:
                  'twelve million eight hundred ninety-three thousand rupiah',
            ),
            const CbDescriptionItem(
              label: 'Transfer date',
              value: Text('28 August 2026'),
            ),
            const CbDescriptionItem(
              label: 'Destination account',
              value: Text('BCA •••• 9842'),
            ),
            const CbDescriptionItem(
              label: 'Notes',
              value: Text(
                'Monthly operating transfer for the Jakarta workspace.',
              ),
              fullWidth: true,
            ),
          ],
        ),
      ),
      const SizedBox(height: CbStructure.space4),
      CbSurface(
        variant: CbSurfaceVariant.tinted,
        child: CbDescriptionsSkeleton(
          itemCount: 5,
          title: true,
          action: true,
          fullWidthLast: true,
          motion: widget.motion,
        ),
      ),
    ],
  );
}
