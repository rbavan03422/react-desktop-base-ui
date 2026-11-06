import * as React from 'react';
import * as Mac from '../lib/macos';
import * as Win from '../lib/windows';
import { MacExtras } from './MacExtras';
import { WinExtras } from './WinExtras';
import { MacGrid } from './MacGrid';
import { WinGrid } from './WinGrid';

function MacDemo({ theme }: { theme: Mac.Theme }) {
  const [tab, setTab] = React.useState(0);
  const [nav, setNav] = React.useState('files');
  const [row, setRow] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  return (
    <Mac.Window chrome theme={theme} width={460} height={520}>
      <Mac.TitleBar title="Finder" controls inset>
        <Mac.Toolbar height="36px" horizontalAlignment="center" layout="horizontal" verticalAlignment="center">
          <Mac.ToolbarNav>
            {['files', 'recent'].map((k) => (
              <Mac.ToolbarNavItem key={k} title={k} selected={nav === k} onPress={() => setNav(k)} />
            ))}
          </Mac.ToolbarNav>
          <Mac.SearchField placeholder="Search" />
        </Mac.Toolbar>
      </Mac.TitleBar>
      <Mac.View padding="16px" layout="vertical">
        <Mac.SegmentedControl box>
          {['General', 'Advanced'].map((t, i) => (
            <Mac.SegmentedControlItem key={t} title={t} selected={tab === i} onSelect={() => setTab(i)}>
              <Mac.View layout="vertical">
                <Mac.Checkbox label="Show hidden files" defaultChecked />
                <Mac.Checkbox label="Disabled" disabled />
                <Mac.RadioGroup defaultValue="a" style={{ marginTop: 8 }}>
                  <Mac.Radio value="a" label="Icons" />
                  <Mac.Radio value="b" label="List" />
                </Mac.RadioGroup>
                <Mac.TextInput label="Name" defaultValue="Untitled" />
              </Mac.View>
            </Mac.SegmentedControlItem>
          ))}
        </Mac.SegmentedControl>
        <Mac.View layout="horizontal" verticalAlignment="center" style={{ gap: 12, margin: '16px 0' }}>
          <Mac.ProgressCircle size={22} />
          <Mac.Button onClick={() => setOpen(true)}>Open dialog</Mac.Button>
          <Mac.Button color="blue">OK</Mac.Button>
          <Mac.Link href="#">A link</Mac.Link>
        </Mac.View>
        <Mac.ListView height={150}>
          <Mac.ListViewHeader>Name</Mac.ListViewHeader>
          {['Documents', 'Downloads', 'Pictures'].map((n, i) => (
            <Mac.ListViewRow key={n} selected={row === i} onClick={() => setRow(i)}>{n}</Mac.ListViewRow>
          ))}
          <Mac.ListViewFooter>3 items</Mac.ListViewFooter>
        </Mac.ListView>
        <Mac.TreeView
          aria-label="Files"
          style={{ height: 110 }}
          defaultExpandedIds={['documents']}
          defaultSelectedId="projects"
          items={[
            { id: 'documents', label: 'Documents', icon: '📁', children: [
              { id: 'projects', label: 'Projects', icon: '📁' },
              { id: 'notes', label: 'Notes.txt', icon: '📄' },
            ] },
            { id: 'downloads', label: 'Downloads', icon: '📁' },
          ]}
        />
      </Mac.View>
      <Mac.Dialog
        theme={theme}
        open={open}
        onOpenChange={setOpen}
        icon="⚠️"
        title="Are you sure?"
        message="This action cannot be undone."
        buttons={<><Mac.Button onClick={() => setOpen(false)}>Cancel</Mac.Button><Mac.Button color="blue" onClick={() => setOpen(false)}>OK</Mac.Button></>}
      />
    </Mac.Window>
  );
}

function WinDemo({ theme }: { theme: Win.Theme }) {
  const accent = theme === 'dark' ? '#60cdff' : '#0067c0';
  return (
    <Win.Window chrome background theme={theme} color={accent} width={560} height={520}>
      <Win.TitleBar title="Settings" controls />
      <div style={{ flex: 1, minHeight: 0 }}>
        <Win.NavPane paneExpandedLength={160}>
          <Win.NavPaneItem title="Controls" icon="🎛">
            <Win.View layout="vertical" style={{ gap: 12 }}>
              <Win.Button>Default</Win.Button>
              <Win.Button color={accent}>Accent</Win.Button>
              <Win.Checkbox label="Checkbox" defaultChecked />
              <Win.RadioGroup defaultValue="a">
                <Win.Radio value="a" label="Option A" />
                <Win.Radio value="b" label="Option B" />
              </Win.RadioGroup>
              <Win.TextInput label="Name" placeholder="Type here" />
              <Win.ProgressCircle />
              <Win.TreeView
                aria-label="Project files"
                style={{ height: 130 }}
                defaultExpandedIds={['workspace']}
                defaultSelectedId="readme"
                items={[
                  { id: 'workspace', label: 'Workspace', icon: '📁', children: [
                    { id: 'readme', label: 'README.md', icon: '📄' },
                    { id: 'src', label: 'src', icon: '📁' },
                  ] },
                  { id: 'archive', label: 'Archive', icon: '📁' },
                ]}
              />
            </Win.View>
          </Win.NavPaneItem>
          <Win.NavPaneItem title="Master / details" icon="📋">
            <Win.MasterDetailsView style={{ height: 200 }}>
              <Win.MasterDetailsViewItem>
                <Win.MasterDetailsViewItemMaster>Item one</Win.MasterDetailsViewItemMaster>
                <Win.MasterDetailsViewItemDetails>Details for one</Win.MasterDetailsViewItemDetails>
              </Win.MasterDetailsViewItem>
              <Win.MasterDetailsViewItem>
                <Win.MasterDetailsViewItemMaster>Item two</Win.MasterDetailsViewItemMaster>
                <Win.MasterDetailsViewItemDetails>Details for two</Win.MasterDetailsViewItemDetails>
              </Win.MasterDetailsViewItem>
            </Win.MasterDetailsView>
          </Win.NavPaneItem>
        </Win.NavPane>
      </div>
    </Win.Window>
  );
}

export function App() {
  const [theme, setTheme] = React.useState<Win.Theme>('light');
  return (
    <div style={{ display: 'flex', gap: 32, padding: 32, background: '#8b9bb4', minHeight: '100vh', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <MacDemo theme={theme} />
        <MacExtras theme={theme} />
        <MacGrid theme={theme} />
        <Mac.ChatWidget theme={theme} />
      </div>
      <div>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} style={{ marginBottom: 12 }}>
          Theme (macOS + Windows): {theme}
        </button>
        <WinDemo theme={theme} />
        <div style={{ height: 32 }} />
        <WinExtras theme={theme} />
        <div style={{ height: 32 }} />
        <WinGrid theme={theme} />
        <div style={{ height: 32 }} />
        <Win.ChatWidget theme={theme} />
      </div>
    </div>
  );
}
