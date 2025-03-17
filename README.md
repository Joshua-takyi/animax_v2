# Animax - Anime Discovery Platform

A modern, feature-rich anime discovery platform built with Next.js 15 and TypeScript. Explore trending anime, movies, TV series, and get personalized recommendations.

## ✨ Key Features

### Content Discovery

- 🔥 **Trending Anime Section**: Stay updated with currently popular shows
- 📺 **Now Airing**: Track currently airing anime series
- 🎬 **Movies & TV Series**: Dedicated sections for anime movies and TV shows
- 🌟 **Popular Rankings**: Discover top-rated and most favorite anime
- 🎯 **Personalized Recommendations**: Get tailored anime suggestions
- 💬 **Telegram Integration**: Find and join anime-related Telegram channels with smart caching and search relevance

### Search & Navigation

- 🔍 **Advanced Search**: Find anime by title, genre, or rating
- 🏷️ **Genre Filtering**: Browse anime by specific genres
- 📱 **Responsive Design**: Seamless experience across all devices
- 🌓 **Dark/Light Mode**: Choose your preferred theme

### Detailed Information

- 📋 **Comprehensive Details**: Synopsis, episodes, ratings, and more
- 🎭 **Character Information**: Learn about anime characters
- 🎥 **Video Integration**: Watch trailers and previews
- 📊 **Dynamic Loading**: Smooth infinite scroll for content browsing

### Technical Features

- ⚡ **Server-Side Rendering**: Fast page loads with Next.js
- 🔄 **Real-time Updates**: Live data with React Query
- 💾 **Data Caching**:
  - Optimized performance with MongoDB caching
  - Smart caching for Telegram search results
  - Relevance-based search result ranking
- 🎨 **Modern UI**:
  - Sleek design with Tailwind CSS
  - Smooth animations with Framer Motion
  - Responsive loading states and error handling
- 🔒 **Type Safety**:
  - Robust codebase with TypeScript
  - Strongly typed API responses
  - Interface-driven development

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**:
  - Tailwind CSS
  - Shadcn UI Components
  - Custom animations with Framer Motion
- **State Management**:
  - React Query for server state
  - React Context for app state
- **Database**: MongoDB
- **APIs**:
  - Jikan APIt API Integration
  - Google Custom Search API for Telegram channels
  - Telegram Bot API integration
- **Development Tools**:
  - ESLint for code quality
  - Prettier for code formatting

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/Joshua-takyi/animax_v2.git
   cd animax
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_API_URL=your_api_url
   MONGODB_URI=your_mongodb_uri
   GOOGLE_API_KEY=your_google_api_key
   GOOGLE_CX_ID=your_google_custom_search_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
src/
├── app/                # Next.js 15 app router pages
├── components/         # Reusable UI components
├── lib/               # Utility functions
├── models/            # MongoDB schemas
├── types/             # TypeScript definitions
└── services/          # API services and integrations
```

## 🔧 Technical Implementation

### Telegram Channel Search

- MongoDB aggregation pipeline for intelligent text matching
- Relevance scoring system based on exact, prefix, and partial matches
- Automatic background caching of search results
- Optimistic UI updates with loading states
- Mobile-responsive grid layout with skeleton loading

### Performance Optimizations

- React Query with custom cache configuration
- Parallel data fetching where possible
- Lazy loading of images and iframes
- Debounced search inputs
- Infinite scrolling with intersection observer

### Error Handling

- Graceful fallbacks for API failures
- Typed error boundaries
- Custom error states for different scenarios
- Network status monitoring

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
