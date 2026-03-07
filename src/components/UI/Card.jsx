'use client';

export default function Card({ children, className = '', padding = 'p-6' }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${padding} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-lg font-semibold text-gray-800 ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}