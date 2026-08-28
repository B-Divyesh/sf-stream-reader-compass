async function openReaderInTab(tabId: number): Promise<{ ok: boolean; error?: string }> {
  try {
    const response = await chrome.tabs.sendMessage(tabId, { type: 'OPEN_READER' });
    if (response) return response;
  } catch {
    // A missing receiver is expected until the reader is requested on this page.
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content-scripts/content.js']
    });
    return await chrome.tabs.sendMessage(tabId, { type: 'OPEN_READER' });
  } catch {
    return { ok: false, error: 'Enable the reader for this site first.' };
  }
}

export default defineBackground(() => {
  chrome.commands.onCommand.addListener(async (command) => {
    if (command !== 'open-reader') return;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    await openReaderInTab(tab.id);
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== 'OPEN_READER_IN_TAB' || typeof message.tabId !== 'number') return;
    openReaderInTab(message.tabId).then(sendResponse);
    return true;
  });
});
