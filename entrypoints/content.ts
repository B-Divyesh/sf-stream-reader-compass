import { extractTranscript, transcriptToText, type TranscriptMessage } from '../shared/transcript';

const HOST_ID = 'stream-reader-compass-host';
let messages: TranscriptMessage[] = [];
let paused = false;
let observer: MutationObserver | null = null;
let refreshTimer = 0;

function pageKey(): string {
  return `resume:${location.origin}${location.pathname}`;
}

async function isEnabled(): Promise<boolean> {
  const result = await chrome.storage.sync.get('enabledOrigins');
  return Array.isArray(result.enabledOrigins) && result.enabledOrigins.includes(location.origin);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]!);
}

function makeStyles(): string {
  return `
    :host { all: initial; color-scheme: light; }
    *, *::before, *::after { box-sizing: border-box; }
    .backdrop { position: fixed; inset: 0; z-index: 2147483646; background: rgba(23,23,19,.66); }
    .reader { position: fixed; z-index: 2147483647; inset: 16px; overflow: auto; background: #f2efe6; color: #171713; border: 3px solid #171713; box-shadow: 8px 8px 0 rgba(0,0,0,.35); font: 16px/1.6 Arial,Helvetica,sans-serif; }
    .masthead { position: sticky; top: 0; z-index: 2; display: grid; grid-template-columns: 1fr auto; gap: 16px; padding: 18px 24px; border-bottom: 4px double #171713; background: #f2efe6; }
    .kicker { margin: 0 0 5px; font: 700 12px/1 ui-monospace,monospace; letter-spacing: .09em; text-transform: uppercase; }
    h1 { margin: 0; font: 700 clamp(26px,4vw,44px)/1 Georgia,serif; }
    .close { align-self: start; }
    .toolbar { display: flex; flex-wrap: wrap; gap: 8px; padding: 16px 24px; border-bottom: 1px solid #76766d; }
    button { min-height: 44px; padding: 8px 14px; border: 2px solid #171713; border-radius: 0; background: #fffdf7; color: #171713; font: 700 14px/1 Arial,sans-serif; cursor: pointer; }
    button.primary { background: #171713; color: #fffdf7; }
    button:hover { background: #f0c94d; color: #171713; }
    button:focus-visible, a:focus-visible, h2:focus-visible { outline: 3px solid #171713; outline-offset: 3px; }
    .notice { min-height: 32px; margin: 0; padding: 6px 24px; background: #fffdf7; color: #245f3e; border-bottom: 1px solid #76766d; font-weight: 700; }
    .messages { width: min(820px,100%); margin: 0 auto; padding: 8px 24px 64px; counter-reset: entry; }
    article { position: relative; padding: 32px 0 28px 72px; border-top: 1px solid #76766d; animation: press-line 220ms ease both; }
    article:first-child { border-top: 0; }
    article.saved { border-left: 8px solid #f0c94d; padding-left: 64px; }
    .folio { position: absolute; left: 0; top: 34px; font: 700 13px/1 ui-monospace,monospace; }
    .saved .folio { left: 8px; }
    h2 { margin: 0 0 12px; font: 700 24px/1.15 Georgia,serif; scroll-margin-top: 180px; }
    .body { white-space: pre-wrap; overflow-wrap: anywhere; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
    .links { margin: 16px 0 0; padding: 12px 0 0 20px; border-top: 1px dotted #76766d; }
    a { color: #171713; text-underline-offset: 3px; overflow-wrap: anywhere; }
    .empty { margin: 48px auto; width: min(600px,calc(100% - 48px)); padding: 32px 0; border-block: 4px double #171713; }
    .empty h2 { font-size: 30px; }
    .help { color: #55554e; }
    @keyframes press-line { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
    @media (max-width: 600px) { .reader { inset: 0; border: 0; } .masthead { padding: 16px; } .toolbar,.notice { padding-inline: 16px; } .messages { padding-inline: 16px; } article { padding-left: 48px; } article.saved { padding-left: 40px; } }
    @media (prefers-reduced-motion: reduce) { *,*::before,*::after { animation: none !important; scroll-behavior: auto !important; transition: none !important; } }
  `;
}

function renderMessages(root: ShadowRoot, resumeId?: string): void {
  const container = root.querySelector<HTMLElement>('.messages')!;
  if (!messages.length) {
    container.innerHTML = `<section class="empty"><h2>No chat messages found</h2><p>The reader looks for visible message groups. Open a chat with at least two messages, then choose <strong>Check for new messages</strong>.</p></section>`;
    return;
  }
  container.innerHTML = messages.map((message, index) => `
    <article id="src-${message.id}" class="${resumeId === message.id ? 'saved' : ''}">
      <span class="folio" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
      <h2 tabindex="-1">${escapeHtml(message.speaker)} <span class="help">— message ${index + 1} of ${messages.length}</span></h2>
      <div class="body">${escapeHtml(message.text)}</div>
      ${message.links.length ? `<h3>Links in this message</h3><ul class="links">${message.links.map((link) => `<li><a href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)} <span class="help">(opens in a new tab)</span></a></li>`).join('')}</ul>` : ''}
      <div class="actions">
        <button type="button" data-copy="${message.id}">Copy this message</button>
        <button type="button" data-resume="${message.id}">Save my place here</button>
      </div>
    </article>`).join('');
}

async function copyText(text: string, status: HTMLElement, success: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = success;
  } catch {
    status.textContent = 'Copy failed. Check clipboard access, then try again.';
  }
}

function downloadTranscript(status: HTMLElement): void {
  const blob = new Blob([transcriptToText(messages)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `stream-reader-transcript-${new Date().toISOString().slice(0, 10)}.txt`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = `Exported ${messages.length} messages as a text file.`;
}

async function refresh(root: ShadowRoot, announce = true): Promise<void> {
  const next = extractTranscript(document);
  const previousCount = messages.length;
  messages = next;
  const stored = await chrome.storage.local.get(pageKey());
  renderMessages(root, stored[pageKey()]);
  if (announce) {
    const status = root.querySelector<HTMLElement>('.notice')!;
    status.textContent = next.length > previousCount
      ? `${next.length - previousCount} new ${next.length - previousCount === 1 ? 'message' : 'messages'} added. Your focus stayed in place.`
      : `Transcript checked. ${next.length} ${next.length === 1 ? 'message' : 'messages'} available.`;
  }
}

async function openReader(): Promise<{ ok: boolean; error?: string }> {
  if (!(await isEnabled())) return { ok: false, error: 'Enable the reader for this site first.' };
  if (document.getElementById(HOST_ID)) return { ok: true };
  messages = extractTranscript(document);
  const host = document.createElement('div');
  host.id = HOST_ID;
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `<style>${makeStyles()}</style><div class="backdrop"></div><section class="reader" role="dialog" aria-modal="true" aria-labelledby="src-title"><header class="masthead"><div><p class="kicker">Local transcript · ${escapeHtml(location.hostname)}</p><h1 id="src-title" tabindex="-1">Conversation reader</h1></div><button class="close" type="button" aria-label="Close transcript reader">Close</button></header><nav class="toolbar" aria-label="Transcript tools"><button class="primary" data-action="copy-all" type="button">Copy all messages</button><button data-action="export" type="button">Export text file</button><button data-action="previous" type="button">Previous message</button><button data-action="next" type="button">Next message</button><button data-action="refresh" type="button">Check for new messages</button><button data-action="pause" type="button">Pause updates</button></nav><p class="notice" role="status" aria-live="polite">${messages.length ? `${messages.length} messages ready.` : 'No messages found yet.'}</p><main class="messages"></main></section>`;
  document.documentElement.append(host);
  const priorOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  const stored = await chrome.storage.local.get(pageKey());
  const resumeId = stored[pageKey()] as string | undefined;
  renderMessages(shadow, resumeId);
  const title = shadow.querySelector<HTMLElement>('#src-title')!;
  title.focus();
  if (resumeId) {
    const resumeHeading = shadow.querySelector<HTMLElement>(`#src-${resumeId} h2`);
    if (resumeHeading) {
      resumeHeading.scrollIntoView({ block: 'center' });
      resumeHeading.focus();
      shadow.querySelector<HTMLElement>('.notice')!.textContent = 'Returned to your saved message.';
    }
  }

  const close = () => {
    observer?.disconnect();
    observer = null;
    clearTimeout(refreshTimer);
    host.remove();
    document.documentElement.style.overflow = priorOverflow;
  };

  shadow.addEventListener('click', async (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button');
    if (!button) return;
    const status = shadow.querySelector<HTMLElement>('.notice')!;
    if (button.classList.contains('close')) return close();
    const copyId = button.dataset.copy;
    if (copyId) {
      const message = messages.find((item) => item.id === copyId);
      if (message) await copyText(message.text, status, 'Message copied.');
      return;
    }
    const resumeId = button.dataset.resume;
    if (resumeId) {
      await chrome.storage.local.set({ [pageKey()]: resumeId });
      renderMessages(shadow, resumeId);
      shadow.querySelector<HTMLElement>(`#src-${resumeId} h2`)?.focus();
      status.textContent = 'Place saved on this device.';
      return;
    }
    switch (button.dataset.action) {
      case 'copy-all': await copyText(transcriptToText(messages), status, 'All messages copied.'); break;
      case 'export': downloadTranscript(status); break;
      case 'refresh': await refresh(shadow); break;
      case 'pause':
        paused = !paused;
        button.textContent = paused ? 'Resume updates' : 'Pause updates';
        status.textContent = paused ? 'Updates paused. The current transcript will not change.' : 'Updates resumed. New messages will appear without moving focus.';
        break;
      case 'previous':
      case 'next': {
        const headings = Array.from(shadow.querySelectorAll<HTMLElement>('article h2'));
        const current = headings.indexOf(shadow.activeElement as HTMLElement);
        const offset = button.dataset.action === 'next' ? 1 : -1;
        const target = headings[Math.max(0, Math.min(headings.length - 1, current + offset))] || headings[0];
        target?.focus();
        target?.scrollIntoView({ block: 'center' });
        break;
      }
    }
  });

  shadow.addEventListener('keydown', (event) => {
    const keyEvent = event as KeyboardEvent;
    if (keyEvent.key === 'Escape') close();
    if (keyEvent.key.toLowerCase() === 'j' || keyEvent.key.toLowerCase() === 'k') {
      const selector = keyEvent.key.toLowerCase() === 'j' ? '[data-action="next"]' : '[data-action="previous"]';
      shadow.querySelector<HTMLButtonElement>(selector)?.click();
    }
  });

  observer = new MutationObserver((records) => {
    if (paused) return;
    if (records.every((record) => host.contains(record.target))) return;
    clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => refresh(shadow), 700);
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  return { ok: true };
}

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  main() {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message?.type !== 'OPEN_READER') return;
      openReader().then(sendResponse);
      return true;
    });
  }
});
