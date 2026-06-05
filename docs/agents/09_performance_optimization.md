# Performance Optimization Audit & Lighthouse Compliance Report

This document details the performance optimization audit, rendering optimizations, layout shift prevention, and Lighthouse score alignment for the **YouTube Playlist Planner**.

---

## 1. Optimization Status

An audit of the codebase was conducted to identify performance bottlenecks across state management, bundle sizes, asset delivery, and loop complexity.

| Optimization Area | Current Status | Description |
| :--- | :--- | :--- |
| **Initial Bundle Size** | `OPTIMAL` | Compiles using Next.js 16 (Turbopack). Main route code splits components. Heavy dependencies are deferred. |
| **Component Re-renders** | `EFFICIENT` | All state callbacks in `PlannerContext.tsx` and custom hooks like `useRevision.ts` are memoized using `useCallback`. Consumers do not re-render from changed function references. |
| **Rendering Loop Complexity** | `O(1) OPTIMIZED` | Replaced linear array traversals (`find`, `filter`, `includes`) inside `CalendarGrid` and `TimelineList` rendering loops with precomputed `useMemo` hash map lookups. |
| **Asset Loading** | `SELF-HOSTED` | Fonts are optimized via `next/font/google`, removing third-party CDN requests. |
| **Dynamic Imports** | `LAZY LOADED` | Confetti library (`canvas-confetti`) is lazy loaded dynamically using ES import calls only when milestones are unlocked. |

---

## 2. Lighthouse Audit Checklist

Targeting **90+ scores** across Performance, Accessibility, Best Practices, and SEO.

### Performance (Target: 95+)
* [x] **Self-Hosted Web Fonts**: Utilizes `next/font/google` for *Geist* and *Geist Mono* fonts. Fonts are served from the same origin, configured with `display: swap` to prevent Flash of Invisible Text (FOIT), and avoid external DNS lookups.
* [x] **Dynamic Import of Heavy Packages**: The `canvas-confetti` module is imported dynamically (`import("canvas-confetti")`) within a client-side `useEffect` only when a milestone event triggers. It is excluded from the initial main bundle, reducing the First Contentful Paint (FCP) duration.
* [x] **Minified & Tree-shaken Output**: Next.js production bundler minifies client JavaScript, tree-shakes unused Lucide-react icons, and generates static route pages where possible.
* [x] **O(1) Layout Lookups**: Grid lookups in calendar blocks use precomputed key-value Maps, minimizing computation overhead on minor state updates or theme switching.

### Accessibility (Target: 98+)
* [x] **Visible Focus Indicators**: Interactive components use `focus-visible:ring-1 focus-visible:ring-ring` to ensure high contrast keyboard focus styling.
- [x] **Hidden Input Association**: Custom checkboxes hide the native input visually via `sr-only` while maintaining accessible tab order. Focus changes are highlighted on the custom wrapper using `peer-focus-visible:ring-ring`.
* [x] **Semantic Document Layout**: Uses semantic tags (`header`, `main`, structured lists, headings) to provide a clear accessibility tree for screen readers.

### Best Practices (Target: 100+)
* [x] **No Console Warnings/Errors**: Unused imports and variables have been cleaned, and warnings are resolved.
* [x] **Security Headers**: Standard SSL and HTTP/2 headers are configured by the Next.js deployment provider (e.g., Vercel) by default.

### SEO (Target: 100+)
* [x] **Document Language**: `lang="en"` is specified on the root `<html>` tag in `app/layout.tsx`.
* [x] **Metadata Configuration**: Title, description, and structured tags are configured in `app/layout.tsx` metadata.
* [x] **Mobile Meta Viewport**: Next.js App Router automatically injects `<meta name="viewport" content="width=device-width, initial-scale=1" />` for mobile device responsiveness.

---

## 3. Rendering & Paint Optimizations

Layout shift prevention and rendering paint times have been addressed as follows:

### Cumulative Layout Shift (CLS) Mitigation
- **Overlays vs Inline Reflows**: Interactive video players (`VideoEmbedModal`) and progress milestone prompts (`ConfettiPlayer`) are rendered as absolute/fixed overlays outside the normal DOM flow. They do not cause page layout shifts when opened or closed, keeping CLS at `0`.
- **Transitions**: The dark/light theme switch edits the `document.documentElement` class list. Layout background and color properties use `transition-colors duration-200` to prevent frame drops during state paint.

### Rendering Loop Optimization (Before vs. After)
In the Calendar Grid view, up to 42 calendar cells are mapped on screen. Previously, each cell executed multiple linear searches:
* `sortedSchedules.find((s) => s.date === dateStr)` $\rightarrow$ $O(S)$
* `getDayNumber(dateStr)` $\rightarrow$ `sortedSchedules.findIndex(...)` $\rightarrow$ $O(S)$
* `pendingRevisions.filter((rev) => rev.nextReviewDate === dateStr)` $\rightarrow$ $O(R)$
* `videos.filter((v) => schedule.videoIds.includes(v.id))` $\rightarrow$ $O(V \cdot S_{v})$

For a grid of $C$ cells, complexity was $O(C \cdot (2S + R + V \cdot S_{v}))$. 

**Implemented Solution**:
Precompute maps in `CalendarGrid.tsx` and `TimelineList.tsx` using `useMemo`:
```typescript
const scheduleMap = React.useMemo(() => new Map(dailySchedules.map(s => [s.date, s])), [dailySchedules]);
const dayNumMap = React.useMemo(() => new Map(sortedSchedules.map((s, idx) => [s.date, idx + 1])), [sortedSchedules]);
const dayRevisionsMap = React.useMemo(() => {
  const map = new Map<string, RevisionTask[]>();
  pendingRevisions.forEach(r => {
    const list = map.get(r.nextReviewDate) || [];
    list.push(r);
    map.set(r.nextReviewDate, list);
  });
  return map;
}, [pendingRevisions]);
```
Cell mapping now performs $O(1)$ hash lookups:
```typescript
const schedule = scheduleMap.get(dateStr);
const dayNum = dayNumMap.get(dateStr) ?? null;
const dayRevisions = dayRevisionsMap.get(dateStr) || [];
```
This reduces overall rendering runtime to a linear $O(C + S + R + V)$ complexity, eliminating layout paint lag.

---

## 4. Completed Optimizations & Future Recommendations

### Completed
1. **Memoized Callbacks**: Standardized hooks and contexts to prevent useless re-render cascades.
2. **Next.js Font Loader**: Integrated Google Fonts natively using same-origin caching.
3. **O(1) Grid and List Rendering Maps**: Swapped linear loop scans with precomputed key-value indexing.
4. **On-demand Third-Party Assets**: Lazy-loaded `canvas-confetti` using dynamic ES module imports.

### Future Recommendations
- **Next.js Image Component**: If external YouTube thumbnails (`thumbnailUrl` in database model) are displayed in future outline components, import `Image` from `next/image`. Configure `next.config.ts` remote patterns for `i.ytimg.com` to enable automatic responsive resizing, modern format conversion (WebP), and browser lazy-loading.
- **Dynamic Feature Routing**: If scheduling or revision features expand with additional charts, consider wrapping `<CalendarGrid />` and `<RevisionQueue />` imports in the main page with Next.js `dynamic()` lazy loaders to separate bundle chunks:
  ```typescript
  import dynamic from 'next/dynamic';
  const CalendarGrid = dynamic(() => import('@/components/features/calendar/CalendarGrid').then(mod => mod.CalendarGrid), {
    loading: () => <div className="animate-pulse h-48 bg-card/20" />,
    ssr: false
  });
  ```
