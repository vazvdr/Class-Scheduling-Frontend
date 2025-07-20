import React from 'react';

export default function ContainerComBackground({ imagem, children, className = "" }) {
  return (
    <div
      className={`relative w-full min-h-screen bg-cover bg-center bg-no-repeat ${className}`}
      style={{ backgroundImage: `url('/Banner2.jpg')` }}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
