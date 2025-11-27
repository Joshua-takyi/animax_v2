# Infinite Scroll & UI Improvements

## Key Updates

### 1. **Infinite Scroll Implementation**

- **Component**: `src/components/InfiniteAnimeGrid.tsx`
- **Usage**: Replaced manual pagination/load-more buttons in:
  - `src/app/(with-nav)/movies/page.tsx`
  - `src/app/(with-nav)/tv-series/page.tsx`
  - `src/app/(with-nav)/special/page.tsx`
  - `src/app/(with-nav)/discover/page.tsx`
  - `src/app/(with-nav)/search/page.tsx`
  - `src/components/gen.tsx` (Genres)

### 2. **Profile & Recommendations**

- **Duplicate Keys Fixed**: Fixed `key` prop issues in `src/app/(with-nav)/profile/[id]/page.tsx` (Characters & Episodes) by combining ID with index.
- **Recommendations**: Updated `src/app/(with-nav)/anime/[id]/recommendations/page.tsx` to use the new minimal `AnimeCard` component.
- **Season Spotlight**: Updated `src/app/(with-nav)/seasonSpotlight.tsx` to use `AnimeCard` and removed extra wrapper for cleaner look.

### 3. **Code Cleanup**

- Removed redundant `MoviesCard` usage in updated files.
- Simplified data fetching logic by using `InfiniteAnimeGrid` which handles loading, error, and empty states internally.
- Consistent use of `GetAnime` action for paginated results.

## How to Verify

1. Navigate to **/movies**, **/tv-series**, **/discover**, or **/search**.
2. Scroll down to see more items loading automatically.
3. Check **/profile/[id]** (e.g., click a card) and verify no console warnings about duplicate keys.
4. Check **Recommendations** tab on a profile page to see the minimal card design.
