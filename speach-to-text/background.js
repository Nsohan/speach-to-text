let recognizing = false;

// When extension is installed, create context menu
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");

  chrome.contextMenus.create(
    {
      id: "voice-to-text",
      title: "Voice to Text Converter",
      contexts: ["all"],
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        console.log("Context menu created");
      }
    }
  );
});

// When context menu is clicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "voice-to-text") {
    console.log("Voice to Text clicked");

    // Open popup window
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: 450,
      height: 500,
    });
  }
});

// When extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  // Check if we're on a valid page (not chrome:// pages)
  if (
    !tab.url ||
    tab.url.startsWith("chrome://") ||
    tab.url.startsWith("chrome-extension://")
  ) {
    console.log("Cannot run on chrome:// pages");
    // Show notification or alert
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      width: 400,
      height: 500,
    });
    return;
  }

  recognizing = !recognizing;

  if (recognizing) {
    console.log("Starting voice capture");
    chrome.storage.local.set({ recognizing: recognizing });

    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        func: startVoiceCapture,
      })
      .catch((err) => {
        console.error("Failed to inject script:", err);
        recognizing = false;
        chrome.storage.local.set({ recognizing: false });
      });
  } else {
    console.log("Stopping voice capture");
    chrome.storage.local.set({ recognizing: recognizing });

    chrome.tabs.sendMessage(tab.id, "stop").catch((err) => {
      console.error("Failed to send stop message:", err);
    });
  }
});

// This function will run in the webpage context
function startVoiceCapture() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Speech Recognition not supported");
    return;
  }

  // Remove existing display box if any
  const existingBox = document.getElementById("voice-capture-display");
  if (existingBox) {
    existingBox.remove();
  }

  const displayBox = document.createElement("div");
  displayBox.id = "voice-capture-display";
  displayBox.style.position = "fixed";
  displayBox.style.top = "20px";
  displayBox.style.right = "20px";
  displayBox.style.width = "300px";
  displayBox.style.maxHeight = "400px";
  displayBox.style.padding = "15px";
  displayBox.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  displayBox.style.color = "#00ff00";
  displayBox.style.border = "2px solid #00ff00";
  displayBox.style.borderRadius = "10px";
  displayBox.style.zIndex = "999999";
  displayBox.style.overflow = "auto";
  displayBox.style.fontFamily = "monospace";
  displayBox.style.fontSize = "14px";
  displayBox.textContent = "Listening...";

  document.body.appendChild(displayBox);

  const recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  let finalTranscript = "";
  let isActive = true;

  recognition.start();
  console.log("Voice recognition started");

  recognition.onresult = (event) => {
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcript + " ";
      } else {
        interimTranscript += transcript;
      }
    }

    displayBox.textContent = finalTranscript + interimTranscript;
    displayBox.scrollTop = displayBox.scrollHeight;
  };

  recognition.onerror = (event) => {
    console.error("Recognition error:", event.error);
    if (event.error !== "no-speech" && event.error !== "aborted") {
      displayBox.textContent = "Error: " + event.error;
    }
  };

  recognition.onend = () => {
    if (isActive) {
      console.log("Recognition ended, restarting...");
      try {
        recognition.start();
      } catch (e) {
        console.error("Failed to restart recognition:", e);
        isActive = false;
      }
    }
  };

  chrome.runtime.onMessage.addListener((message) => {
    if (message === "stop") {
      isActive = false;
      try {
        recognition.stop();
      } catch (e) {
        console.error("Failed to stop recognition:", e);
      }
      if (displayBox && displayBox.parentElement) {
        displayBox.remove();
      }
      console.log("Voice recognition stopped");
    }
  });
}
