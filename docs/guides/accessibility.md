# Accessibility notes

The components use native form elements. `mf-field` renders a visible `label` linked to its input or textarea through the `name` input. Give each field a unique, nonempty name.

When you pass an `error`, the field sets `aria-invalid` and links the feedback element with `aria-describedby`. Pass errors when your form is ready to show them, for example after submit or after the control has been touched. A `hint` is shown when there is no error.

The button is a native `button` with a visible focus indicator. Set `type="button"` for actions that should not submit the surrounding form. The default type is `submit`.

For a complete form, also:

- Keep a logical reading and tab order.
- Use descriptive labels instead of relying on placeholders alone.
- Show a clear success or failure state after submission.
- Test keyboard navigation and zoomed or narrow layouts.
- Connect server errors to the relevant controls in the consuming application.

The standalone [offline study reference](../examples/README.md) demonstrates a longer interaction with notes and status controls. It is a UX reference, not an Angular implementation.

