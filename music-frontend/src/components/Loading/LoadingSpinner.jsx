import React from 'react';
import { Music } from 'lucide-react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
    return (
        <div className={`loading-spinner ${size}`}>
            <div className="spinner-container">
                <div className="spinner-orb">
                    <Music className="spinner-icon" />
                </div>
                <div className="spinner-rings">
                    <div className="ring ring-1"></div>
                    <div className="ring ring-2"></div>
                    <div className="ring ring-3"></div>
                </div>
            </div>
            {text && <span className="loading-text">{text}</span>}
        </div>
    );
};

export default LoadingSpinner;