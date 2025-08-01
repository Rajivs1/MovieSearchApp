import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { MovieDetail } from '../types/Movie';
import { getMovieDetails } from '../services/movieService';
import { isFavorite, saveFavorite, removeFavorite } from '../services/storageService';
import { RootStackParamList } from '../types/Navigation';

type MovieDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MovieDetail'
>;

const MovieDetailScreen = ({ route }: MovieDetailScreenProps) => {
  const { movieId } = route.params;
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);

  const fetchMovieDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMovieDetails(movieId);
      setMovie(data);
    } catch (err) {
      setError('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  const checkFavoriteStatus = useCallback(async () => {
    const status = await isFavorite(movieId);
    setIsFav(status);
  }, [movieId]);

  useEffect(() => {
    fetchMovieDetails();
    checkFavoriteStatus();
  }, [fetchMovieDetails, checkFavoriteStatus]);

  const handleToggleFavorite = async () => {
    if (!movie) return;
    
    try {
      if (isFav) {
        await removeFavorite(movieId);
      } else {
        await saveFavorite(movie);
      }
      setIsFav(!isFav);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Failed to load movie details'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} testID="movie-detail-screen">
      <View style={styles.posterContainer}>
        <Image
          source={{
            uri: movie.Poster !== 'N/A'
              ? movie.Poster
              : 'https://via.placeholder.com/300x450?text=No+Image',
          }}
          style={styles.poster}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
          testID="detail-favorite-button"
        >
          <Text style={styles.favoriteIcon}>{isFav ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{movie.Title}</Text>
        <Text style={styles.year}>{movie.Year}</Text>

        <View style={styles.ratingContainer}>
          <View style={styles.ratingItem}>
            <Text style={styles.ratingValue}>{movie.imdbRating}</Text>
            <Text style={styles.ratingLabel}>IMDb</Text>
          </View>
          {movie.Metascore !== 'N/A' && (
            <View style={styles.ratingItem}>
              <Text style={styles.ratingValue}>{movie.Metascore}</Text>
              <Text style={styles.ratingLabel}>Metascore</Text>
            </View>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Released:</Text>
          <Text style={styles.infoValue}>{movie.Released}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Runtime:</Text>
          <Text style={styles.infoValue}>{movie.Runtime}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Rated:</Text>
          <Text style={styles.infoValue}>{movie.Rated}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Genre:</Text>
          <Text style={styles.infoValue}>{movie.Genre}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Director:</Text>
          <Text style={styles.infoValue}>{movie.Director}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Actors:</Text>
          <Text style={styles.infoValue}>{movie.Actors}</Text>
        </View>

        <View style={styles.plotContainer}>
          <Text style={styles.plotTitle}>Plot</Text>
          <Text style={styles.plot}>{movie.Plot}</Text>
        </View>
      </View>
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  posterContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: '#ddd',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 24,
    color: 'gold',
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  year: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  ratingItem: {
    marginRight: 20,
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  ratingLabel: {
    fontSize: 12,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 80,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
  plotContainer: {
    marginTop: 16,
  },
  plotTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  plot: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
});

export default MovieDetailScreen; 