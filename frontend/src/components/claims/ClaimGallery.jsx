import React from 'react';
import { ClaimCard } from './ClaimCard.jsx';
import { FileX } from 'lucide-react';

export function ClaimGallery({ claims, onView, onEdit, onDelete, showUserName = false, emptyMessage = 'No claims found' }) {
  if (claims.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <FileX className="h-16 w-16 mb-4" />
        <p>{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {claims.map((claim) => (
        <ClaimCard
          key={claim.id}
          claim={claim}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          showUserName={showUserName}
        />
      ))}
    </div>
  );
}
