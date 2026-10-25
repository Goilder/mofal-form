# Reactive form validation

`MfFieldComponent` implements `ControlValueAccessor`, so it works with Angular's reactive and template-driven forms. Validation rules belong in the form model. The component displays the error string you pass to it.

~~~ts
import { FormControl, FormGroup, Validators } from '@angular/forms';

form = new FormGroup({
  email: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  }),
});
submitted = false;

submit(): void {
  this.submitted = true;
  if (this.form.invalid) return;
  // Send the validated value to your own API here.
}
~~~

~~~html
<mf-form-card title="Contact us">
  <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
    <mf-field
      name="contact-email"
      label="Email"
      type="email"
      autocomplete="email"
      formControlName="email"
      [required]="true"
      [error]="submitted && form.controls.email.invalid ? 'Enter a valid email.' : ''"
    />
    <mf-button>Send</mf-button>
  </form>
</mf-form-card>
~~~

Import `ReactiveFormsModule` and all three standalone components in the consuming Angular component. Use a unique `name` for each field on the page. The field uses it as the native input ID and to associate helper or error text with the input. Error text takes precedence over the hint. A textarea uses the same component with `[multiline]="true"`.

The demo in `projects/demo` shows a complete three-field local flow. It intentionally has no network submission endpoint.

