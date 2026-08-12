import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 32 }) => {
  return (
    <img
      src="/logo.png"
      alt="BEM PRKK Logo"
      width={size}
      height={size}
      className={`logo-img-premium ${className}`}
      style={{ flexShrink: 0, objectFit: 'contain' }}
    />
  );
};

export default Logo;
