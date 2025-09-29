import React, { useEffect, useRef } from 'react';
import './AudioVisualizer.css';

const AudioVisualizer = () => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Настройка размера canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Параметры визуализатора
        const bars = 150; // Увеличиваем количество столбцов
        const barWidth = Math.max(2, canvas.width / bars * 0.9); // Занимаем 90% ширины
        const gap = Math.max(1, barWidth * 0.1);
        const maxBarHeight = canvas.height * 0.4;

        let frequencies = new Array(bars).fill(0);
        let targets = new Array(bars).fill(0);
        let time = 0;

        const animate = () => {
            // ВМЕСТО прозрачного заливла - полная очистка
            ctx.fillStyle = 'rgba(10, 10, 10, 1)'; // Полностью непрозрачный
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            time += 0.02;

            // Генерируем псевдо-частоты (имитация музыки)
            for (let i = 0; i < bars; i++) {
                // Плавное изменение целей
                if (Math.random() < 0.03) {
                    targets[i] = Math.random();
                }

                // Плавная интерполяция к цели
                frequencies[i] += (targets[i] - frequencies[i]) * 0.1;

                // Добавляем волновой эффект
                const wave = Math.sin(time * 2 + i * 0.1) * 0.4 + 0.6;
                const height = frequencies[i] * wave * maxBarHeight;

                // Цвет градиента в зависимости от высоты
                const hue = (i * 1.5 + time * 30) % 360;
                const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - height);
                gradient.addColorStop(0, `hsla(${hue}, 80%, 50%, 0.8)`);
                gradient.addColorStop(0.7, `hsla(${hue}, 90%, 60%, 0.9)`);
                gradient.addColorStop(1, `hsla(${hue}, 100%, 70%, 1)`);

                // Рисуем столбец - занимаем всю ширину
                const totalWidth = bars * (barWidth + gap);
                const startX = (canvas.width - totalWidth) / 2;
                const x = startX + i * (barWidth + gap);
                const y = canvas.height - height;

                ctx.fillStyle = gradient;

                // Убираем тени чтобы не было следов
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;

                // Рисуем с закругленными углами
                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, height, 4);
                ctx.fill();
            }

            // Убираем частицы чтобы не было следов
            // if (Math.random() < 0.3) { ... } - УДАЛИТЬ ЭТУ ЧАСТЬ

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return <canvas ref={canvasRef} className="audio-visualizer" />;
};

export default AudioVisualizer;