# New App

## Overview

New App is a user-friendly application that allows users to generate images from text prompts using AI. Users can enter any text prompt, and the app will generate an image based on that prompt. Users can also view and manage their previously generated images.

## User Journeys

### 1. Sign In with ZAPT

1. User opens the app and is presented with a sign-in screen.
2. User clicks on "Sign in with ZAPT" and uses their preferred method (email, Google, Facebook, or Apple) to sign in.
3. Upon successful authentication, the user is redirected to the home page.

### 2. Generating an Image from Text

1. On the home page, the user sees a section labeled "Generate Image from Text."
2. User enters a text prompt into the input field.
3. User clicks the "Generate Image" button.
4. The app displays a loading indicator while the image is being generated.
5. Once the image is generated, it is displayed on the page.
6. The app saves the prompt and the generated image URL to the user's history.
7. User can view and download the generated image.

### 3. Viewing Generated Images

1. Below the image generation section, the user sees a gallery of their previously generated images.
2. User can scroll through their generated images.
3. User can click on an image to view it in full size.
4. User can download or share the image.

### 4. Managing Sessions

1. User can sign out using the "Sign Out" button.
2. Upon signing out, the user is redirected to the sign-in screen.

## Additional Features

- Responsive design compatible with various screen sizes.
- Loading indicators during image generation.
- Error handling and user feedback for failed operations.
- Visual enhancements for a modern and intuitive user interface.

## External APIs Used

- **ZAPT AI Services**: Used for generating images based on user text inputs.
- **Supabase**: Used for user authentication.

## Environment Variables

The app requires the following environment variables:

- `NEON_DB_URL`: The database connection URL.
- `VITE_PUBLIC_SENTRY_DSN`: Sentry Data Source Name for error logging.
- `VITE_PUBLIC_APP_ENV`: The application environment (e.g., development, production).
- `VITE_PUBLIC_APP_ID`: The application ID used by ZAPT services.
