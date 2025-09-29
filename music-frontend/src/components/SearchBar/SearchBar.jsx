import React, { useState } from 'react';
import { Search, Music, Users, Disc } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ onSearch, searchTypes }) => {
    const [query, setQuery] = useState('');
    const [selectedType, setSelectedType] = useState('tracks');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim(), selectedType);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'tracks': return <Music size={18} />;
            case 'artists': return <Users size={18} />;
            case 'albums': return <Disc size={18} />;
            default: return <Search size={18} />;
        }
    };
    return (
        <div className="search-bar-container">
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-input-group glass">
                    <div className="search-icon">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for tracks, artists, or albums..."
                        className="search-input"
                    />

                    <div className="search-controls">
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="type-select"
                        >
                            {searchTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!query.trim()}
                        >
                            <Search size={16} />
                            Search
                        </button>
                    </div>
                </div>
            </form>

            <div className="search-types-grid">
                {searchTypes.map(type => (
                    <button
                        key={type.value}
                        className={`btn btn-glass type-button ${selectedType === type.value ? 'active' : ''}`}
                        onClick={() => setSelectedType(type.value)}
                    >
                        <span className="type-icon">{getTypeIcon(type.value)}</span>
                        <span className="type-label">{type.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SearchBar;