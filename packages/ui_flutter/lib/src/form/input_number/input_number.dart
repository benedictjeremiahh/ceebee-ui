import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'package:ceebee_ui/src/tokens/generated/structure.g.dart';

typedef CbInputNumberFormatter = String Function(double value);
typedef CbInputNumberParser = double? Function(String text);

/// A controlled numeric text input with touch-sized step controls.
///
/// The application owns [value], localization, validation, and persistence.
/// Text that cannot be parsed remains an editing draft and is restored to the
/// controlled value when focus leaves the field.
class CbInputNumber extends StatefulWidget {
  const CbInputNumber({
    super.key,
    required this.value,
    required this.label,
    required this.incrementSemanticLabel,
    required this.decrementSemanticLabel,
    this.onChanged,
    this.step = 1,
    this.min,
    this.max,
    this.readOnly = false,
    this.helperText,
    this.errorText,
    this.prefixText,
    this.suffixText,
    this.formatter,
    this.parser,
    this.keyboardType,
    this.inputFormatters,
    this.focusNode,
    this.textInputAction,
    this.onSubmitted,
  }) : assert(step > 0),
       assert(min == null || max == null || min <= max);

  final double? value;
  final String label;
  final String incrementSemanticLabel;
  final String decrementSemanticLabel;

  /// Application callback. When absent, the control is disabled unless
  /// [readOnly] is true.
  final ValueChanged<double?>? onChanged;
  final double step;
  final double? min;
  final double? max;
  final bool readOnly;
  final String? helperText;
  final String? errorText;
  final String? prefixText;
  final String? suffixText;
  final CbInputNumberFormatter? formatter;
  final CbInputNumberParser? parser;
  final TextInputType? keyboardType;
  final List<TextInputFormatter>? inputFormatters;
  final FocusNode? focusNode;
  final TextInputAction? textInputAction;
  final VoidCallback? onSubmitted;

  @override
  State<CbInputNumber> createState() => _CbInputNumberState();
}

class _CbInputNumberState extends State<CbInputNumber> {
  late final TextEditingController _controller;
  FocusNode? _ownedFocusNode;

  FocusNode get _focusNode =>
      widget.focusNode ?? (_ownedFocusNode ??= FocusNode());

  bool get _disabled => widget.onChanged == null && !widget.readOnly;
  bool get _interactive => !_disabled && !widget.readOnly;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: _format(widget.value));
    _focusNode.addListener(_handleFocusChanged);
  }

  @override
  void didUpdateWidget(CbInputNumber oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.focusNode != widget.focusNode) {
      (oldWidget.focusNode ?? _ownedFocusNode)?.removeListener(
        _handleFocusChanged,
      );
      if (widget.focusNode != null) {
        _ownedFocusNode?.dispose();
        _ownedFocusNode = null;
      }
      _focusNode.addListener(_handleFocusChanged);
    }
    if (!_focusNode.hasFocus &&
        (oldWidget.value != widget.value ||
            oldWidget.formatter != widget.formatter)) {
      _replaceText(_format(widget.value));
    }
  }

  @override
  void dispose() {
    _focusNode.removeListener(_handleFocusChanged);
    _ownedFocusNode?.dispose();
    _controller.dispose();
    super.dispose();
  }

  void _handleFocusChanged() {
    if (!_focusNode.hasFocus) _replaceText(_format(widget.value));
  }

  void _handleTextChanged(String text) {
    if (!_interactive) return;
    if (text.trim().isEmpty) {
      widget.onChanged!(null);
      return;
    }
    final double? parsed = (widget.parser ?? _defaultParser)(text);
    if (parsed != null && parsed.isFinite) widget.onChanged!(parsed);
  }

  void _stepBy(double delta) {
    final double next = _clamp((widget.value ?? 0) + delta);
    _replaceText(_format(next));
    widget.onChanged!(next);
  }

  double _clamp(double value) {
    double result = value;
    if (widget.min case final double min when result < min) result = min;
    if (widget.max case final double max when result > max) result = max;
    return result;
  }

  bool get _canDecrement =>
      _interactive &&
      (widget.value == null ||
          widget.min == null ||
          widget.value! > widget.min!);

  bool get _canIncrement =>
      _interactive &&
      (widget.value == null ||
          widget.max == null ||
          widget.value! < widget.max!);

  String _format(double? value) {
    if (value == null) return '';
    return (widget.formatter ?? _defaultFormatter)(value);
  }

  void _replaceText(String text) {
    _controller.value = TextEditingValue(
      text: text,
      selection: TextSelection.collapsed(offset: text.length),
    );
  }

  @override
  Widget build(BuildContext context) => Row(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      _StepButton(
        icon: Icons.remove,
        semanticLabel: widget.decrementSemanticLabel,
        onPressed: _canDecrement ? () => _stepBy(-widget.step) : null,
      ),
      const SizedBox(width: CbStructure.space2),
      Expanded(
        child: TextField(
          controller: _controller,
          focusNode: _focusNode,
          enabled: !_disabled,
          readOnly: widget.readOnly,
          keyboardType:
              widget.keyboardType ??
              const TextInputType.numberWithOptions(
                decimal: true,
                signed: true,
              ),
          inputFormatters: widget.inputFormatters,
          textInputAction: widget.textInputAction,
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
            fontFeatures: const <FontFeature>[FontFeature.tabularFigures()],
          ),
          decoration: InputDecoration(
            labelText: widget.label,
            helperText: widget.helperText,
            errorText: widget.errorText,
            prefixText: widget.prefixText,
            suffixText: widget.suffixText,
            suffixIcon: widget.readOnly ? const Icon(Icons.lock_outline) : null,
          ),
          onChanged: _handleTextChanged,
          onSubmitted: (_) {
            _replaceText(_format(widget.value));
            widget.onSubmitted?.call();
          },
        ),
      ),
      const SizedBox(width: CbStructure.space2),
      _StepButton(
        icon: Icons.add,
        semanticLabel: widget.incrementSemanticLabel,
        onPressed: _canIncrement ? () => _stepBy(widget.step) : null,
      ),
    ],
  );
}

class _StepButton extends StatelessWidget {
  const _StepButton({
    required this.icon,
    required this.semanticLabel,
    required this.onPressed,
  });

  final IconData icon;
  final String semanticLabel;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) => Semantics(
    button: true,
    enabled: onPressed != null,
    label: semanticLabel,
    child: ExcludeSemantics(
      child: IconButton.outlined(
        constraints: const BoxConstraints.tightFor(
          width: CbStructure.controlHeightLg,
          height: CbStructure.controlHeightLg,
        ),
        tooltip: semanticLabel,
        onPressed: onPressed,
        icon: Icon(icon),
      ),
    ),
  );
}

double? _defaultParser(String text) => double.tryParse(text.trim());

String _defaultFormatter(double value) => value == value.roundToDouble()
    ? value.toInt().toString()
    : value.toString();
