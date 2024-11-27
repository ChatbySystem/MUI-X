---
productId: x-date-pickers
title: DX - Field
---

# Field

<p class="description">This page describes how people can use field with Material UI and how they can build custom fields while keeping the built-in editing behavior.</p>

:::success
This page extends the initial proposal made in [this Github comment](https://github.com/mui/mui-x/issues/14496#issuecomment-2348917294)
:::

## Basic standalone usage

### With Material UI

The `@mui/x-date-pickers` package exposes one field per value type.
Those components are self-contained components (meaning they don't use composition).

Here is a basic example of a `<DateField />`:

```tsx
import { DateField } from '@mui/x-date-pickers/DateField';

<DateField value={value} onChange={setValue} />;
```

The behavior is the same for all the other fields:

```tsx
<TimeField value={value} onChange={setValue} />;

<DateTimeField value={value} onChange={setValue} />;

<DateRangeField value={value} onChange={setValue} />;

<DateTimeRangeField value={value} onChange={setValue} />;

<TimeRangeField value={value} onChange={setValue} />;
```

:::success
This RFC proposes to rename `<SingleInputDateRangeField />` into `<DateRangeField />` for concision when the single input range fields become the default and when the multi input range fields are gathered into a single component.
:::

:::success
All these self-contained components are built on top of `PickerField`.
An intermediary internal component is needed to only create the component once and then have each field pass its `manager` to it.
:::

### Without Material UI

```tsx
import { useDateManager } from '@base-ui/x-date-pickers/managers';
import { PickerField } from '@base-ui/x-date-pickers/PickerField';

function CustomDateField(props) {
  const manager = useDateManager();

  return (
    <PickerField.Root manager={manager} {...props}>
      <PickerField.Content>
        {({ sections }) =>
          sections.map((section) => (
            <PickerField.Section section={section}>
              <PickerField.SectionSeparator position="before" />
              <PickerField.SectionContent />
              <PickerField.SectionSeparator position="after" />
            </PickerField.Section>
          ))
        }
      </PickerField.Content>
    </PickerField.Root>
  );
}
```

The field can then be rendered just like the Material UI fields:

```tsx
<CustomDateField value={value} onChange={setValue} />
```

## Basic usage inside a picker

### With Material UI

:::success
No DX change here compared to today
:::

```tsx
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

<DatePicker slots={{ field: DateField }} />;
```

:::success
The concept of slots does not fit this use case very well, but the exploration of a better DX to override part of the UI in self-contained component is outside the scope of this documentation, so this RFC uses the tools currently available.
:::

### Without Material UI

#### Inside a picker from `@mui/x-date-pickers`

Even if most applications with a custom field probably want to remove `@mui/material` entirely, using these custom fields inside a self contained picker component from `@mui/x-date-pickers/DatePicker` is totally doable.
This can be useful for application using Material UI but with some specific needs for the fields or to allow for a gradual migration away from Material UI.

```tsx
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

<DatePicker slots={{ field: CustomDateField }} />;
```

:::success
The concept of slots does not fit this use case very well, but the exploration of a better DX to override part of the UI in self-contained component is outside the scope of this documentation, so this RFC uses the tools currently available.
:::

#### Inside an unstyled picker

The custom field can also be used inside a picker built with the composable `Picker.*` component from `@base-ui/x-date-pickers/Picker`:

```tsx
import { useDateManager } from '@base-ui/x-date-pickers/managers';
import { Picker } from '@base-ui/x-date-pickers/Picker';

function CustomDatePicker(props) {
  const manager = useDateManager();

  return (
    <Picker.Root manager={manager} {...props}>
      <CustomField />
      <Picker.ResponsivePopper>
        {/** See picker documentation */}
      </Picker.ResponsivePopper>
    </Picker.Root>
  );
}
```

The user can also inline their field if they want:

```tsx
import { useDateManager } from '@base-ui/x-date-pickers/managers';
import { Picker } from '@base-ui/x-date-pickers/Picker';

function CustomDatePicker(props) {
  const manager = useDateManager();

  return (
    <Picker.Root manager={manager} {...props}>
      <PickerField.Root>{/** See demo above */}</PickerField.Root>
      <Picker.ResponsivePopper>
        {/** See picker documentation */}
      </Picker.ResponsivePopper>
    </Picker.Root>
  );
}
```

:::success
When doing that, the `Picker.Field.Root` doesn't have to receive props like `minDate` because they are accessed using `usePickerContext` (or maybe a dedicated `usePickerValidationContext`). This makes composition viable between the picker and the field (same for the views).
:::

## Basic usage (multi input picker)

### With Material UI

The `@mui/x-date-pickers` package also exposes a component to create multi input range fields as follow:

```tsx
import { useDateRangeManager } from '@mui/x-date-pickers/managers';
import { MultiInputRangeField } from '@mui/x-date-pickers/MultiInputRangeField';

function MultiInputDateTimeRangeField(props: MultiInputDateTimeRangeFieldProps) {
  const manager = useDateTimeRangeManager(props);

  return <MultiInputRangeField {...props} manager={manager} ref={ref} />;
}
```

When used inside a picker, `<MultiInputRangeField />` can be passed directly and uses the `manager` exposed by `usePickerContext`:

```tsx
<DatePicker slots={{ field: MultiInputRangeField }} />
```

:::success
I have a POC of this in [#15505](https://github.com/mui/mui-x/pull/15505).
:::

### Without Material UI

:::warning
This is not planned for now.
`Picker.*` could contain some additional components that would be the building blocks for `<MultiInputRangeField />` but it does not seem to be the priority for now.
:::

## Clearable field

### With Material UI

:::success
No DX change here compared to today
:::

```tsx
<DateField clearable />

<DatePicker slotProps={{ field: { clearable: true } }}>
```

### Without Material UI

The user can use the `<PickerField.Clear />` component to add a button to clear the value:

```tsx
import { useDateManager } from '@base-ui/x-date-pickers/managers';
import { PickerField } from '@base-ui/x-date-pickers/PickerField';

function CustomDateField(props) {
  const manager = useDateManager();

  return (
    <PickerField.Root manager={manager} {...props}>
      <PickerField.Content>{/** See demo above */}</PickerField.Content>
      <PickerField.Clear>
        <CustomIcon />
      </PickerField.Clear>
    </PickerField.Root>
  );
}
```

## Anatomy of `Picker.*`

### `PickerField.Root`

Top level component that wraps the other components.
It would expend `Field.Root` from `@base-ui-components/react/Field`.

#### Props

- Extends `Field.Root.Props`

- `manager`: `PickerManager` - **required for standalone fields**

  See [#15395](https://github.com/mui/mui-x/issues/15395) for context.

- **Value props**: `value`, `defaultValue`, `referenceDate`, `onChange`, `onError` and `timezone`.

  Same typing and behavior as today.

- **Validation props**: list based on the `manager` prop

  For `useDateManager()` it would be `maxDate`, `minDate`, `disableFuture`, `disablePast`, `shouldDisableDate`, `shouldDisableMonth`, `shouldDisableYear`.

  Same typing and behavior as today.

- **Form props**: `disabled`, `readOnly`.

  Same typing and behavior as today.

- `format`: `string` (default value applied by the `manager`).

- `formatDensity`: `'dense' | 'spacious'`, default: `'dense'`.

- `shouldRespectLeadingZeros`: `boolean`, default: `false`.

- `selectedSections`: `FieldSelectedSections`

- `onSelectedSectionsChange`: `(newValue: FieldSelectedSections) => void`

- `unstableFieldRef`: `React.Ref<FieldRef<TSection>>`

  This one may not be needed. If its only used for internal purpose, it can probably be made internal (the picker would pass a ref using a private context instead of a prop).

  Keeping it unstable makes removing it easy.

- `autoFocus`: `boolean`

:::success
All the props that the picker can pass to the field (validation props, value props, etc...) are read both from the props and from `usePickerContext` so that it can be used inside a picker built with composition.

That way, users only have to pass the props specific to the field to `<PickerField.Root />`:

```tsx
<Picker.Root manager={manager} {...props}>
  <PickerField.Root shouldRespectLeadingZeros>
    {/** See demo above */}
  </PickerField.Root>
  <Picker.ResponsivePopper>
    {/** See picker documentation */}
  </Picker.ResponsivePopper>
</Picker.Root>
```

:::

### `PickerField.Content`

It would expend `Field.Control` from `@base-ui-components/react/Field`.

It expects a function as its children, which has the list of sections as a parameter:

```tsx
<PickerField.Content>
  {({ sections }) =>
    sections.map((section) => <PickerField.Section section={section} />)
  }
</PickerField.Content>
```

It also renders a hidden input which contains the stringified value and can be used for form submission and testing.

#### Props

- Extends `Field.Control.Props`

- `children`: `(section: InferFieldSection<TValue>) => React.ReactNode`

### `PickerField.Section`

Renders a single section (for instance the year of the hour of the current value).

#### Props

- Extends `React.HTMLAttributes<HTMLSpanElement>`
- `section`: `InferFieldSection<TValue>` (can be `FieldSection` or `FieldRangeSection`) - **required**.

### `PickerField.SectionContent`

Renders the content of a single section.

#### Props

- Extends `React.HTMLAttributes<HTMLSpanElement>`

### `PickerField.SectionSeparator`

Renders the separator to display before or after the current section.

```tsx
<PickerField.SectionSeparator position="before" />
```

#### Props

- Extends `React.HTMLAttributes<HTMLSpanElement>`
- `position`: `'before' | 'after'` - **required**.

### `PickerField.Clear`

Renders the button to clear the value of the field.

#### Props

- Extends `React.HTMLAttributes<HTMLButtonElement>`

- `children`: `React.ReactNode`

- `onClear`: `React.MouseEventHandler`

  :::success
  The new DX is a good opportunity to discuss the behavior of this prop.
  The behavior should either be:

  1. `onClear` is defined on `<PickerField.Root />`. It is also fired when doing <kbd class="key">Ctrl</kbd> + <kbd class="key">A</kbd> and then <kbd class="key">Backspace</kbd>.
  2. `onClear` is defined on `<PickerField.Clear />` (or not defined at all and people just use `onClick`). It is only fired when clicking on this button.

  :::
