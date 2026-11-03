// Import from the platform entry points to avoid name clashes:
//   import { Window, Button } from './lib/macos';
//   import { Window, Button } from './lib/windows';
import * as macOs from './macos';
import * as windows from './windows';
export { macOs, windows };
export { cx, splitLayout } from './common';
