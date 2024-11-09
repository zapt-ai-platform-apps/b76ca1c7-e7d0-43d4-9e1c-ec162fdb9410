# New App

## Overview

New App is an application that allows users to create images from text prompts using AI. Users can sign in using ZAPT authentication and generate images based on any text they input.

## User Journeys

### 1. Sign In with ZAPT

1. User opens the app and is presented with a sign-in screen.
2. "Sign in with ZAPT" is displayed above the authentication component.
3. User clicks on their preferred sign-in method (email, Google, Facebook, or Apple).
4. Upon successful authentication, the user is redirected to the home page.

### 2. Generating an Image from Text

1. On the home page, the user sees a section labeled "Generate Image from Text".
2. User enters a text prompt into the input field.
3. User clicks the "Generate Image" button.
4. The app displays a loading indicator while the image is being generated.
5. Once the image is generated, it is displayed on the page.
6. The generated image is added to the gallery of generated images.
7. User can view and download the generated images.

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
