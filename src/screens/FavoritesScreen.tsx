import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import MovieItem from '../components/MovieItem';
import { Movie } from '../types/Movie';
import { getFavorites, removeFavorite } from '../services/storageService';
import { RootStackParamList } from '../types/Navigation';

type FavoritesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Favorites'>;
};

const FavoritesScreen = ({ navigation }: FavoritesScreenProps) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });

    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const favMovies = await getFavorites();
      setFavorites(favMovies);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoviePress = (movie: Movie) => {
    navigation.navigate('MovieDetail', { movieId: movie.imdbID });
  };

  const handleRemoveFavorite = async (movie: Movie) => {
    try {
      await removeFavorite(movie.imdbID);
      // Update state to remove the movie from the list
      setFavorites((currentFavorites) => 
        currentFavorites.filter((fav) => fav.imdbID !== movie.imdbID)
      );
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favorite movies added yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => (
          <MovieItem
            movie={item}
            onPress={handleMoviePress}
            isFavorite={true}
            onToggleFavorite={() => handleRemoveFavorite(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        testID="favorites-list"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  listContainer: {
    paddingVertical: 8,
  },
});

export default FavoritesScreen; 