# UI/UX Design System & Layout Specification

## Project: YouTube Playlist Planner
**Author**: UI/UX Designer Agent  
**Status**: APPROVED  
**Date**: 2026-06-05  

---

## 1. Design Philosophy

The **YouTube Playlist Planner** user interface balances two distinct design systems to create a professional, low-friction environment for self-directed study:

1. **Linear-style Dark Theme Aesthetics**: Deep dark backgrounds (`#0a0a0c`), razor-thin micro-borders (`1px` with low-opacity borders), dark slate panels, clean monochrome scales, and sharp neon accents (glowing Indigo, Violet, and Amber). High contrast ratios and subtle shadows suggest a high-performance developer tool.
2. **Notion-level Structural Clarity**: Maximum data density without noise. Clean hierarchical typography, collapsible toggle sections, simple checkboxes, and plain-text statistics. Zero unnecessary icons; every visual element corresponds to an action.
3. **Mobile-First Responsiveness**: Designing for dual-screen learning. Users often watch YouTube on a secondary screen (laptop, tablet, TV) and tick off items or check reviews on a mobile device. Dashboard layouts collapse cleanly, maintaining immediate tap targets and sticky progress tracking.

---

## 2. Design System Tokens (Tailwind + CSS Variables)

The theme uses HSL CSS variables mapping to Tailwind classes. This enables real-time client-side toggling between **Dark** (default), **Light** (Notion-clean), and **System** mode.

### 2.1 CSS Theme Variables (`global.css`)

```css
@theme {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  
  --color-streak: hsl(var(--streak));
  --color-revision: hsl(var(--revision));
  --color-success: hsl(var(--success));
}

:root {
  /* --- Notion Light Mode --- */
  --background: 0 0% 100%;
  --foreground: 240 10% 4%;
  
  --card: 0 0% 98%;
  --card-foreground: 240 10% 4%;
  
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 4%;
  
  --primary: 262.1 83.3% 57.8%; /* Vibrant Violet */
  --primary-foreground: 210 20% 98%;
  
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 20% 98%;
  
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 262.1 83.3% 57.8%;
  
  --streak: 24 95% 53%; /* Flame Orange */
  --revision: 280 85% 55%; /* Spaced Repetition Purple */
  --success: 142.1 76.2% 36.3%; /* Progress Green */
}

.dark {
  /* --- Linear Dark Mode --- */
  --background: 240 10% 3.9%; /* Rich Near-Black */
  --foreground: 0 0% 98%;
  
  --card: 240 10% 5.9%; /* Faint Dark Grey Panel */
  --card-foreground: 0 0% 98%;
  
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  
  --primary: 263.4 70% 50.4%; /* Neon Violet */
  --primary-foreground: 210 20% 98%;
  
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  
  --border: 240 3.7% 12%; /* Thin Sleek Micro-Borders */
  --input: 240 3.7% 12%;
  --ring: 263.4 70% 50.4%;
  
  --streak: 24 95% 50%; /* Glowing Flame Orange */
  --revision: 280 85% 60%; /* Glowing Spaced Repetition Purple */
  --success: 142.1 70.6% 45.3%; /* Glowing Teal/Green */
}
```

### 2.2 Typography

Typography is set up for high technical readability and structured layout logic.
* **Sans-serif (UI & Text)**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`. Thin letterforms, clean scaling.
* **Monospace (Data, Time, Badges, Streaks)**: `JetBrains Mono`, `Fira Code`, `ui-monospace`, `SFMono-Regular`, `monospace`. Used for duration metrics, task lists (e.g. `15m 30s`), streak counts, dates, and order numbers.

```javascript
// Typography sizing scale
const typography = {
  xs: '0.75rem',     // 12px - Monospace details, sequence orders
  sm: '0.875rem',    // 14px - Main content text, inputs, dashboard checklists
  base: '1rem',      // 16px - Primary paragraph texts, subheaders
  lg: '1.125rem',    // 18px - Card headers, modal settings titles
  xl: '1.25rem',     // 20px - Section headings
  '2xl': '1.5rem',   // 24px - Dashboard totals, streak counters
  '3xl': '1.875rem', // 30px - Hero title segments
  '4xl': '2.25rem'   // 36px - Onboarding main titles
}
```

### 2.3 Micro-borders & Depth Shadows

Linear layouts rely heavily on high-precision dividers and glowing highlights instead of solid fills.
* **Borders**: Clean `1px solid var(--border)` with zero rounded edges (`rounded-none`) or extremely tight radius (`rounded-md` -> 6px).
* **Glow/Shadows**: 
  - Subtle cards: `shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]`
  - Neon Accent Hover Glow: `hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]`
  - Active Streak Glow: `shadow-[0_0_12px_rgba(249,115,22,0.2)]`

---

## 3. High-Level Layouts & Wireframes

### 3.1 Onboarding & Landing View

The starting view contains a clean logo header, a database provider selector, a prominent URL parser field, and pre-configured mock playlist selections for instant initialization.

#### Desktop Layout (1280px+)
* Centered main console (`max-w-3xl`) with absolute minimal decoration.
* Header contains: Logo, Database Mode Badge, and Dark Mode toggle.
* Main action card uses glowing micro-borders.

```
+-----------------------------------------------------------------------------------+
| [ytpp]                                               [Database Client: Local] [☼] |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|                   TURN YOUTUBE PLAYLISTS INTO RETENTIVE ROADMAPS                  |
|                   ----------------------------------------------                  |
|          Paste a YouTube playlist to automatically parse topics, schedule         |
|             daily sessions, and trigger spaced repetition review cards.           |
|                                                                                   |
|    +-------------------------------------------------------------------------+    |
|    | Paste playlist URL: [ https://youtube.com/playlist?list=...       ] [Go]|    |
|    +-------------------------------------------------------------------------+    |
|                                                                                   |
|                                     -- OR --                                      |
|                                                                                   |
|    Select a Mock Playlist:                                                        |
|    +------------------------+  +------------------------+  +--------------------+ |
|    | React JS Beginners     |  | Data Structures & Algo |  | Intro to Python    | |
|    | 25 Videos | 5 Topics   |  | 15 Videos | 3 Topics   |  | 10 Videos | 2 Topics| |
|    | [Start Mock Plan]      |  | [Start Mock Plan]      |  | [Start Mock Plan]  | |
|    +------------------------+  +------------------------+  +--------------------+ |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

#### Mobile Layout
* Stacked single-column card elements.
* Large buttons for mock playlists to permit easy touch tapping.

---

### 3.2 Playlist Customization & Setup View

Once a playlist is parsed or selected, this modal-style panel handles personalized parameters and renders real-time calculations.

#### Panel Structure (Two Column Desktop / Single Column Mobile Scroll)
* **Left Column (Inputs)**: Customization controls.
* **Right Column (Instant Calculation Summary)**: Estimated target output.

```
+-----------------------------------------------------------------------------------+
| Customizing: React JS Course for Beginners                                        |
+-----------------------------------------------------------------------------------+
| STUDY SETTINGS                       | PLAN PREVIEW                               |
|                                      |                                            |
| Playback Speed                       | Playlist: React JS Beginners               |
| [ 1.0x ] [ 1.25x ] [ 1.5x ] [ 2.0x ] | Total Videos: 25 videos                    |
|                                      | Raw Duration: 05h 00m                      |
| Daily Budget                         | Effective Duration: 03h 20m (at 1.5x)      |
| [ 30 min ] [ 45 min ] [ 60 min ]     |                                            |
| Custom: [ 45 ] minutes               | Target Days Required: 5 Active Days        |
|                                      | Projected End Date: Mon, June 15, 2026     |
| Active Study Days                    |                                            |
| [S] [M] [T] [W] [T] [F] [S]          |                                            |
| Active: Mon, Wed, Fri                |                                            |
|                                      |                                            |
| Start Date                           |                                            |
| [ 2026-06-08 ]                       |                                            |
|                                      |                                            |
| ------------------------------------ | ------------------------------------------ |
| [ Cancel ]                           |                    [ Generate My Roadmap ] |
+-----------------------------------------------------------------------------------+
```

---

### 3.3 Core Dashboard View

The workspace layout is divided into a left sidebar with summary statistics and active streaks, a central feed with the active checklist, and tabs to view the roadmap calendar or the revision queue.

#### Desktop Layout (Three-Column Dashboard)
* **Sidebar (Left)**: Active Streak widget, overall completion percentage, mock database provider badge.
* **Main Area (Center & Right)**: Tab bar switcher: `[ Checklist ] [ Roadmap Calendar ] [ Revision Queue (2) ]`.

```
+-----------------------------------------------------------------------------------+
| [ytpp] React JS Beginners  |  Progress: 48% (12/25 vids)  |  🔥 Streak: 5 days  | ☼|
+-----------------------------------------------------------------------------------+
| SIDEBAR STATS          | TABS: [ CHECKLIST ] [ ROADMAP CALENDAR ] [ REVISION QUEUE (1) ]|
|                        | -------------------------------------------------------- |
| Playlist: React JS     | Active Day: Day 3 (Friday, June 12)                      |
| Total: 25 videos       | Today's Target: 45 minutes remaining                     |
| Complete: 12 videos    |                                                          |
| Speed: 1.5x            | Today's Videos:                                          |
| Budget: 45m            | [ ] Video 5: React Props Explained (12 mins)      [Watch]|
| Remaining: 01h 45m     | [ ] Video 6: Handling Events in Components (15 mins) [Watch]|
|                        |                                                          |
| MILESTONES             | --- ALL TOPICS & COURSE OUTLINE ------------------------ |
| [x] First Step!        | v [x] Topic 1: Environment Setup (Completed)             |
| [x] Topic 1 Finished   |   [x] Video 1: Node & NPM Setup (10m)                    |
| [ ] Halfway (12/25)    |   [x] Video 2: CRA vs Vite (8m)                          |
|                        | > [ ] Topic 2: Core React Concepts                       |
| DATABASE CONTEXT       |   [x] Video 3: JSX Syntax Basics (15m)                   |
| Mode: Offline (Local)  |   [x] Video 4: Functional Components (20m)               |
| [ Migrate to Cloud ]   |   [ ] Video 5: React Props Explained (12m)               |
|                        |   [ ] Video 6: Handling Events (15m)                     |
+-----------------------------------------------------------------------------------+
```

#### Mobile Layout
* Sidebar stats collapse into a sticky top row: `48% [=======>...] 🔥 5d`.
* Main body handles vertical scrolling of checklist elements. Toggling folder tags expands/collapses list nodes instantly.

---

### 3.4 Roadmap Calendar View

The Roadmap view provides a grid representation of the learning plan, with revision indicators visible on appropriate scheduled review days.

#### Grid Representation (Month/Week Calendar View)

```
+-----------------------------------------------------------------------------------+
| TABS: [ CHECKLIST ] [ ROADMAP CALENDAR ] [ REVISION QUEUE (1) ]                   |
+-----------------------------------------------------------------------------------+
| View: [ Calendar Grid ]  [ Day-by-Day Timeline List ]                             |
|                                                                                   |
| June 2026                                                                         |
| +------------+------------+------------+------------+------------+------------+   |
| | Mon 8      | Tue 9      | Wed 10     | Thu 11     | Fri 12     | Sat 13     |   |
| | DAY 1      |            | DAY 2      |            | DAY 3      |            |   |
| | * Video 1  | (Off-Day)  | * Video 3  | (Off-Day)  | [!] today  | (Off-Day)  |   |
| | * Video 2  |            | * Video 4  |            | * Video 5  |            |   |
| |            |            |            |            | * Video 6  |            |   |
| | [Complete] |            | [Complete] |            | [Pending]  |            |   |
| +------------+------------+------------+------------+------------+------------+   |
| | Mon 15     | Tue 16     | Wed 17     | Thu 18     | Fri 19     | Sat 20     |   |
| | DAY 4      |            | DAY 5      |            | DAY 6      |            |   |
| | * Video 7  | (Off-Day)  | * Video 9  | (Off-Day)  | * Video 11 | (Off-Day)  |   |
| | * Video 8  |            | * Video 10 |            | * Video 12 |            |   |
| |            |            |            |            |            |            |   |
| | 🔂 Rev 1   |            |            |            | 🔂 Rev 2   |            |   |
| | (Topic 1)  |            |            |            | (Topic 1)  |            |   |
| +------------+------------+------------+------------+------------+------------+   |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

* **🔂 Rev Task Indicator**: Shows spaced-repetition schedules marked in purple (`--color-revision`). This visual separation alerts users to study reviews before watching new material.

---

### 3.5 Revision View (Spaced Repetition Cards)

Dedicated queue section for reviews. Uses Leitner step parameters, offering direct Pass/Fail actions.

```
+-----------------------------------------------------------------------------------+
| TABS: [ CHECKLIST ] [ ROADMAP CALENDAR ] [ REVISION QUEUE (1) ]                   |
+-----------------------------------------------------------------------------------+
| PENDING REVISIONS (1)                                                             |
| Complete these conceptual checks to commit topics to long-term memory.             |
|                                                                                   |
| +-------------------------------------------------------------------------------+ |
| | TOPIC REVISION CARD                                                           | |
| | Topic: Topic 1: Environment Setup                                             | |
| | Playlist: React JS Beginners                                                  | |
| | Current Leitner Box: Box 1 (1-Day Interval)                                   | |
| |                                                                               | |
| | Self-Check Task:                                                              | |
| | Describe node setup, difference between CRA & Vite, NPM start command.        | |
| | [ Review Notes/Videos ]                                                        | |
| |                                                                               | |
| | ----------------------------------------------------------------------------- | |
| | Next Scheduled Intervals:                                                     | |
| | [ PASS ] -> Move to Box 2 (Review in 3 days)                                  | |
| | [ FAIL ] -> Stay in Box 1 (Review again tomorrow)                             | |
| |                                                                               | |
| |   [ X ] I failed this check (Reset)         [ V ] I passed this check (Advance) | |
| +-------------------------------------------------------------------------------+ |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## 4. Component Hierarchy & Sub-components Breakdown

The application is structured into atomic presentation components, feature modules, and dashboard layouts.

```
src/
├── components/
│   ├── ui/                       # Atomic Primitives (No external state context)
│   │   ├── Button.tsx            # Theme-compliant custom buttons with focus indicators
│   │   ├── Checkbox.tsx          # Custom checkbox using SVGs for check indicator
│   │   ├── Card.tsx              # Content panels using micro-borders and shadows
│   │   ├── Progress.tsx          # Dual-theme styled progress bar with neon accents
│   │   ├── Dialog.tsx            # Overlay modals (used for Setup and Milestone alerts)
│   │   ├── Input.tsx             # Text inputs with micro-borders
│   │   └── Tabs.tsx              # Segmented control layout tabs switcher
│   │
│   ├── layouts/                  # Templates wrapping pages
│   │   ├── MainLayout.tsx        # Standard viewport wrapper (Header + Footer + DB status)
│   │   └── AuthLayout.tsx        # Centered auth view wrapper
│   │
│   ├── features/                 # Modular domain logic components
│   │   ├── onboarding/
│   │   │   ├── LandingHero.tsx   # Intro copywriting & layout
│   │   │   ├── PlaylistInput.tsx # URL input form and error display
│   │   │   └── MockSelector.tsx  # Grid of mock starter playlists
│   │   │
│   │   ├── scheduler/
│   │   │   ├── CustomizerForm.tsx# Speed, budget, active days select panel
│   │   │   └── PlanPreview.tsx   # Speed calculator output metrics
│   │   │
│   │   ├── dashboard/
│   │   │   ├── SidebarStats.tsx  # Completion stats & milestone records
│   │   │   ├── StreakFlame.tsx   # Glowing active streak widget
│   │   │   └── ChecklistFeed.tsx # Collapsible Topic folder node listings
│   │   │
│   │   ├── calendar/
│   │   │   ├── CalendarGrid.tsx  # Date-based grid view
│   │   │   └── TimelineList.tsx  # Linear chronological day-by-day scheduler
│   │   │
│   │   └── revision/
│   │       ├── RevisionQueue.tsx # List container for outstanding reviews
│   │       └── RevisionCard.tsx  # Spaced repetition pass/fail control card
│   │
│   └── shared/
│       ├── ConfettiPlayer.tsx    # Confetti triggers for milestone completions
│       └── VideoEmbedModal.tsx   # YouTube overlay player for viewing videos in-app
```

---

## 5. Micro-interactions & Visual Enhancements

To sustain motivation during long playlists, the application features subtle animations and hover transitions.

### 5.1 Streak Flame Glowing Effect
* **State**: Active (`streakCount > 0`).
* **UI**: Render the flame icon with the HSL color `--color-streak` (`#f97316`).
* **Micro-interaction**: Apply a soft animate pulse and text shadow:
  ```css
  .streak-active {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    filter: drop-shadow(0 0 6px hsl(var(--streak) / 0.4));
  }
  ```

### 5.2 Completion Checkbox Action
* **State**: Toggling a video checkbox.
* **UI**: The checkbox fills with `--color-success` (`#22c55e`), drawing a line-through video titles.
* **Micro-interaction**: Scale-up bump animation (e.g., standard Tailwind `scale-105 duration-100 ease-out`).

### 5.3 Milestone Celebrations
* **State**: Completed topic or playlist.
* **Micro-interaction**: Triggers a canvas-confetti blast centered at the cursor position (or full viewport). A dialog opens with a custom success message (e.g., "7-Day Streak Achieved!").

### 5.4 Database Mode Switcher Indicator
* **State**: Swapping between offline storage and Supabase sync.
* **UI**: A small indicator in the header:
  - **Local Mode**: Plain gray border, small monospaced tag: `[ db_local ]`.
  - **Cloud Mode**: Glowing blue border, tag: `[ db_cloud ]` with a green active connection dot.
* **Interactivity**: Clicking "Migrate to Cloud" triggers a sliding transition modal showing progress step logs.

### 5.5 View Transition Durations
* Content switches between tabs use clean CSS transitions to prevent visual stutter:
  - **Fade-In Transition**: `transition-opacity duration-200 ease-in-out`
  - **Slide-in Panels**: `transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1)`
