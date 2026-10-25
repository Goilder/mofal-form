import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MfButtonComponent, MfFieldComponent, MfFormCardComponent } from 'mofal-form';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, MfButtonComponent, MfFieldComponent, MfFormCardComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly submitted = signal(false);
  readonly success = signal(false);
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    message: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  submit(): void {
    this.submitted.set(true);
    if (this.form.valid) this.success.set(true);
  }
}
