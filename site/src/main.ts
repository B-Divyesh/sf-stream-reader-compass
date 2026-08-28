import './styles.css';
import { transcriptToText, type TranscriptMessage } from '../../shared/transcript';
import { sampleMessages, streamedMessage } from './sample';
import { footer, header } from './templates';

const app = document.querySelector<HTMLDivElement>('#app')!;
const routeStatus = document.querySelector<HTMLElement>('.route-status')!;

const pageDetails: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Stream Reader Compass — Read streaming chats',
    description: 'Turn long browser chats into a stable transcript with headings, saved places, copy, and text export.'
  },
  '/demo': {
    title: 'Demo — Stream Reader Compass',
    description: 'Try a private sample transcript with heading navigation, a saved place, copy, and text export.'
  },
  '/privacy': {
    title: 'Privacy — Stream Reader Compass',
    description: 'How Stream Reader Compass handles site settings, resume markers, and conversation text.'
  },
  '/terms': {
    title: 'Terms — Stream Reader Compass',
    description: 'Terms for the free Stream Reader Compass browser extension and website.'
  }
};

function setMeta(path: string): void {
  const details = pageDetails[path] || pageDetails['/'];
  document.title = details.title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = details.description;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = `https://stream-reader-compass.sociobot.in${path}`;
}

function landingPage(): string {
  return `${header()}
    <main id="main">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow">A steadier browser chat reader</p>
          <h1 id="hero-title" tabindex="-1">Read streaming chats without losing your place</h1>
          <p class="dek">For screen-reader users who need stable headings, links, and copy controls in long browser chats.</p>
          <div class="primary-row">
            <a class="button" href="/demo" data-route>Try it with sample data</a>
            <span>Opens a private sample transcript.</span>
          </div>
          <ul class="plain-facts" aria-label="Product facts">
            <li>Conversation text stays in your browser.</li>
            <li>No account is needed.</li>
            <li>Free to use.</li>
          </ul>
        </div>
        <figure class="hero-art">
          <img src="/assets/hero-editorial.webp" width="1200" height="800" alt="Loose paper strips align into one ordered newspaper column beside a compass needle." fetchpriority="high" decoding="async" />
          <figcaption>Loose chat fragments become one numbered reading order.</figcaption>
        </figure>
      </section>

      <section class="preview" aria-labelledby="preview-title">
        <div class="section-heading"><p class="eyebrow">Reader specimen · 04 messages</p><h2 id="preview-title">A transcript that holds still</h2></div>
        <div class="preview-sheet">
          <article><span class="folio" aria-hidden="true">01</span><h3>You — message 1 of 4</h3><p>My checkout button works with a mouse, but keyboard focus disappears after the basket opens.</p></article>
          <article class="marked"><span class="folio" aria-hidden="true">02</span><h3>Support response — message 2 of 4</h3><p>Move focus to the basket heading when it opens. Return focus to the checkout button when it closes.</p><p class="marker-label">Saved place</p></article>
        </div>
        <a class="text-link" href="/demo" data-route>Open the working transcript demo →</a>
      </section>

      <section id="how" class="how" aria-labelledby="how-title">
        <div class="section-heading"><p class="eyebrow">Three steps</p><h2 id="how-title">Turn a live chat into a reading record</h2></div>
        <ol class="steps">
          <li><span>1</span><div><h3>Enable one site</h3><p>Choose the extension on a chat page. Enable that site only.</p></div></li>
          <li><span>2</span><div><h3>Open the reader</h3><p>Press Alt+Shift+R. Each visible message gets a heading and stable anchor.</p></div></li>
          <li><span>3</span><div><h3>Read and act</h3><p>Move by heading, save your place, copy a message, or export the transcript.</p></div></li>
        </ol>
        <aside id="install" class="install-note" aria-labelledby="install-title">
          <h3 id="install-title">Install the unpacked extension</h3>
          <p>Download the ZIP, extract it, then load the folder from your browser's extensions page.</p>
          <a class="button secondary" href="/downloads/stream-reader-compass-chrome.zip" download>Download extension ZIP</a>
        </aside>
      </section>

      <section class="boundaries" aria-labelledby="boundaries-title">
        <div><p class="eyebrow">Clear boundaries</p><h2 id="boundaries-title">It reads the page you already opened</h2></div>
        <div class="boundary-copy">
          <p>The extension does not call a model or summarize your words.</p>
          <p>It reads visible message groups only after you enable that site.</p>
          <p>It stores the enabled site list and your resume marker. It does not store transcript text.</p>
          <a href="/privacy" data-route>Read the full privacy notice</a>
        </div>
      </section>
    </main>${footer()}`;
}

function demoPage(): string {
  return `<div class="demo-banner" role="status"><strong>Demo — sample data, nothing is saved</strong><div><button type="button" data-demo-reset>Reset demo</button><a href="/#install" data-start-real>Start for real</a></div></div>
    ${header('demo')}
    <main id="main" class="demo-main">
      <section class="demo-intro"><p class="eyebrow">Sample support chat · local sandbox</p><h1 tabindex="-1">Read this conversation in order</h1><p>Use headings or the message buttons. New replies never move your focus.</p></section>
      <section class="reader-app" aria-labelledby="reader-title">
        <header class="reader-masthead"><div><p class="eyebrow">The daily transcript · sample edition</p><h2 id="reader-title">Checkout keyboard support</h2></div><p id="message-count" class="edition-count"></p></header>
        <nav class="reader-tools" aria-label="Transcript tools">
          <button class="primary" type="button" data-copy-all>Copy all messages</button>
          <button type="button" data-export>Export text file</button>
          <button type="button" data-previous>Previous message</button>
          <button type="button" data-next>Next message</button>
          <button type="button" data-add-reply>Add sample reply</button>
          <button type="button" data-pause>Pause updates</button>
        </nav>
        <p id="demo-status" class="reader-status" aria-live="polite" role="status"></p>
        <div id="demo-messages" class="demo-messages"></div>
      </section>
      <aside class="demo-help" aria-labelledby="keys-title"><h2 id="keys-title">Keyboard shortcuts in the reader</h2><p>Press J for the next message. Press K for the previous message. Tab reaches every action.</p></aside>
    </main>${footer()}`;
}

function privacyPage(): string {
  return `${header('privacy')}<main id="main" class="legal"><p class="eyebrow">Privacy notice · effective 28 August 2026</p><h1 tabindex="-1">Your conversation stays in your browser</h1>
    <p class="lede">Stream Reader Compass processes visible page content on your device. It does not send conversation text to us.</p>
    <h2>What the extension reads</h2><p>After you enable a site and open the reader, the extension reads visible message text and links from that page. It uses them to make the transcript you see.</p>
    <h2>What the extension stores</h2><p>Your browser stores the list of enabled site origins in extension sync storage. It stores one message identifier per page when you save your place. Transcript text is not stored.</p>
    <h2>What the demo stores</h2><p>The demo uses keys beginning with <code>demo:</code> in local storage. Reset demo or choose Start for real to remove them. It never reads extension data.</p>
    <h2>What leaves your device</h2><p>No conversation text, links, resume markers, or enabled site list is sent to Stream Reader Compass. The website loads only its own files. There is no analytics script.</p>
    <h2>Your controls</h2><p>Disable a site from the extension popup. Remove the extension to delete its local data. Reset the demo from its top banner.</p>
    <h2>Contact</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a> with a privacy question.</p>
  </main>${footer()}`;
}

function termsPage(): string {
  return `${header()}<main id="main" class="legal"><p class="eyebrow">Terms · effective 28 August 2026</p><h1 tabindex="-1">Use the reader as a local aid</h1>
    <p class="lede">Stream Reader Compass is free software that restructures visible page content for reading.</p>
    <h2>Using the extension</h2><p>You may use and modify the extension under the MIT License. You are responsible for following the rules of each site you enable.</p>
    <h2>No content ownership</h2><p>The extension does not own or publish your conversations. Exported text remains subject to the rights and rules that already apply to it.</p>
    <h2>Availability</h2><p>The extension is provided as is. Websites can change their page structure, so message detection may need an update.</p>
    <h2>Contact</h2><p>Email <a href="mailto:support@sociobot.in">support@sociobot.in</a> with a terms question.</p>
  </main>${footer()}`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!);
}

let demoMessages: TranscriptMessage[] = [];
let demoPaused = false;

function renderDemoMessages(): void {
  const container = document.querySelector<HTMLElement>('#demo-messages');
  if (!container) return;
  const savedId = localStorage.getItem('demo:resume');
  container.innerHTML = demoMessages.map((message, index) => `<article id="${message.id}" class="demo-message ${savedId === message.id ? 'marked' : ''}">
    <span class="folio" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
    <h3 tabindex="-1">${escapeHtml(message.speaker)} <span>— message ${index + 1} of ${demoMessages.length}</span></h3>
    <p>${escapeHtml(message.text)}</p>
    ${message.links.length ? `<h4>Links in this message</h4><ul>${message.links.map((link) => `<li><a href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)} <span class="sr-only">(opens another site in a new tab)</span></a></li>`).join('')}</ul>` : ''}
    <div class="message-actions"><button type="button" data-copy-message="${message.id}">Copy this message</button><button type="button" data-save-place="${message.id}">Save my place here</button></div>
    ${savedId === message.id ? '<p class="marker-label">Saved place</p>' : ''}
  </article>`).join('');
  document.querySelector<HTMLElement>('#message-count')!.textContent = `${String(demoMessages.length).padStart(2, '0')} messages`;
}

async function copyToClipboard(text: string, success: string): Promise<void> {
  const status = document.querySelector<HTMLElement>('#demo-status')!;
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = success;
  } catch {
    status.textContent = 'Copy failed. Allow clipboard access, then try again.';
  }
}

function moveMessage(offset: number): void {
  const headings = Array.from(document.querySelectorAll<HTMLElement>('.demo-message h3'));
  const current = headings.indexOf(document.activeElement as HTMLElement);
  const target = headings[Math.max(0, Math.min(headings.length - 1, current + offset))] || headings[0];
  target?.focus();
  target?.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

function bindDemo(): void {
  demoMessages = [...sampleMessages];
  demoPaused = false;
  renderDemoMessages();
  const status = document.querySelector<HTMLElement>('#demo-status')!;
  status.textContent = 'Four sample messages ready.';
  const saved = localStorage.getItem('demo:resume');
  if (saved) {
    document.querySelector<HTMLElement>(`#${saved} h3`)?.focus();
    status.textContent = 'Returned to your saved message.';
  }
  document.querySelector('[data-demo-reset]')?.addEventListener('click', () => {
    Object.keys(localStorage).filter((key) => key.startsWith('demo:')).forEach((key) => localStorage.removeItem(key));
    demoMessages = [...sampleMessages];
    renderDemoMessages();
    status.textContent = 'Demo reset to four sample messages.';
    document.querySelector<HTMLElement>('main h1')?.focus();
  });
  document.querySelector('[data-start-real]')?.addEventListener('click', () => {
    Object.keys(localStorage).filter((key) => key.startsWith('demo:')).forEach((key) => localStorage.removeItem(key));
  });
  document.querySelector('[data-copy-all]')?.addEventListener('click', () => copyToClipboard(transcriptToText(demoMessages), 'All messages copied.'));
  document.querySelector('[data-export]')?.addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([transcriptToText(demoMessages)], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'sample-stream-reader-transcript.txt';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = `Exported ${demoMessages.length} messages as a text file.`;
  });
  document.querySelector('[data-previous]')?.addEventListener('click', () => moveMessage(-1));
  document.querySelector('[data-next]')?.addEventListener('click', () => moveMessage(1));
  document.querySelector('[data-pause]')?.addEventListener('click', (event) => {
    demoPaused = !demoPaused;
    (event.currentTarget as HTMLButtonElement).textContent = demoPaused ? 'Resume updates' : 'Pause updates';
    status.textContent = demoPaused ? 'Updates paused. The transcript will not change.' : 'Updates resumed. New replies can appear without moving focus.';
  });
  document.querySelector('[data-add-reply]')?.addEventListener('click', () => {
    if (demoPaused) {
      status.textContent = 'The reply was not added because updates are paused. Resume updates first.';
      return;
    }
    if (demoMessages.some((message) => message.id === streamedMessage.id)) {
      status.textContent = 'The sample reply is already in this transcript.';
      return;
    }
    const focused = document.activeElement;
    demoMessages.push(streamedMessage);
    renderDemoMessages();
    (focused as HTMLElement)?.focus();
    status.textContent = 'One new message added. Your focus stayed in place.';
  });
  document.querySelector('#demo-messages')?.addEventListener('click', async (event) => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button');
    if (!button) return;
    if (button.dataset.copyMessage) {
      const message = demoMessages.find((item) => item.id === button.dataset.copyMessage);
      if (message) await copyToClipboard(message.text, 'Message copied.');
    }
    if (button.dataset.savePlace) {
      localStorage.setItem('demo:resume', button.dataset.savePlace);
      const id = button.dataset.savePlace;
      renderDemoMessages();
      document.querySelector<HTMLElement>(`#${id} h3`)?.focus();
      status.textContent = 'Place saved in the demo sandbox.';
    }
  });
  document.addEventListener('keydown', demoKeyHandler);
}

function demoKeyHandler(event: KeyboardEvent): void {
  if (location.pathname !== '/demo' || /input|textarea/i.test((event.target as Element).tagName)) return;
  if (event.key.toLowerCase() === 'j') moveMessage(1);
  if (event.key.toLowerCase() === 'k') moveMessage(-1);
}

function render(path = location.pathname): void {
  document.removeEventListener('keydown', demoKeyHandler);
  const cleanPath = path.replace(/\/$/, '') || '/';
  setMeta(cleanPath);
  if (cleanPath === '/demo') app.innerHTML = demoPage();
  else if (cleanPath === '/privacy') app.innerHTML = privacyPage();
  else if (cleanPath === '/terms') app.innerHTML = termsPage();
  else app.innerHTML = landingPage();
  if (cleanPath === '/demo') bindDemo();
  if (location.hash) requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView());
}

document.addEventListener('click', (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-route]');
  if (!link || event.defaultPrevented || event.button !== 0 || link.origin !== location.origin) return;
  event.preventDefault();
  history.pushState({}, '', link.href);
  render();
  window.scrollTo(0, 0);
  const heading = document.querySelector<HTMLElement>('main h1');
  heading?.focus();
  routeStatus.textContent = document.title;
});

window.addEventListener('popstate', () => {
  render();
  document.querySelector<HTMLElement>('main h1')?.focus();
  routeStatus.textContent = document.title;
});

render();
