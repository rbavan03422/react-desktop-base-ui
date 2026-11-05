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
| OTP Field | yes | yes | `length`, `groupSize`; imported as `OTPField` (renamed from `OTPFieldPreview` in Base UI 1.6) |
| Preview Card | yes | yes | `href`, `content`; opens on hover or keyboard focus |
| Radio Group | yes | yes | already available as `RadioGroup` |


Windows components that render popups (Select, Menu, Tooltip, ...) accept `theme` / `color`, because popups are portaled
outside the themed `Window`.

```tsx
import { ToastProvider, useToast, Menu, Button } from './lib/windows';
// <ToastProvider theme="dark"> ...app... </ToastProvider>
// useToast().add({ title: 'Saved', description: 'Done' });
// <Menu trigger={<Button>File</Button>} items={[{ label: 'New', shortcut: 'Ctrl+N' }, { type: 'separator' }]} />
```

## Data grid with inline row editor
`DataGrid` (macOS and Windows) is a grid with an editor that works like **Ext.grid.plugin.RowEditing** from ExtJS 4:
double-click a row and it turns into an editor (one field per column) with **Update / Cancel** buttons floating under it.

```tsx
const columns: GridColumn<Person>[] = [
  { field: 'name', header: 'Name', flex: 1, sortable: true, editor: { required: true } },
  { field: 'age', header: 'Age', width: 70, align: 'right', editor: { type: 'number', min: 0, max: 120 } },
  { field: 'role', header: 'Role', width: 120, editor: { type: 'select', options: roles } },
  { field: 'active', header: 'Active', width: 70, editor: { type: 'boolean' } },
];
<DataGrid<Person> ref={grid} columns={columns} rows={rows} getRowId={(r) => r.id} height={280}
  onEdit={(e) => setRows((rs) => rs.map((r) => (r.id === e.rowId ? { ...r, ...e.changes } : r)))} />
```
| ExtJS 4 | here |
|---|---|
| `clicksToEdit` | `clicksToEdit` (1 or 2, default 2) |
| `autoCancel` | `autoCancel` (default true) |
| `beforeedit` | `onBeforeEdit` (return `false` to prevent) |
| `validateedit` | `onValidateEdit` (return `false` or an error message to reject) |
| `edit` | `onEdit({ rowId, row, originalValues, newValues, changes })` |
| `canceledit` | `onCancelEdit` |
| column `editor` | column `editor`: `text`, `number`, `percent`, `rating`, `date`, `select`, `boolean` with `required`, `min`/`max`, `validate` |
| `plugin.startEdit(record, column)` | `ref.current.startEdit(rowId, field)`; also `completeEdit()`, `cancelEdit()`, `getEditingId()` |
| `saveBtnText` / `cancelBtnText` | `updateText` / `cancelText` |

Behaviour: **Enter** updates, **Esc** cancels, **Tab** cycles through the fields and buttons. Invalid fields are outlined, Update is disabled and an error summary appears
next to the buttons. The buttons move above the row when there is no room below. Columns without an `editor` are shown read-only inside the editor.
The grid also has sortable headers (click to cycle asc / desc / none), row selection, and arrow-key / Home / End / Enter / F2 navigation.
The grid does not keep your data: apply `e.changes` to your rows in `onEdit` (see `demo/MacGrid.tsx` for the "Add row" flow that removes a new row if its edit is cancelled).
Not included: row virtualization.

### Column groups, resizing, checkboxes, percent / rating columns, paging
```tsx
const columns: GridColumnItem<Person>[] = [
  { header: 'Person', columns: [                       // group header spanning its columns (nest for more levels)
      { field: 'name', header: 'Name', flex: 1, sortable: true, editor: { required: true } },
      { field: 'email', header: 'Email', flex: 1.5 } ] },
  { header: 'Performance', columns: [
      { field: 'progress', header: 'Progress', type: 'percent', width: 130, editor: { type: 'percent' } },
      { field: 'rating', header: 'Rating', type: 'rating', width: 110, editor: { type: 'rating' } } ] },
  { field: 'joined', header: 'Joined', width: 130 },     // leaf columns span all header rows
];
<DataGrid<Person> columns={columns} rows={rows} getRowId={(r) => r.id}
  checkboxSelection checkedIds={checked} onCheckedChange={setChecked}
  defaultPageSize={10} pageSizeOptions={[10, 25, 50]} onColumnResize={(field, width) => save(field, width)} />
```
- **Resizing:** drag the right edge of a header (or focus it and use Left / Right, Shift for bigger steps; double-click or Home resets). `minWidth` / `maxWidth` limit it and `resizable: false` turns it off. Widths are kept inside the grid; seed them with `defaultColumnWidths` and persist them from `onColumnResize`.
- **Checkbox column:** `checkboxSelection` adds a leading column with a select-all header (applies to the current page, with an indeterminate state). Space toggles the focused row. Control it with `checkedIds` / `onCheckedChange`.
- **Cell spans:** set `colSpan` / `rowSpan` on a `GridColumn` to a positive integer or `(row, rowIndex) => span`. Spans apply to the currently displayed page after sorting; spans extending beyond the page are clipped.
- **Cell selection:** click or drag across cells to select a rectangular range; Shift-click extends the current range. The paging bar shows subtotals for finite numeric values in selected cells.
- **Percent column:** `type: 'percent'` shows a bar with a centred label; `max` is the value that equals 100% and `decimals` sets label precision. Edit it with `editor: { type: 'percent' }` (0 to max).
- **Rating column:** `type: 'rating'` shows stars (`max`, default 5). `editor: { type: 'rating' }` is a radio group: arrow keys, click or Space pick a value, and a small × clears it.
- **Paging:** set `pageSize` or `defaultPageSize` to show the toolbar (first, previous, "Page n of N", next, last, rows per page, "Displaying a - b of N"). Control it with `page` / `onPageChange` / `onPageSizeChange`, or pass `total` for server-side paging (then `rows` is the current page and is not sliced).
  Changing page cancels an open editor, and `startEdit` jumps to the row's page. `ref.current.goToPage(n)` is available.
- **Grouped headers:** groups can be nested to any depth. Leaf headers span the remaining header rows and sorting and resizing only apply to leaf columns.

## Dark theme
Both platforms support `theme="light" | "dark"`.

```tsx
import { Window, Select, Menu } from './lib/macos';   // or './lib/windows'
<Window theme="dark" chrome> ... </Window>
```
- Everything inside a themed `Window` (or `View`) inherits the theme through CSS variables, so only the container needs the prop.
- Components that render in a **portal** (Dialog, Select, Combobox, Autocomplete, Menu, ContextMenu, Menubar, Tooltip, Popover, Drawer, Preview Card, Toast) take their own `theme` prop, because the popup lives outside the window in the DOM. Pass the same value.
- Colours are tokens: `--rd-mac-*` (macOS) and `--rd-win-*` (Windows). Override them globally, or under `[data-rd-theme="dark"]` for dark only.

## Focus animation
Every interactive control animates on keyboard focus (`:focus-visible`; text fields on any focus), in plain CSS.
- **macOS:** the blue focus ring pops in and settles. Tune with `--rd-mac-focus` (`r, g, b`) and `--rd-mac-focus-ms`.
- **Windows:** the dotted focus rectangle fades in and tightens; text field borders ease to the accent. Tune with `--rd-win-focus-ms`.
- Both respect `prefers-reduced-motion` (durations drop to 0).
