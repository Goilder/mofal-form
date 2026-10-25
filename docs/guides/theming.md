# Theming

Mofal Form ships with its own component styles. Override the CSS custom properties on a form container or the root element.

~~~css
.contact-form {
  --mf-accent: #2563eb;
  --mf-ink: #172033;
  --mf-muted: #66738a;
  --mf-surface: #ffffff;
  --mf-input-bg: #f8fafc;
  --mf-border: #d8e0eb;
  --mf-radius: 20px;
  --mf-font: ui-sans-serif, system-ui, sans-serif;
}
~~~

| Token | Default | Used for |
| --- | --- | --- |
| `--mf-accent` | `#7059e8` | Button, focus ring, eyebrow, required marker |
| `--mf-ink` | `#1d2540` | Headings, labels, input text |
| `--mf-muted` | `#73809a` | Supporting text and hints |
| `--mf-surface` | `#ffffff` | Card background |
| `--mf-input-bg` | `#fafbff` | Field background |
| `--mf-border` | Light cool gray | Card and field borders |
| `--mf-radius` | `24px` | Card radius |
| `--mf-font` | Inter/system stack | Component font family |

The demo applies its own page layout in `projects/demo/src/app/app.scss`. Those styles are not part of the library package. The standalone HTML reference in `docs/examples` has its own theme so it can run without Angular.

