# 🎤 Voice to Text Converter - Chrome Extension

A modern, smooth, and efficient Chrome extension that converts your voice to text in real-time using the Web Speech API. Support for 15+ languages with a beautiful, gradient-based UI.

![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📸 Screenshots

### Main Interface

![Popup UI](screenshots/popup-ui.png)

### Language Selection

![Language Selection](screenshots/language-selection.png)


### Overlay Mode

![Overlay Mode](screenshots/overlay-mode.png)

## ✨ Features

- 🎯 **Real-time Voice Recognition** - See your words appear instantly as you speak
- 🌐 **Multi-language Support** - 15+ languages including English, Spanish, French, German, Arabic, Bengali, Hindi, and more
- 💾 **Language Preference Memory** - Your selected language is saved automatically
- 📋 **Quick Copy** - One-click copy to clipboard
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- 🔄 **Continuous Recording** - Auto-restarts recognition for uninterrupted dictation
- 📱 **Popup & Overlay Modes** - Use in popup window or floating overlay on any webpage
- ⚡ **Optimized Performance** - Smooth text streaming without lag

## 🚀 Installation

### Option 1: Load Unpacked Extension (Development)

1. **Download or Clone** this repository:

```bash
   git clone https://github.com/Nsohan/speach-to-text.git
```

2. **Open Chrome** and navigate to:

```
   chrome://extensions/
```

3. **Enable Developer Mode** (toggle in top-right corner)

4. **Click "Load unpacked"**

5. **Select** the `my-voice-capture` folder

6. **Done!** The extension icon should appear in your toolbar

### Option 2: Install from Chrome Web Store

_Coming soon..._

## 📖 Usage

### Method 1: Popup Window

1. Click the extension icon in your Chrome toolbar
2. Select your preferred language from the dropdown
3. Click **"▶ Start Recording"**
4. Start speaking - text appears instantly
5. Click **"⏹ Stop Recording"** when done
6. Use **"📋 Copy Text"** to copy to clipboard

### Method 2: Context Menu (Overlay)

1. Right-click anywhere on a webpage
2. Select **"Voice to Text Converter"**
3. A floating overlay appears
4. Start speaking - text displays in the overlay box

### Method 3: Extension Icon (Page Overlay)

1. Navigate to any webpage
2. Click the extension icon
3. A floating display box appears on the page
4. Click icon again to stop

## 🌍 Supported Languages

| Language             | Code  |
| -------------------- | ----- |
| English (US)         | en-US |
| English (UK)         | en-GB |
| Spanish (Spain)      | es-ES |
| Spanish (Mexico)     | es-MX |
| French               | fr-FR |
| German               | de-DE |
| Italian              | it-IT |
| Portuguese (Brazil)  | pt-BR |
| Japanese             | ja-JP |
| Korean               | ko-KR |
| Chinese (Simplified) | zh-CN |
| Hindi                | hi-IN |
| Arabic               | ar-SA |
| Russian              | ru-RU |
| Bengali (Bangladesh) | bn-BD |

_More languages can be added easily!_

## 🛠️ Technical Details

### Technologies Used

- **Web Speech API** (webkit Speech Recognition)
- **Chrome Extension Manifest V3**
- **Vanilla JavaScript** (No dependencies)
- **CSS3** (Gradients, animations, transitions)

### File Structure

```
my-voice-capture/
│
├── manifest.json          # Extension configuration
├── background.js          # Service worker & context menu logic
├── popup.html            # Popup window UI
├── popup.js              # Popup logic & speech recognition
├── README.md             # Documentation
│
└── icons/
    ├── 16.png
    ├── 32.png
    ├── 48.png
    └── 128.png
```

### Key Features Implementation

**Smooth Text Streaming:**

```javascript
// Optimized onresult handler for instant text display
recognition.onresult = (event) => {
  for (let i = 0; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      finalTranscript += transcript + " ";
    } else {
      interimTranscript += transcript;
    }
  }
  textArea.value = finalTranscript + interimTranscript;
};
```

**Language Persistence:**

```javascript
// Save and load language preferences
chrome.storage.local.set({ selectedLanguage: selectedLang });
chrome.storage.local.get(["selectedLanguage"], (result) => {
  recognition.lang = result.selectedLanguage;
});
```

## 🎨 UI Customization

The extension uses a modern gradient-based design. You can customize colors in `popup.html`:

```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Button gradients */
#startBtn {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
}
#stopBtn {
  background: linear-gradient(135deg, #f44336 0%, #da190b 100%);
}
```

## 🔒 Permissions

This extension requires the following permissions:

- `activeTab` - Access current tab for overlay display
- `scripting` - Inject speech recognition script
- `tabs` - Manage tab information
- `storage` - Save language preferences
- `contextMenus` - Add right-click menu option
- `host_permissions: ["*://*/*"]` - Work on all websites

## 🐛 Known Issues

- **Chrome-only**: Uses webkit Speech Recognition (not available in Firefox)
- **Microphone Permission**: Browser will request microphone access on first use
- **Restricted Pages**: Cannot run on `chrome://` pages or Chrome Web Store

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] Auto-punctuation
- [ ] Export to file (TXT, DOCX, PDF)
- [ ] Custom keyboard shortcuts
- [ ] Dark mode toggle
- [ ] Voice commands (clear, copy, etc.)
- [ ] Translation feature
- [ ] Timestamp markers
- [ ] Multiple theme options

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Author

**Nh Sohan**

- GitHub: [@Nsohan](https://github.com/Nsohan)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Web Speech API by Google/Chrome
- Icons from [your icon source]
- Inspired by Google Docs voice typing

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Nsohan/speach-to-text) page
2. Create a new issue with detailed description
3. Contact: nhsohan3@gmail.com

---

**⭐ If you find this project useful, please give it a star!**

Made with ❤️ and JavaScript
