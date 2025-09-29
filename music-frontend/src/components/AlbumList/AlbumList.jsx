import React from 'react';
import { Disc, Calendar, Music, Play, Headphones } from 'lucide-react';
import './AlbumList.css';

const AlbumList = ({ albums }) => {
    if (!albums || albums.length === 0) {
        return (
            <div className="empty-state">
                <Disc size={48} className="empty-icon" />
                <h3>No albums found</h3>
                <p>Try adjusting your search terms</p>
            </div>
        );
    }

    const formatReleaseDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getReleaseYear = (date) => {
        return new Date(date).getFullYear();
    };

    return (
        <div className="album-grid">
            {albums.map((album) => (
                <div key={album.id} className="album-card">
                    <div className="album-image-container">
                        <div className="album-image">
                            {album.images?.[0]?.url ? (
                                <img
                                    src={album.images[0].url}
                                    alt={album.name}
                                    loading="lazy"
                                />
                            ) : (
                                <div className="image-placeholder">
                                    <Disc size={32} />
                                </div>
                            )}
                        </div>
                        <div className="album-overlay">
                            <button className="play-album-button">
                                <Play size={24} fill="currentColor" />
                            </button>
                            <div className="album-actions">
                                <button className="action-button">
                                    <Headphones size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="album-type-badge">
                            {album.album_type}
                        </div>
                    </div>

                    <div className="album-info">
                        <h4 className="album-name">{album.name}</h4>
                        <p className="album-artist">
                            {album.artists.map(artist => artist.name).join(', ')}
                        </p>

                        <div className="album-meta">
                            <div className="meta-item">
                                <Calendar size={14} />
                                <span>{getReleaseYear(album.release_date)}</span>
                            </div>
                            <div className="meta-item">
                                <Music size={14} />
                                <span>{album.total_tracks} tracks</span>
                            </div>
                        </div>

                        <div className="album-details">
                            <div className="detail-row">
                                <span className="detail-label">Released:</span>
                                <span className="detail-value">
                                    {formatReleaseDate(album.release_date)}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Type:</span>
                                <span className="detail-value capitalize">
                                    {album.album_type}
                                </span>
                            </div>
                        </div>

                        <div className="album-popularity">
                            <div className="popularity-container">
                                <div className="popularity-label">Popularity</div>
                                <div className="popularity-bar">
                                    <div
                                        className="popularity-fill"
                                        style={{ width: `${album.popularity || 0}%` }}
                                    ></div>
                                </div>
                                <span className="popularity-percent">
                                    {album.popularity || 0}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AlbumList;