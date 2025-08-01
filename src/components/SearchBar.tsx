import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const SearchBar = ({ onSearch, isLoading = false }: SearchBarProps) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    if (searchText.trim().length === 0 || isLoading) return;
    
    onSearch(searchText.trim());
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for movies..."
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          testID="search-input"
          autoCapitalize="none"
          editable={!isLoading}
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchText('')}
            testID="clear-button"
            disabled={isLoading}
          >
            <Text style={[styles.clearButtonText, isLoading && styles.disabledText]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={[styles.searchButton, searchText.trim().length === 0 && styles.disabledButton]}
        onPress={handleSearch}
        disabled={isLoading || searchText.trim().length === 0}
        testID="search-button"
      >
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  clearButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#999',
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 15,
    height: 40,
  },
  disabledButton: {
    backgroundColor: '#a0c8ff',
  },
  disabledText: {
    color: '#ccc',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SearchBar; 