import type { TranscriptMessage } from '../../shared/transcript';

export const sampleMessages: TranscriptMessage[] = [
  {
    id: 'sample-1',
    speaker: 'You',
    text: 'My checkout button works with a mouse, but keyboard focus disappears after the basket opens. What should I check first?',
    links: []
  },
  {
    id: 'sample-2',
    speaker: 'Support response',
    text: 'Start with the basket dialog. Move focus to its heading when it opens. Keep Tab inside the dialog, then return focus to the checkout button when it closes.',
    links: [
      { label: 'WAI-ARIA dialog pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/' }
    ]
  },
  {
    id: 'sample-3',
    speaker: 'You',
    text: 'The heading receives focus now. How should I announce that the basket total changed?',
    links: []
  },
  {
    id: 'sample-4',
    speaker: 'Support response',
    text: 'Put the short total message in a polite live region. Do not move focus. Keep the full basket details available under a clear heading.',
    links: [
      { label: 'Live regions guide', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions' }
    ]
  }
];

export const streamedMessage: TranscriptMessage = {
  id: 'sample-5',
  speaker: 'Support response',
  text: 'Test the change with only the keyboard. Open the basket, change the quantity, hear the new total, close the basket, and confirm focus returns.',
  links: []
};
