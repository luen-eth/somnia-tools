import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-950 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-purple-gradient text-white hover:scale-105 hover:shadow-lg hover:shadow-primary-500/25',
      secondary: 'bg-dark-800 border border-primary-500/30 text-white hover:bg-dark-700 hover:border-primary-500/50',
      outline: 'border border-primary-500/50 text-primary-400 hover:bg-primary-500/10 hover:border-primary-500',
      ghost: 'text-gray-300 hover:text-white hover:bg-dark-800',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2">
            <LoadingSpinner size="sm" color={variant === 'primary' ? 'white' : 'primary'} />
          </div>
        )}
        <span className={loading ? 'opacity-75' : ''}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
