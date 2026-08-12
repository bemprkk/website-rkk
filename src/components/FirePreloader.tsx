import { type FC, useState, useEffect, useMemo } from 'react';

interface FirePreloaderProps {
  onComplete: () => void;
}

export const FirePreloader: FC<FirePreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExtinguished, setIsExtinguished] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const fireParticles = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => {
      const types = ['rise-left', 'rise-right', 'rise-straight'];
      return {
        id: i,
        left: `${10 + Math.random() * 80}%`, // spread across the bottom
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${0.8 + Math.random() * 1.5}s`,
        size: `${15 + Math.random() * 40}px`,
        type: types[Math.floor(Math.random() * types.length)],
      };
    });
  }, []);

  useEffect(() => {
    const duration = 1800; // 1.8 seconds for loading phase
    const startTime = performance.now();
    
    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(Math.floor(pct));
      if (pct >= 100) {
        clearInterval(interval);
      }
    }, 20); // Smooth updates every 20ms
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setProgress(100);
      setIsExtinguished(true); // Fire goes out
      
      const fadeTimeout = setTimeout(() => {
        setIsComplete(true);
      }, 700); // Display 'API PADAM!' for 700ms before starting fade-out

      const completeTimeout = setTimeout(() => {
        onComplete();
      }, 1200); // Complete after 1.2 seconds (700ms text display + 500ms exit transition)

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(completeTimeout);
      };
    }
  }, [progress, onComplete]);

  return (
    <div className={`fire-curtain-overlay ${isExtinguished ? 'extinguishing' : ''} ${isComplete ? 'open' : ''}`}>
      <div className="preloader-soft-bg"></div>
      <div className="extinguish-mist"></div>
      
      <div className={`fire-content-wrapper ${isExtinguished ? 'extinguished' : ''}`}>
        <div className="fire-realistic-container full-width">
          <div className="fire-glow-base wide"></div>
          {fireParticles.map((p) => (
            <div 
              key={p.id} 
              className={`fire-particle-real ${p.type}`}
              style={{
                left: p.left,
                animationDelay: p.animationDelay,
                animationDuration: p.animationDuration,
                width: p.size,
                height: p.size,
              }}
            ></div>
          ))}
        </div>
        
        <div className="center-content">
          {/* Logo uploaded by user */}
          <img src="/logo.png" alt="Logo BEM PRKK" className="preloader-logo" />
          <div className="fire-percentage">{progress}%</div>
          <div className="fire-text">
            {!isExtinguished ? 'MEMADAMKAN API...' : 'API PADAM!'}
          </div>
        </div>
      </div>
    </div>
  );
};
