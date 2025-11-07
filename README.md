---
# 🌐 Custom Browser Homepage

A **beautiful**, **feature-rich**, and **fully customizable** personal homepage built with **Next.js**, **React**, and **Tailwind CSS**.
Includes everything you’d want from a new tab — a clock, search bar, weather, notes, pinned sites, and dynamic backgrounds.

🚀 **Live Demo:** [**tabstart.netlify.app**](https://tabstart.netlify.app/)
---

## ✨ Features

- 🕒 **Real-time Clock & Calendar** – Always know the time and date
- 🔍 **Multi-Search Engine** – Google, DuckDuckGo, Bing, or Brave
- 🌦️ **Weather Widget** – Live conditions with location detection
- 🎨 **Theme Support** – Light, Dark, or System themes + custom accents
- 🖼️ **Dynamic Backgrounds** – Auto, manual, or custom images
- 📌 **Pinned Sites** – Quick access + drag-and-drop sorting
- 🗒️ **Notes Widget** – Quick notes with auto-save
- ⚡ **Command Palette** – Instant access with `Ctrl + K`
- 📱 **Fully Responsive** – Works on all devices
- 🔒 **Privacy Focused** – Everything stored locally

---

## 🧭 Set as Your Browser Homepage

### 🧩 Chrome / Edge

1. Go to **Settings → On startup**
2. Select **Open a specific page or set of pages**
3. Add your homepage URL:
   👉 [**https://tabstart.netlify.app/**](https://tabstart.netlify.app/)
4. _(Optional)_ Install [**New Tab Redirect**](https://chrome.google.com/webstore/detail/new-tab-redirect/icpgjfneehieebagbmdbhnlpiopdcmna) for new tab usage

### 🦊 Firefox

1. Open **Settings → Home**
2. Set “Homepage and new windows” to:
   👉 [**https://tabstart.netlify.app/**](https://tabstart.netlify.app/)
3. For new tabs, use [**New Tab Override**](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/)

### 🍏 Safari

1. Open **Preferences (Cmd + ,)** → **General**
2. Set **Homepage** to:
   👉 [**https://tabstart.netlify.app/**](https://tabstart.netlify.app/)
3. Enable **“Show homepage on new windows/tabs”**

---

## ⚙️ Configuration

### 🌤️ Weather Widget

1. Click the **⚙️ Settings** icon (top-right)
2. Open the **Weather** tab
3. Enter your city or API key

### 🧑‍💻 Customization

Access via **⚙️ Settings** icon:

- 🧭 **General** – Choose your search engine
- 🎨 **Appearance** – Theme, accent color, background
- 🌤️ **Weather** – API key, temperature units
- 💾 **Data** – Export/import or reset settings

---

## 🧑‍💻 Development

### 📋 Requirements

- Node.js **v18+**
- **npm**, **yarn**, or **pnpm**

### 🧱 Getting Started

```bash
git clone https://github.com/VortexDevX/custom-homepage.git
cd custom-homepage
npm install
npm run dev
```

Then open 👉 [http://localhost:3000](http://localhost:3000)

### 🏗️ Production Build

```bash
npm run build
```

---

## 🛠️ Tech Stack

| Layer           | Technology                       |
| --------------- | -------------------------------- |
| **Framework**   | Next.js 16 (App Router)          |
| **UI Library**  | React 19                         |
| **Language**    | TypeScript                       |
| **Styling**     | Tailwind CSS 4                   |
| **Animations**  | Framer Motion                    |
| **Icons**       | Lucide React                     |
| **Theming**     | next-themes                      |
| **Drag & Drop** | @dnd-kit/core, @dnd-kit/sortable |

---

## 🤝 Contributing

Pull requests and issues are always welcome.
Just keep your code clean — this project deserves it.

---

## 📜 License

Licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for details.

---
