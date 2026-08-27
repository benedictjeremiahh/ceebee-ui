'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import AutoCompleteBasic from './basic';
import AutoCompleteOptions from './options';
import AutoCompleteCustom from './custom';
import AutoCompleteNonCaseSensitive from './non-case-sensitive';
import AutoCompleteCertainCategory from './certain-category';
import AutoCompleteUncertainCategory from './uncertain-category';
import AutoCompleteStatus from './status';
import AutoCompleteVariant from './variant';
import AutoCompleteAllowClear from './allowClear';
import AutoCompleteStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: 'basic', title: 'Basic Usage', description: 'Basic Usage, set data source of autocomplete with options property.', Component: AutoCompleteBasic },
  { file: 'options', title: 'Customized', description: 'You could set custom Option label', Component: AutoCompleteOptions },
  { file: 'custom', title: 'Customize Input Component', description: 'Customize Input Component', Component: AutoCompleteCustom },
  { file: 'non-case-sensitive', title: 'Non-case-sensitive AutoComplete', description: 'A non-case-sensitive AutoComplete', Component: AutoCompleteNonCaseSensitive },
  { file: 'certain-category', title: 'Lookup-Patterns - Certain Category', description: 'Demonstration of Lookup Patterns: Certain Category. Basic Usage, set options of autocomplete with options property.', Component: AutoCompleteCertainCategory },
  { file: 'uncertain-category', title: 'Lookup-Patterns - Uncertain Category', description: 'Demonstration of Lookup Patterns: Uncertain Category.', Component: AutoCompleteUncertainCategory },
  { file: 'status', title: 'Status', description: 'Add status to AutoComplete with status, which could be error or warning.', Component: AutoCompleteStatus },
  { file: 'variant', title: 'Variants', description: 'There are outlined, filled, borderless, and underlined variants to choose from.', Component: AutoCompleteVariant },
  { file: 'allowClear', title: 'Customize clear button', description: 'Customize clear button', Component: AutoCompleteAllowClear },
  { file: 'style-class', title: 'Custom semantic dom styling', description: 'You can customize the semantic dom style of AutoComplete by passing objects/functions through classNames and styles.', Component: AutoCompleteStyleClass },
];

export function AutoCompleteShowcase() {
  return <Showcase section="data-entry" component="auto-complete" demos={demos} sources={sources} cols={2} />;
}
