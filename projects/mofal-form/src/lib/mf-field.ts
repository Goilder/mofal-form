import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Styled input and textarea with Angular Forms support. Supply a unique `name`. */
@Component({
  selector: 'mf-field',
  standalone: true,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MfFieldComponent), multi: true }],
  template: `
    <div class="mf-field">
      <label [for]="name">{{ label }} @if (required) { <span aria-hidden="true">*</span> }</label>
      @if (multiline) {
        <textarea [id]="name" [name]="name" [value]="value" [placeholder]="placeholder"
          [required]="required" [disabled]="disabled" [attr.aria-invalid]="error ? true : null"
          [attr.aria-describedby]="message ? name + '-message' : null"
          (input)="handleInput($event)" (blur)="onTouched()"></textarea>
      } @else {
        <input [id]="name" [name]="name" [type]="type" [value]="value" [placeholder]="placeholder"
          [autocomplete]="autocomplete" [required]="required" [disabled]="disabled"
          [attr.aria-invalid]="error ? true : null"
          [attr.aria-describedby]="message ? name + '-message' : null"
          (input)="handleInput($event)" (blur)="onTouched()" />
      }
      @if (message) { <small [id]="name + '-message'" [class.mf-error]="!!error">{{ message }}</small> }
    </div>
  `,
  styles: [`
    :host { display: block; font-family: var(--mf-font, Inter, ui-sans-serif, system-ui, sans-serif); }
    .mf-field { display: grid; gap: 9px; }
    label { color: var(--mf-ink, #1d2540); font-size: 13px; font-weight: 700; }
    label span { color: var(--mf-accent, #7059e8); }
    input, textarea { width: 100%; box-sizing: border-box; border: 1px solid var(--mf-border, #dfe3ee); border-radius: 12px; background: var(--mf-input-bg, #fafbff); color: var(--mf-ink, #1d2540); font: inherit; font-size: 14px; padding: 14px 16px; outline: none; transition: border-color .2s, box-shadow .2s; }
    input::placeholder, textarea::placeholder { color: #a1abc0; }
    input:focus, textarea:focus { border-color: var(--mf-accent, #7059e8); box-shadow: 0 0 0 4px rgba(112, 89, 232, .12); }
    input:disabled, textarea:disabled { opacity: .55; cursor: not-allowed; }
    input[aria-invalid=true], textarea[aria-invalid=true] { border-color: #e05c76; }
    textarea { min-height: 112px; resize: vertical; }
    small { color: var(--mf-muted, #73809a); font-size: 12px; line-height: 1.4; }
    .mf-error { color: #d54462; }
  `],
})
export class MfFieldComponent implements ControlValueAccessor {
  @Input() name = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() autocomplete = 'off';
  @Input() hint = '';
  @Input() error = '';
  @Input() required = false;
  @Input() multiline = false;

  value = '';
  disabled = false;
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  get message(): string { return this.error || this.hint; }
  writeValue(value: string | null): void { this.value = value ?? ''; }
  registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.disabled = disabled; }
  handleInput(event: Event): void {
    this.value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.onChange(this.value);
  }
}
