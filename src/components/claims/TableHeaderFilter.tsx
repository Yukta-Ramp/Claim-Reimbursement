import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Filter, ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Separator } from '../ui/separator';

interface TableHeaderFilterProps {
  label: string;
  onSort?: (direction: 'asc' | 'desc' | null) => void;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  currentSort?: 'asc' | 'desc' | null;
}

export const TableHeaderFilter: React.FC<TableHeaderFilterProps> = ({
  label,
  onSort,
  onSearch,
  searchPlaceholder = 'Search...',
  currentSort = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSort = (direction: 'asc' | 'desc' | null) => {
    if (onSort) {
      onSort(direction);
      setIsOpen(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    if (onSearch) {
      onSearch('');
    }
  };

  const getSortIcon = () => {
    if (currentSort === 'asc') return <ArrowUp className="h-3 w-3" />;
    if (currentSort === 'desc') return <ArrowDown className="h-3 w-3" />;
    return null;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1 hover:text-gray-900 transition-colors group">
          <span>{label}</span>
          <div className="flex items-center gap-0.5">
            {getSortIcon()}
            <Filter className={`h-3 w-3 transition-opacity ${isOpen || currentSort || searchValue ? 'opacity-100' : 'opacity-40'}`} />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          {/* Search Section */}
          {onSearch && (
            <>
              <div>
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Search</div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>
                {searchValue && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="w-full mt-2 h-8 text-xs"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
              {onSort && <Separator />}
            </>
          )}

          {/* Sort Section */}
          {onSort && (
            <div>
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Sort</div>
              <div className="space-y-1">
                <Button
                  variant={currentSort === 'asc' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => handleSort('asc')}
                  className="w-full justify-start h-8 text-sm"
                >
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Ascending
                </Button>
                <Button
                  variant={currentSort === 'desc' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => handleSort('desc')}
                  className="w-full justify-start h-8 text-sm"
                >
                  <ArrowDown className="h-4 w-4 mr-2" />
                  Descending
                </Button>
                {currentSort && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort(null)}
                    className="w-full justify-start h-8 text-sm"
                  >
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Clear Sort
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
