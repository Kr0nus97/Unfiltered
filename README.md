# UnFiltered - Anonymous Social Platform

This is a Next.js starter project for UnFiltered, an anonymous social media platform, built in Firebase Studio.

To get started, take a look at `src/app/page.tsx`.

## Overview

UnFiltered allows users to share opinions and content anonymously within interest-based groups. It features:

-   Dynamic pseudonym generation ("Adjective_Object") for each post.
-   Anonymous posting of text (Markdown supported), images (via URL), and links.
-   Like/dislike feedback mechanism for posts.
-   AI-powered content moderation to flag potentially harmful content.
-   Organization of discussions into groups with search/discovery functionality.

## Tech Stack

-   Next.js (App Router)
-   React
-   TypeScript
-   Tailwind CSS
-   ShadCN UI Components
-   Lucide Icons
-   Genkit for AI flows (Content Moderation)
-   Zustand (for client-side state management of posts/groups)

## Color Scheme

-   **Primary**: Deep Blue (`#1a237e`)
-   **Secondary**: Clean White (`#FFFFFF`) (for card backgrounds, etc.)
-   **Accent**: Teal (`#26a69a`) (for highlights, buttons, CTAs)
-   **Page Background**: Light Cool Gray
-   **Text**: Dark Desaturated Blue

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

3.  **Run Genkit (for AI features, in a separate terminal):**
    ```bash
    npm run genkit:dev
    # or for watching changes
    npm run genkit:watch
    ```

## Project Structure

-   `src/app/`: Contains all routes, pages, and layouts.
    -   `src/app/page.tsx`: Home feed.
    -   `src/app/groups/`: Group discovery and individual group pages.
-   `src/components/`: Shared UI components.
    -   `src/components/core/`: Application-specific core components (Header, PostCard, GroupCard, CreatePostDialog).
    -   `src/components/ui/`: ShadCN UI library components.
-   `src/lib/`: Utility functions and type definitions.
    -   `src/lib/types.ts`: Core data structures.
    -   `src/lib/pseudonyms.ts`: Pseudonym generation logic.
-   `src/store/`: Client-side state management (Zustand).
    -   `src/store/postsStore.ts`: Mock data and actions for posts and groups.
-   `src/ai/`: Genkit AI flows.
    -   `src/ai/flows/moderate-content.ts`: AI content moderation logic.

## Key Features Implemented

-   **Theming**: Updated `globals.css` with the specified color palette.
-   **Layout**: Basic app shell with `AppHeader`, main content area, and footer.
-   **Pseudonym Generation**: Utility in `src/lib/pseudonyms.ts`.
-   **Mock Data & Store**: `src/store/postsStore.ts` provides mock groups and posts, and uses Zustand for state management.
-   **Post Display**: `PostCard.tsx` component renders posts with text, images (URL), links, likes/dislikes.
-   **Group Display**: `GroupCard.tsx` for group discovery.
-   **Navigation**: Home feed (`/`), Groups page (`/groups`), and individual group pages (`/groups/[groupId]`).
-   **Create Post**: A dialog (`CreatePostDialog.tsx`) allows users to create posts, select a group, and add text/image/link.
-   **AI Moderation**: Integrated `moderateContent` AI flow into the post creation process.
-   **Markdown Rendering**: `MarkdownRenderer.tsx` for displaying Markdown in posts.
