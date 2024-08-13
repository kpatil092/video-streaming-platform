# Video Streaming Application

A full-featured video streaming application built with ReactJS, React-query, TailwindCSS for the frontend, and NodeJS, ExpressJS, MongoDB, Cloudinary for the backend. This project aims to replicate the core functionalities of YouTube, providing users with a seamless video streaming experience.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
## Features

- **Responsive Design**: Fully responsive UI with TailwindCSS for an optimal experience on any device.
- **User Authentication**: Secure user authentication with JWT, allowing users to register, log in, and manage profiles.
- **Dynamic Video Feed**: Efficient data fetching and state management with React-query.
- **Video Management**: Upload, manage, and stream videos with Cloudinary integration.
- **Interactive Features**: Comment, like/dislike, create playlists, subscribe to channels, and receive notifications.

## Technologies Used

### Frontend
- ReactJS
- React-query
- TailwindCSS

### Backend
- NodeJS
- ExpressJS
- MongoDB
- Cloudinary

## Installation

### Prerequisites
- NodeJS
- MongoDB
- Cloudinary account for video/image storage

### Steps

1. **Clone the repository**
   ```
   git clone https://github.com/kpatil092/video-streaming-platform.git
   cd video-streaming-platform
   ```
2. **Install dependencies**

- Frontend

    ```
    cd client
    npm install
    ```

- Backend

    ```
    cd ../server
    npm install
    ```
    
3. Configure environment variables

    Create a .env file in the backend directory and add the following:

    ```
    MONGO_URI=your_mongo_db_uri
    JWT_SECRET=your_jwt_secret
    ACCESS_TOKEN_SECRET=access_key_secret
    ACCESS_TOKEN_EXPIRY=access_expiry_date
    REFRESH_TOKEN_SECRET=refresh_token_secret
    REFRESH_TOKEN_EXPIRY=refresh_expiry_date
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```
    
4. Run the application

- Backend
    ```
    cd server
    npm run start
    ```
- Frontend

    ```
    cd client
    npm run dev
    ```
5. Access the application
    
    Open your browser and navigate to http://localhost:5173

### Usage

- **User Registration & Login** : Create an account or log in to access personalized features.
- **Video Upload** : Upload videos directly from the platform.
- **Video Interaction** : Comment on, like/dislike videos, and subscribe to channels.
- **Create Playlists** : Organize videos into custom playlists.

### API Endpoints

#### Auth
- `POST /api/v1/auth/register`: Register a new user
- `POST /api/v1/auth/login`: Login a user

#### Videos
- `GET /api/v1/videos`: Get all videos
- `POST /api/v1/videos`: Upload a new video
- `GET /api/v1/videos/:id`: Get a specific video

#### Comments
- `POST /api/v1/comments`: Add a comment to a video
- `GET /api/v1/comments/:videoId`: Get all comments for a video

#### Users
- `GET /api/v1/users/:id`: Get user profile
- `PATCH /api/v1/users/:id`: Update user profile