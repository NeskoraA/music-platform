import React from 'react';
import { Music } from 'lucide-react';
import './LoadingSpinner.css';

const LoadingSpinner = ({
                            size = 'medium',
                            text = 'Loading...',
                            subtext = '',
                            type = 'loading'
                        }) => {
    return (
        <div className={`loading-spinner ${size} ${type}`}>
            <div className="spinner-container">
                {/* Центральная иконка */}
                <div className="spinner-core">
                    <Music className="spinner-icon" />
                </div>

                {/* Орбиты */}
                <div className="spinner-orbit orbit-1">
                    <div className="orbit-particle particle-1"></div>
                </div>
                <div className="spinner-orbit orbit-2">
                    <div className="orbit-particle particle-2"></div>
                </div>
                <div className="spinner-orbit orbit-3">
                    <div className="orbit-particle particle-3"></div>
                </div>
            </div>

            {/* Текст */}
            <div className="loading-content">
                <div className="loading-text">{text}</div>
                {subtext && <div className="loading-subtext">{subtext}</div>}
            </div>
        </div>
    );
};

export default LoadingSpinner;