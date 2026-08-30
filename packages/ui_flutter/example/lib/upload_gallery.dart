import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key uploadGalleryKey = Key('upload-gallery');

class UploadGallery extends StatefulWidget {
  const UploadGallery({super.key, this.motion = true});

  final bool motion;

  @override
  State<UploadGallery> createState() => _UploadGalleryState();
}

class _UploadGalleryState extends State<UploadGallery> {
  List<CbUploadItem> _items = const <CbUploadItem>[
    CbUploadItem(
      id: 'cover',
      name: 'campaign-cover.png',
      status: CbUploadStatus.success,
      statusLabel: 'Uploaded',
      semanticLabel: 'campaign-cover.png, uploaded',
    ),
    CbUploadItem(
      id: 'brief',
      name: 'launch-brief.pdf',
      status: CbUploadStatus.uploading,
      statusLabel: 'Uploading, 64 percent',
      semanticLabel: 'launch-brief.pdf, uploading, 64 percent',
      progress: 0.64,
    ),
    CbUploadItem(
      id: 'notes',
      name: 'research-notes.txt',
      status: CbUploadStatus.error,
      statusLabel: 'Upload failed',
      semanticLabel: 'research-notes.txt, upload failed',
    ),
  ];

  @override
  Widget build(BuildContext context) => Column(
    key: uploadGalleryKey,
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: <Widget>[
      Text('File upload', style: Theme.of(context).textTheme.displaySmall),
      const SizedBox(height: CbStructure.space2),
      Text(
        'The application injects file picking and transfer work; Ceebee renders controlled status, progress, retry, and removal.',
        style: Theme.of(context).textTheme.bodyLarge,
      ),
      const SizedBox(height: CbStructure.space5),
      CbSurface(
        child: LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            final Widget live = CbUpload(
              items: _items,
              selectLabel: 'Choose files',
              semanticLabel: 'Campaign files',
              onSelect: _addQueuedItem,
              onRemove: _removeItem,
              onRetry: _retryItem,
              retryLabelBuilder: (CbUploadItem item) => 'Retry ${item.name}',
              removeLabelBuilder: (CbUploadItem item) => 'Remove ${item.name}',
            );
            final Widget loading = CbUploadSkeleton(
              itemCount: 3,
              motion: widget.motion,
            );
            if (constraints.maxWidth >= CbStructure.space8 * 10) {
              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Expanded(child: live),
                  const SizedBox(width: CbStructure.space5),
                  Expanded(child: loading),
                ],
              );
            }
            return Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                live,
                const SizedBox(height: CbStructure.space5),
                const Divider(),
                const SizedBox(height: CbStructure.space5),
                loading,
              ],
            );
          },
        ),
      ),
    ],
  );

  void _addQueuedItem() {
    if (_items.any((CbUploadItem item) => item.id == 'queued')) return;
    setState(() {
      _items = <CbUploadItem>[
        ..._items,
        const CbUploadItem(
          id: 'queued',
          name: 'selected-file.zip',
          status: CbUploadStatus.queued,
          statusLabel: 'Waiting to upload',
          semanticLabel: 'selected-file.zip, waiting to upload',
        ),
      ];
    });
  }

  void _removeItem(CbUploadItem selected) => setState(() {
    _items = _items
        .where((CbUploadItem item) => item.id != selected.id)
        .toList(growable: false);
  });

  void _retryItem(CbUploadItem selected) => setState(() {
    _items = _items
        .map(
          (CbUploadItem item) => item.id == selected.id
              ? CbUploadItem(
                  id: item.id,
                  name: item.name,
                  status: CbUploadStatus.queued,
                  statusLabel: 'Waiting to retry',
                  semanticLabel: '${item.name}, waiting to retry',
                )
              : item,
        )
        .toList(growable: false);
  });
}
