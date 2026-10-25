import { Component, Input } from '@angular/core';

@Component({
  selector: 'mf-button',
  standalone: true,
  template: `<button [type]="type" [disabled]="disabled"><ng-content /><span aria-hidden="true">→</span></button>`,
  styles: [`
    :host { display: block; font-family: var(--mf-font, Inter, ui-sans-serif, system-ui, sans-serif); }
    button { width: 100%; min-height: 50px; display: flex; align-items: center; justify-content: center; gap: 12px; border: 0; border-radius: 12px; background: var(--mf-accent, #7059e8); color: white; font: inherit; font-size: 14px; font-weight: 750; cursor: pointer; box-shadow: 0 10px 24px rgba(112, 89, 232, .22); transition: transform .2s, box-shadow .2s, opacity .2s; }
    button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 28px rgba(112, 89, 232, .28); }
    button:focus-visible { outline: 3px solid #b6a9ff; outline-offset: 3px; }
    button:disabled { opacity: .55; cursor: not-allowed; }
    span { font-size: 19px; line-height: 1; }
  `],
})
export class MfButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'submit';
  @Input() disabled = false;
}
