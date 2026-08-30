import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

class FoundationGallery extends StatelessWidget {
  const FoundationGallery({super.key});

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Text('Material foundation', style: type.displaySmall),
        const SizedBox(height: CbStructure.space2),
        Text(
          'Typography, icons, dividers, and buttons keep their native Material contracts while '
          'reading Ceebee Tokens through the Theme bridge.',
          style: type.bodyLarge,
        ),
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          elevation: CbElevation.sm,
          padding: CbPad.lg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text('Type hierarchy', style: type.titleLarge),
              const Divider(),
              Text('Display / Product direction', style: type.headlineMedium),
              const SizedBox(height: CbStructure.space2),
              Text('Title / A deliberate section', style: type.titleLarge),
              const SizedBox(height: CbStructure.space2),
              Text(
                'Body text stays readable and native text scaling remains intact.',
                style: type.bodyMedium,
              ),
              Text('Supporting context and metadata', style: type.bodySmall),
              const SizedBox(height: CbStructure.space6),
              Text('Icon and divider', style: type.titleLarge),
              const Divider(),
              const Wrap(
                spacing: CbStructure.space4,
                runSpacing: CbStructure.space3,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: <Widget>[
                  Tooltip(
                    message: 'Decorative Surface',
                    child: Icon(Icons.auto_awesome_outlined),
                  ),
                  Tooltip(
                    message: 'Substrate layers',
                    child: Icon(Icons.layers_outlined),
                  ),
                  Tooltip(
                    message: 'Accessibility',
                    child: Icon(Icons.accessibility_new_outlined),
                  ),
                  SizedBox(
                    height: CbStructure.controlHeightMd,
                    child: VerticalDivider(),
                  ),
                  Text('Inherited foreground role'),
                ],
              ),
              const SizedBox(height: CbStructure.space6),
              Text('Button hierarchy', style: type.titleLarge),
              const Divider(),
              Wrap(
                spacing: CbStructure.space3,
                runSpacing: CbStructure.space3,
                children: <Widget>[
                  FilledButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.add),
                    label: const Text('Create project'),
                  ),
                  FilledButton.tonalIcon(
                    onPressed: () {},
                    icon: const Icon(Icons.tune),
                    label: const Text('Configure'),
                  ),
                  ElevatedButton(
                    onPressed: () {},
                    child: const Text('Elevated'),
                  ),
                  OutlinedButton(
                    onPressed: () {},
                    child: const Text('Preview'),
                  ),
                  TextButton(
                    onPressed: () {},
                    child: const Text('View details'),
                  ),
                ],
              ),
              const SizedBox(height: CbStructure.space4),
              Wrap(
                spacing: CbStructure.space3,
                runSpacing: CbStructure.space3,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: <Widget>[
                  const FilledButton(onPressed: null, child: Text('Upload')),
                  Text('Choose a file first', style: type.bodySmall),
                  const _SavingButton(),
                  FilledButton.icon(
                    onPressed: () {},
                    style: FilledButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.error,
                      foregroundColor: Theme.of(context).colorScheme.onError,
                    ),
                    icon: const Icon(Icons.delete_outline),
                    label: const Text('Delete draft'),
                  ),
                ],
              ),
              const SizedBox(height: CbStructure.space6),
              Text('Floating actions', style: type.titleLarge),
              const Divider(),
              Wrap(
                spacing: CbStructure.space4,
                runSpacing: CbStructure.space3,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: <Widget>[
                  FloatingActionButton.small(
                    heroTag: 'small-fab',
                    onPressed: () {},
                    tooltip: 'Add item',
                    child: const Icon(Icons.add),
                  ),
                  FloatingActionButton(
                    heroTag: 'regular-fab',
                    onPressed: () {},
                    tooltip: 'Edit item',
                    child: const Icon(Icons.edit_outlined),
                  ),
                  FloatingActionButton.extended(
                    heroTag: 'extended-fab',
                    onPressed: () {},
                    icon: const Icon(Icons.add),
                    label: const Text('New project'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _SavingButton extends StatefulWidget {
  const _SavingButton();

  @override
  State<_SavingButton> createState() => _SavingButtonState();
}

class _SavingButtonState extends State<_SavingButton> {
  bool _saving = false;

  Future<void> _save() async {
    setState(() => _saving = true);
    await Future<void>.delayed(CbMotionTokens.deliberate);
    if (mounted) setState(() => _saving = false);
  }

  @override
  Widget build(BuildContext context) => FilledButton.icon(
    onPressed: _saving ? null : _save,
    icon: _saving
        ? SizedBox.square(
            dimension: CbStructure.textMd,
            child: CircularProgressIndicator(
              strokeWidth: CbStructure.focusWidth,
            ),
          )
        : const Icon(Icons.save_outlined),
    label: Text(_saving ? 'Saving' : 'Save changes'),
  );
}
