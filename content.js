console.log("Content script injected");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'translate') {
    translateText(request.text);
  }
});

function translateText(text) {
  fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=en|es`)
    .then(response => response.json())
    .then(data => {
      const translatedText = data.responseData.translatedText;
      displayTranslation(translatedText);
    })
    .catch(error => {
      console.error('Translation error:', error);
    });
}

function displayTranslation(translatedText) {
  const span = document.createElement('span');
  span.textContent = translatedText;
  span.style.backgroundColor = '#ffff99';
  span.style.border = '1px solid #cccccc';
  span.style.padding = '2px';
  span.style.position = 'absolute';

  document.body.appendChild(span);

  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    span.style.left = `${rect.left}px`;
    span.style.top = `${rect.bottom}px`;
  }

  setTimeout(() => {
    document.body.removeChild(span);
  }, 5000);
}
