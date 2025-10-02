import React from 'react';
import { DeveloperApp } from '../api/developerAppsApi';

interface AppCardProps {
  app: DeveloperApp;
  onEdit: (appId: string) => void;
  onDelete: (appId: string) => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onEdit, onDelete }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const tags = app.tags.split(',').map((tag) => tag.trim());

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/30 rounded-lg p-6 hover:border-purple-700/50 transition-all duration-300">
      {/* Header with Logo */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          {app.logo && (
            <img
              src={app.logo}
              alt={`${app.name} logo`}
              className="w-16 h-16 rounded-lg object-cover border border-purple-900/30"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white mb-1 truncate">{app.name}</h3>
          <p className="text-sm text-purple-400 font-mono truncate">{app.appId}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{app.shortDescription}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-purple-900/20 border border-purple-700/30 text-purple-300 text-xs rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Social Links */}
      {(app.socialX || app.socialTelegram || app.socialFacebook || app.socialTiktok) && (
        <div className="flex gap-3 mb-4">
          {app.socialX && (
            <a
              href={app.socialX}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
              title="X (Twitter)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          )}
          {app.socialTelegram && (
            <a
              href={app.socialTelegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
              title="Telegram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
              </svg>
            </a>
          )}
          {app.socialFacebook && (
            <a
              href={app.socialFacebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
              title="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          )}
          {app.socialTiktok && (
            <a
              href={app.socialTiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
              title="TikTok"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-purple-900/30">
        <div className="text-xs text-gray-500">
          <p>Created: {formatDate(app.createdAt)}</p>
          {app.updatedAt !== app.createdAt && (
            <p>Updated: {formatDate(app.updatedAt)}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(app.appId)}
            className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-700/50 text-purple-300 rounded text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(app.appId)}
            className="px-4 py-2 bg-red-900/20 hover:bg-red-900/30 border border-red-700/50 text-red-400 rounded text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppCard;

