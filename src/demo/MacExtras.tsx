import * as React from 'react';
import * as UI from '../lib/macos';
import { ChartShowcase } from './ChartShowcase';
import imageListItems from './imageListItems';

const fruits = ['Apple', 'Banana', 'Cherry', 'Grape', 'Mango'];
const sizes = [{ value: 's', label: 'Small' }, { value: 'm', label: 'Medium' }, { value: 'l', label: 'Large' }];
const row: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' };

function ToastButton() {
  const toast = UI.useToast();
  return (
    <UI.Button onClick={() => toast.add({ title: 'Saved', description: 'Your changes were saved.' })}>
      Show toast
    </UI.Button>
  );
}

export function MacExtras({ theme }: { theme: UI.Theme }) {
  const [volume, setVolume] = React.useState(40);
  const [activeStep, setActiveStep] = React.useState(1);
  const [dialMessage, setDialMessage] = React.useState('');
  const [imageVariant, setImageVariant] = React.useState<UI.ImageListVariant>('standard');
  return (
    <UI.ToastProvider theme={theme}>
      <UI.Window chrome theme={theme} width={520} padding="0 0 16px">
        <UI.Menubar theme={theme} menus={[
          { label: 'File', items: [
            { label: 'New', shortcut: 'Ctrl+N' }, { label: 'Open…' }, { type: 'separator' },
            { type: 'checkbox', label: 'Autosave', defaultChecked: true },
            { type: 'submenu', label: 'Export', items: [{ label: 'PDF' }, { label: 'PNG' }] },
          ] },
          { label: 'View', items: [
            { type: 'radio-group', defaultValue: 'list', items: [{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }] },
          ] },
        ]} />
        <UI.Toolbar>
          <UI.ToolbarButton>Cut</UI.ToolbarButton>
          <UI.ToolbarButton>Copy</UI.ToolbarButton>
          <UI.ToolbarSeparator />
          <UI.ToolbarGroup><UI.ToolbarButton>Left</UI.ToolbarButton><UI.ToolbarButton>Right</UI.ToolbarButton></UI.ToolbarGroup>
        </UI.Toolbar>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '12px 16px 0' }}>
          <UI.Typography variant="h5">Typography</UI.Typography>
          <UI.Typography variant="h6">h6. Heading</UI.Typography>
          <UI.Typography variant="subtitle1">subtitle1. Subheading</UI.Typography>
          <UI.Typography variant="body1">body1. The quick brown fox jumps over the lazy dog.</UI.Typography>
          <UI.Typography variant="body2">body2. Secondary body text.</UI.Typography>
          <UI.Typography variant="caption" color="textSecondary">caption. Supporting text</UI.Typography>
          <UI.Typography variant="overline" color="primary">overline</UI.Typography>
        </div>
        <div style={{ padding: '14px 16px 0' }}><UI.Meter theme={theme} value={72} warning={60} critical={90} label="Battery" showValue /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '14px 16px 0' }}>
          <div style={row} aria-label="Semantic button colors">
            <UI.Button color="primary">Primary</UI.Button>
            <UI.Button color="secondary">Secondary</UI.Button>
            <UI.Button color="warning">Warning</UI.Button>
            <UI.Button color="error">Error</UI.Button>
            <UI.Button color="info">Info</UI.Button>
            <UI.Button color="success">Success</UI.Button>
          </div>
          <div style={row}>
            <UI.Switch theme={theme} label="Wi-Fi" defaultChecked />
            <UI.ToggleButton theme={theme}>Bold</UI.ToggleButton>
            <UI.ToggleGroup theme={theme} defaultValue={['left']}>
              <UI.ToggleGroupItem value="left">Left</UI.ToggleGroupItem>
              <UI.ToggleGroupItem value="center">Center</UI.ToggleGroupItem>
              <UI.ToggleGroupItem value="right">Right</UI.ToggleGroupItem>
            </UI.ToggleGroup>
          </div>
          <UI.Slider theme={theme} value={volume} onValueChange={(v) => setVolume(Array.isArray(v) ? v[0] : v)} thumbLabels={['Volume']} />
          <UI.Slider theme={theme} defaultValue={[20, 70]} thumbLabels={['Minimum', 'Maximum']} />
          <div style={row}>
            <UI.NumberField theme={theme} label="Quantity" defaultValue={1} min={0} max={10} />
            <UI.Select theme={theme} items={sizes} defaultValue="m" />
            <UI.Combobox theme={theme} items={fruits} placeholder="Fruit" />
            <UI.Autocomplete theme={theme} items={fruits} placeholder="Search…" />
          </div>
          <UI.ProgressBar theme={theme} value={60} label="Uploading" showValue />
          <UI.ProgressBar theme={theme} value={null} label="Working…" />
          <div style={row}>
            <UI.Tooltip theme={theme} content="A helpful hint"><UI.Button>Hover me</UI.Button></UI.Tooltip>
            <UI.Popover theme={theme} trigger={<UI.Button>Popover</UI.Button>} title="Details">Some popover content.</UI.Popover>
            <UI.Menu theme={theme} trigger={<UI.Button>Menu</UI.Button>} items={[{ label: 'Rename' }, { label: 'Duplicate' }, { type: 'separator' }, { label: 'Delete', disabled: true }]} />
            <UI.Drawer theme={theme} trigger={<UI.Button>Drawer</UI.Button>} title="Drawer" description="Slides in from the edge.">Drawer content.</UI.Drawer>
            <ToastButton />
          </div>
          <UI.Fieldset theme={theme} legend="Account">
            <UI.Field theme={theme} label="Email" description="We never share it.">
              <UI.FieldControl type="email" placeholder="you@example.com" />
            </UI.Field>
          </UI.Fieldset>
          <UI.OTPField theme={theme} label="Verification code" groupSize={3} />
          <p style={{ margin: 0 }}>Read the <UI.PreviewCard theme={theme} href="https://base-ui.com" content="Base UI is an unstyled React component library.">Base UI docs</UI.PreviewCard> for details.</p>
          <UI.Divider>Components</UI.Divider>
          <div style={row}>
            <UI.Badge badgeContent={4} color="primary"><UI.Avatar>AB</UI.Avatar></UI.Badge>
            <UI.Badge variant="dot" color="success"><UI.Button>Notifications</UI.Button></UI.Badge>
            <UI.Chip label="Chip" color="primary" />
            <UI.Chip label="Deletable" variant="outlined" onDelete={() => setDialMessage('Chip removed')} />
          </div>
          <UI.Breadcrumbs aria-label="Breadcrumb">
            <a href="#home">Home</a><a href="#library">Library</a><span>Data</span>
          </UI.Breadcrumbs>
          <UI.Accordion defaultExpanded>
            <UI.AccordionSummary>Accordion</UI.AccordionSummary>
            <UI.AccordionDetails>Expandable content.</UI.AccordionDetails>
          </UI.Accordion>
          <UI.Card variant="outlined">
            <UI.CardHeader avatar={<UI.Avatar> M </UI.Avatar>} title="Card title" subheader="Card subheader" />
            <UI.CardContent>Card content with an action.</UI.CardContent>
            <UI.CardActions><UI.Button color="blue">Action</UI.Button></UI.CardActions>
          </UI.Card>
          <ChartShowcase theme={theme} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <UI.Typography variant="subtitle2">Image List: {imageVariant}</UI.Typography>
            <div style={row}>
              {(['standard', 'quilted', 'woven', 'masonry'] as UI.ImageListVariant[]).map((variant) => (
                <UI.Button key={variant} aria-pressed={imageVariant === variant} onClick={() => setImageVariant(variant)}>{variant}</UI.Button>
              ))}
            </div>
            <UI.ImageList variant={imageVariant} cols={3} rowHeight={72} gap={4} style={{ maxWidth: 340 }}>
              {imageListItems.map((item) => (
                <UI.ImageListItem key={item.id} cols={item.cols} rows={item.rows}>
                  <img src={item.src} alt={item.title} />
                  <UI.ImageListItemBar title={item.title} position="bottom" />
                </UI.ImageListItem>
              ))}
            </UI.ImageList>
          </div>
          <UI.Stepper
            activeStep={activeStep}
            nonLinear
            onStepClick={(_, step) => setActiveStep(step)}
            steps={[{ label: 'Details' }, { label: 'Review' }, { label: 'Complete' }]}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <UI.SpeedDial
              ariaLabel="Quick actions"
              actions={[
                { name: 'Create', icon: <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden focusable="false"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>, onClick: () => setDialMessage('Create selected') },
                { name: 'Search', icon: <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden focusable="false"><circle cx="10.8" cy="10.8" r="6.3" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m15.5 15.5 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>, onClick: () => setDialMessage('Search selected') },
              ]}
            />
            <span>{dialMessage}</span>
          </div>
          <UI.Separator theme={theme} />
          <UI.ContextMenu theme={theme} items={[{ label: 'Back' }, { label: 'Reload' }, { type: 'submenu', label: 'More', items: [{ label: 'Inspect' }] }]}>
            <div style={{ padding: 16, border: '1px dashed currentColor', opacity: .8 }}>Right-click here</div>
          </UI.ContextMenu>
          <UI.ScrollArea theme={theme} style={{ height: 80 }}>
            {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ padding: '2px 4px' }}>Scrollable line {i + 1}</div>)}
          </UI.ScrollArea>
        </div>
      </UI.Window>
    </UI.ToastProvider>
  );
}
