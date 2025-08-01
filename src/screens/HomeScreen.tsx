import React, { useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import SearchBar from '../components/SearchBar';
import MovieItem from '../components/MovieItem';
import { Movie } from '../types/Movie';
import { searchMovies } from '../services/movieService';
import { saveFavorite, removeFavorite, isFavorite } from '../services/storageService';
import { RootStackParamList } from '../types/Navigation';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const isSearchInProgress = useRef(false);

  const checkFavoriteStatus = useCallback(async (moviesToCheck: Movie[]) => {
    try {
      const favoritesObj: Record<string, boolean> = { ...favorites };
      
      for (const movie of moviesToCheck) {
        if (favoritesObj[movie.imdbID] === undefined) {
          favoritesObj[movie.imdbID] = await isFavorite(movie.imdbID);
        }
      }
      
      setFavorites(favoritesObj);
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  }, [favorites]);

  const handleSearch = useCallback(async (query: string) => {
    // Prevent concurrent searches
    if (isSearchInProgress.current) return;
    isSearchInProgress.current = true;
    
    if (query !== searchQuery) {
      setMovies([]);
      setPage(1);
    }
    
    setSearchQuery(query);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await searchMovies(query, 1, false);
      
      if (response.Response === 'True') {
        setMovies(response.Search);
        setTotalResults(parseInt(response.totalResults, 10));
        checkFavoriteStatus(response.Search);
      } else {
        setMovies([]);
        setError(response.Error || 'No results found');
        setTotalResults(0);
        if (response.Error === 'Invalid API key!' || response.Error?.includes('API key')) {
          Alert.alert(
            'API Key Error',
            'Your OMDb API key appears to be invalid or inactive. Please make sure you have activated your key by clicking the verification link in your email.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setMovies([]);
      setTotalResults(0);
    } finally {
      // Ensure isLoading is set to false immediately
      setIsLoading(false);
      isSearchInProgress.current = false;
    }
  }, [searchQuery, checkFavoriteStatus]);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || movies.length >= totalResults || isSearchInProgress.current) return;
    isSearchInProgress.current = true;
    
    const nextPage = page + 1;
    setIsLoading(true);
    
    try {
      const response = await searchMovies(searchQuery, nextPage, true);
      
      if (response.Response === 'True') {
        setMovies(prevMovies => [...prevMovies, ...response.Search]);
        setPage(nextPage);
        checkFavoriteStatus(response.Search);
      } else if (response.Error) {
        console.error('Error loading more movies:', response.Error);
        setError('Error loading more movies');
      }
    } catch (err) {
      console.error('Exception loading more movies:', err);
      setError('Error loading more movies');
    } finally {
      setIsLoading(false);
      isSearchInProgress.current = false;
    }
  }, [isLoading, movies.length, totalResults, page, searchQuery, checkFavoriteStatus]);

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetail', { movieId: movie.imdbID });
  };

  const handleToggleFavorite = async (movie: Movie) => {
    try {
      const isFav = favorites[movie.imdbID];
      
      if (isFav) {
        await removeFavorite(movie.imdbID);
      } else {
        await saveFavorite(movie);
      }
      
      setFavorites({
        ...favorites,
        [movie.imdbID]: !isFav
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const renderFooter = () => {
    // Show loading spinner only when loading and no movies yet
    if (isLoading && movies.length === 0) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      );
    }
    
    // Show Load More button when:
    // 1. Have at least 3 movies
    // 2. More movies available to load
    // 3. Not currently loading
    if (movies.length >= 3 && movies.length < totalResults && !isLoading) {
      return (
        <View style={styles.loadMoreContainer}>
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={handleLoadMore}
            testID="load-more-button"
          >
            <Text style={styles.loadMoreButtonText}>Load More Movies</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    // Show loading for load more action
    if (isLoading && movies.length > 0) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Loading more movies...</Text>
        </View>
      );
    }
    
    return null;
  };

  const navigateToFavorites = () => {
    navigation.navigate('Favorites');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Movie Search</Text>
        <TouchableOpacity
          style={styles.favoritesButton}
          onPress={navigateToFavorites}
        >
          <Text style={styles.favoritesButtonText}>Favorites</Text>
        </TouchableOpacity>
      </View>
      
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      <FlatList
        data={movies}
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => (
          <MovieItem
            movie={item}
            onPress={handleMoviePress}
            isFavorite={favorites[item.imdbID]}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={renderFooter}
        testID="movies-list"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#007BFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  favoritesButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  favoritesButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  listContainer: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  errorText: {
    textAlign: 'center',
    padding: 16,
    color: 'red',
  },
  footerLoader: {
    paddingVertical: 20,
  },
  loadMoreContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loadMoreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
    fontSize: 14,
  },
});

export default HomeScreen; 