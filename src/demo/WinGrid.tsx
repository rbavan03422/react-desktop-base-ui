import * as React from 'react';
import * as UI from '../lib/windows';

type Person = { id: string; name: string; email: string; age: number | null; role: string; active: boolean; joined: string };

const roles = [{ value: 'admin', label: 'Admin' }, { value: 'editor', label: 'Editor' }, { value: 'viewer', label: 'Viewer' }];
const initial: Person[] = [
  { id: '1', name: 'Ada Lovelace', email: 'ada@example.com', age: 36, role: 'admin', active: true, joined: '2021-03-04' },
  { id: '2', name: 'Grace Hopper', email: 'grace@example.com', age: 45, role: 'editor', active: true, joined: '2020-11-18' },
  { id: '3', name: 'Alan Turing', email: 'alan@example.com', age: 41, role: 'editor', active: false, joined: '2019-06-01' },
  { id: '4', name: 'Edsger Dijkstra', email: 'edsger@example.com', age: 72, role: 'viewer', active: true, joined: '2018-02-27' },
  { id: '5', name: 'Barbara Liskov', email: 'barbara@example.com', age: 58, role: 'admin', active: true, joined: '2022-09-12' },
  { id: '6', name: 'Donald Knuth', email: 'donald@example.com', age: 84, role: 'viewer', active: false, joined: '2017-05-30' },
];

const columns: UI.GridColumn<Person>[] = [
  { field: 'name', header: 'Name', flex: 1.2, sortable: true, editor: { required: true } },
  { field: 'email', header: 'Email', flex: 1.6, sortable: true, editor: { required: true, validate: (v) => /^\S+@\S+\.\S+$/.test(v) || 'Email is not valid' } },
  { field: 'age', header: 'Age', width: 70, align: 'right', sortable: true, editor: { type: 'number', min: 0, max: 120, required: true } },
  { field: 'role', header: 'Role', width: 120, sortable: true, render: (v) => roles.find((r) => r.value === v)?.label ?? String(v), editor: { type: 'select', options: roles } },
  { field: 'active', header: 'Active', width: 70, align: 'center', editor: { type: 'boolean' } },
  { field: 'joined', header: 'Joined', width: 140, sortable: true, editor: { type: 'date', required: true } },
];

export function WinGrid({ theme }: { theme: UI.Theme }) {
  const [rows, setRows] = React.useState(initial);
  const [pending, setPending] = React.useState<string | null>(null);
  const [log, setLog] = React.useState('Double-click a row to edit it (Enter = Update, Esc = Cancel).');
  const grid = React.useRef<UI.DataGridHandle>(null);

  // A new row is inserted first, then opened in the editor (like ExtJS: store.insert + startEdit).
  React.useEffect(() => {
    if (pending) grid.current?.startEdit(pending, 'name');
  }, [pending]);

  const addRow = () => {
    const id = `new-${Date.now()}`;
    setRows((r) => [{ id, name: '', email: '', age: 30, role: 'viewer', active: true, joined: new Date().toISOString().slice(0, 10) }, ...r]);
    setPending(id);
  };

  return (
    <UI.Window chrome background theme={theme} width={760} padding="12px">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
        <UI.Button theme={theme} onClick={addRow}>Add row</UI.Button>
        <span style={{ fontSize: 12, opacity: 0.75 }}>{log}</span>
      </div>
      <UI.DataGrid<Person>
        ref={grid}
        theme={theme}
        columns={columns}
        rows={rows}
        getRowId={(r) => r.id}
        height={280}
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
  );
}
