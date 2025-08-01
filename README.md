# Movie Search App

A React Native mobile application for searching movies using the OMDb API. This app allows users to search for movies, view detailed information, and manage their favorite movies list.

## ✅ Assignment Requirements Fulfilled

### Core Requirements:
- ✅ **Search bar to search for movies by title** - Functional search with clear button
- ✅ **OMDb API integration** - Uses https://www.omdbapi.com/ for movie data
- ✅ **List view with name and poster** - Displays search results on same page as search bar
- ✅ **Movie details on separate screen** - Shows poster, title, year, genre, rating, and more

### Bonus Features:
- ✅ **Favorite movies with AsyncStorage** - Save/remove favorites locally
- ✅ **Load more movies** - Manual "Load More" button for pagination

## Features

- **Movie Search**: Search for movies by title with instant results
- **Movie List**: View search results with movie posters and basic information
- **Movie Details**: Detailed view showing poster, title, year, genre, ratings, plot, cast, director, and more
- **Favorites System**: Save favorite movies and view them in a dedicated favorites screen
- **Load More**: Manual pagination to load additional search results
- **Offline Storage**: Favorites persisted using AsyncStorage
- **Clean UI**: Modern, intuitive interface with smooth navigation
- **Error Handling**: Graceful error handling for network issues and invalid searches

## Screenshots

(Screenshots will be added when the app is running)

## Installation

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- React Native development environment setup (Android Studio / Xcode)

### Getting Started

1. Clone this repository:
   ```
   git clone https://github.com/your-username/MovieSearchApp.git
   cd MovieSearchApp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Get an API key from OMDb:
   - Go to [OMDb API](https://www.omdbapi.com/) and request a free API key
   - Open `src/services/movieService.ts` and replace `'7a6eb685'` with your actual API key
   - **Note**: The current API key is temporary and may have usage limits

4. Start the Metro bundler:
   ```
   npm start
   ```

5. Run the app:

   For iOS:
   ```
   npm run ios
   ```

   For Android:
   ```
   npm run android
   ```

## API Information

This app uses the [OMDb API](https://www.omdbapi.com/) to fetch movie data. The API provides:
- Movie search by title
- Detailed movie information
- Movie posters and ratings
- Plot summaries and cast information

## Tech Stack

- React Native
- TypeScript
- React Navigation
- AsyncStorage for local storage
- OMDb API for movie data

## Project Structure

- `src/components/`: Reusable UI components
- `src/screens/`: App screens
- `src/services/`: API and storage services
- `src/types/`: TypeScript type definitions
- `src/utils/`: Utility functions

## License

This project is licensed under the MIT License.
