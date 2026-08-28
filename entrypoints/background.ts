export default defineBackground(() => {
  chrome.commands.onCommand.addListener(async (command) => {
    if (command !== 'open-reader') return;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) return;
    chrome.tabs.sendMessage(tab.id, { type: 'OPEN_READER' }).catch(() => undefined);
  });
});
