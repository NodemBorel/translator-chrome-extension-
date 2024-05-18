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
  span.style.backgroundColor = '#ffff99'; // White background
  span.style.color = '#333';
  span.style.border = '2px solid #4CAF50'; // Green border
  span.style.borderRadius = '8px'; // Rounded corners
  span.style.padding = '15px'; // Increased padding for readability
  span.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.5)'; // Shadow
  span.style.position = 'absolute';
  span.style.zIndex = '9999'; // Ensure it's above other elements

  // Add close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '✕'; // Close icon
  closeButton.style.position = 'absolute';
  closeButton.style.top = '5px'; // Adjust position
  closeButton.style.left = '-30px'; // Move button to the left
  closeButton.style.border = 'none';
  closeButton.style.backgroundColor = 'transparent';
  closeButton.style.color = 'red'; // Green color
  closeButton.style.fontSize = '20px';
  closeButton.style.fontWeight = 'bold'; // Make the button bold
  closeButton.style.cursor = 'pointer';
  closeButton.addEventListener('click', () => {
    document.body.removeChild(span);
  });
  span.appendChild(closeButton);

  document.body.appendChild(span);

  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    const topOffset = rect.bottom - bodyRect.top + 10; // Adjust the offset
    const leftOffset = rect.left - bodyRect.left;
    span.style.top = `${topOffset}px`;
    span.style.left = `${leftOffset}px`;
  }

  setTimeout(() => {
    document.body.removeChild(span);
  }, 90000); // 3 minutes = 180,000 milliseconds
}

