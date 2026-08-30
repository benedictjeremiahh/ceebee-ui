import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key formEntriesGoldenKey = Key('form-entries-golden');
const Key focusedInputKey = Key('focused-input');
const Key dropdownOverlayGoldenKey = Key('dropdown-overlay-golden');
const Key dropdownOverlayFieldKey = Key('dropdown-overlay-field');

void main() {
  testWidgets('Form entries — light', (WidgetTester tester) async {
    await _pumpScene(tester, cbThemeData());

    await expectLater(
      find.byKey(formEntriesGoldenKey),
      matchesGoldenFile('goldens/form_entries_light.png'),
    );
  });

  testWidgets('Form entries — dark', (WidgetTester tester) async {
    await _pumpScene(tester, cbThemeData(brightness: Brightness.dark));

    await expectLater(
      find.byKey(formEntriesGoldenKey),
      matchesGoldenFile('goldens/form_entries_dark.png'),
    );
  });

  testWidgets('Dropdown overlay — light', (WidgetTester tester) async {
    await _pumpDropdownOverlay(tester, cbThemeData());

    await expectLater(
      find.byKey(dropdownOverlayGoldenKey),
      matchesGoldenFile('goldens/form_entry_dropdown_light.png'),
    );
  });

  testWidgets('Dropdown overlay — dark', (WidgetTester tester) async {
    await _pumpDropdownOverlay(
      tester,
      cbThemeData(brightness: Brightness.dark),
    );

    await expectLater(
      find.byKey(dropdownOverlayGoldenKey),
      matchesGoldenFile('goldens/form_entry_dropdown_dark.png'),
    );
  });
}

Future<void> _pumpScene(WidgetTester tester, ThemeData theme) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(900, 1000);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);

  await tester.pumpWidget(
    MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: theme.copyWith(
        textTheme: theme.textTheme.apply(fontFamily: 'Roboto'),
      ),
      home: const RepaintBoundary(
        key: formEntriesGoldenKey,
        child: _FormEntriesScene(),
      ),
    ),
  );
  await tester.tap(find.byKey(focusedInputKey));
  await tester.pumpAndSettle();
}

Future<void> _pumpDropdownOverlay(WidgetTester tester, ThemeData theme) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(500, 440);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);

  await tester.pumpWidget(
    RepaintBoundary(
      key: dropdownOverlayGoldenKey,
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: theme.copyWith(
          textTheme: theme.textTheme.apply(fontFamily: 'Roboto'),
        ),
        home: Scaffold(
          body: Padding(
            padding: const EdgeInsets.all(CbStructure.space6),
            child: CbSurface(
              padding: CbPad.lg,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  Text('Access level', style: theme.textTheme.titleLarge),
                  const SizedBox(height: CbStructure.space3),
                  const DropdownMenu<String>(
                    key: dropdownOverlayFieldKey,
                    expandedInsets: EdgeInsets.zero,
                    initialSelection: 'Viewer',
                    label: Text('Permission'),
                    dropdownMenuEntries: <DropdownMenuEntry<String>>[
                      DropdownMenuEntry<String>(
                        value: 'Viewer',
                        label: 'Viewer',
                        leadingIcon: Icon(Icons.visibility_outlined),
                      ),
                      DropdownMenuEntry<String>(
                        value: 'Editor',
                        label: 'Editor',
                        leadingIcon: Icon(Icons.edit_outlined),
                      ),
                      DropdownMenuEntry<String>(
                        value: 'Owner',
                        label: 'Owner',
                        leadingIcon: Icon(Icons.admin_panel_settings_outlined),
                      ),
                    ],
                  ),
                  const SizedBox(height: CbStructure.space3),
                  Text(
                    'Choose the least access required.',
                    style: theme.textTheme.bodySmall,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    ),
  );
  await tester.tap(find.byKey(dropdownOverlayFieldKey));
  await tester.pumpAndSettle();
}

class _FormEntriesScene extends StatelessWidget {
  const _FormEntriesScene();

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;

    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(CbStructure.space6),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Text('Form entries', style: type.displaySmall),
            const SizedBox(height: CbStructure.space2),
            Text(
              'Native input, validation, autocomplete, and dropdown states.',
              style: type.bodyLarge,
            ),
            const SizedBox(height: CbStructure.space5),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Expanded(
                  child: CbSurface(
                    padding: CbPad.lg,
                    elevation: CbElevation.sm,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: <Widget>[
                        Text('Text input', style: type.titleLarge),
                        const Divider(),
                        const TextField(
                          decoration: InputDecoration(
                            labelText: 'Full name',
                            hintText: 'e.g. Ada Lovelace',
                          ),
                        ),
                        const SizedBox(height: CbStructure.space4),
                        const TextField(
                          controller: null,
                          decoration: InputDecoration(
                            labelText: 'Search projects',
                            prefixIcon: Icon(Icons.search),
                          ),
                        ),
                        const SizedBox(height: CbStructure.space4),
                        const TextField(
                          minLines: 2,
                          maxLines: 2,
                          decoration: InputDecoration(
                            labelText: 'Notes (optional)',
                            alignLabelWithHint: true,
                            hintText: 'Add context for collaborators',
                          ),
                        ),
                        const SizedBox(height: CbStructure.space4),
                        TextFormField(
                          initialValue: 'System account',
                          readOnly: true,
                          decoration: InputDecoration(
                            labelText: 'Created by',
                            suffixIcon: Icon(Icons.lock_outline),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: CbStructure.space5),
                Expanded(
                  child: CbSurface(
                    padding: CbPad.lg,
                    elevation: CbElevation.sm,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: <Widget>[
                        Text('State and choice', style: type.titleLarge),
                        const Divider(),
                        const TextField(
                          key: focusedInputKey,
                          decoration: InputDecoration(
                            labelText: 'Project name',
                            hintText: 'New workspace',
                          ),
                        ),
                        const SizedBox(height: CbStructure.space4),
                        const TextField(
                          decoration: InputDecoration(
                            labelText: 'Workspace slug',
                            errorText: 'Use at least 3 characters',
                            suffixIcon: Icon(Icons.error_outline),
                          ),
                        ),
                        const SizedBox(height: CbStructure.space4),
                        TextFormField(
                          initialValue: 'Pending',
                          enabled: false,
                          decoration: InputDecoration(
                            labelText: 'Managed workspace ID',
                          ),
                        ),
                        const SizedBox(height: CbStructure.space2),
                        Text(
                          'This value is managed by your organization.',
                          style: type.bodySmall,
                        ),
                        const SizedBox(height: CbStructure.space4),
                        Autocomplete<String>(
                          initialValue: const TextEditingValue(
                            text: 'Designer',
                          ),
                          optionsBuilder: _roleOptions,
                          fieldViewBuilder:
                              (
                                BuildContext context,
                                TextEditingController controller,
                                FocusNode focusNode,
                                VoidCallback onFieldSubmitted,
                              ) => TextField(
                                controller: controller,
                                focusNode: focusNode,
                                decoration: const InputDecoration(
                                  labelText: 'Role',
                                  suffixIcon: Icon(Icons.search),
                                ),
                                onSubmitted: (_) => onFieldSubmitted(),
                              ),
                        ),
                        const SizedBox(height: CbStructure.space4),
                        DropdownMenu<String>(
                          expandedInsets: EdgeInsets.zero,
                          initialSelection: 'Editor',
                          label: const Text('Access level'),
                          dropdownMenuEntries:
                              const <DropdownMenuEntry<String>>[
                                DropdownMenuEntry<String>(
                                  value: 'Viewer',
                                  label: 'Viewer',
                                ),
                                DropdownMenuEntry<String>(
                                  value: 'Editor',
                                  label: 'Editor',
                                ),
                                DropdownMenuEntry<String>(
                                  value: 'Owner',
                                  label: 'Owner',
                                ),
                              ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

Iterable<String> _roleOptions(TextEditingValue value) =>
    const <String>['Designer', 'Developer', 'Researcher'].where(
      (String option) =>
          option.toLowerCase().contains(value.text.toLowerCase()),
    );
