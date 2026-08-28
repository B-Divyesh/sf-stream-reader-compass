export type TranscriptLink = { label: string; url: string };

export type TranscriptMessage = {
  id: string;
  speaker: string;
  text: string;
  links: TranscriptLink[];
};

const SELECTORS = [
  '[data-message-author-role]',
  '[data-testid*="conversation-turn"]',
  '[data-testid*="message"]',
  'main article',
  '[role="main"] article',
  '.message'
];

const ANCHOR_ATTRIBUTE = 'data-stream-reader-compass-anchor';
const FINGERPRINT_ATTRIBUTE = 'data-stream-reader-compass-fingerprint';
const EXCLUDED_CONTENT = 'script, style, template, noscript, button, input, select, textarea, [role="button"], [aria-hidden="true"], [data-stream-reader-compass-ui], [data-transcript-chrome], .folio, .actions, .message-actions, .marker-label';

function hash(value: string): string {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(36);
}

function isRendered(element: Element): boolean {
  const view = element.ownerDocument.defaultView;
  if (!view) return true;
  for (let current: Element | null = element; current; current = current.parentElement) {
    const style = view.getComputedStyle(current);
    if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse' || style.contentVisibility === 'hidden') return false;
  }
  return true;
}

function visibleText(element: Element): string {
  const parts: string[] = [];
  const walker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (parent && isRendered(parent) && !parent.closest(EXCLUDED_CONTENT)) parts.push(node.textContent || '');
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

function messageId(element: Element, fingerprint: string, duplicate: number): string {
  const existing = element.getAttribute(ANCHOR_ATTRIBUTE);
  const fingerprintHash = hash(fingerprint);
  const sourceIdentity = element.getAttribute('data-message-id')
    || element.getAttribute('data-id')
    || element.getAttribute('data-testid')
    || element.id;
  if (existing && (sourceIdentity || element.getAttribute(FINGERPRINT_ATTRIBUTE) === fingerprintHash)) return existing;
  const identity = sourceIdentity ? `source:${sourceIdentity}` : `content:${fingerprint}:${duplicate}`;
  const id = existing ? `message-${hash(`replacement:${existing}:${fingerprint}`)}` : `message-${hash(identity)}`;
  // The attribute gives otherwise anonymous DOM nodes a stable identity while the page is
  // streaming. Explicit message IDs keep the same identifier after a full page reload.
  element.setAttribute(ANCHOR_ATTRIBUTE, id);
  element.setAttribute(FINGERPRINT_ATTRIBUTE, fingerprintHash);
  return id;
}

function speakerFor(element: Element, index: number): string {
  const explicit = element.getAttribute('data-message-author-role')
    || element.getAttribute('data-author')
    || element.getAttribute('aria-label');
  if (explicit && /user|you/i.test(explicit)) return 'You';
  if (explicit && /assistant|agent|support|bot/i.test(explicit)) return 'Response';
  const nearby = element.querySelector('[data-message-author-role], [class*="author"], [class*="sender"]')?.textContent;
  if (nearby && nearby.trim().length < 40) return nearby.trim();
  return index % 2 === 0 ? 'Message' : 'Response';
}

export function extractTranscript(root: ParentNode = document): TranscriptMessage[] {
  let elements: Element[] = [];
  for (const selector of SELECTORS) {
    const matches = Array.from(root.querySelectorAll(selector));
    if (matches.length >= 2) {
      elements = matches;
      break;
    }
  }

  const duplicates = new Map<string, number>();
  return elements.flatMap((element, index) => {
    if (!isRendered(element)) return [];
    const text = visibleText(element);
    if (text.length < 2 || text.length > 100_000) return [];
    const speaker = speakerFor(element, index);
    const links = Array.from(element.querySelectorAll<HTMLAnchorElement>('a[href]'))
      .filter((link) => isRendered(link) && !link.closest(EXCLUDED_CONTENT))
      .map((link) => ({
        label: (link.textContent || link.getAttribute('aria-label') || 'Open link').trim(),
        url: link.href
      }))
      .filter((link, linkIndex, all) => /^(https?|mailto):/.test(link.url) && all.findIndex((other) => other.url === link.url) === linkIndex);
    const fingerprint = `${speaker}\n${text.slice(0, 2_000)}\n${links.map((link) => link.url).join('\n')}`;
    const duplicate = (duplicates.get(fingerprint) || 0) + 1;
    duplicates.set(fingerprint, duplicate);
    return [{
      id: messageId(element, fingerprint, duplicate),
      speaker,
      text,
      links
    }];
  });
}

export function transcriptToText(messages: TranscriptMessage[]): string {
  return messages.map((message, index) => {
    const links = message.links.length
      ? `\nLinks:\n${message.links.map((link) => `- ${link.label}: ${link.url}`).join('\n')}`
      : '';
    return `${index + 1}. ${message.speaker}\n${message.text}${links}`;
  }).join('\n\n');
}

export function safeOrigin(url: string): string | null {
  try {
    const parsed = new URL(url);
    return /^https?:$/.test(parsed.protocol) ? parsed.origin : null;
  } catch {
    return null;
  }
}
