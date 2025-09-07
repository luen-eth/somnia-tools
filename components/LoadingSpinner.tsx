'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'pink';
}

export function LoadingSpinner({ size = 'md', color = 'primary' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'border-primary-500',
    white: 'border-white',
    pink: 'border-pink-400',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
}

export function PulsingDots({ color = 'primary' }: { color?: 'primary' | 'white' | 'pink' }) {
  const colorClasses = {
    primary: 'bg-primary-500',
    white: 'bg-white',
    pink: 'bg-pink-400',
  };

  return (
    <div className="flex space-x-1">
      <div className={`w-2 h-2 ${colorClasses[color]} rounded-full animate-pulse`} style={{ animationDelay: '0ms' }} />
      <div className={`w-2 h-2 ${colorClasses[color]} rounded-full animate-pulse`} style={{ animationDelay: '150ms' }} />
      <div className={`w-2 h-2 ${colorClasses[color]} rounded-full animate-pulse`} style={{ animationDelay: '300ms' }} />
    </div>
  );
}

export function BouncingBalls() {
  return (
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-3 h-3 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}
