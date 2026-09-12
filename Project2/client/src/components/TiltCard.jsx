import React, { useRef, useState } from 'react';

/**
 * TiltCard provides interactive 3D perspective tilt with specular glare reflection
 */
const TiltCard = ({
  children,
  className = '',
  maxTilt = 12,
  scale = 1.02,
  glare = true,
  onClick,
}) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState(
    'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  );
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = x / rect.width;
    const yPct = y / rect.height;

    const rotateX = (0.5 - yPct) * maxTilt;
    const rotateY = (xPct - 0.5) * maxTilt;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
    );

    if (glare) {
      setGlarePosition({
        x: xPct * 100,
        y: yPct * 100,
        opacity: 0.15,
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        transition: isHovered
          ? 'transform 0.1s ease-out'
          : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}

      {/* Dynamic Specular Glare Overlay */}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 z-30"
          style={{
            background: `radial-gradient(circle 320px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glarePosition.opacity}), transparent 70%)`,
          }}
        />
      )}
    </div>
  );
};

export default TiltCard;
