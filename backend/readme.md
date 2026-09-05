# EktuDekhi

A video hosting website backend, similar to YouTube. Built with Node.js, Express, and MongoDB, it handles user auth, video uploads, engagement (likes/comments), and channel subscriptions.

## Features

- **Auth** — register/login with JWT access & refresh tokens, hashed passwords (bcrypt), secure logout, token refresh, avatar/cover image uploads
- **Users** — update account details, change password, get channel profile (with subscriber counts), watch history
- **Videos** — upload video + thumbnail (via Cloudinary), list/paginate, update, delete, toggle publish status
- **Comments** — add, update, delete, paginated fetch per video
- **Likes** — toggle like on videos, comments, and tweets; fetch all liked videos
- **Subscriptions** — subscribe/unsubscribe to channels, fetch a channel's subscribers, fetch channels a user is subscribed to
- **Tweets** — create, update, delete tweets, fetch a user's tweets (paginated)
- **Playlists** — create playlists, fetch a user's playlists (paginated), fetch a playlist with its videos, add/remove videos, delete a playlist
- **Dashboard** — channel stats (total videos, views, subscribers, likes) and a paginated list of the logged-in creator's own videos (including unpublished)

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose (+ `mongoose-paginate-v2` for pagination)
- **Auth**: JSON Web Tokens (`jsonwebtoken`), `bcrypt` for password hashing
- **File uploads**: `multer` (local, temp) → `cloudinary` (persistent storage)
- **Other**: `cors`, `cookie-parser`, `dotenv`

## Project Structure

```
src/
├── controllers/     # request handlers (business logic)
├── routes/          # Express routers, mounted under /api/v1
├── models/          # Mongoose schemas (user, video, comment, like, subscription, tweet, playlist)
├── middlewares/      # auth (JWT) and multer (file upload) middleware
├── utils/            # ApiError, ApiResponse, asyncHandler, cloudinary helper
├── db/                # MongoDB connection
├── app.js            # Express app + route mounting
├── constant.js        # DB name
└── index.js           # entry point
```

## Getting Started

### Prerequisites

- Node.js
- A MongoDB instance (e.g. MongoDB Atlas)
- A Cloudinary account (for media storage)

### Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.sample` to `.env` and fill in your values:
   ```
   PORT=8000
   MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>
   CORS_ORIGIN=*
   ACCESS_TOKEN_SECRET=your-secret-key
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your-secret-key
   REFRESH_TOKEN_EXPIRY=10d

   CLOUDINARY_CLOUD_NAME=my-cloud
   CLOUDINARY_API_KEY=my-key
   CLOUDINARY_API_SECRET=my-secret
   ```
3. Run the dev server (auto-restarts with nodemon):
   ```bash
   npm run dev
   ```

The server starts on `http://localhost:<PORT>` (default `8000`).

## API Overview

All routes are prefixed with `/api/v1`. Routes marked 🔒 require a valid JWT (sent via cookies or `Authorization` header).

### Health check
| Method | Endpoint | Description |
|---|---|---|
| GET | `/healthcheck` | Service liveness check |

### Users — `/users`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user (avatar + optional cover image) |
| POST | `/login` | Log in, receive access & refresh tokens |
| POST | `/logout` 🔒 | Log out, clear tokens |
| POST | `/refresh-token` | Get a new access token from a refresh token |
| PATCH | `/change-password` 🔒 | Change current password |
| GET | `/get-user` 🔒 | Get current logged-in user |
| PATCH | `/update-account` 🔒 | Update account details |
| PATCH | `/avatar` 🔒 | Update avatar image |
| PATCH | `/cover-image` 🔒 | Update cover image |
| GET | `/c/:username` 🔒 | Get a channel profile (with subscriber info) |
| GET | `/watchHistory` 🔒 | Get the user's watch history |

### Videos — `/videos` 🔒 (all routes)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List/paginate all videos |
| POST | `/` | Upload a new video (video file + thumbnail) |
| GET | `/:videoId` | Get a video by id |
| PATCH | `/:videoId` | Update a video (thumbnail/details) |
| DELETE | `/:videoId` | Delete a video |
| PATCH | `/toggle/publish/:videoId` | Toggle a video's publish status |

### Comments — `/comments` 🔒 (all routes)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/:videoId` | Get paginated comments for a video |
| POST | `/:videoId` | Add a comment to a video |
| PATCH | `/c/:commentId` | Update a comment |
| DELETE | `/c/:commentId` | Delete a comment |

### Likes — `/likes` 🔒 (all routes)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/toggle/v/:videoId` | Toggle like on a video |
| POST | `/toggle/c/:commentId` | Toggle like on a comment |
| POST | `/toggle/t/:tweetId` | Toggle like on a tweet |
| GET | `/videos` | Get all videos liked by the current user |

### Subscriptions — `/subscriptions` 🔒 (all routes)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/c/:channelId` | Subscribe/unsubscribe to a channel |
| GET | `/c/:channelId` | Get a channel's subscribers |
| GET | `/u/:subscriberId` | Get channels a user is subscribed to |

### Tweets — `/tweets` 🔒 (all routes)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create a tweet |
| GET | `/user/:userId` | Get paginated tweets for a user |
| PATCH | `/:tweetId` | Update a tweet |
| DELETE | `/:tweetId` | Delete a tweet |

### Playlists — `/playlists` 🔒 (all routes)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create a playlist |
| GET | `/user/:userId` | Get paginated playlists for a user |
| GET | `/:playlistId` | Get a playlist by id, with its videos populated |
| DELETE | `/:playlistId` | Delete a playlist |
| PATCH | `/add/:videoId/:playlistId` | Add a video to a playlist |
| PATCH | `/remove/:videoId/:playlistId` | Remove a video from a playlist |

### Dashboard — `/dashboard` 🔒 (all routes)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/stats` | Get the logged-in channel's stats (videos, views, subscribers, likes) |
| GET | `/videos` | Get paginated list of the logged-in channel's own videos |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with nodemon |

## Author

Jonayed Al Habib
