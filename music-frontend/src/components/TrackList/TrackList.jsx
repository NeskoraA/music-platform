import React from 'react';
import { Play, Clock, Music, Heart } from 'lucide-react';
import './TrackList.css';

const TrackList = ({ tracks }) => {
    if (!tracks || tracks.length === 0) {
        return (
            <div className="empty-state">
                <Music size={48} className="empty-icon" />
                <h3>No tracks found</h3>
                <p>Try adjusting your search terms</p>
            </div>
        );
    }

    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    };

    return (
        <div className="track-list">
            {tracks.map((track, index) => (
                <div key={track.id} className="track-card">
                    <div className="track-number">
                        {index + 1}
                    </div>

                    <div className="track-info">
                        <div className="track-image">
                            {track.album?.images?.[0]?.url ? (
                                <img
                                    src={track.album.images[0].url}
                                    alt={track.album.name}
                                    loading="lazy"
                                />
                            ) : (
                                <div className="image-placeholder">
                                    <Music size={24} />
                                </div>
                            )}
                            <button className="play-button">
                                <Play size={16} fill="currentColor" />
                            </button>
                        </div>

                        <div className="track-details">
                            <h4 className="track-name">{track.name}</h4>
                            <p className="track-artists">
                                {track.artists.map(artist => artist.name).join(', ')}
                            </p>
                            <p className="track-album">{track.album.name}</p>
                        </div>
                    </div>

                    <div className="track-meta">
                        <div className="track-popularity">
                            <div className="popularity-bar">
                                <div
                                    className="popularity-fill"
                                    style={{ width: `${track.popularity}%` }}
                                ></div>
                            </div>
                            <span>{track.popularity}%</span>
                        </div>

                        <div className="track-stats">
                            <span className="track-duration">
                                <Clock size={14} />
                                {formatDuration(track.duration_ms)}
                            </span>
                            {track.preview_url && (
                                <button className="preview-button">
                                    Preview
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TrackList;