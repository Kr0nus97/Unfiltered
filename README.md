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
    *   Rename the `.env` file (if it exists) or create a new file named `.env.local` in the root of your project.
    *   Open `.env.local` and fill in your Firebase project's configuration values. **Replace `YOUR_...` placeholders with your actual Firebase project credentials.**
        ```env
        NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
        NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
        NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID" # Optional, leave blank if not used
        ```
    *   **Example using the values you provided:**
        ```env
        NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyAzJ6w_mc3SnuZS9krfOefs0vBTIbYNMWA"
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="unfiltered-laoar.firebaseapp.com"
        NEXT_PUBLIC_FIREBASE_PROJECT_ID="unfiltered-laoar"
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="unfiltered-laoar.firebasestorage.app"
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="431771945516"
        NEXT_PUBLIC_FIREBASE_APP_ID="1:431771945516:web:78e8a290fc03b094261f89"
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=""
        ```
    *   **Important for Google Sign-In & "Invalid Domain" errors:**
        *   In your Firebase project console, go to **Authentication** -> **Settings** (tab) -> **Authorized domains**.
        *   Ensure that `localhost` is listed (it usually is by default for development).
        *   If you are running on a different port than the default (e.g. `localhost:9002`), ensure that domain is also listed.
        *   If deploying your app, you'll need to add your production domain here (e.g., `your-app-name.vercel.app` or `www.yourdomain.com`).
        *   The `authDomain` you set in `.env.local` (e.g., `unfiltered-laoar.firebaseapp.com`) should also inherently be authorized, but explicitly check the "Authorized domains" list.

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
If you encounter authentication errors (e.g., "Authentication Error: Failed to get authentication state.", issues with Google Sign-In popups, or **"Invalid Domain" / "auth/unauthorized-domain"** errors):

1.  **Verify `.env.local` Configuration**:
    *   Ensure all `NEXT_PUBLIC_FIREBASE_` variables are correctly copied from your Firebase project settings into the `.env.local` file at the root of your project.
    *   **Crucial**: After creating or modifying `.env.local`, **you MUST restart your Next.js development server** (`npm run dev`). Next.js only loads these variables at build time or server start.
    *   **Specifically for "Firebase: Error (auth/api-key-not-valid)"**: This means the `NEXT_PUBLIC_FIREBASE_API_KEY` in your `.env.local` file is either missing, incorrect, or not being loaded properly.
        *   Go to your Firebase project settings > General tab.
        *   Under "Your apps", select your web app.
        *   Find the `apiKey` value in the `firebaseConfig` object.
        *   Ensure this exact `apiKey` value is set for `NEXT_PUBLIC_FIREBASE_API_KEY` in your `.env.local` file.

2.  **Firebase Authentication Setup**:
    *   In the Firebase console, go to **Authentication** -> **Sign-in method** tab.
    *   Confirm that **Google** is **ENABLED** as a sign-in provider.
    *   Ensure your project support email is set if required by the Google provider.

3.  **Authorized Domains (VERY IMPORTANT for "auth/unauthorized-domain" errors)**:
    *   This is the most common cause for the "auth/unauthorized-domain" error.
    *   In the Firebase console, go to **Authentication** -> **Settings** (tab).
    *   Under the **Authorized domains** section, click "Add domain".
    *   **For local development (this project runs on `http://localhost:9002` by default):**
        *   **Add `localhost`**. This is usually added by default when you enable a sign-in provider, but **verify it is present**. This should typically cover all ports on localhost, including `9002`.
        *   **If `localhost` alone does not resolve the issue**, try explicitly adding `localhost:9002` as well. However, this is often not necessary.
        *   **Verify your `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` value** (e.g., `unfiltered-laoar.firebaseapp.com` from your `.env.local` file) is also listed in the "Authorized domains" in the Firebase console. Firebase usually adds this automatically when you set up the project or enable a sign-in provider, but it's crucial to confirm.
    *   **For deployed applications**: Add the domain where your application is hosted (e.g., `your-app-name.vercel.app`, `www.yourdomain.com`).
    *   If you recently added domains, it might take a few minutes for the changes to propagate.

4.  **API Key Restrictions (Advanced)**:
    *   If you have restricted your Firebase API key in the Google Cloud Console (APIs & Services -> Credentials):
        *   Ensure it allows access from your web app's domain (and `localhost` for development).
        *   Verify it has the necessary Firebase service permissions (e.g., "Identity Toolkit API" for authentication).
        *   For initial setup and troubleshooting, it's often easier to temporarily remove restrictions on the API key and then re-apply them one by one to identify the issue.

5.  **Browser Pop-up Blockers**: Ensure your browser is not blocking the Google Sign-In pop-up window. Try disabling pop-up blockers for your development site (`http://localhost:9002`).

6.  **Third-Party Cookies**: Some browsers or extensions might block third-party cookies, which can interfere with Google Sign-In. Try allowing third-party cookies for `google.com` and your `authDomain` (e.g., `unfiltered-laoar.firebaseapp.com`).

7.  **Console Errors**: Open your browser's developer console (usually F12). Look for more specific error messages from Firebase or your application. These can provide more clues beyond the toast notification.

8.  **Firebase Project Region/Location**: Ensure your Firebase project's region settings (if applicable, e.g., for Firestore/Functions) are compatible and there are no regional restrictions affecting authentication.

By systematically checking these points, especially ensuring `localhost` (and the project's `authDomain` like `your-project-id.firebaseapp.com`) is listed in the **Authorized Domains** in your Firebase Authentication settings, you should be able to resolve the "auth/unauthorized-domain" error.
