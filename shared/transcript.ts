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

  const seen = new Set<string>();
  return elements.flatMap((element, index) => {
    const text = (element.textContent || '').replace(/\s+/g, ' ').trim();
    if (text.length < 2 || text.length > 100_000) return [];
    const signature = text.slice(0, 500);
    if (seen.has(signature)) return [];
    seen.add(signature);
    const links = Array.from(element.querySelectorAll<HTMLAnchorElement>('a[href]'))
      .map((link) => ({
        label: (link.textContent || link.getAttribute('aria-label') || 'Open link').trim(),
        url: link.href
      }))
      .filter((link, linkIndex, all) => /^(https?|mailto):/.test(link.url) && all.findIndex((other) => other.url === link.url) === linkIndex);
    return [{
      id: `message-${index + 1}`,
      speaker: speakerFor(element, index),
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
