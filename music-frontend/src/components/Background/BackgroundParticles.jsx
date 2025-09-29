import React, { useEffect, useState } from 'react';
import './BackgroundParticles.css';

const BackgroundParticles = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const newParticles = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            size: Math.random() * 60 + 20,
            left: Math.random() * 100,
            top: Math.random() * 100,
            animationDelay: Math.random() * 5,
            duration: Math.random() * 10 + 10
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="background-particles">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="particle"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                        animationDelay: `${particle.animationDelay}s`,
                        animationDuration: `${particle.duration}s`
                    }}
                />
            ))}
        </div>
    );
};

export default BackgroundParticles;