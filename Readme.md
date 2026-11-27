# Backend Final — YouTube Clone API

A production-style YouTube clone backend built with **Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Multer, and Cloudinary**, following the *Chai aur Backend* series.

## Features

- **Users & Auth:** Register (avatar & cover image upload), login, logout, refresh access tokens, change password, update profile/avatar/cover image, channel profile aggregation, and watch history.
- **Videos:** Publish videos with thumbnails, paginated search/sort/filter, view counter & watch history tracking, update details/thumbnail, toggle publish status, and delete with Cloudinary cleanup.
- **Comments & Likes:** Paginated video comments with CRUD and like toggles for videos, comments, and tweets, plus liked videos listing.
- **Subscriptions & Dashboard:** Subscribe/unsubscribe toggles, subscriber/subscribed channel lists, and creator analytics (total views, subscribers, videos, likes).
- **Playlists & Tweets:** Create/manage playlists (add/remove videos) and community posts (tweets).
- **Healthcheck:** `/api/v1/healthcheck` uptime endpoint.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.sample` to `.env` and fill in your MongoDB, JWT, and Cloudinary values.
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Base Routes (`/api/v1`)

- `/healthcheck`
- `/users`
- `/videos`
- `/comments`
- `/likes`
- `/tweets`
- `/subscriptions`
- `/playlist`
- `/dashboard`
