/// The semantic colour a component wears. A component takes a [CbTone], never a colour.
enum CbTone { neutral, brand, info, success, warning, danger }

/// A component's size step. Never a number.
enum CbSize { sm, md, lg }

/// The decorative pastel set the reference board leans on. Wins over [CbTone] where both are given.
enum CbDecorHue { violet, blue, teal, green, amber, rose }
