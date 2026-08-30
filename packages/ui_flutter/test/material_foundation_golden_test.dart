import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

const Key materialFoundationGoldenKey = Key('material-foundation-golden');

void main() {
  testWidgets('Material foundation family — light', (
    WidgetTester tester,
  ) async {
    await _pumpScene(tester, cbThemeData());

    await expectLater(
      find.byKey(materialFoundationGoldenKey),
      matchesGoldenFile('goldens/material_foundation_light.png'),
    );
  });

  testWidgets('Material foundation family — dark', (WidgetTester tester) async {
    await _pumpScene(tester, cbThemeData(brightness: Brightness.dark));

    await expectLater(
      find.byKey(materialFoundationGoldenKey),
      matchesGoldenFile('goldens/material_foundation_dark.png'),
    );
  });
}

Future<void> _pumpScene(WidgetTester tester, ThemeData theme) async {
  tester.view.devicePixelRatio = 1;
  tester.view.physicalSize = const Size(840, 760);
  addTearDown(tester.view.resetDevicePixelRatio);
  addTearDown(tester.view.resetPhysicalSize);

  final TextStyle? goldenButtonText = theme.filledButtonTheme.style?.textStyle
      ?.resolve(<WidgetState>{})
      ?.copyWith(fontFamily: 'Roboto');
  ButtonStyle? goldenButtonStyle(ButtonStyle? style) => style?.copyWith(
    textStyle: WidgetStatePropertyAll<TextStyle?>(goldenButtonText),
  );
  final ThemeData goldenTheme = theme.copyWith(
    shadowColor: Colors.transparent,
    textTheme: theme.textTheme.apply(fontFamily: 'Roboto'),
    filledButtonTheme: FilledButtonThemeData(
      style: goldenButtonStyle(theme.filledButtonTheme.style),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: goldenButtonStyle(theme.elevatedButtonTheme.style),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: goldenButtonStyle(theme.outlinedButtonTheme.style),
    ),
    textButtonTheme: TextButtonThemeData(
      style: goldenButtonStyle(theme.textButtonTheme.style),
    ),
  );

  await tester.pumpWidget(
    MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: goldenTheme,
      home: const RepaintBoundary(
        key: materialFoundationGoldenKey,
        child: _MaterialFoundationScene(),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

class _MaterialFoundationScene extends StatelessWidget {
  const _MaterialFoundationScene();

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;

    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(CbStructure.space6),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text('Material foundation', style: type.displaySmall),
            const SizedBox(height: CbStructure.space2),
            Text(
              'Ceebee Tokens, rendered through native Material roles.',
              style: type.bodyLarge,
            ),
            const SizedBox(height: CbStructure.space6),
            Text('Type hierarchy', style: type.titleLarge),
            const Divider(),
            Text('Display / Product direction', style: type.headlineMedium),
            const SizedBox(height: CbStructure.space2),
            Text('Title / A deliberate section', style: type.titleLarge),
            const SizedBox(height: CbStructure.space2),
            Text(
              'Body text stays readable while native text scaling remains intact.',
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
                Icon(Icons.auto_awesome_outlined),
                Icon(Icons.layers_outlined),
                Icon(Icons.accessibility_new_outlined),
                SizedBox(
                  height: CbStructure.controlHeightMd,
                  child: VerticalDivider(),
                ),
                Text('One inherited foreground role'),
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
                ElevatedButton(onPressed: () {}, child: const Text('Elevated')),
                OutlinedButton(onPressed: () {}, child: const Text('Preview')),
                TextButton(onPressed: () {}, child: const Text('View details')),
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
                FilledButton.icon(
                  onPressed: null,
                  icon: SizedBox.square(
                    dimension: CbStructure.textMd,
                    child: CircularProgressIndicator(
                      value: 0.65,
                      strokeWidth: CbStructure.focusWidth,
                    ),
                  ),
                  label: const Text('Saving'),
                ),
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
            const SizedBox(height: CbStructure.space5),
            Text('Floating actions', style: type.titleLarge),
            const Divider(),
            Wrap(
              spacing: CbStructure.space4,
              runSpacing: CbStructure.space3,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: <Widget>[
                FloatingActionButton.small(
                  heroTag: 'small',
                  onPressed: () {},
                  tooltip: 'Add item',
                  child: const Icon(Icons.add),
                ),
                FloatingActionButton(
                  heroTag: 'regular',
                  onPressed: () {},
                  tooltip: 'Edit item',
                  child: const Icon(Icons.edit_outlined),
                ),
                FloatingActionButton.extended(
                  heroTag: 'extended',
                  onPressed: () {},
                  icon: const Icon(Icons.add),
                  label: const Text('New project'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
