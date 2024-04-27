chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF',
  });
});

// const extensions = 'https://developer.chrome.com/docs/extensions';
// const webstore = 'https://developer.chrome.com/docs/webstore';
const allHttps = 'https://';

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(allHttps)) {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    if (nextState === 'ON') {
      // Insert the CSS file when the user turns the extension on
      // await chrome.scripting.insertCSS({
      //   files: ['focus-mode.css'],
      //   target: { tabId: tab.id },
      // });
      await chrome.scripting.executeScript({
        target: {
          tabId: tab.id,
        },
        func: () => {
          const s = document.createElement('script');
          s.src = chrome.runtime.getURL('loadPowerglitch.js');
          s.onload = function () {
            this.remove();
          };
          (document.head || document.documentElement).appendChild(s);
          const body = document.querySelector('body');
          PowerGlitch.glitch(body);
        },
      });
    } else if (nextState === 'OFF') {
      // Remove the CSS file when the user turns the extension off
      await chrome.scripting.removeCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id },
      });
    }
  }
});
