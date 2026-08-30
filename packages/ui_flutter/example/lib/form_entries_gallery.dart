import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key profileNameKey = Key('profile-name');
const Key profileEmailKey = Key('profile-email');
const Key profileSubmitKey = Key('profile-submit');
const Key profileRoleKey = Key('profile-role');
const Key profileAccessKey = Key('profile-access');

class FormEntriesGallery extends StatefulWidget {
  const FormEntriesGallery({super.key});

  @override
  State<FormEntriesGallery> createState() => _FormEntriesGalleryState();
}

class _FormEntriesGalleryState extends State<FormEntriesGallery> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final FocusNode _nameFocus = FocusNode();
  final TextEditingController _name = TextEditingController();
  bool _submitted = false;
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
    setState(() => _submitted = true);
    if (!(_formKey.currentState?.validate() ?? false)) {
      _nameFocus.requestFocus();
      return;
    }
    FocusManager.instance.primaryFocus?.unfocus();
    setState(() => _savedName = _name.text.trim());
  }

  @override
  Widget build(BuildContext context) {
    final TextTheme type = Theme.of(context).textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Text('Form entries', style: type.displaySmall),
        const SizedBox(height: CbStructure.space2),
        Text(
          'Material owns editing, keyboard, focus, validation, and menu behavior. '
          'Ceebee supplies semantic color and type roles through the Theme bridge.',
          style: type.bodyLarge,
        ),
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          elevation: CbElevation.sm,
          padding: CbPad.lg,
          child: Form(
            key: _formKey,
            autovalidateMode: _submitted
                ? AutovalidateMode.onUserInteraction
                : AutovalidateMode.disabled,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                Text('Profile form', style: type.titleLarge),
                const Divider(),
                Text(
                  'Required. Use the name people recognize.',
                  style: type.bodySmall,
                ),
                TextFormField(
                  key: profileNameKey,
                  controller: _name,
                  focusNode: _nameFocus,
                  textCapitalization: TextCapitalization.words,
                  textInputAction: TextInputAction.next,
                  decoration: const InputDecoration(labelText: 'Full name'),
                  validator: (String? value) =>
                      value == null || value.trim().isEmpty
                      ? 'Enter your name'
                      : null,
                ),
                const SizedBox(height: CbStructure.space4),
                Text(
                  'Required. We only use this for account communication.',
                  style: type.bodySmall,
                ),
                TextFormField(
                  key: profileEmailKey,
                  keyboardType: TextInputType.emailAddress,
                  autofillHints: const <String>[AutofillHints.email],
                  textInputAction: TextInputAction.done,
                  decoration: const InputDecoration(labelText: 'Email address'),
                  validator: (String? value) =>
                      value != null && value.contains('@')
                      ? null
                      : 'Enter a valid email address',
                  onFieldSubmitted: (_) => _submit(),
                ),
                const SizedBox(height: CbStructure.space4),
                const TextField(
                  minLines: 2,
                  maxLines: 4,
                  decoration: InputDecoration(
                    labelText: 'Bio (optional)',
                    alignLabelWithHint: true,
                  ),
                ),
                const SizedBox(height: CbStructure.space5),
                Align(
                  alignment: Alignment.centerLeft,
                  child: FilledButton.icon(
                    key: profileSubmitKey,
                    onPressed: _submit,
                    icon: const Icon(Icons.save_outlined),
                    label: const Text('Save profile'),
                  ),
                ),
                if (_savedName != null) ...<Widget>[
                  const SizedBox(height: CbStructure.space3),
                  Text('Profile saved for $_savedName', style: type.bodySmall),
                ],
              ],
            ),
          ),
        ),
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          padding: CbPad.lg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Text('Assisted choices', style: type.titleLarge),
              const Divider(),
              Autocomplete<String>(
                optionsBuilder: (TextEditingValue value) => value.text.isEmpty
                    ? const Iterable<String>.empty()
                    : _roles.where(
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
                      key: profileRoleKey,
                      controller: controller,
                      focusNode: focusNode,
                      decoration: const InputDecoration(
                        labelText: 'Role',
                        hintText: 'Start typing a role',
                        suffixIcon: Icon(Icons.search),
                      ),
                      onSubmitted: (_) => onFieldSubmitted(),
                    ),
                onSelected: (String value) => setState(() => _role = value),
              ),
              const SizedBox(height: CbStructure.space2),
              Text('Selected role: ${_role ?? 'None'}', style: type.bodySmall),
              const SizedBox(height: CbStructure.space4),
              DropdownMenu<String>(
                key: profileAccessKey,
                expandedInsets: EdgeInsets.zero,
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
              const SizedBox(height: CbStructure.space2),
              Text('Selected access: $_access', style: type.bodySmall),
            ],
          ),
        ),
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          padding: CbPad.lg,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Text('Non-editable states', style: type.titleLarge),
              const Divider(),
              TextFormField(
                initialValue: 'System account',
                readOnly: true,
                decoration: const InputDecoration(
                  labelText: 'Created by',
                  suffixIcon: Icon(Icons.lock_outline),
                ),
              ),
              const SizedBox(height: CbStructure.space4),
              TextFormField(
                initialValue: 'Pending',
                enabled: false,
                decoration: const InputDecoration(
                  labelText: 'Managed workspace ID',
                ),
              ),
              const SizedBox(height: CbStructure.space2),
              Text(
                'The workspace ID is assigned after provisioning.',
                style: type.bodySmall,
              ),
            ],
          ),
        ),
      ],
    );
  }
}

const List<String> _roles = <String>[
  'Designer',
  'Developer',
  'Product manager',
  'Researcher',
];
