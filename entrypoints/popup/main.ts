import './style.css';
import { safeOrigin } from '../../shared/transcript';

const enableButton = document.querySelector<HTMLButtonElement>('#enable')!;
const openButton = document.querySelector<HTMLButtonElement>('#open')!;
const siteText = document.querySelector<HTMLElement>('#site')!;
const status = document.querySelector<HTMLElement>('#status')!;
let tabId: number | undefined;
let origin: string | null = null;

async function currentOrigins(): Promise<string[]> {
  const result = await chrome.storage.sync.get('enabledOrigins');
  return Array.isArray(result.enabledOrigins) ? result.enabledOrigins : [];
}

async function refresh(): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  tabId = tab.id;
  origin = tab.url ? safeOrigin(tab.url) : null;
  if (!origin) {
    siteText.textContent = 'Open a web chat to use the reader.';
    enableButton.hidden = true;
    return;
  }
  siteText.textContent = new URL(origin).hostname;
  const enabled = (await currentOrigins()).includes(origin);
  enableButton.textContent = enabled ? 'Disable on this site' : 'Enable on this site';
  enableButton.dataset.enabled = String(enabled);
  openButton.hidden = !enabled;
}

enableButton.addEventListener('click', async () => {
  if (!origin) return;
  const origins = await currentOrigins();
  const enabled = enableButton.dataset.enabled === 'true';
  const next = enabled ? origins.filter((item) => item !== origin) : [...new Set([...origins, origin])];
  await chrome.storage.sync.set({ enabledOrigins: next });
  status.textContent = enabled ? 'Reader disabled for this site.' : 'Reader enabled. Open it when the chat is ready.';
  await refresh();
});

openButton.addEventListener('click', async () => {
  if (!tabId) return;
  try {
    const response = await chrome.tabs.sendMessage(tabId, { type: 'OPEN_READER' });
    if (!response?.ok) throw new Error(response?.error || 'Reader could not open.');
    window.close();
  } catch {
    status.textContent = 'The reader could not open. Reload the chat, then try again.';
  }
});

refresh().catch(() => {
  status.textContent = 'The current site could not be checked. Reload it, then try again.';
});
