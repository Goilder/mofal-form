# Components

All components are standalone and exported from `mofal-form`.

## `mf-form-card`

A styled surface with content projection.

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `Your form` | Heading |
| `description` | `string` | empty | Supporting text |
| `eyebrow` | `string` | empty | Small label above heading |

Put controls and actions inside the component tags.

## `mf-field`

A text input or textarea that implements Angular's `ControlValueAccessor`. Use it with `formControl`, `formControlName`, or `ngModel`. Supply a unique `name` so the label and feedback text link to the control.

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | empty | DOM ID and name; should be unique |
| `label` | `string` | empty | Visible label |
| `placeholder` | `string` | empty | Placeholder text |
| `type` | `string` | `text` | Native input type when `multiline` is false |
| `autocomplete` | `string` | `off` | Native autocomplete hint |
| `hint` | `string` | empty | Helper message below the control |
| `error` | `string` | empty | Error message; overrides hint and sets `aria-invalid` |
| `required` | `boolean` | `false` | Adds the native required attribute and a label marker |
| `multiline` | `boolean` | `false` | Renders a textarea |

Values are strings. For numeric data, convert and validate in your own form model. Validation rules come from Angular Forms; pass an error message when you want the component to display feedback.

## `mf-button`

A full-width themed button with projected label text.

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `button \| submit \| reset` | `submit` | Native button type |
| `disabled` | `boolean` | `false` | Disables the native button |

## Theming

The components inherit `--mf-accent`, `--mf-ink`, `--mf-muted`, `--mf-surface`, `--mf-input-bg`, `--mf-border`, `--mf-radius`, and `--mf-font` from their ancestors. Defaults are included, so importing a separate stylesheet is unnecessary.

## Demo behavior

The demo checks required name, email, and message fields. Its success state is local to the browser. It does not send data to a server.

