import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Plus, Folder, Search } from 'lucide-react';

export default function CategoryDropdown({
  categories = [],
  selectedCategory,
  onSelectCategory,
  onAddNewCategory
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCatInput, setNewCatInput] = useState('');
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsAddingNew(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter out "All Works" for category assignment if present, or let user pick any valid category
  const assignableCategories = categories.filter(c => c !== 'All Works');

  const filteredCategories = assignableCategories.filter(cat =>
    cat.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleSelect = (cat) => {
    onSelectCategory(cat);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleCreateNew = (e) => {
    e.preventDefault();
    const trimmed = newCatInput.trim();
    if (trimmed) {
      if (onAddNewCategory) {
        onAddNewCategory(trimmed);
      }
      onSelectCategory(trimmed);
      setNewCatInput('');
      setIsAddingNew(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        id="category-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#15141b] hover:bg-[#1b1a23] border border-[#2d2b38] focus:border-[#d48b4e] rounded-xl text-left text-[#eee7dc] transition-all duration-200 group focus:outline-none focus:ring-1 focus:ring-[#d48b4e]/50 shadow-inner"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 truncate">
          <Folder className="w-4 h-4 text-[#d48b4e] shrink-0" />
          <span className="text-sm font-medium tracking-wide truncate">
            {selectedCategory || 'Select a Category'}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[#a9a296] group-hover:text-[#f2bc88] transition-transform duration-300 shrink-0 ${
            isOpen ? 'rotate-180 text-[#d48b4e]' : ''
          }`}
        />
      </button>

      {/* Dropdown Floating Menu with Custom Scrollbar */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#121118] border border-[#2e2c3b] rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden animate-fade-in">
          {/* Quick Search Header */}
          <div className="p-2 border-b border-[#23212e] bg-[#0e0d14]/70">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-[#8a8175] absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181721] text-xs text-[#eee7dc] placeholder-[#7d756b] pl-8 pr-3 py-1.5 rounded-lg border border-[#2a2836] focus:border-[#d48b4e] focus:outline-none"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>

          {/* Scrollable list with high-styled custom scrollbar */}
          <div
            className="max-h-52 overflow-y-auto custom-dropdown-scrollbar p-1.5 space-y-0.5"
            role="listbox"
          >
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleSelect(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-all duration-150 ${
                      isSelected
                        ? 'bg-[#d48b4e]/20 text-[#f2bc88] font-medium border border-[#d48b4e]/30'
                        : 'text-[#ded3c1] hover:bg-[#1f1d29] hover:text-[#fbf8f3]'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="truncate pr-2">{cat}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#d48b4e] shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-xs text-[#8a8175]">
                No matching category found
              </div>
            )}
          </div>

          {/* Quick Add Custom Category inline footer */}
          <div className="p-2 border-t border-[#23212e] bg-[#0c0b12]">
            {!isAddingNew ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddingNew(true);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-[11px] uppercase tracking-wider text-[#d48b4e] hover:text-[#f2bc88] hover:bg-[#1a1824] rounded-lg transition-colors border border-dashed border-[#d48b4e]/30"
              >
                <Plus className="w-3 h-3" />
                <span>+ Create New Category</span>
              </button>
            ) : (
              <form onSubmit={handleCreateNew} className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  placeholder="New category name..."
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  className="flex-1 bg-[#181721] text-xs text-[#eee7dc] px-2.5 py-1.5 rounded-lg border border-[#2d2b3a] focus:border-[#d48b4e] focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newCatInput.trim()}
                  className="bg-[#d48b4e] hover:bg-[#e7a369] disabled:opacity-40 text-[#0b0b0e] text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-[#8a8175] hover:text-[#eee7dc] px-2 py-1.5"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
