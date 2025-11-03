import React, { useState } from 'react';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover.jsx';
import { Filter, ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { Separator } from '../ui/separator.jsx';

export function TableHeaderFilter({ label, onSort, onSearch, searchPlaceholder = 'Search...', currentSort = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const handleSort = (direction) => {
    if (onSort) {
      onSort(direction);
      setIsOpen(false);
    }
  };
  const handleSearchChange = (value) => {
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
                    className="mt-2"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </>
          )}
          <Separator />
          {/* Sort Section */}
          {onSort && (
            <div>
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Sort</div>
              <div className="flex gap-2">
                <Button
                  variant={currentSort === 'asc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSort('asc')}
                >
                  <ArrowUp className="h-3 w-3 mr-1" /> Ascending
                </Button>
                <Button
                  variant={currentSort === 'desc' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSort('desc')}
                >
                  <ArrowDown className="h-3 w-3 mr-1" /> Descending
                </Button>
                <Button
                  variant={!currentSort ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSort(null)}
                >
                  <ArrowUpDown className="h-3 w-3 mr-1" /> None
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
