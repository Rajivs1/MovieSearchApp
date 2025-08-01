import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie } from '../types/Movie';

const FAVORITES_KEY = 'favorites';

export const saveFavorite = async (movie: Movie): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const isAlreadyFavorite = favorites.some((fav) => fav.imdbID === movie.imdbID);
    
    if (!isAlreadyFavorite) {
      const updatedFavorites = [...favorites, movie];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    }
  } catch (error) {
    console.error('Error saving favorite:', error);
    throw error;
  }
};

export const removeFavorite = async (movieId: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter((movie) => movie.imdbID !== movieId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

export const getFavorites = async (): Promise<Movie[]> => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const isFavorite = async (movieId: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some((movie) => movie.imdbID === movieId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
}; 