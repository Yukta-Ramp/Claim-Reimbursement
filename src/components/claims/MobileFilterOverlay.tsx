import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { X, Search } from 'lucide-react';
import { Label } from '../ui/label';

interface MobileFilterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (value: string) => void;
  searchValue: string;
}

export const MobileFilterOverlay: React.FC<MobileFilterOverlayProps> = ({
  isOpen,
  onClose,
  onSearch,
  searchValue,
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  if (!isOpen) return null;

  const handleApply = () => {
    onSearch(localSearchValue);
    onClose();
  };

  const handleClear = () => {
    setLocalSearchValue('');
    onSearch('');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[70] md:hidden"
        onClick={onClose}
      />

      {/* Overlay Panel */}
      <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl z-[80] md:hidden shadow-2xl animate-slide-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900">Search Claims</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Input */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-600 mb-2">Search across all fields</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by claim no, description, amount..."
                  value={localSearchValue}
                  onChange={(e) => setLocalSearchValue(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Search will look across claim number, title, description, and amount
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleClear}
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 bg-black hover:bg-gray-800"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
