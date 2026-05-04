import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  variant?: 'default' | 'white';
}

export default function Breadcrumb({ items, variant = 'default' }: BreadcrumbProps) {
  const textColor = variant === 'white' ? 'text-blue-100 hover:text-white' : 'text-gray-600 hover:text-blue-800';
  const activeColor = variant === 'white' ? 'text-white' : 'text-gray-900';
  const separatorColor = variant === 'white' ? 'text-blue-300' : 'text-gray-400';

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      <Link
        to="/"
        className={`flex items-center ${textColor} transition-colors`}
      >
        <Home className="h-4 w-4" />
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className={`h-4 w-4 ${separatorColor}`} />
          {item.path && index < items.length - 1 ? (
            <Link
              to={item.path}
              className={`${textColor} transition-colors`}
            >
              {item.label}
            </Link>
          ) : (
            <span className={`${activeColor} font-medium`}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
