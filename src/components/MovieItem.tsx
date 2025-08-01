import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, View } from 'react-native';
import { Movie } from '../types/Movie';

interface MovieItemProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (movie: Movie) => void;
}

const MovieItem = ({ movie, onPress, isFavorite, onToggleFavorite }: MovieItemProps) => {
  const defaultImage = 'https://via.placeholder.com/150x225?text=No+Image';
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(movie)}
      testID={`movie-item-${movie.imdbID}`}
    >
      <Image
        source={{ uri: movie.Poster !== 'N/A' ? movie.Poster : defaultImage }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.Title}
        </Text>
        <Text style={styles.year}>{movie.Year}</Text>
      </View>
      
      {onToggleFavorite && (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(movie)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          testID={`favorite-button-${movie.imdbID}`}
        >
          <Text style={styles.favoriteIcon}>{isFavorite ? '★' : '☆'}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  poster: {
    width: 70,
    height: 100,
    borderRadius: 4,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  year: {
    fontSize: 14,
    color: '#666',
  },
  favoriteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  favoriteIcon: {
    fontSize: 24,
    color: 'gold',
  },
});

export default MovieItem; 