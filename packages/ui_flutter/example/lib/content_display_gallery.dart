import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key galleryContentListTileKey = Key('gallery-content-list-tile');
const Key galleryContentFilterChipKey = Key('gallery-content-filter-chip');
const Key galleryContentInputChipKey = Key('gallery-content-input-chip');

class ContentDisplayGallery extends StatefulWidget {
  const ContentDisplayGallery({super.key});

  @override
  State<ContentDisplayGallery> createState() => _ContentDisplayGalleryState();
}

class _ContentDisplayGalleryState extends State<ContentDisplayGallery> {
  bool _selectedAda = false;
  bool _available = true;
  bool _showFlutter = true;
  String _choice = 'Recent';

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Text('Content display', style: type.displaySmall),
        const SizedBox(height: CbStructure.space2),
        Text(
          'Use Material-native identity, status, card, list, and chip primitives. Ceebee maps '
          'the active Skin onto their semantic colour and type roles.',
          style: type.bodyLarge,
        ),
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          elevation: CbElevation.sm,
          padding: CbPad.lg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text('Identity and status', style: type.titleLarge),
              const Divider(),
              Wrap(
                spacing: CbStructure.space4,
                runSpacing: CbStructure.space4,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: <Widget>[
                  Semantics(
                    label: 'Ada Lovelace',
                    image: true,
                    child: ExcludeSemantics(
                      child: CircleAvatar(child: Text('AL')),
                    ),
                  ),
                  Semantics(
                    label: 'Grace Hopper, 3 unread messages',
                    image: true,
                    child: ExcludeSemantics(
                      child: Badge.count(
                        count: 3,
                        child: CircleAvatar(child: Text('GH')),
                      ),
                    ),
                  ),
                  const Badge(child: Icon(Icons.notifications_outlined)),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: CbStructure.space5),
        Text('Card variants', style: type.titleLarge),
        const SizedBox(height: CbStructure.space2),
        Card(
          child: ListTile(
            leading: const Icon(Icons.layers_outlined),
            title: const Text('Elevated card'),
            subtitle: const Text('Material owns elevation and shape.'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
        ),
        Card.filled(
          child: ListTile(
            leading: const Icon(Icons.palette_outlined),
            title: const Text('Filled card'),
            subtitle: const Text('Skin colours flow through ColorScheme.'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
        ),
        Card.outlined(
          child: ListTile(
            leading: const Icon(Icons.border_outer),
            title: const Text('Outlined card'),
            subtitle: const Text('The native variant keeps its own border.'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
        ),
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          padding: CbPad.none,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Padding(
                padding: const EdgeInsets.all(CbStructure.space4),
                child: Text('Recent activity', style: type.titleLarge),
              ),
              const Divider(height: CbStructure.borderWidth),
              ListTile(
                key: galleryContentListTileKey,
                selected: _selectedAda,
                leading: const CircleAvatar(child: Text('AL')),
                title: const Text('Ada Lovelace'),
                subtitle: const Text('Shared the accessibility review'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => setState(() => _selectedAda = !_selectedAda),
              ),
              const ListTile(
                leading: CircleAvatar(child: Text('GH')),
                title: Text('Grace Hopper'),
                subtitle: Text(
                  'Updated a long release note that truncates without moving the trailing action',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                trailing: Icon(Icons.chevron_right),
              ),
              const ListTile(
                enabled: false,
                leading: Icon(Icons.lock_outline),
                title: Text('Archived workspace'),
                subtitle: Text('Read-only'),
              ),
            ],
          ),
        ),
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          elevation: CbElevation.sm,
          padding: CbPad.lg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text('Tags and compact actions', style: type.titleLarge),
              const Divider(),
              Wrap(
                spacing: CbStructure.space2,
                runSpacing: CbStructure.space2,
                children: <Widget>[
                  const Chip(
                    avatar: CircleAvatar(child: Text('A')),
                    label: Text('Team'),
                  ),
                  FilterChip(
                    key: galleryContentFilterChipKey,
                    label: const Text('Available'),
                    selected: _available,
                    onSelected: (bool value) =>
                        setState(() => _available = value),
                  ),
                  ChoiceChip(
                    label: const Text('Recent'),
                    selected: _choice == 'Recent',
                    onSelected: (_) => setState(() => _choice = 'Recent'),
                  ),
                  ChoiceChip(
                    label: const Text('Archived'),
                    selected: _choice == 'Archived',
                    onSelected: (_) => setState(() => _choice = 'Archived'),
                  ),
                  if (_showFlutter)
                    InputChip(
                      key: galleryContentInputChipKey,
                      label: const Text('Flutter'),
                      onDeleted: () => setState(() => _showFlutter = false),
                    ),
                  ActionChip(
                    avatar: const Icon(Icons.add),
                    label: const Text('Add label'),
                    onPressed: () {},
                  ),
                ],
              ),
              const SizedBox(height: CbStructure.space3),
              Text(
                'Filter: ${_available ? 'available' : 'all'} · Choice: $_choice',
                style: type.bodySmall,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
