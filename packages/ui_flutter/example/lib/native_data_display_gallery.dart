import 'dart:convert';
import 'dart:math' as math;
import 'dart:typed_data';

import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key galleryCarouselKey = Key('gallery-data-carousel');
const Key galleryCarouselNextKey = Key('gallery-data-carousel-next');
const Key galleryExpansionKey = Key('gallery-data-expansion');
const Key gallerySortableTableKey = Key('gallery-data-sortable-table');
const Key galleryPaginatedTableKey = Key('gallery-data-paginated-table');

class NativeDataDisplayGallery extends StatefulWidget {
  const NativeDataDisplayGallery({super.key});

  @override
  State<NativeDataDisplayGallery> createState() =>
      _NativeDataDisplayGalleryState();
}

class _NativeDataDisplayGalleryState extends State<NativeDataDisplayGallery> {
  final CarouselController _carouselController = CarouselController();
  final _ReleaseSource _releaseSource = _ReleaseSource();
  final ScrollController _tableScrollController = ScrollController();
  int _carouselIndex = 0;
  int _sortColumnIndex = 0;
  bool _sortAscending = true;
  String? _selectedWorkspace;
  double _carouselItemExtent = CbStructure.space8 * 6;

  static const List<_WorkspaceRow> _workspaces = <_WorkspaceRow>[
    _WorkspaceRow('Atlas', 'Ada', 'Ready', 92),
    _WorkspaceRow('Beacon', 'Grace', 'Review', 76),
    _WorkspaceRow('Current', 'Linus', 'Blocked', 41),
  ];

  @override
  void dispose() {
    _carouselController.dispose();
    _releaseSource.dispose();
    _tableScrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Text('Native data display', style: type.displaySmall),
        const SizedBox(height: CbStructure.space2),
        Text(
          'Material and Flutter own scrolling, disclosure, image decoding, sorting, selection, and pagination. Ceebee supplies the Skin.',
          style: type.bodyLarge,
        ),
        const SizedBox(height: CbStructure.space5),
        _carousel(context),
        const SizedBox(height: CbStructure.space5),
        _disclosure(context),
        const SizedBox(height: CbStructure.space5),
        _imageStates(context),
        const SizedBox(height: CbStructure.space5),
        LayoutBuilder(
          builder: (BuildContext context, BoxConstraints constraints) {
            if (constraints.maxWidth < CbStructure.space8 * 8) {
              return _compactWorkspaceList(context);
            }
            return Column(
              children: <Widget>[
                _sortableTable(context),
                const SizedBox(height: CbStructure.space5),
                _paginatedTable(context),
              ],
            );
          },
        ),
      ],
    );
  }

  Widget _carousel(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      Row(
        children: <Widget>[
          Expanded(
            child: Text(
              'Ordered stories',
              style: Theme.of(context).textTheme.titleLarge,
            ),
          ),
          Text(
            '${_carouselIndex + 1} of 4',
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ],
      ),
      const SizedBox(height: CbStructure.space2),
      const Text(
        'Swipe the carousel or use the visible controls. Each item advances one workspace story.',
      ),
      const SizedBox(height: CbStructure.space4),
      LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final double itemExtent = math.min(
            constraints.maxWidth - CbStructure.space6,
            CbStructure.space8 * 6,
          );
          _carouselItemExtent = itemExtent;
          return SizedBox(
            height: CbStructure.space8 * 5,
            child: CarouselView(
              key: galleryCarouselKey,
              controller: _carouselController,
              itemExtent: itemExtent,
              itemSnapping: true,
              onIndexChanged: (int index) =>
                  setState(() => _carouselIndex = index),
              children: const <Widget>[
                _StoryPanel(
                  Icons.inventory_2_outlined,
                  'Collect source material',
                ),
                _StoryPanel(Icons.account_tree_outlined, 'Connect the work'),
                _StoryPanel(Icons.fact_check_outlined, 'Review with context'),
                _StoryPanel(
                  Icons.rocket_launch_outlined,
                  'Release with confidence',
                ),
              ],
            ),
          );
        },
      ),
      const SizedBox(height: CbStructure.space3),
      Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: <Widget>[
          IconButton(
            tooltip: 'Previous story',
            onPressed: _carouselIndex == 0
                ? null
                : () => _showCarouselItem(_carouselIndex - 1),
            icon: const Icon(Icons.arrow_back),
          ),
          const SizedBox(width: CbStructure.space2),
          FilledButton.icon(
            key: galleryCarouselNextKey,
            onPressed: _carouselIndex == 3
                ? null
                : () => _showCarouselItem(_carouselIndex + 1),
            icon: const Icon(Icons.arrow_forward),
            label: const Text('Next story'),
          ),
        ],
      ),
    ],
  );

  Widget _disclosure(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      Text(
        'Progressive disclosure',
        style: Theme.of(context).textTheme.titleLarge,
      ),
      const SizedBox(height: CbStructure.space2),
      const Text(
        'One policy stays open at a time so supporting detail does not compete with the primary table.',
      ),
      const SizedBox(height: CbStructure.space4),
      ExpansionPanelList.radio(
        key: galleryExpansionKey,
        initialOpenPanelValue: 'retention',
        children: <ExpansionPanelRadio>[
          ExpansionPanelRadio(
            value: 'retention',
            canTapOnHeader: true,
            headerBuilder: _retentionHeader,
            body: _PolicyBody(
              'Completed releases remain available for 90 days before archival.',
            ),
          ),
          ExpansionPanelRadio(
            value: 'blocked',
            canTapOnHeader: true,
            headerBuilder: _blockedHeader,
            body: _PolicyBody(
              'A blocked item needs an owner, a reason, and a next review date.',
            ),
          ),
          ExpansionPanelRadio(
            value: 'access',
            canTapOnHeader: true,
            headerBuilder: _accessHeader,
            body: _PolicyBody(
              'Workspace access is reviewed whenever an owner changes teams.',
            ),
          ),
        ],
      ),
    ],
  );

  Widget _imageStates(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      Text('Image states', style: Theme.of(context).textTheme.titleLarge),
      const SizedBox(height: CbStructure.space2),
      const Text(
        'Successful media has an accessible description. Decode failures preserve layout and offer recovery.',
      ),
      const SizedBox(height: CbStructure.space4),
      LayoutBuilder(
        builder: (BuildContext context, BoxConstraints constraints) {
          final Widget loaded = _LoadedImage(tokens: context.cb);
          const Widget broken = _BrokenImage();
          if (constraints.maxWidth < CbStructure.space8 * 7) {
            return Column(
              children: <Widget>[
                loaded,
                const SizedBox(height: CbStructure.space4),
                broken,
              ],
            );
          }
          return SizedBox(
            height: CbStructure.space8 * 2,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                Expanded(child: loaded),
                const SizedBox(width: CbStructure.space4),
                const Expanded(child: broken),
              ],
            ),
          );
        },
      ),
    ],
  );

  Widget _sortableTable(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;
    final List<_WorkspaceRow> rows = List<_WorkspaceRow>.of(_workspaces)
      ..sort((_WorkspaceRow a, _WorkspaceRow b) {
        final int result = a.name.compareTo(b.name);
        return _sortAscending ? result : -result;
      });
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Row(
          children: <Widget>[
            Expanded(child: Text('Workspace health', style: type.titleLarge)),
            Text(
              _selectedWorkspace == null
                  ? 'No row selected'
                  : 'Selected: $_selectedWorkspace',
              style: type.bodySmall,
            ),
          ],
        ),
        const SizedBox(height: CbStructure.space2),
        const Text(
          'Sort by name and select a row. Swipe or scroll horizontally on a narrow viewport.',
        ),
        const SizedBox(height: CbStructure.space4),
        Scrollbar(
          controller: _tableScrollController,
          thumbVisibility: true,
          child: SingleChildScrollView(
            controller: _tableScrollController,
            scrollDirection: Axis.horizontal,
            child: DataTable(
              key: gallerySortableTableKey,
              sortColumnIndex: _sortColumnIndex,
              sortAscending: _sortAscending,
              columns: <DataColumn>[
                DataColumn(
                  label: const Text('Workspace'),
                  onSort: (int index, bool ascending) => setState(() {
                    _sortColumnIndex = index;
                    _sortAscending = ascending;
                  }),
                ),
                const DataColumn(label: Text('Owner')),
                const DataColumn(label: Text('Status')),
                const DataColumn(numeric: true, label: Text('Health')),
              ],
              rows: rows.map((_WorkspaceRow row) {
                return DataRow(
                  selected: _selectedWorkspace == row.name,
                  onSelectChanged: (bool? selected) => setState(() {
                    _selectedWorkspace = selected == true ? row.name : null;
                  }),
                  cells: <DataCell>[
                    DataCell(Text(row.name)),
                    DataCell(Text(row.owner)),
                    DataCell(_StatusCell(row.status)),
                    DataCell(
                      Text(
                        '${row.health}%',
                        style: type.bodyMedium?.copyWith(
                          fontFeatures: const <FontFeature>[
                            FontFeature.tabularFigures(),
                          ],
                        ),
                      ),
                    ),
                  ],
                );
              }).toList(),
            ),
          ),
        ),
      ],
    );
  }

  Widget _paginatedTable(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      Text('Larger result sets', style: Theme.of(context).textTheme.titleLarge),
      const SizedBox(height: CbStructure.space2),
      const Text(
        'PaginatedDataTable keeps its source long-lived and exposes native page controls.',
      ),
      const SizedBox(height: CbStructure.space4),
      PaginatedDataTable(
        key: galleryPaginatedTableKey,
        header: const Text('Release queue'),
        rowsPerPage: 3,
        availableRowsPerPage: const <int>[3],
        showFirstLastButtons: true,
        source: _releaseSource,
        columns: const <DataColumn>[
          DataColumn(label: Text('Release')),
          DataColumn(label: Text('Owner')),
          DataColumn(label: Text('Status')),
        ],
      ),
    ],
  );

  Widget _compactWorkspaceList(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      Text('Workspace health', style: Theme.of(context).textTheme.titleLarge),
      const SizedBox(height: CbStructure.space2),
      const Text(
        'Compact screens keep every field readable as native list rows.',
      ),
      const SizedBox(height: CbStructure.space4),
      CbSurface(
        padding: CbPad.none,
        child: Column(
          children: <Widget>[
            for (final _WorkspaceRow row in _workspaces)
              ListTile(
                title: Text(row.name),
                subtitle: Text('${row.owner} · ${row.status}'),
                trailing: Text('${row.health}%'),
                selected: _selectedWorkspace == row.name,
                onTap: () => setState(() => _selectedWorkspace = row.name),
              ),
          ],
        ),
      ),
    ],
  );

  Future<void> _showCarouselItem(int index) {
    if (MediaQuery.disableAnimationsOf(context)) {
      _carouselController.jumpTo(index * _carouselItemExtent);
      return Future<void>.value();
    }
    return _carouselController.animateToItem(
      index,
      duration: CbMotionTokens.deliberate,
      curve: Curves.easeOut,
    );
  }
}

class _StoryPanel extends StatelessWidget {
  const _StoryPanel(this.icon, this.title);

  final IconData icon;
  final String title;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (BuildContext context, BoxConstraints constraints) {
      if (constraints.maxWidth < CbStructure.space8 * 2) {
        return Padding(
          padding: const EdgeInsets.all(CbStructure.space2),
          child: FittedBox(child: Icon(icon)),
        );
      }
      return Padding(
        padding: const EdgeInsets.all(CbStructure.space5),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Icon(icon, size: CbStructure.space7),
            const Spacer(),
            Text(title, style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: CbStructure.space2),
            const Text('One deliberate step in a visible, ordered workflow.'),
          ],
        ),
      );
    },
  );
}

class _PolicyBody extends StatelessWidget {
  const _PolicyBody(this.text);
  final String text;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(
      left: CbStructure.space5,
      right: CbStructure.space5,
      bottom: CbStructure.space5,
    ),
    child: Align(alignment: Alignment.centerLeft, child: Text(text)),
  );
}

class _LoadedImage extends StatelessWidget {
  const _LoadedImage({required this.tokens});
  final CbSkinTokens tokens;

  @override
  Widget build(BuildContext context) => CbSurface(
    padding: CbPad.none,
    child: SizedBox(
      height: CbStructure.space8 * 2,
      child: Stack(
        fit: StackFit.expand,
        children: <Widget>[
          Image.memory(
            _whitePixel,
            semanticLabel: 'Teal workspace preview',
            color: tokens.decorTeal.toColor(),
            colorBlendMode: BlendMode.srcIn,
            fit: BoxFit.cover,
          ),
          const Center(child: Icon(Icons.image_outlined)),
          const Positioned(
            left: CbStructure.space4,
            bottom: CbStructure.space4,
            child: Text('Loaded preview'),
          ),
        ],
      ),
    ),
  );
}

class _BrokenImage extends StatelessWidget {
  const _BrokenImage();

  @override
  Widget build(BuildContext context) => CbSurface(
    variant: CbSurfaceVariant.tinted,
    padding: CbPad.none,
    child: SizedBox(
      height: CbStructure.space8 * 2,
      child: Image.memory(
        Uint8List.fromList(const <int>[0, 1, 2]),
        fit: BoxFit.cover,
        errorBuilder: (BuildContext context, Object error, StackTrace? stack) =>
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                const Icon(Icons.broken_image_outlined),
                const SizedBox(height: CbStructure.space2),
                const Text('Preview unavailable'),
                TextButton(
                  onPressed: _ignoreAction,
                  child: const Text('Retry'),
                ),
              ],
            ),
      ),
    ),
  );
}

class _StatusCell extends StatelessWidget {
  const _StatusCell(this.label);
  final String label;

  @override
  Widget build(BuildContext context) => Row(
    mainAxisSize: MainAxisSize.min,
    children: <Widget>[
      Icon(
        label == 'Ready'
            ? Icons.check_circle_outline
            : label == 'Review'
            ? Icons.schedule_outlined
            : Icons.error_outline,
        size: CbStructure.textLg,
      ),
      const SizedBox(width: CbStructure.space2),
      Text(label),
    ],
  );
}

class _WorkspaceRow {
  const _WorkspaceRow(this.name, this.owner, this.status, this.health);
  final String name;
  final String owner;
  final String status;
  final int health;
}

class _ReleaseSource extends DataTableSource {
  static const List<(String, String, String)> _rows =
      <(String, String, String)>[
        ('Release 26.8', 'Ada', 'Ready'),
        ('Release 26.9', 'Grace', 'Review'),
        ('Release 27.0', 'Linus', 'Blocked'),
        ('Release 27.1', 'Margaret', 'Ready'),
        ('Release 27.2', 'Edsger', 'Review'),
      ];

  @override
  DataRow? getRow(int index) {
    if (index >= _rows.length) return null;
    final (String release, String owner, String status) = _rows[index];
    return DataRow.byIndex(
      index: index,
      cells: <DataCell>[
        DataCell(Text(release)),
        DataCell(Text(owner)),
        DataCell(Text(status)),
      ],
    );
  }

  @override
  bool get isRowCountApproximate => false;
  @override
  int get rowCount => _rows.length;
  @override
  int get selectedRowCount => 0;
}

Widget _retentionHeader(BuildContext context, bool isExpanded) =>
    const ListTile(title: Text('Retention policy'));
Widget _blockedHeader(BuildContext context, bool isExpanded) =>
    const ListTile(title: Text('Blocked work'));
Widget _accessHeader(BuildContext context, bool isExpanded) =>
    const ListTile(title: Text('Access review'));

final Uint8List _whitePixel = base64Decode(
  'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAARGVYSWZNTQAqAAAACAABh2kABAAAAAEAAAAaAAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAAIoAMABAAAAAEAAAAIAAAAAJWEe1IAAAC1SURBVBgZLY9bbgIxDEWPQx4w8IGq7qX7Xwp/RUVUotA8ZibGKbUcJTmyde+VR26ac8E5xzTtALFW6K+nR9VQp3el9WoU1rJl44SQOlLqojE4VITz95kQIvUS2U2e/THgx+bX9UaKkY1u0dmxP8xIUroE3Lws/NzulDZzf2T6alLJ09wQM/lcVx2eTuWXz1r4OL6ZIwPWYrLezl+9p8TB+/8QI8mLS2mrWhCbHmzksc+ocRl7AoOsVIdUTQI2AAAAAElFTkSuQmCC',
);

void _ignoreAction() {}
