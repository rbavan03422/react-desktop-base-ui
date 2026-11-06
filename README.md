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
| Tree View | yes | yes | nested items, expansion, single selection, keyboard navigation |
| Typography | yes | yes | MUI v4 variants, alignment, semantic color, and paragraph helpers |
| Avatar, Badge, Chip | yes | yes | identity, notifications, and compact labels |
| Divider, Accordion, Card | yes | yes | content structure and expandable panels |
| Breadcrumbs, Speed Dial, Stepper | yes | yes | navigation, quick actions, and progress |
| Image List | yes | yes | standard, quilted, woven, and masonry layouts |
| Chart | yes | yes | SVG bar, line, area, donut, scatter, sparkline, gauge, radar, heatmap, funnel, pyramid, range bar, and candlestick charts |


Windows components that render popups (Select, Menu, Tooltip, ...) accept `theme` / `color`, because popups are portaled
outside the themed `Window`.

```tsx
import { ToastProvider, useToast, Menu, Button } from './lib/windows';
// <ToastProvider theme="dark"> ...app... </ToastProvider>
// useToast().add({ title: 'Saved', description: 'Done' });
// <Menu trigger={<Button>File</Button>} items={[{ label: 'New', shortcut: 'Ctrl+N' }, { type: 'separator' }]} />
```

## Typography
Both platforms export `Typography` with the MUI v4 variant scale: `h1`–`h6`, `subtitle1`, `subtitle2`, `body1`, `body2`, `button`, `caption`, `overline`, and `inherit`.

```tsx
<Typography variant="h4" gutterBottom>Page title</Typography>
<Typography variant="body2" color="textSecondary" paragraph>
  Supporting text using the same scale on Windows and macOS.
</Typography>
<Typography variant="button" component="span" color="primary">Action label</Typography>
```

By default, heading variants render as headings, body variants as paragraphs, and `button`, `caption`, and `overline` as spans. Set `component` or `variantMapping` to customize the element. `align`, `display`, `noWrap`, `gutterBottom`, and `paragraph` provide MUI-style layout helpers; `color` accepts `primary`, `secondary`, `textPrimary`, `textSecondary`, `error`, `warning`, `info`, `success`, `inherit`, `initial`, or a CSS color. Typography uses the Roboto / Helvetica / Arial font stack; Roboto is not downloaded by the library.

## Material-style components
Both platforms export `Avatar`, `Badge`, `Chip`, `Divider`, `Accordion` / `AccordionSummary` / `AccordionDetails`, `Card` / `CardHeader` / `CardContent` / `CardActions` / `CardMedia`, `Breadcrumbs`, `SpeedDial`, and `Stepper`.

```tsx
<Badge badgeContent={4} color="primary"><Avatar alt="Ada">A</Avatar></Badge>
<Chip label="Completed" color="success" onDelete={removeChip} />
<Accordion>
  <AccordionSummary>Details</AccordionSummary>
  <AccordionDetails>Expandable content.</AccordionDetails>
</Accordion>
<Stepper activeStep={1} steps={[{ label: 'Details' }, { label: 'Review' }, { label: 'Done' }]} />
```

`Accordion` supports controlled (`expanded` / `onChange`) and default expansion. `SpeedDial` takes an `actions` array (`{ name, icon, onClick }`) and supports controlled or default `open` state. `Stepper` takes `steps` and `activeStep`; use `nonLinear` with `onStepClick` to make steps navigable. Breadcrumbs accepts child links/items and collapses long paths at `maxItems`. The two platform demos show examples of these components.

### Image List
`ImageList`, `ImageListItem`, and `ImageListItemBar` are available from both platform entry points. Set `variant` to `standard`, `quilted`, `woven`, or `masonry`; `cols`, `rowHeight`, and `gap` control the layout. Quilted items accept `cols` and `rows` spans, and item bars support top, bottom, or below-image placement.
The demos use locally bundled SVG illustrations and do not require a network connection to load Image List images.

```tsx
<ImageList variant="quilted" cols={3} rowHeight={120} gap={8}>
  <ImageListItem cols={2} rows={2}>
    <img src="/images/landscape.jpg" alt="Mountain landscape" />
    <ImageListItemBar title="Mountain landscape" />
  </ImageListItem>
  <ImageListItem><img src="/images/coast.jpg" alt="Coast" /></ImageListItem>
</ImageList>
```

### Charts
Both platform entry points export an SVG-based `Chart`. Choose a `type` and supply either a simple `data` array or named `series`; charts use the platform palette and support the optional `theme`, `width`, `height`, `min`, `max`, `value`, `labels`, `colors`, and `showGrid` props. `ChartDatum` points accept `x`, `y` or `value`, and a `label`. Range bars use `low` / `high`; candlesticks use `open`, `close`, `low`, and `high`. Heatmaps accept a 2D numeric `data` array. The demo gallery shows all supported chart types.

```tsx
<Chart type="bar" series={[
  { label: 'This year', data: [18, 30, 23] },
  { label: 'Last year', data: [12, 21, 28] },
]} height={200} />
<Chart type="candlestick" data={[
  { low: 12, high: 34, open: 18, close: 28 },
  { low: 16, high: 38, open: 30, close: 21 },
]} />
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

## Tree view
`TreeView` is available from both platform entry points. Supply nested `items` with unique `id`s and labels:

```tsx
<TreeView
  aria-label="Project files"
  items={[
    { id: 'src', label: 'src', children: [{ id: 'app', label: 'App.tsx' }] },
    { id: 'readme', label: 'README.md' },
  ]}
  defaultExpandedIds={['src']}
  defaultSelectedId="app"
  onSelectedChange={(id) => setSelectedId(id)}
/>
```

Expansion and selection can be controlled with `expandedIds` / `onExpandedChange` and `selectedId` / `onSelectedChange`. Arrow keys navigate and expand/collapse; Home and End move to the first and last visible item. Enter or Space selects the focused item. Items may include nested `children`, decorative `icon` content, and `disabled`.

## Chat widget

`Mac.ChatWidget` and `Win.ChatWidget` (in `src/lib/macos/chat` and `src/lib/windows/chat`) are complete chat apps built from [react-chat-elements](https://github.com/Detaysoft/react-chat-elements) and themed with the macOS / Windows 11 tokens. Each has a native titlebar (macOS inset toolbar like Finder, Windows titlebar plus command bar like Settings) and an in-memory `react-router-dom` router, so it never touches the host page URL.

```tsx
<Mac.ChatWidget theme="dark" width={380} height={640} />
<Win.ChatWidget initialPath="/rooms" />
```

| Route | Page |
| --- | --- |
| `/login` | Sign in (any name and password in the demo) |
| `/rooms` | Room list with search |
| `/rooms/:roomId` | Conversation, Enter to send, Shift+Enter for a new line |
| `/rooms/:roomId/voice` | Voice call (mute, speaker, switch to video, end) |
| `/rooms/:roomId/video` | Video call with camera preview via `getUserMedia` |
| `/settings` | Profile, message and notification options, sign out |

State, seed data and media hooks are shared in `src/lib/common/chat`; the pages and CSS live per theme. The data is in memory with a simulated peer, so replace `ChatProvider` to connect a real backend. Microphone and camera access fail soft when the browser blocks them.

## Dark theme
Both platforms support `theme="light" | "dark"`.

```tsx
import { Window, Select, Menu } from './lib/macos';   // or './lib/windows'
<Window theme="dark" chrome> ... </Window>
```
- Everything inside a themed `Window` (or `View`) inherits the theme through CSS variables, so only the container needs the prop.
- Components that render in a **portal** (Dialog, Select, Combobox, Autocomplete, Menu, ContextMenu, Menubar, Tooltip, Popover, Drawer, Preview Card, Toast) take their own `theme` prop, because the popup lives outside the window in the DOM. Pass the same value.
- Colours are tokens: `--rd-mac-*` (macOS) and `--rd-win-*` (Windows). Override them globally, or under `[data-rd-theme="dark"]` for dark only.

## Semantic button colors
Both `Button` components accept `color="primary" | "secondary" | "warning" | "error" | "info" | "success"`.
The same semantic names use platform-specific styling: Windows uses solid Windows 11 buttons, while macOS keeps its classic gradient button treatment. The default button remains neutral.

```tsx
import { Button as WinButton } from './lib/windows';
import { Button as MacButton } from './lib/macos';

<WinButton color="primary">Save</WinButton>
<MacButton color="success">Saved</MacButton>
```

The palette can be customized with `--rd-win-primary`, `--rd-win-secondary`, `--rd-win-warning`, `--rd-win-error`, `--rd-win-info`, `--rd-win-success` (and matching `--rd-mac-*` tokens). Each color has a companion `-fg` token for its foreground, such as `--rd-win-primary-fg`. Windows `Button` also continues to accept a CSS color string for a custom accent; macOS `blue` and `red` remain aliases for `primary` and `error`.

## Focus animation
Every interactive control animates on keyboard focus (`:focus-visible`; text fields on any focus), in plain CSS.
- **macOS:** the blue focus ring pops in and settles. Tune with `--rd-mac-focus` (`r, g, b`) and `--rd-mac-focus-ms`.
- **Windows:** the dotted focus rectangle fades in and tightens; text field borders ease to the accent. Tune with `--rd-win-focus-ms`.
- Both respect `prefers-reduced-motion` (durations drop to 0).
