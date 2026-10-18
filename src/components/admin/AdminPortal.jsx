import React, { useState, useRef } from 'react';
import { useArtworks } from '../../context/ArtworksContext';
import { useTheme } from '../../context/ThemeContext';
import CategoryDropdown from './CategoryDropdown';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  ArrowLeft,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Search,
  RotateCcw,
  Sparkles,
  X
} from 'lucide-react';

export default function AdminPortal() {
  const { theme } = useTheme();
  const {
    artworks,
    categories,
    closeAdmin,
    addArtwork,
    deleteArtwork,
    resetToDefaults,
    addCategory
  } = useArtworks();

  // Form State
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    categories.find(c => c !== 'All Works') || 'Sacred Deities'
  );
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
  const [imageUrl, setImageUrl] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Search & Filter in Existing Artworks
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterCat, setActiveFilterCat] = useState('All');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const fileInputRef = useRef(null);

  // Handle local file selection and convert to Base64 data URL
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileError('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    // Limit to reasonable client-side file size (approx 8MB max)
    if (file.size > 8 * 1024 * 1024) {
      setFileError('Image size exceeds 8MB. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewImage(event.target.result);
      setImageUrl('');
    };
    reader.onerror = () => {
      setFileError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setImageUrl(val);
    setPreviewImage(val.trim() ? val.trim() : null);
    setFileError('');
  };

  const handleClearImage = () => {
    setPreviewImage(null);
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit new photo
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFileError('Please enter a name for the artwork.');
      return;
    }
    const finalImage = previewImage || imageUrl;
    if (!finalImage) {
      setFileError('Please provide an image via upload or URL.');
      return;
    }

    setIsSubmitting(true);
    try {
      addArtwork({
        title: title.trim(),
        image: finalImage,
        category: selectedCategory,
      });

      // Show toast
      showToast(`✓ "${title.trim()}" added to portfolio!`);

      // Reset form
      setTitle('');
      handleClearImage();
      setFileError('');
    } catch (err) {
      setFileError(err.message || 'Error adding artwork');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Delete handler
  const handleDelete = (id, artTitle) => {
    deleteArtwork(id);
    setConfirmDeleteId(null);
    showToast(`Deleted "${artTitle}" from gallery.`);
  };

  // Filter artworks list
  const filteredList = artworks.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase().trim());
    const matchesCategory = activeFilterCat === 'All' || item.category === activeFilterCat;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#09080c] text-[#fbf8f3] font-body selection:bg-[#d48b4e]/30 selection:text-[#fbf8f3] pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#1b1924] border border-[#d48b4e]/60 text-[#fbf8f3] px-5 py-3 rounded-xl shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#d48b4e]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0c0b11]/90 backdrop-blur-md border-b border-[#211f2c] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={closeAdmin}
              className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#cfc4b2] hover:text-[#fbf8f3] bg-[#171520] hover:bg-[#201d2c] border border-[#2c293a] px-3.5 py-2 rounded-lg transition-colors group"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-4 h-4 text-[#d48b4e] group-hover:-translate-x-1 transition-transform" />
              <span>Back to Studio</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base md:text-lg tracking-wider text-[#fbf8f3] font-medium">
                  KAVIN SIRPI
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#d48b4e]/15 text-[#f2bc88] border border-[#d48b4e]/30">
                  /admin
                </span>
              </div>
              <p className="text-[11px] text-[#a9a296] tracking-wide hidden sm:block">
                Fast Photo & Artwork Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-[#f2bc88]">{artworks.length}</span>
              <span className="text-[11px] text-[#8e8578] ml-1">Live Works</span>
            </div>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 text-xs text-[#a9a296] hover:text-[#f28b82] border border-[#2a2736] hover:border-[#f28b82]/40 bg-[#14121b] px-3 py-1.5 rounded-lg transition-colors"
              title="Reset gallery to default works"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Fast Small Add Photo Form */}
          <section className="lg:col-span-5 bg-[#121118] border border-[#242230] rounded-2xl p-6 shadow-xl relative">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#211f2c]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#d48b4e]/10 text-[#d48b4e]">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold tracking-wide text-[#fbf8f3]">
                    Add New Photo
                  </h2>
                  <p className="text-[11px] text-[#8e8578]">Fast upload or image link</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Artwork Title / Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#cfc4b2] mb-1.5 font-medium">
                  Artwork Name <span className="text-[#d48b4e]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Adiyogi Lord Shiva Cement Relief"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#171620] border border-[#2d2b3a] focus:border-[#d48b4e] rounded-xl px-4 py-2.5 text-sm text-[#fbf8f3] placeholder-[#6b645b] focus:outline-none focus:ring-1 focus:ring-[#d48b4e]/50 transition-all"
                  required
                />
              </div>

              {/* Category Custom Dropdown with Custom Scrollbar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#cfc4b2] font-medium">
                    Category <span className="text-[#d48b4e]">*</span>
                  </label>
                  <span className="text-[10px] text-[#8e8578]">Custom Dropdown</span>
                </div>
                <CategoryDropdown
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  onAddNewCategory={addCategory}
                />
              </div>

              {/* Image Input Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-[#cfc4b2] font-medium">
                    Artwork Photo <span className="text-[#d48b4e]">*</span>
                  </label>
                  <div className="flex bg-[#181722] p-0.5 rounded-lg border border-[#292736]">
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                        imageMode === 'upload'
                          ? 'bg-[#d48b4e] text-[#0b0b0e] font-semibold'
                          : 'text-[#a9a296] hover:text-[#eee7dc]'
                      }`}
                    >
                      File Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                        imageMode === 'url'
                          ? 'bg-[#d48b4e] text-[#0b0b0e] font-semibold'
                          : 'text-[#a9a296] hover:text-[#eee7dc]'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {/* Upload Mode */}
                {imageMode === 'upload' ? (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      id="artwork-photo-upload"
                    />
                    {!previewImage ? (
                      <label
                        htmlFor="artwork-photo-upload"
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#2f2d3d] hover:border-[#d48b4e]/70 bg-[#15141e]/60 hover:bg-[#181723] rounded-xl cursor-pointer transition-all group"
                      >
                        <div className="p-3 rounded-full bg-[#1f1d2a] group-hover:bg-[#d48b4e]/15 text-[#a9a296] group-hover:text-[#d48b4e] transition-colors mb-2">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-[#ded3c1] group-hover:text-[#fbf8f3]">
                          Click to browse or drop photo
                        </span>
                        <span className="text-[10px] text-[#787065] mt-1">
                          PNG, JPG, WEBP up to 8MB
                        </span>
                      </label>
                    ) : (
                      <div className="relative rounded-xl overflow-hidden border border-[#2f2d3e] bg-[#161520] group">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-44 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#09080d]/90 via-transparent to-transparent flex items-end justify-between p-3">
                          <span className="text-[11px] text-[#f2bc88] font-medium truncate max-w-[200px]">
                            Photo Ready
                          </span>
                          <button
                            type="button"
                            onClick={handleClearImage}
                            className="bg-[#2a1818]/90 hover:bg-[#471f1f] text-[#f87171] p-1.5 rounded-lg border border-[#f87171]/30 transition-colors"
                            title="Remove Photo"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* URL Mode */
                  <div className="space-y-2">
                    <div className="relative">
                      <ImageIcon className="w-4 h-4 text-[#8a8175] absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        type="url"
                        placeholder="https://example.com/artwork.jpg or /images/..."
                        value={imageUrl}
                        onChange={handleUrlChange}
                        className="w-full bg-[#171620] border border-[#2d2b3a] focus:border-[#d48b4e] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#fbf8f3] placeholder-[#6b645b] focus:outline-none focus:ring-1 focus:ring-[#d48b4e]/50 transition-all"
                      />
                    </div>
                    {previewImage && (
                      <div className="relative rounded-xl overflow-hidden border border-[#2f2d3e] bg-[#161520]">
                        <img
                          src={previewImage}
                          alt="URL Preview"
                          className="w-full h-36 object-cover"
                          onError={() => setFileError('Could not load image from this URL.')}
                        />
                        <button
                          type="button"
                          onClick={handleClearImage}
                          className="absolute top-2 right-2 bg-[#000]/70 hover:bg-[#000] text-white p-1 rounded-full"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Error Alert */}
              {fileError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#2e1515] border border-[#f87171]/40 text-[#fca5a5] text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#f87171]" />
                  <span>{fileError}</span>
                </div>
              )}

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: theme.accent }}
                className="w-full mt-2 flex items-center justify-center gap-2 text-[#0b0b0e] font-semibold text-xs tracking-wider uppercase py-3 px-4 rounded-xl hover:brightness-110 active:scale-[0.99] transition-all duration-200 shadow-lg cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'Adding Photo...' : 'Add to Portfolio'}</span>
              </button>
            </form>
          </section>

          {/* RIGHT COLUMN: Existing Artworks List with Fast Delete */}
          <section className="lg:col-span-7 space-y-4">
            {/* Header & Search */}
            <div className="bg-[#121118] border border-[#242230] rounded-2xl p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-sm font-semibold tracking-wide text-[#fbf8f3]">
                    Existing Artworks ({filteredList.length})
                  </h2>
                  <p className="text-[11px] text-[#8e8578]">
                    Delete existing photos or click to view
                  </p>
                </div>

                {/* Search Input */}
                <div className="relative min-w-[220px]">
                  <Search className="w-3.5 h-3.5 text-[#8a8175] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#181722] text-xs text-[#eee7dc] placeholder-[#6b645b] pl-8 pr-3 py-2 rounded-xl border border-[#2a2838] focus:border-[#d48b4e] focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-[#8a8175] hover:text-[#eee7dc]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Pills with Custom Scrollbar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-dropdown-scrollbar">
                <button
                  onClick={() => setActiveFilterCat('All')}
                  className={`text-[11px] uppercase tracking-wider px-3 py-1 rounded-lg shrink-0 transition-all ${
                    activeFilterCat === 'All'
                      ? 'bg-[#d48b4e]/20 text-[#f2bc88] border border-[#d48b4e]/40 font-semibold'
                      : 'text-[#9c9386] hover:text-[#eee7dc] hover:bg-[#181722]'
                  }`}
                >
                  All ({artworks.length})
                </button>
                {categories.filter(c => c !== 'All Works').map((cat) => {
                  const count = artworks.filter(a => a.category === cat).length;
                  const isActive = activeFilterCat === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveFilterCat(cat)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg shrink-0 transition-all ${
                        isActive
                          ? 'bg-[#d48b4e]/20 text-[#f2bc88] border border-[#d48b4e]/40 font-semibold'
                          : 'text-[#9c9386] hover:text-[#eee7dc] hover:bg-[#181722]'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Artworks List Grid */}
            <div className="space-y-3">
              {filteredList.length > 0 ? (
                filteredList.map((art) => {
                  const isConfirming = confirmDeleteId === art.id;
                  return (
                    <div
                      key={art.id}
                      className="flex items-center justify-between gap-4 p-3 bg-[#131219] hover:bg-[#171620] border border-[#23212e] hover:border-[#322f42] rounded-xl transition-all duration-200"
                    >
                      {/* Thumbnail & Details */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#1a1924] shrink-0 border border-[#2c293a]">
                          <img
                            src={art.image}
                            alt={art.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80';
                            }}
                          />
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-medium text-[#fbf8f3] truncate">
                            {art.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[10px] font-medium text-[#d48b4e] bg-[#d48b4e]/10 border border-[#d48b4e]/25 px-2 py-0.5 rounded-full">
                              {art.category}
                            </span>
                            {art.date && (
                              <span className="text-[10px] text-[#7d756b]">
                                {art.date}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action: Fast Delete */}
                      <div className="shrink-0">
                        {!isConfirming ? (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(art.id)}
                            className="flex items-center gap-1.5 text-xs text-[#a9a296] hover:text-[#f87171] hover:bg-[#2b1618] border border-transparent hover:border-[#f87171]/30 px-3 py-1.5 rounded-lg transition-all"
                            title="Delete artwork"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 animate-fade-in">
                            <button
                              type="button"
                              onClick={() => handleDelete(art.id, art.title)}
                              className="bg-[#dc2626] hover:bg-[#ef4444] text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors shadow"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-xs text-[#8a8175] hover:text-[#eee7dc] px-2 py-1.5"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-[#121118] border border-[#242230] rounded-2xl p-12 text-center">
                  <ImageIcon className="w-10 h-10 text-[#4a4556] mx-auto mb-3" />
                  <p className="text-sm text-[#eee7dc] font-medium">No artworks found</p>
                  <p className="text-xs text-[#7d756b] mt-1">
                    {searchQuery ? 'Try clearing your search query.' : 'Add your first photo using the form on the left!'}
                  </p>
                </div>
              )}
            </div>
          </section>

        </div>
      </main>

      {/* Confirmation Modal for Resetting Defaults */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#15141e] border border-[#2f2c3d] rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-[#fbf8f3] mb-2">
              Restore Default Gallery?
            </h3>
            <p className="text-xs text-[#a9a296] leading-relaxed mb-6">
              This will reset the portfolio back to the master sculptor initial collection of authentic cement relief carvings.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs text-[#cfc4b2] hover:text-[#fbf8f3] hover:bg-[#1d1b28] rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToDefaults();
                  setShowResetConfirm(false);
                  showToast('Restored default portfolio artworks.');
                }}
                className="px-4 py-2 text-xs font-semibold bg-[#d48b4e] hover:bg-[#e7a369] text-[#0b0b0e] rounded-xl transition-colors"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
