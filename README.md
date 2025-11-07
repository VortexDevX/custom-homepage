# Custom Homepage

A beautiful, feature-rich personal homepage built with Next.js, React, and Tailwind CSS. This customizable homepage includes a clock, search bar, weather widget, pinned sites, notes, and dynamic backgrounds.

![Custom Homepage Screenshot](public/screenshots/homepage.png)

## Features

- **Real-time Clock & Calendar** - Always know the time and date
- **Multi-search Engine** - Search with Google, DuckDuckGo, Bing, or Brave
- **Weather Widget** - Current weather conditions with location detection
- **Theme Support** - Light, Dark, or System theme with custom accent colors
- **Dynamic Backgrounds** - Auto-changing, manual selection, or custom backgrounds
- **Pinned Sites** - Quick access to your favorite websites with drag-and-drop reordering
- **Notes Widget** - Keep important notes handy with auto-saving
- **Command Palette** - Quick actions with Ctrl+K shortcut
- **Fully Responsive** - Works on desktop, tablet, and mobile devices
- **Privacy Focused** - All data stored locally in your browser

## Deployment Options

### Netlify (Recommended)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/VortexDevX/custom-homepage)

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/VortexDevX/custom-homepage)

## Setting as Your Browser Homepage

### Chrome/Edge

1. Open Chrome/Edge settings
2. Go to "On startup" section
3. Select "Open a specific page or set of pages"
4. Click "Add a new page" and enter your deployed URL
5. Optionally, install the [New Tab Redirect](https://chrome.google.com/webstore/detail/new-tab-redirect/icpgjfneehieebagbmdbhnlpiopdcmna) extension to use your homepage as the new tab page

### Firefox

1. Open Firefox settings
2. Go to "Home" section
3. Set "Homepage and new windows" to your deployed URL
4. For new tabs, you'll need an extension like [New Tab Override](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/)

### Safari

1. Open Safari preferences (Cmd + ,)
2. Go to "General" tab
3. Set "Homepage" to your deployed URL
4. Check "Show homepage when newly opened windows and tabs are created"

### Using Extensions for New Tab Replacement

#### Chrome/Edge Extension: New Tab Redirect

1. Install [New Tab Redirect](https://chrome.google.com/webstore/detail/new-tab-redirect/icpgjfneehieebagbmdbhnlpiopdcmna) from Chrome Web Store
2. Click on the extension icon
3. Select "Current Primary Page" or "Custom URL"
4. If using custom URL, enter your homepage URL

#### Firefox Extension: New Tab Override

1. Install [New Tab Override](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/) from Firefox Add-ons
2. Click on the extension icon
3. Choose "Load this page" and enter your homepage URL

## Configuration

### Weather Widget

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Click the settings icon (gear) in the top-right corner
3. Go to the "Weather" tab
4. Enter your API key
5. Optionally, set your location manually

### Customization

All settings are accessible through the gear icon in the top-right corner:

- **General**: Choose your preferred search engine
- **Appearance**: Select theme, accent color, and background options
- **Weather**: Configure weather API key and units
- **Data**: Export/import settings or reset to defaults

## Development

### Prerequisites

- Node.js 18 or later
- npm, yarn, or pnpm

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/VortexDevX/custom-homepage.git
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Deploying

This project works with any static hosting service:
- Netlify (recommended)
- Vercel
- GitHub Pages
- Any traditional web server

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theming**: next-themes
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.