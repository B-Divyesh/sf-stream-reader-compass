import './style.css';
import { safeOrigin } from '../../shared/transcript';

const enableButton = document.querySelector<HTMLButtonElement>('#enable')!;
const openButton = document.querySelector<HTMLButtonElement>('#open')!;
const siteText = document.querySelector<HTMLElement>('#site')!;
const status = document.querySelector<HTMLElement>('#status')!;
let tabId: number | undefined;
let origin: string | null = null;

function permissionPattern(value: string): string {
  return `${value}/*`;
}

async function currentOrigins(): Promise<string[]> {
  const result = await chrome.storage.sync.get('enabledOrigins');
  return Array.isArray(result.enabledOrigins) ? result.enabledOrigins : [];
}

async function refresh(): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  tabId = tab?.id;
  origin = tab?.url ? safeOrigin(tab.url) : null;
  if (!origin) {
    siteText.textContent = 'Open a web chat to use the reader.';
    enableButton.hidden = true;
    return;
  }
  siteText.textContent = new URL(origin).hostname;
  const enabled = (await currentOrigins()).includes(origin)
    && await chrome.permissions.contains({ origins: [permissionPattern(origin)] });
  enableButton.textContent = enabled ? 'Disable on this site' : 'Enable on this site';
  enableButton.dataset.enabled = String(enabled);
  openButton.hidden = !enabled;
}

enableButton.addEventListener('click', async () => {
  if (!origin) return;
  const origins = await currentOrigins();
  const enabled = enableButton.dataset.enabled === 'true';
  const pattern = permissionPattern(origin);
  if (!enabled) {
    const granted = await chrome.permissions.request({ origins: [pattern] });
    if (!granted) {
      status.textContent = 'Site access was not granted. Choose Enable on this site to try again.';
      return;
    }
    await chrome.storage.sync.set({ enabledOrigins: [...new Set([...origins, origin])] });
    status.textContent = 'Reader enabled for this site only. Open it when the chat is ready.';
  } else {
    if (tabId) await chrome.tabs.sendMessage(tabId, { type: 'CLOSE_READER' }).catch(() => undefined);
    const removed = await chrome.permissions.remove({ origins: [pattern] });
    const stillGranted = await chrome.permissions.contains({ origins: [pattern] });
    if (!removed && stillGranted) {
      status.textContent = 'Site access could not be removed. Close this popup, then try again.';
      return;
    }
    await chrome.storage.sync.set({ enabledOrigins: origins.filter((item) => item !== origin) });
    status.textContent = 'Reader disabled and site access removed.';
  }
  await refresh();
});

openButton.addEventListener('click', async () => {
  if (!tabId) return;
  try {
    const response = await chrome.runtime.sendMessage({ type: 'OPEN_READER_IN_TAB', tabId });
    if (!response?.ok) throw new Error(response?.error || 'Reader could not open.');
    window.close();
  } catch {
    status.textContent = 'The reader could not open. Reload the chat, then try again.';
  }
});

refresh().catch(() => {
  status.textContent = 'The current site could not be checked. Reload it, then try again.';
});
