# Custom Homepage (React + Next.js)

## Project Status

**IMPLEMENTED** - A modern, minimal homepage built with Next.js 16, React 19, and Tailwind CSS 4.

## Overview

This is a fully functional custom homepage application featuring:

- Clean, responsive UI with smooth Framer Motion animations
- Next.js App Router with TypeScript
- Local-first data storage (localStorage)
- Theme support (light/dark/system) with custom accent colors
- Dynamic backgrounds with auto/manual/custom modes
- Drag-and-drop functionality for pinned sites
- Integrated weather widget, notes, and command palette

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theming**: next-themes
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable

## Implemented Components

### Core Components

- **TopBar** - Real-time clock, date display, weather widget, theme toggle, notes toggle, settings button
- **SearchBar** - Multi-engine search (Google, DuckDuckGo, Bing, Brave) with instant search
- **WeatherWidget** - OpenWeatherMap integration with geolocation, manual city input, C/F toggle
- **ThemeToggle** - Light/Dark/System theme support with smooth transitions
- **PinnedGrid** - Drag-and-drop grid for pinned sites with add/edit/delete functionality
- **NotesWidget** - Draggable notes panel with localStorage persistence
- **CommandPalette** - Keyboard-driven quick actions (Ctrl+K)
- **SettingsModal** - Tabbed settings interface (General, Appearance, Weather, Data)

### Settings Tabs

- **GeneralTab** - Search engine selection, homepage behavior
- **AppearanceTab** - Theme selection, accent color picker, background modes (auto/manual/custom), overlay strength slider
- **WeatherTab** - API key management, unit toggle (C/F), city input
- **DataTab** - Export/import settings, reset to defaults

### Data Layer

- Custom `useAppSettings` hook with localStorage persistence
- Typed settings interface with schema versioning support
- Auto-save on settings changes
- Import/Export functionality for backup/restore

## Design & UX Features

### Visual Design

- **Glassmorphism** - Subtle backdrop blur effects on panels and buttons
- **Design Tokens** - CSS variables for theming (--accent, --text, --text-muted, --panel-bg, --panel-border)
- **Typography** - Geist Sans and Geist Mono fonts with proper font loading
- **Spacing** - Consistent spacing scale using Tailwind utilities
- **Shadows** - Layered shadow system for depth

### Animations

- **Framer Motion** - Page-level and component-level animations
- **Micro-interactions** - Hover, tap, and focus states with scale/rotate effects
- **Page Transitions** - Staggered entrance animations for content
- **Reduced Motion** - Respects user preference for reduced motion

### Accessibility

- **Keyboard Navigation** - Full keyboard support (Tab, Enter, Escape, Ctrl+K)
- **ARIA Labels** - Proper ARIA roles and labels for screen readers
- **Focus Management** - Focus trap in modals, visible focus indicators
- **Semantic HTML** - Proper heading hierarchy and semantic elements
- **Color Contrast** - Text contrast utility classes for readability

### Responsive Design

- **Mobile-First** - Responsive layouts that adapt to all screen sizes
- **Flexible Grid** - Auto-fit grid for pinned sites
- **Touch-Friendly** - Adequate touch targets for mobile devices

### Theming System

- **Three Modes** - Light, Dark, and System (auto-detect)
- **Custom Accents** - User-selectable accent color with color picker
- **Background Modes**:
  - **Auto** - Random background selection based on theme
  - **Manual** - Choose from gallery of light + dark backgrounds
  - **Custom** - Upload custom background image (base64)
- **Overlay Control** - Adjustable overlay strength (0-100%) for better text readability

## Features Breakdown

### Top Bar

- **Time & Date** - Live updating clock with formatted date
- **Weather Widget** - Current temperature, conditions, location with refresh
- **Action Buttons** - Notes toggle, theme toggle, settings access
- **Search Bar** - Centered search with engine selector dropdown

### Pinned Sites

- **Drag & Drop** - Reorder pins using @dnd-kit
- **CRUD Operations** - Add, edit, delete pinned sites
- **Visual Indicators** - Hover states, drag overlays
- **Grid Layout** - Responsive auto-fit grid
- **Data Persistence** - Auto-save to localStorage

### Notes Widget

- **Draggable Panel** - Repositionable notes widget
- **Simple Notes** - Add, delete notes with checkboxes
- **Persistence** - Position and content saved to localStorage
- **Toggle Visibility** - Show/hide from top bar button

### Weather Integration

- **OpenWeatherMap API** - Real-time weather data
- **Geolocation** - Auto-detect location or manual city input
- **Unit Toggle** - Switch between Celsius and Fahrenheit
- **Error Handling** - Graceful fallbacks for API failures
- **Refresh Button** - Manual weather update trigger

### Command Palette (Ctrl+K)

- **Quick Actions** - Toggle theme, open settings, toggle notes
- **Pin Navigation** - Quick access to pinned sites
- **Search** - Filter commands and pins
- **Keyboard Shortcuts** - Fully keyboard navigable

### Settings Management

- **Tabbed Interface** - Organized settings across 4 tabs
- **Real-time Preview** - Changes apply immediately
- **Import/Export** - Backup and restore all settings as JSON
- **Reset Defaults** - One-click reset to factory settings
- **Validation** - Input validation and error messages

## Performance Optimizations

### Implemented

- **Client-Side Rendering** - Fast initial page load with "use client" directive
- **Framer Motion** - Hardware-accelerated animations
- **Conditional Rendering** - Components only render when needed
- **Local Storage** - No external API calls except weather
- **Font Optimization** - next/font for Geist fonts with proper loading
- **CSS-in-JS** - Tailwind CSS 4 with PostCSS for minimal bundle size

### SEO Implementation

- **Metadata** - Comprehensive metadata in layout.tsx
- **Open Graph** - OG tags for social media sharing
- **Viewport** - Proper viewport configuration
- **Theme Color** - Dynamic theme color based on system preference
- **Semantic HTML** - Proper document structure
- **Accessibility** - WCAG AA compliance

### Privacy & Data

- **Local-First** - All user data stored in localStorage
- **No Tracking** - No analytics or tracking scripts
- **API Keys** - Weather API key stored locally (user-provided)
- **No Cookies** - Theme preference in localStorage only

## Background System

### Auto Mode

- Randomly selects from 7 backgrounds per theme
- Automatically switches when theme changes
- Supports both JPG and PNG formats

### Manual Mode

- Gallery view of all available backgrounds
- Preview thumbnails with selection indicator
- Separate collections for light and dark themes

### Custom Mode

- Upload custom background images
- Base64 encoding for localStorage
- File size validation
- Image preview before applying

### Overlay System

- Adjustable opacity (0-100%)
- Improves text readability over backgrounds
- Real-time preview in settings

## Data Management

### Storage Structure

```typescript
interface AppSettings {
  searchEngine: string;
  weatherApiKey?: string;
  weatherUnit: "C" | "F";
  weatherCity?: string;
  bgMode: "auto" | "manual" | "custom";
  selectedBg?: string;
  customBg?: string;
  overlayStrength: number;
  accent: string;
  pins: Pin[];
  notes: Note[];
  notesPos: { x: number; y: number };
}
```

### Import/Export

- Export all settings as JSON file
- Import previously exported settings
- Validation on import
- Merge or replace options

### Reset Functionality

- One-click reset to defaults
- Confirmation dialog before reset
- Preserves no data (clean slate)

## Current File Structure

```
📁 CustomHomePage/
├── 📁 app/
│   ├── 📄 favicon.ico
│   ├── 📄 globals.css
│   ├── 📄 layout.tsx
│   └── 📄 page.tsx
├── 📁 components/
│   ├── 📁 SettingsModal/
│   │   ├── 📄 AppearanceTab.tsx
│   │   ├── 📄 DataTab.tsx
│   │   ├── 📄 GeneralTab.tsx
│   │   ├── 📄 WeatherTab.tsx
│   │   └── 📄 index.tsx
│   ├── 📄 CommandPalette.tsx
│   ├── 📄 NotesWidget.tsx
│   ├── 📄 PinItem.tsx
│   ├── 📄 PinnedGrid.tsx
│   ├── 📄 SearchBar.tsx
│   ├── 📄 ThemeToggle.tsx
│   ├── 📄 TopBar.tsx
│   └── 📄 WeatherWidget.tsx
├── 📁 lib/
│   └── 📄 storage.ts
├── 📁 public/
│   └── 📁 backgrounds/
│       ├── 📁 dark/
│       │   ├── 📄 1.png
│       │   ├── 📄 2.png
│       │   ├── 📄 3.png
│       │   ├── 📄 4.png
│       │   ├── 📄 5.png
│       │   ├── 📄 6.png
│       │   └── 📄 7.png
│       └── 📁 light/
│           ├── 📄 1.jpg
│           ├── 📄 2.png
│           ├── 📄 3.jpg
│           ├── 📄 4.png
│           ├── 📄 5.png
│           ├── 📄 6.png
│           └── 📄 7.jpg
├── 📄 .gitignore
├── 📄 .hintrc
├── 📄 MARKDOWN.md
├── 📄 USAGE.md
├── 📄 eslint.config.mjs
├── 📄 next-env.d.ts
├── 📄 next.config.ts
├── 📄 package.json
├── 📄 postcss.config.mjs
├── 📄 structure.txt
└── 📄 tsconfig.json

```

## Implementation Status

### ✅ Completed Features

1. **Core Infrastructure**

   - Next.js 16 + React 19 + TypeScript setup
   - Tailwind CSS 4 with custom design tokens
   - next-themes for theme management
   - Framer Motion for animations

2. **Component Library**

   - All core components implemented
   - Settings modal with 4 tabs
   - Drag-and-drop functionality
   - Command palette

3. **Data Management**

   - localStorage-based persistence
   - useAppSettings custom hook
   - Import/export functionality
   - Reset to defaults

4. **Theming System**

   - Light/Dark/System modes
   - Custom accent colors
   - Three background modes
   - Overlay strength control

5. **Weather Integration**

   - OpenWeatherMap API integration
   - Geolocation support
   - Manual city input
   - C/F unit toggle

6. **Accessibility**

   - Keyboard navigation
   - ARIA labels and roles
   - Focus management
   - Reduced motion support

7. **Search & Navigation**
   - Multi-engine search (4 engines)
   - Command palette (Ctrl+K)
   - Quick actions

### 📝 Configuration

1. **Weather API** - Add OpenWeatherMap API key in Settings > Weather
2. **Search Engine** - Select preferred engine in Settings > General
3. **Theme** - Choose light/dark/system in top bar
4. **Backgrounds** - Configure in Settings > Appearance
5. **Accent Color** - Pick custom color in Settings > Appearance

## Future Enhancements (Optional)

### Potential Additions

- [ ] Search suggestions API integration
- [ ] Pin categories/folders
- [ ] Note labels and filtering
- [ ] Background presets/collections
- [ ] Server-side weather API proxy (needed)
- [ ] Image optimization (WebP/AVIF)
- [ ] Background lazy loading
- [ ] Dynamic imports for heavy components

## Known Limitations

1. **Weather API Key** - Stored client-side (visible in localStorage)
2. **Background Storage** - Custom backgrounds stored as base64 (localStorage limit ~5-10MB)
3. **No Cloud Sync** - All data is local to the browser
4. **Static Hosting** - Currently no server-side features

## Browser Support

- **Chrome/Edge** - Full support
- **Firefox** - Full support
- **Safari** - Full support
- **Mobile Browsers** - Responsive design supports all modern mobile browsers
