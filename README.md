# Chattera

Chattera is a Reddit-style social platform where users can create communities, share posts, and discuss topics through threaded comments.

The goal of the project is to demonstrate a full-stack social media architecture using modern web technologies, focusing on scalable data access, authentication, and clean frontend state management.

 **Live Demo:** [Chatterra](https://Chatterra.vercel.app/)
 
---

## Features

- User authentication (Email, Google, GitHub)
- Create and browse communities
- Create posts within communities
- Optional post images
- Comment on posts
- Reply to comments (threaded discussions)
- Upvote / downvote posts
- View user profiles
- Community-specific feeds
- Search posts, communities...
- Global feed
- Responsive UI

---

## Tech Stack

### Frontend
- React 19
- React Router
- React Query
- TailwindCSS
- Vite
- TypeScript

### Backend / Infrastructure
- Supabase
- PostgreSQL
- Row Level Security (RLS)
- Supabase Auth
- Supabase Storage

---

## Architecture Overview

Chattera follows a **client-server architecture** with Supabase acting as the backend service.

Frontend responsibilities:

- UI rendering
- Client routing
- Data fetching via React Query
- State management

Backend responsibilities:

- Authentication
- Database operations
- Access control via RLS
- Storage for post images


