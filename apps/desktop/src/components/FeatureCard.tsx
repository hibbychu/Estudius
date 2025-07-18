import React from 'react';

interface FeatureCardProps {
  icon: string; // Emoji or use a ReactNode for more flexible icons
  title: string;
  description: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className = '',
}) => (
  <div
    className={
      `bg-white rounded-lg shadow p-6 flex items-start space-x-4 hover:shadow-lg transition-shadow ${className}`
    }
  >
    <div className="bg-blue-100 flex justify-center items-center h-12 w-12 rounded-full text-blue-600 text-2xl shrink-0">
      <span role="img" aria-label={title} className="align-middle">{icon}</span>
    </div>
    <div>
      <h3 className="text-lg font-bold mb-1 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export default FeatureCard;
