import React from 'react';
import { Users, Music, Star, TrendingUp } from 'lucide-react';
import './ArtistList.css';

const ArtistList = ({ artists }) => {
    if (!artists || artists.length === 0) {
        return (
            <div className="empty-state">
                <Users size={48} className="empty-icon" />
                <h3>No artists found</h3>
                <p>Try adjusting your search terms</p>
            </div>
        );
    }

    const getPopularityStars = (popularity) => {
        const stars = Math.ceil(popularity / 20);
        return '★'.repeat(stars) + '☆'.repeat(5 - stars);
    };

    return (
        <div className="artist-grid">
            {artists.map((artist) => (
                <div key={artist.id} className="artist-card">
                    <div className="artist-image-container">
                        <div className="artist-image">
                            {artist.images?.[0]?.url ? (
                                <img
                                    src={artist.images[0].url}
                                    alt={artist.name}
                                    loading="lazy"
                                />
                            ) : (
                                <div className="image-placeholder">
                                    <Users size={32} />
                                </div>
                            )}
                        </div>
                        <div className="artist-overlay">
                            <button className="view-button">
                                View Artist
                            </button>
                        </div>
                    </div>

                    <div className="artist-info">
                        <h4 className="artist-name">{artist.name}</h4>

                        <div className="artist-stats">
                            <div className="stat">
                                <Users size={14} />
                                <span>{artist.followers?.total?.toLocaleString() || 0}</span>
                                <small>followers</small>
                            </div>

                            <div className="stat">
                                <TrendingUp size={14} />
                                <span>{artist.popularity}%</span>
                                <small>popularity</small>
                            </div>
                        </div>

                        {artist.genres && artist.genres.length > 0 && (
                            <div className="artist-genres">
                                <div className="genres-label">Genres:</div>
                                <div className="genres-list">
                                    {artist.genres.slice(0, 3).map((genre, index) => (
                                        <span key={index} className="genre-tag">
                                            {genre}
                                        </span>
                                    ))}
                                    {artist.genres.length > 3 && (
                                        <span className="genre-more">
                                            +{artist.genres.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="artist-popularity">
                            <div className="popularity-stars">
                                {getPopularityStars(artist.popularity)}
                            </div>
                            <span className="popularity-text">
                                {artist.popularity}/100
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ArtistList;