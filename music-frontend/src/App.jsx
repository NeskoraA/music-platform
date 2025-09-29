import React, { useState, useEffect } from 'react'
import { Music, Wifi, WifiOff, Search } from 'lucide-react'
import SearchBar from './components/SearchBar/SearchBar'
import TrackList from './components/TrackList/TrackList'
import ArtistList from './components/ArtistList/ArtistList'
import AlbumList from './components/AlbumList/AlbumList'
import LoadingSpinner from './components/Loading/LoadingSpinner'
import AudioVisualizer from './components/Background/AudioVisualizer';
import Pagination from './components/Pagination/Pagination';
import { musicAPI } from './services/api'
import './App.css'

function App() {
    const [searchResults, setSearchResults] = useState(null)
    const [searchType, setSearchType] = useState('tracks')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [serviceStatus, setServiceStatus] = useState('checking')
    const [currentQuery, setCurrentQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(20)
    const [totalItems, setTotalItems] = useState(0)

    useEffect(() => {
        checkServiceHealth()
    }, [])

    const checkServiceHealth = async () => {
        try {
            await musicAPI.healthCheck()
            setServiceStatus('healthy')
        } catch (err) {
            setServiceStatus('unavailable')
        }
    }

    const handleSearch = async (query, type, page = 1, limit = itemsPerPage) => {
        if (!query.trim()) return

        setLoading(true)
        setError(null)
        setSearchType(type)
        setCurrentQuery(query)
        setCurrentPage(page)

        const offset = (page - 1) * limit

        try {
            let results
            switch (type) {
                case 'tracks':
                    results = await musicAPI.searchTracks(query, offset, limit)
                    break
                case 'artists':
                    results = await musicAPI.searchArtists(query, offset, limit)
                    break
                case 'albums':
                    results = await musicAPI.searchAlbums(query, offset, limit)
                    break
                default:
                    results = await musicAPI.searchTracks(query, offset, limit)
            }

            setSearchResults(results)

            // Update total items count based on search type
            const items = results.tracks?.items || results.artists?.items || results.albums?.items || []
            const total = results.tracks?.total || results.artists?.total || results.albums?.total || items.length
            setTotalItems(total)

        } catch (err) {
            setError(err.message || 'Failed to fetch data')
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            handleSearch(currentQuery, searchType, newPage, itemsPerPage)
        }
    }

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage)
        // Reset to first page when changing items per page
        handleSearch(currentQuery, searchType, 1, newItemsPerPage)
    }

    const getResultCount = (data, type) => {
        if (!data) return 0
        switch (type) {
            case 'tracks': return data.tracks?.items?.length || 0
            case 'artists': return data.artists?.items?.length || 0
            case 'albums': return data.albums?.items?.length || 0
            default: return 0
        }
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage)

    const searchTypes = [
        { value: 'tracks', label: 'Tracks', icon: '🎵' },
        { value: 'artists', label: 'Artists', icon: '🎤' },
        { value: 'albums', label: 'Albums', icon: '💿' }
    ]

    return (
        <div className="app">
            <AudioVisualizer />
            {/* Header */}
            <header className="app-header glass-dark">
                <div className="header-content">
                    <div className="logo">
                        <Music className="logo-icon"/>
                        <h1>Spotify Explorer</h1>
                    </div>
                    <div className={`service-status ${serviceStatus}`}>
                        {serviceStatus === 'healthy' ? <Wifi size={16}/> : <WifiOff size={16}/>}
                        <span>Backend {serviceStatus}</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="app-main">
                <div className="container">
                    {/* Search Section */}
                    <section className="search-section">
                        <SearchBar
                            onSearch={(query, type) => handleSearch(query, type, 1, itemsPerPage)}
                            searchTypes={searchTypes}
                        />
                    </section>

                    {/* Status Messages */}
                    {loading && (
                        <div className="status-message loading">
                            <LoadingSpinner
                                text={`Searching ${searchType}...`}
                                subtext="This may take a few seconds"
                                size="large"
                            />
                        </div>
                    )}

                    {error && (
                        <div className="status-message error">
                            <span>{error}</span>
                            <button onClick={checkServiceHealth} className="retry-btn">
                                Retry Connection
                            </button>
                        </div>
                    )}

                    {/* Results Section */}
                    <section className="results-section">
                        {!searchResults && !loading && !error && (
                            <div className="welcome-message">
                                <Search size={64} className="welcome-icon" />
                                <h2>Discover New Music</h2>
                                <p>Search for tracks, artists, or albums to explore the Spotify universe</p>
                            </div>
                        )}

                        {searchResults && (
                            <>
                                <div className="results-header">
                                    <h2>
                                        {searchType === 'tracks' && '🎵 Tracks'}
                                        {searchType === 'artists' && '🎤 Artists'}
                                        {searchType === 'albums' && '💿 Albums'}
                                    </h2>
                                    <span className="results-count">
                                        {totalItems.toLocaleString()} total results •
                                        Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} •
                                        Page {currentPage} of {totalPages}
                                    </span>
                                </div>

                                {searchType === 'tracks' && (
                                    <TrackList tracks={searchResults.tracks?.items || []} />
                                )}
                                {searchType === 'artists' && (
                                    <ArtistList artists={searchResults.artists?.items || []} />
                                )}
                                {searchType === 'albums' && (
                                    <AlbumList albums={searchResults.albums?.items || []} />
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        itemsPerPage={itemsPerPage}
                                        onItemsPerPageChange={handleItemsPerPageChange}
                                    />
                                )}
                            </>
                        )}
                    </section>
                </div>
            </main>
        </div>
    )
}

export default App