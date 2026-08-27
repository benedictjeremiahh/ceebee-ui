'use client';

import { Showcase, type OfficialDemo } from '../../showcase-frame';
import { sources } from './sources.generated';

import FormBasic from './basic';
import FormControlHooks from './control-hooks';
import FormLayout from './layout';
import FormLayoutMultiple from './layout-multiple';
import FormDisabled from './disabled';
import FormVariant from './variant';
import FormRequiredMark from './required-mark';
import FormSize from './size';
import FormLayoutCanWrap from './layout-can-wrap';
import FormWarningOnly from './warning-only';
import FormUseWatch from './useWatch';
import FormValidateTrigger from './validate-trigger';
import FormValidateOnly from './validate-only';
import FormFormItemPath from './form-item-path';
import FormDynamicFormItem from './dynamic-form-item';
import FormDynamicFormItems from './dynamic-form-items';
import FormDynamicFormItemsDragSorting from './dynamic-form-items-drag-sorting';
import FormDynamicFormItemsComplex from './dynamic-form-items-complex';
import FormNestMessages from './nest-messages';
import FormComplexFormControl from './complex-form-control';
import FormCustomizedFormControls from './customized-form-controls';
import FormGlobalState from './global-state';
import FormFormContext from './form-context';
import FormInlineLogin from './inline-login';
import FormLogin from './login';
import FormRegister from './register';
import FormAdvancedSearch from './advanced-search';
import FormFormInModal from './form-in-modal';
import FormTimeRelatedControls from './time-related-controls';
import FormWithoutFormCreate from './without-form-create';
import FormValidateStatic from './validate-static';
import FormDynamicRule from './dynamic-rule';
import FormFormDependencies from './form-dependencies';
import FormGetValuePropsNormalize from './getValueProps-normalize';
import FormValidateScrollToField from './validate-scroll-to-field';
import FormValidateOther from './validate-other';
import FormStyleClass from './style-class';

const demos: OfficialDemo[] = [
  { file: "basic", title: "Basic Usage", description: "Basic Form data control. Includes layout, initial values, validation and submit.", Component: FormBasic },
  { file: "control-hooks", title: "Form methods", description: "Call form method with Form.useForm. > Note that useForm is a React Hooks that only works in functional component. You can also use ref to get the form instance in class component: https://codesandbox.io/p/sandbox-ngtjtm", Component: FormControlHooks },
  { file: "layout", title: "Form Layout", description: "There are three layout for form: horizontal, vertical, inline.", Component: FormLayout },
  { file: "layout-multiple", title: "Form mix layout", description: "Defining a separate layout on Form.Item can achieve multiple layouts for a single form.", Component: FormLayoutMultiple },
  { file: "disabled", title: "Form disabled", description: "Set component to disabled, only works for library components.", Component: FormDisabled },
  { file: "variant", title: "Form variants", description: "Change the variant of all components in the form, options include: outlined filled borderless and underlined.", Component: FormVariant },
  { file: "required-mark", title: "Required style", description: "Switch required or optional style with requiredMark.", Component: FormRequiredMark },
  { file: "size", title: "Form size", description: "Set component size, only works for library components.", Component: FormSize },
  { file: "layout-can-wrap", title: "label can wrap", description: "Turn on labelWrap to wrap label if text is long.", Component: FormLayoutCanWrap },
  { file: "warning-only", title: "No block rule", description: "rule with warningOnly will not block form submit.", Component: FormWarningOnly },
  { file: "useWatch", title: "Watch Hooks", description: "useWatch helps watch the field change and only re-render for the value change. API Ref.", Component: FormUseWatch },
  { file: "validate-trigger", title: "Validate Trigger", description: "For the async validation scenario, high frequency of verification will cause backend pressure. You can change the verification timing through validateTrigger, or change the verification frequency through validateDebounce, or set the verification short circuit through validateFirst.", Component: FormValidateTrigger },
  { file: "validate-only", title: "Validate Only", description: "Dynamic adjust submit button's disabled status by validateOnly of validateFields.", Component: FormValidateOnly },
  { file: "form-item-path", title: "Path Prefix", description: "In some scenarios, you may want to set a prefix for some fields consistently. You can achieve this effect with HOC.", Component: FormFormItemPath },
  { file: "dynamic-form-item", title: "Dynamic Form Item", description: "Add or remove form items dynamically. add function support config initial value.", Component: FormDynamicFormItem },
  { file: "dynamic-form-items", title: "Dynamic Form nest Items", description: "Nest dynamic field need extends field. Pass field.name to nest item.", Component: FormDynamicFormItems },
  { file: "dynamic-form-items-drag-sorting", title: "Drag sorting", description: "Combine dnd-kit with the move operation provided by Form.List to drag and sort dynamic form items. Each field's stable key is used as the drag identifier, and move(from, to) is called on drag end to reorder items while keeping the form values in sync.", Component: FormDynamicFormItemsDragSorting },
  { file: "dynamic-form-items-complex", title: "Complex Dynamic Form Item", description: "Multiple Form.List nested usage scenarios.", Component: FormDynamicFormItemsComplex },
  { file: "nest-messages", title: "Nest", description: "name prop support nest data structure. Customize validate message template with validateMessages or message. Ref here about message template.", Component: FormNestMessages },
  { file: "complex-form-control", title: "complex form control", description: "This demo shows how to use Form.Item with multiple controls. <Form.Item name=\"field\" /> will only bind the control(Input/Select) which is the only children of it. Imagine this case: you added some text description after the Input, then you have to wrap the Input by an extra <Form.Item name=\"field\">. style property of Form.Item could be useful to modify the nested form item layout, or use <Form.Item noStyle /> to turn it into a pure form-binded component(like getFieldDecorator in 3.x). diff - <Form.Item label=\"Field\" name=\"field\"> -   <Input /> - </Form.Item> + <Form.Item label=\"Field\" htmlFor=\"field\"> +   <Form.Item name=\"field\" noStyle><Input id=\"field\" /></Form.Item> +   {/* The nested item binds the input. */} +   <span>description</span> + </Form.Item> When the outer labeled Form.Item has no name, it cannot infer the nested control's ID. If the label describes a single control, set htmlFor on the outer item and the same id on the nested control to preserve label-click focus and screen reader association. This demo shows three typical usages: - Username: extra elements after control, using <Form.Item name=\"field\" noStyle /> inside Form.Item to bind Input. - Address: two controls in one line, using two <Form.Item name=\"field\" noStyle /> to bind each control. - BirthDate\uff1atwo controls in one line with independent error message, using two <Form.Item name=\"field\" noStyle /> to bind each control, make layout inline by customizing style property. > Note that, in this case, no more name property should be left in Form.Item with label. See the Customized Form Controls demo below for more advanced usage.", Component: FormComplexFormControl },
  { file: "customized-form-controls", title: "Customized Form Controls", description: "Customized or third-party form controls can be used in Form, too. Controls must follow these conventions: > - It has a controlled property value or other name which is equal to the value of valuePropName. > - It has event onChange or an event which name is equal to the value of trigger. > - Forward the ref or pass the id property to dom to support the scrollToField method.", Component: FormCustomizedFormControls },
  { file: "global-state", title: "Store Form Data into Upper Component", description: "We can store form data into upper component or Redux or dva by using onFieldsChange and fields, see more at this rc-field-form demo. onFieldsChange returns a flat FieldData[]. When a field uses an array name path, FieldData.name keeps that path instead of converting it into a nested object, making it easier to process each field entry in the external state. **Note:** Saving form data globally is not a good practice. You should avoid this if not necessary.", Component: FormGlobalState },
  { file: "form-context", title: "Control between forms", description: "Use Form.Provider to process data between forms. In this case, submit button is in the Modal which is out of Form. You can use form.submit to submit form. Besides, we recommend native <Button htmlType=\"submit\" /> to submit a form.", Component: FormFormContext },
  { file: "inline-login", title: "Inline Login Form", description: "Inline login form is often used in navigation bar.", Component: FormInlineLogin },
  { file: "login", title: "Login Form", description: "Normal login form which can contain more elements.", Component: FormLogin },
  { file: "register", title: "Registration", description: "Fill in this form to create a new account for you.", Component: FormRegister },
  { file: "advanced-search", title: "Advanced search", description: "Three columns layout is often used for advanced searching of data table. Because the width of label is not fixed, you may need to adjust it by customizing its style.", Component: FormAdvancedSearch },
  { file: "form-in-modal", title: "Form in Modal to Create", description: "When user visit a page with a list of items, and want to create a new item. The page can popup a form in Modal, then let user fill in the form to create an item.", Component: FormFormInModal },
  { file: "time-related-controls", title: "Time-related Controls", description: "The value of time-related components is a dayjs object, which we need to pre-process it before we submit to server.", Component: FormTimeRelatedControls },
  { file: "without-form-create", title: "Handle Form Data Manually", description: "Form will collect and validate form data automatically. But if you don't need this feature or the default behavior cannot satisfy your business, you can handle form data manually.", Component: FormWithoutFormCreate },
  { file: "validate-static", title: "Customized Validation", description: "We provide properties like validateStatus help hasFeedback to customize your own validate status and message, without using Form. 1. validateStatus: validate status of form components which could be 'success', 'warning', 'error', 'validating'. 2. hasFeedback: display feed icon of input control 3. help: display validate message.", Component: FormValidateStatic },
  { file: "dynamic-rule", title: "Dynamic Rules", description: "Perform different check rules according to different situations.", Component: FormDynamicRule },
  { file: "form-dependencies", title: "Dependencies", description: "Form.Item can set the associated field through the dependencies property. When the value of the associated field changes, the validation and update will be triggered.", Component: FormFormDependencies },
  { file: "getValueProps-normalize", title: "getValueProps + normalize", description: "By combining getValueProps and normalize, it is possible to convert the format of value, such as converting the timestamp into a dayjs object and then passing it to the DatePicker.", Component: FormGetValuePropsNormalize },
  { file: "validate-scroll-to-field", title: "Slide to error field", description: "When validation fails or manually scroll to the error field.", Component: FormValidateScrollToField, iframe: 360 },
  { file: "validate-other", title: "Other Form Controls", description: "Demonstration of validation configuration for form controls which are not shown in the demos above.", Component: FormValidateOther },
  { file: "style-class", title: "Custom semantic dom styling", description: "You can customize the semantic dom style of Form by passing objects/functions through classNames and styles.", Component: FormStyleClass },
];

export function FormShowcase() {
  return <Showcase section="data-entry" component="form" demos={demos} sources={sources} />;
}
