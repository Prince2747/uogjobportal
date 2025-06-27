interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function Loading({ size = 'md', text, className = '' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full border-t-2 border-b-2 border-[#3A95E8] ${sizeClasses[size]} mx-auto ${text ? 'mb-4' : ''}`}></div>
        {text && <p className="text-gray-600">{text}</p>}
      </div>
    </div>
  );
}

// Full screen loading variant
export function FullScreenLoading({ text }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#F8F9FA]">
      <Loading size="lg" text={text} />
    </div>
  );
}