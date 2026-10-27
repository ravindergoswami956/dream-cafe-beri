import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tiltMaxAngle?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  onClick,
  tiltMaxAngle = 12,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({ opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -tiltMaxAngle;
    const rotateY = ((x - centerX) / centerX) * tiltMaxAngle;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
    });

    setGlareStyle({
      opacity: 0.35,
      background: `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255, 180, 50, 0.4), transparent 60%)`,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
    });
    setGlareStyle({
      opacity: 0,
      transition: 'opacity 0.4s ease-out',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={style}
      className={`relative group overflow-hidden will-change-transform transform-style-3d ${className}`}
    >
      {/* Glare specular reflection */}
      <div
        style={glareStyle}
        className="pointer-events-none absolute inset-0 z-20 transition-opacity"
        aria-hidden="true"
      />
      {children}
    </div>
  );
};
