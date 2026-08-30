import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_test/flutter_test.dart';

const Key nameFieldKey = Key('name-field');
const Key emailFieldKey = Key('email-field');
const Key roleFieldKey = Key('role-field');
const Key accessFieldKey = Key('access-field');
const Key readOnlyFieldKey = Key('read-only-field');
const Key disabledFieldKey = Key('disabled-field');
const Key submitFormKey = Key('submit-form');

void main() {
  testWidgets('form validates on submit and focuses the first invalid field', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _FormEntryHarness()),
    );

    expect(find.text('Enter your name'), findsNothing);
    await tester.tap(find.byKey(submitFormKey));
    await tester.pump();

    expect(find.text('Enter your name'), findsOneWidget);
    expect(find.text('Enter a valid email address'), findsOneWidget);
    expect(
      tester
          .widget<EditableText>(
            find.descendant(
              of: find.byKey(nameFieldKey),
              matching: find.byType(EditableText),
            ),
          )
          .focusNode
          .hasFocus,
      isTrue,
    );

    await tester.enterText(find.byKey(nameFieldKey), 'Ada Lovelace');
    await tester.enterText(find.byKey(emailFieldKey), 'ada@example.com');
    await tester.tap(find.byKey(submitFormKey));
    await tester.pump();

    expect(find.text('Saved Ada Lovelace'), findsOneWidget);
    expect(find.text('Enter your name'), findsNothing);
  });

  testWidgets('autocomplete and dropdown expose native selection behavior', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _FormEntryHarness()),
    );

    await tester.enterText(find.byKey(roleFieldKey), 'des');
    await tester.pump();
    expect(find.text('Designer'), findsOneWidget);
    await tester.tap(find.text('Designer'));
    await tester.pumpAndSettle();
    expect(find.text('Selected role: Designer'), findsOneWidget);

    await tester.tap(find.byKey(accessFieldKey));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Editor').last);
    await tester.pumpAndSettle();
    expect(find.text('Selected access: Editor'), findsOneWidget);
  });

  testWidgets('read-only and disabled fields expose distinct behavior', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(theme: cbThemeData(), home: const _FormEntryHarness()),
    );

    final SemanticsNode readOnly = tester.getSemantics(
      find.descendant(
        of: find.byKey(readOnlyFieldKey),
        matching: find.byType(EditableText),
      ),
    );
    expect(readOnly.flagsCollection.isReadOnly, isTrue);
    await tester.tap(find.byKey(disabledFieldKey));
    await tester.pump();
    expect(
      tester
          .widget<EditableText>(
            find.descendant(
              of: find.byKey(disabledFieldKey),
              matching: find.byType(EditableText),
            ),
          )
          .focusNode
          .hasFocus,
      isFalse,
    );
    expect(find.text('Managed by your administrator'), findsOneWidget);
  });
}

class _FormEntryHarness extends StatefulWidget {
  const _FormEntryHarness();

  @override
  State<_FormEntryHarness> createState() => _FormEntryHarnessState();
}

class _FormEntryHarnessState extends State<_FormEntryHarness> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final FocusNode _nameFocus = FocusNode();
  final TextEditingController _name = TextEditingController();
  String? _savedName;
  String? _role;
  String _access = 'Viewer';

  @override
  void dispose() {
    _nameFocus.dispose();
    _name.dispose();
    super.dispose();
  }

  void _submit() {
    if (!(_formKey.currentState?.validate() ?? false)) {
      _nameFocus.requestFocus();
      return;
    }
    setState(() => _savedName = _name.text.trim());
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SingleChildScrollView(
      child: Form(
        key: _formKey,
        child: Column(
          children: <Widget>[
            TextFormField(
              key: nameFieldKey,
              controller: _name,
              focusNode: _nameFocus,
              textInputAction: TextInputAction.next,
              decoration: const InputDecoration(labelText: 'Full name'),
              validator: (String? value) =>
                  value == null || value.trim().isEmpty
                  ? 'Enter your name'
                  : null,
            ),
            TextFormField(
              key: emailFieldKey,
              keyboardType: TextInputType.emailAddress,
              textInputAction: TextInputAction.done,
              decoration: const InputDecoration(labelText: 'Email address'),
              validator: (String? value) => value != null && value.contains('@')
                  ? null
                  : 'Enter a valid email address',
              onFieldSubmitted: (_) => _submit(),
            ),
            Autocomplete<String>(
              optionsBuilder: (TextEditingValue value) => value.text.isEmpty
                  ? const Iterable<String>.empty()
                  : const <String>['Designer', 'Developer', 'Researcher'].where(
                      (String option) => option.toLowerCase().contains(
                        value.text.toLowerCase(),
                      ),
                    ),
              fieldViewBuilder:
                  (
                    BuildContext context,
                    TextEditingController controller,
                    FocusNode focusNode,
                    VoidCallback onFieldSubmitted,
                  ) => TextField(
                    key: roleFieldKey,
                    controller: controller,
                    focusNode: focusNode,
                    decoration: const InputDecoration(labelText: 'Role'),
                    onSubmitted: (_) => onFieldSubmitted(),
                  ),
              onSelected: (String value) => setState(() => _role = value),
            ),
            DropdownMenu<String>(
              key: accessFieldKey,
              initialSelection: _access,
              label: const Text('Access level'),
              dropdownMenuEntries: const <DropdownMenuEntry<String>>[
                DropdownMenuEntry<String>(value: 'Viewer', label: 'Viewer'),
                DropdownMenuEntry<String>(value: 'Editor', label: 'Editor'),
                DropdownMenuEntry<String>(value: 'Owner', label: 'Owner'),
              ],
              onSelected: (String? value) {
                if (value != null) setState(() => _access = value);
              },
            ),
            const TextField(
              key: readOnlyFieldKey,
              readOnly: true,
              controller: null,
              decoration: InputDecoration(
                labelText: 'Created by',
                hintText: 'System account',
              ),
            ),
            const TextField(
              key: disabledFieldKey,
              enabled: false,
              decoration: InputDecoration(
                labelText: 'Managed workspace ID',
                hintText: 'Assigned after provisioning',
              ),
            ),
            const Text('Managed by your administrator'),
            FilledButton(
              key: submitFormKey,
              onPressed: _submit,
              child: const Text('Save profile'),
            ),
            if (_savedName != null) Text('Saved $_savedName'),
            Text('Selected role: ${_role ?? 'None'}'),
            Text('Selected access: $_access'),
          ],
        ),
      ),
    ),
  );
}
