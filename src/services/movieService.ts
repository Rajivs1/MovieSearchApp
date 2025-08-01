import { Movie, MovieDetail } from '../types/Movie';

// API key from OMDb API
const API_KEY = '7a6eb685';
const API_URL = 'https://www.omdbapi.com/';

interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

// Create separate controllers for different types of requests
let searchController: AbortController | null = null;
let loadMoreController: AbortController | null = null;

// Helper function to handle network errors with cancelation
const fetchWithTimeout = async (url: string, timeout: number = 10000, isLoadMore: boolean = false) => {
  // Cancel previous request of the same type
  if (isLoadMore) {
    if (loadMoreController) {
      loadMoreController.abort();
    }
    loadMoreController = new AbortController();
  } else {
    if (searchController) {
      searchController.abort();
    }
    searchController = new AbortController();
  }
  
  const controller = isLoadMore ? loadMoreController : searchController;
  const timeoutId = setTimeout(() => {
    if (controller) {
      controller.abort();
    }
  }, timeout);
  
  try {
    const response = await fetch(url, { signal: controller?.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  } finally {
    // Clear the controller reference after request completes or fails
    if (isLoadMore) {
      loadMoreController = null;
    } else {
      searchController = null;
    }
  }
};

export const searchMovies = async (query: string, page: number = 1, isLoadMore: boolean = false): Promise<SearchResponse> => {
  try {
    const url = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
    const response = await fetchWithTimeout(url, 10000, isLoadMore);
    
    if (!response.ok) {
      throw new Error(`Network error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    // Don't throw error for aborted requests
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Request was canceled');
      return {
        Search: [],
        totalResults: "0",
        Response: "False",
        Error: "Search canceled"
      };
    }
    
    // Return a formatted error response
    return {
      Search: [],
      totalResults: "0",
      Response: "False",
      Error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

export const getMovieDetails = async (imdbID: string): Promise<MovieDetail> => {
  try {
    const url = `${API_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new Error(`Network error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}; 