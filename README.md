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

## Folder layout
Each platform is split into folders with one file per component and an `index.ts` that re-exports them:
```
src/lib/macos/{layout,controls,chrome,list-view}/   e.g. controls/Checkbox.tsx, controls/Radio.tsx, ...
src/lib/windows/{layout,controls,chrome,navigation}/
```
`list-view/factory.tsx` and `navigation/utils.ts` are internal helpers and are not re-exported.
Import from the platform entry point (`./lib/macos`, `./lib/windows`) or from a single folder.

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

## More controls
Beyond the original react-desktop set, these Base UI controls are implemented in the matching theme:

| Control | macOS | Windows | Notes |
|---|---|---|---|
| Autocomplete, Combobox | yes | yes | `items: string[]` |
| Select | yes (pop-up button, aligns to trigger) | yes (combo box) | `items: { value, label }[]` |
| Switch, Slider (single/range), Number Field | yes | yes | |
| Toggle (`ToggleButton`), Toggle Group (`ToggleGroup` + `ToggleGroupItem`) | yes | yes | |
| Progress (`ProgressBar`, plus the existing `ProgressCircle`) | yes | yes | `value={null}` = indeterminate |
| Meter | yes (level indicator) | no native equivalent | `warning` / `critical` thresholds |
| Menu, Context Menu, Menubar | yes | yes | data-driven `items` (`MenuEntry`) |
| Navigation Menu | no (use Toolbar) | yes (top nav with flyouts) | |
| Toolbar parts (`ToolbarButton`, `ToolbarGroup`, `ToolbarSeparator`) | yes | yes (+ `Toolbar` command bar) | |
| Popover, Tooltip, Drawer | yes | yes | |
| Toast (`ToastProvider` + `useToast`) | yes | yes | |
| Field, Fieldset, Form, Separator, Scroll Area | yes | yes | `FieldControl` wires an input into `Field` |
| Radio Group | yes | yes | already available as `RadioGroup` |

Not implemented: **OTP Field** and **Preview Card** (no native macOS or Windows desktop control).

Windows components that render popups (Select, Menu, Tooltip, ...) accept `theme` / `color`, because popups are portaled
outside the themed `Window`.

```tsx
import { ToastProvider, useToast, Menu, Button } from './lib/windows';
// <ToastProvider theme="dark"> ...app... </ToastProvider>
// useToast().add({ title: 'Saved', description: 'Done' });
// <Menu trigger={<Button>File</Button>} items={[{ label: 'New', shortcut: 'Ctrl+N' }, { type: 'separator' }]} />
```

## Focus animation
Every interactive control animates on keyboard focus (`:focus-visible`; text fields on any focus), in plain CSS.
- **macOS:** the blue focus ring pops in and settles. Tune with `--rd-mac-focus` (`r, g, b`) and `--rd-mac-focus-ms`.
- **Windows:** the dotted focus rectangle fades in and tightens; text field borders ease to the accent. Tune with `--rd-win-focus-ms`.
- Both respect `prefers-reduced-motion` (durations drop to 0).
