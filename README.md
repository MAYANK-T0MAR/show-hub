# show-hub

## Live Demo
Check out the live demo of the project [here](https://show-hub.vercel.app)

## Overview
A TV-show organizer platform with responsive UI built with **React, Node, Express, and MongoDB**, providing users with extensive features to manage lists, write reviews, participate in forums, and explore detailed show information.

## Table of Contents

- [Features](#features)
  - [General Features](#general-features)
  - [Lists Management](#lists-management)
  - [Reviews](#reviews)
  - [Forums](#forums)
  - [Data Source](#data-source)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [License](#license)

---

## Features

### General Features

1. **Login/Signup**: Secure login and signup with JWT-based authentication.
2. **Show Search**: Search for any show and view its detailed information.
3. **Show Details**: Includes:
   - Show poster and banner images.
   - Metadata like ratings, episode count, premiered and end dates, and summary.
   - Season and episode breakdowns with detailed episode information.
   - External links for additional show references.
4. **Top-Rated Episodes**: Display top-rated episodes and their details.
5. **Show Cast**: List of the cast members associated with the show.
6. **Add Shows to Lists**: Users can save shows to personal lists.
7. **User Search**: Search for other users, view their profiles, public lists, and reviews.

### Lists Management

1. **Default Lists**: Each user has three default lists:
   - **Plan to Watch**
   - **Watching**
   - **Completed**
2. **Custom Lists**: Users can create custom lists as per their preferences.
3. **Visibility Controls**: Set lists as public or private, with individual entries also having visibility settings.
4. **Editable List Data**:
   - Ratings, episode progress, start and finish dates.
   - Notes and visibility settings for lists and entries.

### Reviews

1. **Read Reviews**: Users can read reviews posted by others below each show’s details.
2. **Like/Dislike Reviews**: Users can interact with reviews by liking or disliking them.
3. **Rich Text Editor for Reviews**: Write reviews with HTML-like formatting, including:
   - Headings, quotes, code blocks, and media (images, videos, and YouTube embeds).
4. **Review Privacy**: Reviews can be set to public or private.

### Forums

1. **Show-Specific Forums**: Forums are available under each show for users to discuss topics.
2. **Reply Functionality**: Users can reply to forum posts and other replies.
3. **Rich Text Editor for Replies**: Supports text formatting similar to reviews:
   - Headings, italic, strikethrough, images, videos, and links.
4. **Create Forums with Categories**: Users can create forums under different categories related to shows or general topics.

### Data Source

This project utilizes the [TVMaze API](https://www.tvmaze.com/api) to fetch show data, including metadata, episode details, cast, and more.

---

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Rich Text Editor**: React-Quill

---

## Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to Project Directories**:
   - Frontend (React): `client`
   - Backend (Express/Node): `server`

3. **Install Dependencies**
   - Frontend:
     ```bash
     cd client
     npm install
     ```
   - Backend:
     ```bash
     cd server
     npm install
     ```

4. **Initialize Git in the Server Directory**
   - Initialize Git in the `server` folder for version control and commit tracking.
   ```bash
   cd server
   git init
   ```
## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

- `MONGODB_URI` – MongoDB connection string.
- `JWT_SECRET` – Secret key for JWT token generation.
- `PORT` – Port number for the server (default: 5000).
- `REACT_APP_API_URL` – Base URL for backend API (only needed in the `client` if communicating directly).

## Usage

1. **Start the Client**
   ```bash
   cd client
   npm start
   ```
2. **Start the Server**
   ```bash
   cd server
   npm run dev
   ```
Access the application by navigating to `http://localhost:3000` for the frontend and `http://localhost:5000` for the backend API.

## License

Distributed under the MIT License. See `LICENSE` for more information.
