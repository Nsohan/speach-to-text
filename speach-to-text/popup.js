let recognition = null;
let isRecording = false;
let finalTranscript = "";

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const textArea = document.getElementById("textArea");
const status = document.getElementById("status");
const languageSelect = document.getElementById("languageSelect");

// Load saved language preference
chrome.storage.local.get(["selectedLanguage"], (result) => {
  if (result.selectedLanguage) {
    languageSelect.value = result.selectedLanguage;
    if (recognition) {
      recognition.lang = result.selectedLanguage;
    }
  }
});

// Save language when changed
languageSelect.addEventListener("change", () => {
  const selectedLang = languageSelect.value;

  // Save to chrome storage
  chrome.storage.local.set({ selectedLanguage: selectedLang });

  // Update recognition language
  if (recognition) {
    recognition.lang = selectedLang;
    status.textContent = `Language changed to ${
      languageSelect.options[languageSelect.selectedIndex].text
    }`;

    setTimeout(() => {
      if (!isRecording) {
        status.textContent = "Ready to record...";
        status.className = "";
      }
    }, 2000);
  }
});

// Check if browser supports Speech Recognition
if (!("webkitSpeechRecognition" in window)) {
  status.textContent = "Speech Recognition not supported in this browser";
  status.className = "error";
  startBtn.disabled = true;
} else {
  // Initialize Speech Recognition
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";
  recognition.maxAlternatives = 1; // Faster processing
  recognition.interimResults = true; // Already there, but confirm it's true

  // When speech is recognized
  recognition.onresult = (event) => {
    let interimTranscript = "";

    // Process ALL results, not just from resultIndex
    for (let i = 0; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        // Only add to final if it's not already there
        if (!finalTranscript.includes(transcript)) {
          finalTranscript += transcript + " ";
        }
      } else {
        interimTranscript += transcript;
      }
    }

    // Update immediately without debouncing
    textArea.value = finalTranscript + interimTranscript;
    textArea.scrollTop = textArea.scrollHeight;
  };

  // When recognition starts
  recognition.onstart = () => {
    isRecording = true;
    status.textContent = "🎤 Listening...";
    status.className = "listening";
    startBtn.disabled = true;
    stopBtn.disabled = false;
  };

  // When recognition ends
  recognition.onend = () => {
    if (isRecording) {
      // Restart if we're still supposed to be recording
      recognition.start();
    } else {
      status.textContent = "Recording stopped";
      status.className = "";
    }
  };

  // Handle errors
  recognition.onerror = (event) => {
    console.error("Recognition error:", event.error);

    if (event.error === "no-speech") {
      status.textContent = "No speech detected. Try speaking louder.";
    } else if (event.error === "not-allowed") {
      status.textContent = "Microphone permission denied";
      status.className = "error";
      isRecording = false;
      startBtn.disabled = false;
      stopBtn.disabled = true;
    } else {
      status.textContent = "Error: " + event.error;
      status.className = "error";
    }
  };
}

// Start button click
startBtn.addEventListener("click", () => {
  if (recognition) {
    recognition.start();
    console.log("Recording started");
  }
});

// Stop button click
stopBtn.addEventListener("click", () => {
  if (recognition) {
    isRecording = false;
    recognition.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    status.textContent = "Recording stopped";
    status.className = "";
    console.log("Recording stopped");
  }
});

// Copy button click
copyBtn.addEventListener("click", () => {
  if (textArea.value.trim() === "") {
    status.textContent = "Nothing to copy!";
    return;
  }

  textArea.select();
  document.execCommand("copy");

  status.textContent = "✓ Copied to clipboard!";
  status.className = "listening";

  setTimeout(() => {
    if (!isRecording) {
      status.textContent = "Ready to record...";
      status.className = "";
    }
  }, 2000);
});

// Clear button click
clearBtn.addEventListener("click", () => {
  textArea.value = "";
  finalTranscript = "";
  status.textContent = "Text cleared";

  setTimeout(() => {
    if (!isRecording) {
      status.textContent = "Ready to record...";
      status.className = "";
    }
  }, 1500);
});
