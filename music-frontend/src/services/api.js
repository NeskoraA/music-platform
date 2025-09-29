import axios from 'axios';

const API_BASE = '/api/music';

const apiClient = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
});

const handleApiError = (error) => {
    if (error.response) {
        throw new Error(`API Error: ${error.response.status} - ${error.response.data}`);
    } else if (error.request) {
        throw new Error('Network error: Could not connect to the music service');
    } else {
        throw new Error(`Request error: ${error.message}`);
    }
};

export const musicAPI = {
    async healthCheck() {
        try {
            await apiClient.get('/health');
            return { status: 'UP' };
        } catch (error) {
            throw new Error('Music service is unavailable');
        }
    },

    async searchTracks(query, offset = 0, limit = 20) {
        try {
            const response = await apiClient.get(
                `/search/tracks?q=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}`
            );
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    async searchArtists(query, offset = 0, limit = 20) {
        try {
            const response = await apiClient.get(
                `/search/artists?q=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}`
            );
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    async searchAlbums(query, offset = 0, limit = 20) {
        try {
            const response = await apiClient.get(
                `/search/albums?q=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}`
            );
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    }
};