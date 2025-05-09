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
-   Google Account Sign-in for user authentication.

## Tech Stack

-   Next.js (App Router)
-   React
-   TypeScript
-   Tailwind CSS
-   ShadCN UI Components
-   Lucide Icons
-   Firebase (Authentication)
-   Genkit for AI flows (Content Moderation)
-   Zustand (for client-side state management of posts/groups)

## Color Scheme

-   **Primary**: Deep Blue (`#1a237e`)
-   **Secondary**: Clean White (`#FFFFFF`) (for card backgrounds, etc.)
-   **Accent**: Teal (`#26a69a`) (for highlights, buttons, CTAs)
-   **Page Background**: Light Cool Gray
-   **Text**: Dark Desaturated Blue

## Getting Started

1.  **Set up Firebase:**
    *   Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
    *   In your Firebase project, go to **Project settings** (gear icon).
    *   Under the **General** tab, scroll down to "Your apps".
    *   Click on the Web icon (`</>`) to add a new web app or select an existing one.
    *   Register your app and copy the `firebaseConfig` object. You will need these values.
    *   Go to **Authentication** (in the Build section of the Firebase console).
    *   Click on the **Sign-in method** tab.
    *   Enable **Google** as a sign-in provider. You might need to provide a project support email.

2.  **Configure Environment Variables:**
    *   Rename the `.env` file in the root of the project to `.env.local`.
    *   Open `.env.local` and fill in your Firebase project's configuration values:
        ```env
        NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
        NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
        NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID" # Optional
        ```
    *   **Important for Google Sign-In:** In your Firebase project console, go to **Authentication** -> **Settings** -> **Authorized domains**. Ensure that `localhost` is listed (it usually is by default for development). If you deploy your app, you'll need to add your production domain here.

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

5.  **Run Genkit (for AI features, in a separate terminal):**
    ```bash
    npm run genkit:dev
    # or for watching changes
    npm run genkit:watch
    ```
    If you plan to use Genkit features that require Google AI (like the content moderation), you'll also need a `GOOGLE_API_KEY` in your `.env.local` file, obtained from Google AI Studio.

## Project Structure

-   `src/app/`: Contains all routes, pages, and layouts.
    -   `src/app/page.tsx`: Home feed.
    -   `src/app/groups/`: Group discovery and individual group pages.
    -   `src/app/account/page.tsx`: User account page for sign-in/out.
    -   `src/app/activity/page.tsx`: User activity feed.
-   `src/components/`: Shared UI components.
    -   `src/components/core/`: Application-specific core components (Header, PostCard, GroupCard, CreatePostDialog, etc.).
    -   `src/components/ui/`: ShadCN UI library components.
-   `src/lib/`: Utility functions, type definitions, and Firebase configuration.
    -   `src/lib/types.ts`: Core data structures.
    -   `src/lib/pseudonyms.ts`: Pseudonym generation logic.
    -   `src/lib/firebase.ts`: Firebase initialization.
-   `src/context/`: React context providers (e.g., `AuthContext.tsx`).
-   `src/store/`: Client-side state management (Zustand).
    -   `src/store/postsStore.ts`: Mock data and actions for posts, groups, and activities.
    -   `src/store/uiStore.ts`: State for UI elements like dialogs.
-   `src/ai/`: Genkit AI flows.
    -   `src/ai/flows/moderate-content.ts`: AI content moderation logic.

## Key Features Implemented

-   **Theming**: Updated `globals.css` with the specified color palette and dark mode support. `ThemeToggle` component for switching themes.
-   **Layout**: App shell with `AppHeader`, `BottomNavigationBar`, main content area.
-   **Authentication**: Google Sign-In via Firebase (`AuthContext.tsx`, Account page).
-   **Pseudonym Generation**: Utility in `src/lib/pseudonyms.ts`.
-   **Mock Data & Store**: `src/store/postsStore.ts` provides mock groups, posts, and activity feed items. Uses Zustand for state management.
-   **Post Display**: `PostCard.tsx` renders posts with text, images (URL), video (URL), audio (URL), links, likes/dislikes.
-   **Group Display**: `GroupCard.tsx` for group discovery, including background images.
-   **Navigation**: Home feed (`/`), Groups page (`/groups`), individual group pages (`/groups/[groupId]`), Account page (`/account`), Activity feed (`/activity`).
-   **Create Post**: Dialog (`CreatePostDialog.tsx`) allows authenticated users to create posts (text, image, video, audio, link), select a group.
-   **Create Group**: Dialog (`CreateGroupDialog.tsx`) allows authenticated users to create new groups with name, description, and optional background image URL.
-   **AI Moderation**: Integrated `moderateContent` AI flow into the post creation process.
-   **Markdown Rendering**: `MarkdownRenderer.tsx` for displaying Markdown in posts.
-   **Activity Feed**: `ActivityPage.tsx` and `ActivityItemCard.tsx` display user-specific activities. PostsStore manages mock activity data.
-   **Responsive Design**: UI adapts to mobile and desktop, including bottom navigation for mobile.

## Troubleshooting Authentication Errors
If you encounter authentication errors (e.g., "Authentication Error: Failed to get authentication state." or issues with Google Sign-In popups):
1.  **Double-check `.env.local`**: Ensure all `NEXT_PUBLIC_FIREBASE_` variables are correctly copied from your Firebase project settings.
2.  **Firebase Authentication Setup**:
    *   Verify that Google is enabled as a Sign-in provider in your Firebase project (Authentication -> Sign-in method).
    *   Confirm your project support email is set if required by Google provider.
3.  **Authorized Domains**: In Firebase console (Authentication -> Settings -> Authorized domains), make sure `localhost` is listed for development. If deploying, add your deployed domain.
4.  **API Key Restrictions**: If you have restricted your Firebase API key (Google Cloud Console -> APIs & Services -> Credentials), ensure it allows access from your web app's domain (and `localhost` for development) and has the necessary Firebase service permissions (e.g., Identity Toolkit API for authentication). For initial setup, it's often easier to leave the API key unrestricted and tighten security later.
5.  **Browser Pop-up Blockers**: Ensure your browser is not blocking the Google Sign-In pop-up.
6.  **Console Errors**: Check your browser's developer console for more specific error messages from Firebase.
```