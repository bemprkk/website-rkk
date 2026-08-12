import { type FC, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  angle: number;
  active: boolean;
  trail: number;
}

const AnimatedSky: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let time = 0;
    const isLight = theme === 'light';

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      stars = [];
      const count = Math.min(250, Math.floor((canvas.width * canvas.height) / 8000));
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.3,
          opacity: Math.random() * 0.7 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const createShootingStar = (): ShootingStar => ({
      x: Math.random() * canvas.width * 1.2,
      y: Math.random() * canvas.height * 0.5,
      length: Math.random() * 100 + 60,
      speed: Math.random() * 8 + 6,
      opacity: 1,
      angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.4,
      active: true,
      trail: Math.random() * 0.3 + 0.1,
    });

    const draw = () => {
      time += 0.016;

      ctx.fillStyle = isLight ? '#ffffff' : 'rgba(8, 3, 3, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase);
        const currentOpacity = isLight
          ? Math.min(1, star.opacity * (0.95 + 0.35 * twinkle) + 0.26)
          : Math.min(1, star.opacity * (0.9 + 0.35 * twinkle) + 0.22);
        const r = isLight ? 37 : 255;
        const g = isLight ? 99 : 40;
        const b = isLight ? 235 : 40;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.shadowBlur = isLight ? 10 : 9;
        ctx.shadowColor = isLight ? 'rgba(37, 99, 235, 0.9)' : 'rgba(255, 40, 40, 0.9)';
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentOpacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      if (Math.random() < 0.006 && shootingStars.length < 3) {
        shootingStars.push(createShootingStar());
      }

      shootingStars = shootingStars.filter(ss => {
        if (!ss.active) return false;
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity -= ss.trail;

        if (ss.opacity <= 0 || ss.x > canvas.width + 100 || ss.y > canvas.height + 100) {
          return false;
        }

        const grad = ctx.createLinearGradient(
          ss.x, ss.y,
          ss.x - Math.cos(ss.angle) * ss.length,
          ss.y - Math.sin(ss.angle) * ss.length
        );
        grad.addColorStop(0, isLight ? `rgba(37, 99, 235, ${ss.opacity})` : `rgba(255, 40, 40, ${ss.opacity})`);
        grad.addColorStop(1, isLight ? 'rgba(37, 99, 235, 0)' : 'rgba(255, 40, 40, 0)');

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.length, ss.y - Math.sin(ss.angle) * ss.length);
        ctx.stroke();

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    createStars();
    draw();

    const handleResize = () => { resize(); createStars(); };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'var(--particle-bg)',
        transition: 'background 0.4s ease',
      }}
    />
  );
};

export default AnimatedSky;
