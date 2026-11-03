# react-desktop × Base UI (React 17 + TypeScript)

Remake of [gabrielbull/react-desktop](https://github.com/gabrielbull/react-desktop) with
[`@base-ui/react`](https://base-ui.com) providing behaviour and accessibility.

```bash
npm install
npm run dev
```

```tsx
import { Window, TitleBar, Button } from './lib/macos';
import { Window as WinWindow } from './lib/windows';
```

## Base UI mapping
| Component | Base UI primitive |
|---|---|
| Button | Button |
| Checkbox | Checkbox |
| Radio | RadioGroup + Radio |
| TextInput / SearchField | Input |
| SegmentedControl | Toggle |
| ProgressCircle | Progress (visual is custom SVG) |
| TitleBar controls | Button |
| Toolbar / ToolbarNav | Toolbar |
| Dialog (macOS) | Dialog |
| NavPane, MasterDetailsView (Windows) | Tabs (vertical) |
| Window, View, Box, Text, Label, Link, Pin, ListView* | plain elements |

## Intentional API differences from react-desktop
- Radio must be inside `<RadioGroup>`; use `value` / `onValueChange` there.
- Checkbox uses `checked` / `defaultChecked` / `onCheckedChange` (not `onChange`).
- `SegmentedControlItem`, `NavPaneItem`, `MasterDetails*` are marker components; the parent reads their props.
- macOS `Dialog` uses `open` / `onOpenChange` (`hidden` still works) and renders in a portal.
- `ToolbarNav` must be inside `<Toolbar>`.
- Windows `theme="dark"` can go on any element; it cascades via CSS variables.
- `Pin` is an edge-anchored absolute container (verify against the original's behaviour).
