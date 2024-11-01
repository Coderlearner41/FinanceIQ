import React, { forwardRef, ButtonHTMLAttributes } from 'react';

// Define an interface for the button props
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: 'default' | 'ghost'; // Add more variants as needed
  size?: 'icon' | 'small' | 'medium' | 'large'; // Define sizes if needed
}

// Create the Button component with forwardRef and TypeScript types
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className = '', variant = 'default', size = 'medium', ...props }, ref) => {
  // Define styles based on variant and size
  const variantStyles = variant === 'ghost' ? 'bg-transparent border-0' : 'bg-blue-500 text-white';
  const sizeStyles = size === 'icon' ? 'h-8 w-8' : 'py-2 px-4';

  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center text-black rounded-md text-sm font-medium ring-offset-background transition-colors border border-gray-700 shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className} ${variantStyles} ${sizeStyles}`}
      {...props}
    />
  );
});

// Set displayName for better debugging
Button.displayName = "Button";

export default Button;
