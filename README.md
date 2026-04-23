# 🐀 Shrew Browser

A custom Chromium-based browser built with Electron by mrrat and Gravity.

![Shrew Logo](rathole-logo.png)

## ✨ Features

### Core Browser
- **Custom Homepage** - Shrew themed with quick links and search
- **Smart Search** - DuckDuckGo web scraping with malware blocking
- **Wikipedia Integration** - Automatic summaries with images
- **Navigation Controls** - Back, forward, reload buttons
- **Custom URL Bar** - Search or navigate seamlessly

### Search Engine
- 🔍 Real web results from DuckDuckGo
- 📚 Wikipedia summaries with thumbnails
- ⚠️ **Malware Protection** - Blocks suspicious domains automatically
- 🌐 Quick links to Google, YouTube, Reddit, GitHub

### Easter Eggs
- 🎮 **Rat Game** - Search "rat" to play Snake with a pixel rat eating cheese!
  - Controls: Arrow keys or WASD
  - Tracks high score
  - Embedded in search results

### Special Features
- 🐀 **rcked Easter Egg** - Search "rcked" for a special result
- 🧀 Floating cheese and rat animations on homepage
- 🎨 Pink and dark theme throughout
- 💾 Persistent cookies and sessions

## 📥 Installation

### For Users
1. Download `Shrew Setup.exe` from [Releases](https://github.com/mrratcool78/rathole/releases)
2. Run the installer
3. Launch Shrew from your desktop or start menu

### For Developers
```bash
# Clone the repo
git clone https://github.com/mrratcool78/rathole.git
cd rathole

# Install dependencies
npm install

# Run in development
npm start

# Build for Windows
npm run build-win
```

## 🎮 How to Use

### Basic Navigation
- Type a URL in the address bar to visit websites
- Type anything else to search the web
- Click the back/forward arrows to navigate
- Click the refresh button to reload

### Homepage Quick Links
- YouTube 📺
- Discord 💬
- GitHub 💻
- Reddit 🗨️
- Twitter 🐦
- Twitch 🎮

### Easter Eggs
Try searching for these:
- **"rat"** - Play the Shrew Snake game!
- **"rcked"** - Special shoutout to rcked.pages.dev

## 🛡️ Security Features

### Malware Blocking
Automatically blocks:
- Suspicious TLDs (.tk, .ml, .ga, .cf, .gq, .cc, .ws)
- Download/crack/torrent sites from .ru/.cn
- Sites with virus/malware keywords
- Executable file downloads

### Privacy
- Cookies saved locally
- No tracking or analytics
- CORS disabled for better scraping (use responsibly)

## 🔧 Technical Details

### Built With
- **Electron** - Desktop app framework
- **Chromium** - Browser engine
- **Node.js** - Backend runtime
- **DuckDuckGo** - Search provider
- **Wikipedia API** - Knowledge integration

### Project Structure
```
rat-hole/
├── main.js           # Electron main process
├── index.html        # Browser UI
├── homepage.html     # Custom homepage
├── search.html       # Search results page
├── rat-game.html     # Snake game (standalone)
├── rathole-logo.png  # Browser icon
└── package.json      # Dependencies
```

## 🎨 Customization

Want to modify Shrew? Here's where to look:

- **Colors**: Edit CSS in `homepage.html` and `search.html`
- **Quick Links**: Modify the link cards in `homepage.html`
- **Search Provider**: Update scraping logic in `search.html`
- **Easter Eggs**: Add more in the search navigation logic

## 🐛 Known Issues

- YouTube may show black screen if not logged in
- Some sites require login for full functionality
- Auto-update requires code signing (not implemented yet)

## 📝 License

Proprietary License - All Rights Reserved

See [LICENSE](LICENSE) for details.

## 👥 Credits

**Created by:**
- **mrratcool78** - Lead developer
- **Gravity** - Co-creator and creative direction

**Special Thanks:**
- rcked.pages.dev for inspiration

## 🔮 Future Features

- [ ] Browser tabs
- [ ] Bookmark manager
- [ ] Download manager
- [ ] Extensions support
- [ ] Dark mode toggle
- [ ] More easter eggs
- [ ] Custom themes

## 💬 Feedback

Found a bug? Have a feature request? 
- Use the thumbs down button in the browser
- Open an issue on GitHub
- Contact mrratcool78

---

**"not all who wander are lost, some are just in Shrew"** - someone probably

🐀🕳️ Welcome to Shrew
