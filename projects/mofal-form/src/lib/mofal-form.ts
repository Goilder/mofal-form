import { Component, Input } from '@angular/core';

/** A themeable surface for composing Angular forms. */
@Component({
  selector: 'mf-form-card',
  standalone: true,
  template: `
    <section class="mf-card">
      @if (eyebrow) { <div class="mf-card__eyebrow">{{ eyebrow }}</div> }
      <h2 class="mf-card__title">{{ title }}</h2>
      @if (description) { <p class="mf-card__description">{{ description }}</p> }
      <div class="mf-card__content"><ng-content /></div>
    </section>
  `,
  styles: [`
    :host { display: block; font-family: var(--mf-font, Inter, ui-sans-serif, system-ui, sans-serif); color: var(--mf-ink, #1d2540); }
    .mf-card { background: var(--mf-surface, #fff); border: 1px solid var(--mf-border, #e7e9f2); border-radius: var(--mf-radius, 24px); box-shadow: 0 24px 70px rgba(29, 37, 64, .09); padding: clamp(24px, 5vw, 44px); }
    .mf-card__eyebrow { color: var(--mf-accent, #7059e8); font-size: 11px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; margin-bottom: 12px; }
    .mf-card__title { font-size: clamp(25px, 4vw, 34px); letter-spacing: -.045em; line-height: 1.16; margin: 0; }
    .mf-card__description { color: var(--mf-muted, #73809a); line-height: 1.6; margin: 10px 0 0; }
    .mf-card__content { margin-top: 30px; }
  `],
})
export class MfFormCardComponent {
  @Input() title = 'Your form';
  @Input() description = '';
  @Input() eyebrow = '';
}
