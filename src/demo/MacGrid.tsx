import * as React from 'react';
import * as UI from '../lib/macos';

type Person = {
  id: string; name: string; email: string; age: number | null; role: string; active: boolean;
  joined: string; progress: number | null; rating: number;
};

type SpanRow = { id: string; region: string; item: string; units: number | null; group?: boolean };

const spanRows: SpanRow[] = [
  { id: 'north-group', region: 'North', item: 'Regional inventory', units: null, group: true },
  { id: 'north-laptops', region: 'North', item: 'Laptops', units: 12 },
  { id: 'north-monitors', region: 'North', item: 'Monitors', units: 8 },
  { id: 'south-group', region: 'South', item: 'Regional inventory', units: null, group: true },
  { id: 'south-keyboards', region: 'South', item: 'Keyboards', units: 20 },
  { id: 'south-mice', region: 'South', item: 'Mice', units: 14 },
];
const spanColumns: UI.GridColumn<SpanRow>[] = [
  { field: 'region', header: 'Region', width: 130, rowSpan: (row) => row.group ? 3 : 1 },
  { field: 'item', header: 'Item', flex: 1, colSpan: (row) => row.group ? 2 : 1 },
  { field: 'units', header: 'Units', width: 100, align: 'right', render: (value) => value == null ? '' : String(value) },
];

const roles = [{ value: 'admin', label: 'Admin' }, { value: 'editor', label: 'Editor' }, { value: 'viewer', label: 'Viewer' }];
const names = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Edsger Dijkstra', 'Barbara Liskov', 'Donald Knuth',
  'Margaret Hamilton', 'Linus Torvalds', 'Radia Perlman', 'Ken Thompson', 'Frances Allen', 'Tim Berners-Lee'];
const initial: Person[] = Array.from({ length: 23 }, (_, i) => {
  const base = names[i % names.length];
  const round = Math.floor(i / names.length);
  return {
    id: String(i + 1),
    name: round ? `${base} ${round + 1}` : base,
    email: `${base.toLowerCase().replace(/[^a-z]+/g, '.')}${round ? round + 1 : ''}@example.com`,
    age: 25 + ((i * 7) % 50),
    role: roles[i % 3].value,
    active: i % 4 !== 0,
    joined: `20${18 + (i % 6)}-0${1 + (i % 9)}-${10 + (i % 18)}`,
    progress: (i * 37) % 101,
    rating: i % 6,
  };
});

const columns: UI.GridColumnItem<Person>[] = [
  {
    header: 'Person',
    columns: [
      { field: 'name', header: 'Name', flex: 1.2, minWidth: 120, sortable: true, editor: { required: true } },
      { field: 'email', header: 'Email', flex: 1.6, minWidth: 150, sortable: true, editor: { required: true, validate: (v) => /^\S+@\S+\.\S+$/.test(v) || 'Email is not valid' } },
    ],
  },
  {
    header: 'Details',
    columns: [
      { field: 'age', header: 'Age', width: 64, align: 'right', sortable: true, editor: { type: 'number', min: 0, max: 120, required: true } },
      { field: 'role', header: 'Role', width: 110, sortable: true, render: (v) => roles.find((r) => r.value === v)?.label ?? String(v), editor: { type: 'select', options: roles } },
      { field: 'active', header: 'Active', width: 64, align: 'center', editor: { type: 'boolean' } },
    ],
  },
  {
    header: 'Performance',
    columns: [
      { field: 'progress', header: 'Progress', type: 'percent', width: 130, sortable: true, editor: { type: 'percent' } },
      { field: 'rating', header: 'Rating', type: 'rating', width: 110, sortable: true, editor: { type: 'rating' } },
    ],
  },
  { field: 'joined', header: 'Joined', width: 130, sortable: true, editor: { type: 'date', required: true } },
];

export function MacGrid({ theme }: { theme: UI.Theme }) {
  const [rows, setRows] = React.useState(initial);
  const [checked, setChecked] = React.useState<string[]>([]);
  const [pending, setPending] = React.useState<string | null>(null);
  const [log, setLog] = React.useState('Double-click a row to edit it. Drag a header edge to resize a column.');
  const grid = React.useRef<UI.DataGridHandle>(null);

  // A new row is inserted first, then opened in the editor (like ExtJS: store.insert + startEdit).
  React.useEffect(() => {
    if (pending) grid.current?.startEdit(pending, 'name');
  }, [pending]);

  const addRow = () => {
    const id = `new-${Date.now()}`;
    setRows((r) => [{ id, name: '', email: '', age: 30, role: 'viewer', active: true, joined: new Date().toISOString().slice(0, 10), progress: 0, rating: 0 }, ...r]);
    setPending(id);
  };
  const removeChecked = () => {
    setRows((r) => r.filter((x) => !checked.includes(x.id)));
    setLog(`Deleted ${checked.length} row(s)`);
    setChecked([]);
  };

  return (
    <>
    <UI.Window chrome theme={theme} width={900} padding="12px">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
        <UI.Button onClick={addRow}>Add row</UI.Button>
        <UI.Button disabled={!checked.length} onClick={removeChecked}>Delete selected ({checked.length})</UI.Button>
        <span style={{ fontSize: 12, opacity: 0.75 }}>{log}</span>
      </div>
      <p style={{ margin: '0 0 8px', fontSize: 12, opacity: 0.75 }}>
        Click or drag across cells to select a range; Shift-click extends it. Numeric subtotals appear in the pager.
      </p>
      <UI.DataGrid<Person>
        ref={grid}
        theme={theme}
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        height={400}
        checkboxSelection
        checkedIds={checked}
        onCheckedChange={setChecked}
        defaultPageSize={8}
        pageSizeOptions={[5, 8, 15]}
        onColumnResize={(field, width) => setLog(width === null ? `Column "${field}" reset` : `Column "${field}" resized to ${width}px`)}
        onValidateEdit={(e) =>
          rows.some((r) => r.id !== e.rowId && r.email === e.newValues.email) ? 'That email is already used' : true
        }
        onEdit={(e) => {
          setRows((rs) => rs.map((r) => (r.id === e.rowId ? { ...r, ...e.changes } : r)));
          if (e.rowId === pending) setPending(null);
          setLog(`Updated ${Object.keys(e.changes).join(', ')} on "${e.row.name || 'new row'}"`);
        }}
        onCancelEdit={(e) => {
          if (e.rowId === pending) {
            setRows((rs) => rs.filter((r) => r.id !== e.rowId));
            setPending(null);
            setLog('New row discarded');
          } else setLog('Edit cancelled');
        }}
      />
    </UI.Window>
    <UI.Window chrome theme={theme} width={560} padding="16px">
      <h3 style={{ margin: '0 0 8px' }}>Data grid cell spans</h3>
      <p style={{ margin: '0 0 12px', fontSize: 12, opacity: 0.75 }}>
        Region cells span three rows; regional inventory cells span two columns.
      </p>
      <UI.DataGrid<SpanRow>
        theme={theme}
        columns={spanColumns}
        rows={spanRows}
        getRowId={(row) => row.id}
        height={260}
      />
    </UI.Window>
    </>
  );
}
