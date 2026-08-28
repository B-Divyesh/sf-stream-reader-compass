import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: '.',
  outDir: '.output',
  manifest: {
    name: 'Stream Reader Compass',
    short_name: 'Reader Compass',
    description: 'Read streaming chats in a stable, semantic transcript.',
    version: '1.0.0',
    icons: {
      16: 'icon/16.png',
      32: 'icon/32.png',
      48: 'icon/48.png',
      128: 'icon/128.png'
    },
    permissions: ['storage', 'activeTab'],
    host_permissions: ['http://*/*', 'https://*/*'],
    commands: {
      'open-reader': {
        suggested_key: { default: 'Alt+Shift+R' },
        description: 'Open the transcript reader'
      }
    },
    action: {
      default_title: 'Stream Reader Compass',
      default_icon: {
        16: 'icon/16.png',
        32: 'icon/32.png',
        48: 'icon/48.png',
        128: 'icon/128.png'
      }
    }
  }
});
