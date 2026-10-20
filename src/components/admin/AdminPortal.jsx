import React, { useState, useRef, useEffect } from 'react';
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
  X,
  Lock,
  KeyRound,
  ShieldCheck,
  HardDrive,
  Cpu,
  Layers,
  FileCheck,
  LogOut,
  Maximize2,
  Eye,
  Info
} from 'lucide-react';

export default function AdminPortal() {
  const { theme } = useTheme();
  const {
    artworks,
    categories,
    closeAdmin,
    isAuthenticated,
    adminUser,
    login,
    logout,
    getAutoCredentialsInfo,
    getStorageStats,
    uploadPhoto,
    addArtwork,
    deleteArtwork,
    resetToDefaults,
    addCategory,
  } = useArtworks();

  // Authentication State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [autoCreds, setAutoCreds] = useState({ username: 'admin', password: 'kavinsirpi@2026' });

  // VPS Storage Stats
  const [storageStats, setStorageStats] = useState(null);

  // Form State: Complete Frontend Details
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    categories.find((c) => c !== 'All Works') || 'Sacred Deities'
  );
  const [medium, setMedium] = useState('In-Situ Handcrafted Cement Relief');
  const [dimensions, setDimensions] = useState('Custom Architectural Feature Wall');
  const [description, setDescription] = useState('');
  const [aspect, setAspect] = useState('portrait'); // 'portrait' | 'landscape' | 'square'
  const [date, setDate] = useState(() =>
    new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  );
  const [featured, setFeatured] = useState(true);

  // Highlights / Features (list of bullet points)
  const [highlights, setHighlights] = useState([
    'Direct wall relief carving',
    'Master architectural craftsmanship',
  ]);
  const [newHighlight, setNewHighlight] = useState('');

  // Upload & WebP Compression State
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
  const [imageUrl, setImageUrl] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [compressionMetrics, setCompressionMetrics] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Search & Filter in Existing Artworks
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterCat, setActiveFilterCat] = useState('All');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [previewModalItem, setPreviewModalItem] = useState(null);

  const fileInputRef = useRef(null);

  // Load auto credentials info and storage stats on mount
  useEffect(() => {
    getAutoCredentialsInfo().then((creds) => {
      if (creds) setAutoCreds(creds);
    });
    getStorageStats().then((stats) => {
      if (stats) setStorageStats(stats);
    });
  }, [getAutoCredentialsInfo, getStorageStats]);

  // Handle Auto-Fill Credentials
  const handleAutoFill = () => {
    setLoginUsername(autoCreds.username);
    setLoginPassword(autoCreds.password);
    setLoginError('');
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await login(loginUsername, loginPassword);
      showToast(`Welcome back, ${loginUsername}!`);
      // Refresh storage stats once logged in
      const stats = await getStorageStats();
      if (stats) setStorageStats(stats);
    } catch (err) {
      setLoginError(err.message || 'Invalid username or password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Local File Selection with Automatic Sharp WebP Compression
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    setFileError('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (PNG, JPG, JPEG, WEBP, etc.).');
      return;
    }

    setIsUploadingPhoto(true);
    setCompressionMetrics(null);

    try {
      // Send to backend Sharp WebP engine
      const uploadedFile = await uploadPhoto(file);

      // Backend returned compressed WebP file details
      setPreviewImage(uploadedFile.url);
      setImageUrl('');
      setCompressionMetrics({
        originalMB: (uploadedFile.originalSize / (1024 * 1024)).toFixed(2),
        compressedKB: (uploadedFile.compressedSize / 1024).toFixed(1),
        savingsPercent: uploadedFile.compressionRatio,
        width: uploadedFile.width,
        height: uploadedFile.height,
        format: 'WebP',
      });

      // Update storage stats
      const stats = await getStorageStats();
      if (stats) setStorageStats(stats);

      showToast(`✓ Image converted to WebP! Saved ${uploadedFile.compressionRatio}% VPS space.`);
    } catch (err) {
      console.warn('Backend upload failed, creating optimized client fallback:', err.message);
      // Client-side fallback if server is offline
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
        setCompressionMetrics({
          originalMB: (file.size / (1024 * 1024)).toFixed(2),
          compressedKB: (file.size / 1024).toFixed(1),
          savingsPercent: 0,
          format: 'Local DataURL',
        });
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setImageUrl(val);
    setPreviewImage(val.trim() ? val.trim() : null);
    setCompressionMetrics(null);
    setFileError('');
  };

  const handleClearImage = () => {
    setPreviewImage(null);
    setImageUrl('');
    setCompressionMetrics(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Highlight management
  const handleAddHighlight = (e) => {
    e.preventDefault();
    const clean = newHighlight.trim();
    if (clean && !highlights.includes(clean)) {
      setHighlights([...highlights, clean]);
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (indexToRemove) => {
    setHighlights(highlights.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit new photo artwork
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFileError('Please enter an artwork title.');
      return;
    }
    const finalImage = previewImage || imageUrl;
    if (!finalImage) {
      setFileError('Please select a photo to upload or enter an image URL.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addArtwork({
        title: title.trim(),
        category: selectedCategory,
        image: finalImage,
        medium: medium.trim() || 'In-Situ Handcrafted Cement Relief',
        dimensions: dimensions.trim() || 'Custom Architectural Feature Wall',
        description:
          description.trim() ||
          `Handcrafted monumental cement wall relief sculpted on-site by Kavin Sirpi.`,
        highlights: highlights.length > 0 ? highlights : ['Direct wall relief carving', 'Master architectural craftsmanship'],
        aspect,
        date: date.trim() || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        featured,
        originalSize: compressionMetrics ? parseFloat(compressionMetrics.originalMB) * 1024 * 1024 : 0,
        compressedSize: compressionMetrics ? parseFloat(compressionMetrics.compressedKB) * 1024 : 0,
        compressionRatio: compressionMetrics ? compressionMetrics.savingsPercent : 0,
      });

      showToast(`✓ "${title.trim()}" published to portfolio!`);

      // Reset form to clean state
      setTitle('');
      setDescription('');
      handleClearImage();
      setFileError('');

      // Refresh storage stats
      const stats = await getStorageStats();
      if (stats) setStorageStats(stats);
    } catch (err) {
      setFileError(err.message || 'Error publishing artwork');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Delete handler
  const handleDelete = async (id, artTitle) => {
    await deleteArtwork(id);
    setConfirmDeleteId(null);
    showToast(`Deleted "${artTitle}" from gallery.`);
    const stats = await getStorageStats();
    if (stats) setStorageStats(stats);
  };

  // Filter artworks list
  const filteredList = artworks.filter((item) => {
    const matchesSearch =
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (item.category || '').toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (item.description || '').toLowerCase().includes(searchQuery.toLowerCase().trim());
    const matchesCategory = activeFilterCat === 'All' || item.category === activeFilterCat;
    return matchesSearch && matchesCategory;
  });

  // ==========================================
  // VIEW 1: AUTHENTICATION LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07070a] text-[#fbf8f3] font-body selection:bg-[#d48b4e]/30 selection:text-[#fbf8f3] flex flex-col justify-between p-6">
        {/* Top return bar */}
        <div className="max-w-md mx-auto w-full flex justify-between items-center py-4">
          <button
            onClick={closeAdmin}
            className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#a9a296] hover:text-[#fbf8f3] bg-[#121118] border border-[#23212f] px-3.5 py-2 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#d48b4e]" />
            <span>Return to Public Site</span>
          </button>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#d48b4e]/10 text-[#f2bc88] border border-[#d48b4e]/30">
            Manual Route: /admin
          </span>
        </div>

        {/* Login Card */}
        <div className="max-w-md mx-auto w-full bg-[#0e0d14] border border-[#252332] rounded-3xl p-8 shadow-2xl relative my-auto">
          {/* Atelier Brand Accent */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-[#d48b4e]/10 border border-[#d48b4e]/30 text-[#d48b4e] mb-3">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="font-display text-2xl font-medium tracking-wide text-[#fbf8f3]">
              KAVIN SIRPI ATELIER
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-[#8e8578] mt-1 font-light">
              Architectural Admin Portal
            </p>
          </div>

          {/* Auto Credentials Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-[#14121b] border border-[#2d2a3d] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#f2bc88] font-medium">
                <KeyRound className="w-3.5 h-3.5 text-[#d48b4e]" />
                <span>Auto Credentials Configured</span>
              </div>
              <button
                type="button"
                onClick={handleAutoFill}
                className="text-[11px] font-mono uppercase bg-[#d48b4e]/20 hover:bg-[#d48b4e]/35 text-[#f2bc88] px-2.5 py-1 rounded-lg border border-[#d48b4e]/40 transition-colors cursor-pointer"
              >
                1-Click Auto Fill
              </button>
            </div>
            <div className="text-[11px] font-mono text-[#a9a296] bg-[#0c0b11] p-2.5 rounded-xl border border-[#1f1d2b] flex items-center justify-between">
              <span>User: <strong className="text-[#fbf8f3]">{autoCreds.username}</strong></span>
              <span>Pass: <strong className="text-[#fbf8f3]">{autoCreds.password}</strong></span>
            </div>
            <p className="text-[10px] text-[#71695f] leading-relaxed">
              Auto credentials loaded from backend environment (.env)
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#cfc4b2] mb-1.5 font-medium">
                Username
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full bg-[#161520] border border-[#2b2938] focus:border-[#d48b4e] rounded-xl px-4 py-2.5 text-sm text-[#fbf8f3] placeholder-[#6b645b] focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#cfc4b2] mb-1.5 font-medium">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#161520] border border-[#2b2938] focus:border-[#d48b4e] rounded-xl px-4 py-2.5 text-sm text-[#fbf8f3] placeholder-[#6b645b] focus:outline-none transition-all"
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#2e1515] border border-[#f87171]/40 text-[#fca5a5] text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#f87171]" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              style={{ backgroundColor: theme.accent }}
              className="w-full mt-3 flex items-center justify-center gap-2 text-[#0b0b0e] font-semibold text-xs tracking-wider uppercase py-3.5 px-4 rounded-xl hover:brightness-110 active:scale-[0.99] transition-all shadow-lg cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-[#5e584f] py-4">
          Direct secure URL access • Automatic WebP conversion enabled • 4GB VPS Safe
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED ADMIN PORTAL
  // ==========================================
  return (
    <div className="min-h-screen bg-[#08070b] text-[#fbf8f3] font-body selection:bg-[#d48b4e]/30 selection:text-[#fbf8f3] pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 bg-[#171520] border border-[#d48b4e]/80 text-[#fbf8f3] px-5 py-3.5 rounded-2xl shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#d48b4e]" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0c0b11]/95 backdrop-blur-md border-b border-[#211f2d] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={closeAdmin}
              className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#cfc4b2] hover:text-[#fbf8f3] bg-[#171520] hover:bg-[#201d2c] border border-[#2b2839] px-3.5 py-2 rounded-xl transition-colors group"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-4 h-4 text-[#d48b4e] group-hover:-translate-x-1 transition-transform" />
              <span>Back to Public Site</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base md:text-lg tracking-wider text-[#fbf8f3] font-medium">
                  KAVIN SIRPI ATELIER
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#d48b4e]/15 text-[#f2bc88] border border-[#d48b4e]/30">
                  /admin
                </span>
              </div>
              <p className="text-[11px] text-[#8e8578] tracking-wide">
                MERN Admin • Smart WebP Compression Active
              </p>
            </div>
          </div>

          {/* Right Header Stats & Logout */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* VPS 4GB Storage Badge */}
            {storageStats && (
              <div className="hidden lg:flex items-center gap-2 bg-[#14121b] border border-[#2a2738] px-3 py-1.5 rounded-xl text-xs">
                <HardDrive className="w-3.5 h-3.5 text-[#d48b4e]" />
                <div className="text-[11px]">
                  <span className="text-[#eee7dc] font-mono">{storageStats.usedMB} MB</span>
                  <span className="text-[#8e8578]"> / 4,096 MB ({storageStats.vpsPercentUsed})</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-mono">
                  Safe
                </span>
              </div>
            )}

            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-[#f2bc88]">{artworks.length}</span>
              <span className="text-[11px] text-[#8e8578] ml-1">Live Works</span>
            </div>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 text-xs text-[#a9a296] hover:text-[#f28b82] border border-[#282635] hover:border-[#f28b82]/40 bg-[#14121b] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Reset gallery to default works"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-[#a9a296] hover:text-[#eee7dc] border border-[#282635] hover:border-[#d48b4e]/40 bg-[#14121b] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 text-[#d48b4e]" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* VPS 4GB Storage & WebP Engine Banner */}
        <section className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-[#14131d] via-[#100f17] to-[#161421] border border-[#272535] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#d48b4e]/10 text-[#d48b4e] border border-[#d48b4e]/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#fbf8f3]">
                  Automated WebP Compression & 4GB VPS Protection
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d48b4e]/20 text-[#f2bc88] border border-[#d48b4e]/40 font-mono">
                  Sharp Quality 82
                </span>
              </div>
              <p className="text-[11px] text-[#9c9386] mt-0.5">
                Every uploaded image is resized to max 1920px and converted to WebP with effort 6. Reduces file sizes by 85–97% while maintaining museum-grade chisel sharpness.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs shrink-0 font-mono bg-[#0c0b11] px-4 py-2 rounded-xl border border-[#201e2c]">
            <span className="text-[#8e8578]">VPS Mode:</span>
            <span className="text-emerald-400 font-medium">4GB Console Safe</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Upload Photo with Full Frontend Details Form */}
          {/* ======================================================== */}
          <section className="lg:col-span-5 bg-[#100f16] border border-[#23212f] rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#1e1c28]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#d48b4e]/10 text-[#d48b4e] border border-[#d48b4e]/20">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold tracking-wide text-[#fbf8f3]">
                    Upload & Publish Photo
                  </h2>
                  <p className="text-[11px] text-[#8e8578]">Auto-WebP with full frontend details</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Photo Upload Area */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-[#cfc4b2] font-medium">
                    Artwork Photo <span className="text-[#d48b4e]">*</span>
                  </label>
                  <div className="flex bg-[#161520] p-0.5 rounded-lg border border-[#262434]">
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
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#2d2b3b] hover:border-[#d48b4e]/80 bg-[#13121b]/80 hover:bg-[#171522] rounded-2xl cursor-pointer transition-all group"
                      >
                        <div className="p-3 rounded-full bg-[#1c1a27] group-hover:bg-[#d48b4e]/15 text-[#a9a296] group-hover:text-[#d48b4e] transition-colors mb-2">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium text-[#ded3c1] group-hover:text-[#fbf8f3]">
                          {isUploadingPhoto ? 'Converting to WebP...' : 'Click to browse or drop photo'}
                        </span>
                        <span className="text-[10px] text-[#787065] mt-1 text-center">
                          Auto converted to WebP (Quality 82) • Saves 4GB VPS Space
                        </span>
                      </label>
                    ) : (
                      <div className="space-y-2">
                        <div className="relative rounded-2xl overflow-hidden border border-[#2c2a3b] bg-[#14131d] group">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#09080d]/90 via-transparent to-transparent flex items-end justify-between p-3">
                            <span className="text-[11px] text-[#f2bc88] font-medium flex items-center gap-1.5">
                              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                              WebP Ready
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

                        {/* Live WebP Compression Stats Widget */}
                        {compressionMetrics && (
                          <div className="p-3 rounded-xl bg-[#0c0b11] border border-[#211f2d] flex items-center justify-between text-[11px] font-mono">
                            <div>
                              <span className="text-[#8e8578]">Original: </span>
                              <span className="text-[#a9a296]">{compressionMetrics.originalMB} MB</span>
                              <span className="mx-1.5 text-[#5e584f]">→</span>
                              <span className="text-[#8e8578]">WebP: </span>
                              <span className="text-[#f2bc88] font-semibold">{compressionMetrics.compressedKB} KB</span>
                            </div>
                            <span className="text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                              -{compressionMetrics.savingsPercent}% Space
                            </span>
                          </div>
                        )}
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
                        placeholder="https://example.com/artwork.webp or /images/..."
                        value={imageUrl}
                        onChange={handleUrlChange}
                        className="w-full bg-[#15141e] border border-[#2b2938] focus:border-[#d48b4e] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#fbf8f3] placeholder-[#6b645b] focus:outline-none transition-all"
                      />
                    </div>
                    {previewImage && (
                      <div className="relative rounded-2xl overflow-hidden border border-[#2c2a3b] bg-[#14131d]">
                        <img
                          src={previewImage}
                          alt="URL Preview"
                          className="w-full h-40 object-cover"
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

              {/* Artwork Title / Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#cfc4b2] mb-1.5 font-medium">
                  Artwork Title <span className="text-[#d48b4e]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Adiyogi Lord Shiva Cement Relief"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#15141e] border border-[#2b2938] focus:border-[#d48b4e] rounded-xl px-4 py-2.5 text-xs text-[#fbf8f3] placeholder-[#6b645b] focus:outline-none transition-all"
                  required
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#cfc4b2] font-medium">
                    Category <span className="text-[#d48b4e]">*</span>
                  </label>
                </div>
                <CategoryDropdown
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  onAddNewCategory={addCategory}
                />
              </div>

              {/* Medium & Technique (Frontend Detail) */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#cfc4b2] mb-1.5 font-medium">
                  Medium & Technique
                </label>
                <input
                  type="text"
                  placeholder="e.g. Direct High-Relief Cement Mortar"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  className="w-full bg-[#15141e] border border-[#2b2938] focus:border-[#d48b4e] rounded-xl px-4 py-2 text-xs text-[#fbf8f3] placeholder-[#6b645b] focus:outline-none transition-all"
                />
              </div>

              {/* Dimensions / Scope (Frontend Detail) */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#cfc4b2] mb-1.5 font-medium">
                  Dimensions / Scope
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10 ft (W) × 8 ft (H) Feature Wall"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full bg-[#15141e] border border-[#2b2938] focus:border-[#d48b4e] rounded-xl px-4 py-2 text-xs text-[#fbf8f3] placeholder-[#6b645b] focus:outline-none transition-all"
                />
              </div>

              {/* Description (Frontend Detail) */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#cfc4b2] mb-1.5 font-medium">
                  Artwork Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed architectural narrative of the sculpture, wall projection depth, motifs, and finish..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#15141e] border border-[#2b2938] focus:border-[#d48b4e] rounded-xl px-4 py-2.5 text-xs text-[#fbf8f3] placeholder-[#6b645b] focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Artisan Highlights (Frontend Detail - Bullet points) */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#cfc4b2] mb-1.5 font-medium">
                  Artisan Highlights / Features
                </label>
                <div className="space-y-1.5 mb-2">
                  {highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-[#15141e] px-3 py-1.5 rounded-lg border border-[#252332] text-xs"
                    >
                      <span className="text-[#ded3c1] text-[11px] truncate">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx)}
                        className="text-[#8e8578] hover:text-[#f87171] ml-2"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add bullet highlight..."
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight(e);
                      }
                    }}
                    className="flex-1 bg-[#15141e] border border-[#2b2938] focus:border-[#d48b4e] rounded-xl px-3 py-1.5 text-xs text-[#fbf8f3] placeholder-[#6b645b] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="bg-[#201d2c] hover:bg-[#2b273b] text-[#f2bc88] px-3 py-1.5 rounded-xl border border-[#2c293c] text-xs font-medium cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Aspect Ratio & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#cfc4b2] mb-1 font-medium">
                    Aspect Ratio
                  </label>
                  <select
                    value={aspect}
                    onChange={(e) => setAspect(e.target.value)}
                    className="w-full bg-[#15141e] border border-[#2b2938] focus:border-[#d48b4e] rounded-xl px-3 py-2 text-xs text-[#fbf8f3] focus:outline-none"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                    <option value="square">Square</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#cfc4b2] mb-1 font-medium">
                    Completion Date
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. October 2026"
                    className="w-full bg-[#15141e] border border-[#2b2938] focus:border-[#d48b4e] rounded-xl px-3 py-2 text-xs text-[#fbf8f3] focus:outline-none"
                  />
                </div>
              </div>

              {/* Error Alert */}
              {fileError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#2e1515] border border-[#f87171]/40 text-[#fca5a5] text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#f87171]" />
                  <span>{fileError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isUploadingPhoto}
                style={{ backgroundColor: theme.accent }}
                className="w-full mt-2 flex items-center justify-center gap-2 text-[#0b0b0e] font-semibold text-xs tracking-wider uppercase py-3.5 px-4 rounded-xl hover:brightness-110 active:scale-[0.99] transition-all shadow-lg cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? 'Publishing Artwork...'
                    : isUploadingPhoto
                    ? 'Converting Photo to WebP...'
                    : 'Publish to Atelier Portfolio'}
                </span>
              </button>
            </form>
          </section>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Existing Artworks List & Portfolio Grid    */}
          {/* ======================================================== */}
          <section className="lg:col-span-7 space-y-4">
            
            {/* Header & Search */}
            <div className="bg-[#100f16] border border-[#23212f] rounded-3xl p-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-sm font-semibold tracking-wide text-[#fbf8f3]">
                    Existing Artworks ({filteredList.length})
                  </h2>
                  <p className="text-[11px] text-[#8e8578]">
                    Delete, inspect details, or filter portfolio items
                  </p>
                </div>

                {/* Search Input */}
                <div className="relative min-w-[220px]">
                  <Search className="w-3.5 h-3.5 text-[#8a8175] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by title, medium or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#161520] text-xs text-[#eee7dc] placeholder-[#6b645b] pl-8 pr-3 py-2 rounded-xl border border-[#292737] focus:border-[#d48b4e] focus:outline-none"
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

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-dropdown-scrollbar">
                <button
                  onClick={() => setActiveFilterCat('All')}
                  className={`text-[11px] uppercase tracking-wider px-3 py-1 rounded-lg shrink-0 transition-all ${
                    activeFilterCat === 'All'
                      ? 'bg-[#d48b4e]/20 text-[#f2bc88] border border-[#d48b4e]/40 font-semibold'
                      : 'text-[#9c9386] hover:text-[#eee7dc] hover:bg-[#161520]'
                  }`}
                >
                  All ({artworks.length})
                </button>
                {categories
                  .filter((c) => c !== 'All Works')
                  .map((cat) => {
                    const count = artworks.filter((a) => a.category === cat).length;
                    const isActive = activeFilterCat === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveFilterCat(cat)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg shrink-0 transition-all ${
                          isActive
                            ? 'bg-[#d48b4e]/20 text-[#f2bc88] border border-[#d48b4e]/40 font-semibold'
                            : 'text-[#9c9386] hover:text-[#eee7dc] hover:bg-[#161520]'
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Artworks List Cards */}
            <div className="space-y-3">
              {filteredList.map((art) => {
                const artId = art.id || art._id;
                const isConfirming = confirmDeleteId === artId;

                return (
                  <div
                    key={artId}
                    className="bg-[#100f16] border border-[#211f2d] hover:border-[#d48b4e]/50 rounded-2xl p-4 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {/* Image Thumbnail */}
                      <div
                        onClick={() => setPreviewModalItem(art)}
                        className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#161520] border border-[#292737] shrink-0 cursor-pointer group/thumb"
                      >
                        <img
                          src={art.image}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            if (!e.currentTarget.dataset.triedFallback) {
                              e.currentTarget.dataset.triedFallback = 'true';
                              if (art.image && art.image.includes('/uploads/')) {
                                const base = art.image.split('/uploads/').pop().replace(/\.webp$/, '.jpeg');
                                e.currentTarget.src = `/images/crafts/${base}`;
                              }
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                          <Eye className="w-4 h-4 text-[#f2bc88]" />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#1c1a27] text-[#f2bc88] border border-[#292739]">
                            {art.category}
                          </span>
                          {art.aspect && (
                            <span className="text-[9px] uppercase tracking-wider text-[#8e8578]">
                              {art.aspect}
                            </span>
                          )}
                          {art.date && (
                            <span className="text-[9px] text-[#71695f]">
                              • {art.date}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xs font-semibold text-[#fbf8f3] group-hover:text-[#f2bc88] transition-colors truncate">
                          {art.title}
                        </h3>
                        <p className="text-[11px] text-[#8e8578] truncate mt-0.5">
                          {art.medium || 'Handcrafted Cement Relief'}
                        </p>
                        {art.dimensions && (
                          <p className="text-[10px] text-[#696155] truncate">
                            {art.dimensions}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        onClick={() => setPreviewModalItem(art)}
                        className="p-2 rounded-xl bg-[#161520] hover:bg-[#201e2c] text-[#a9a296] hover:text-[#eee7dc] border border-[#272535] transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {isConfirming ? (
                        <div className="flex items-center gap-1.5 animate-fade-in">
                          <button
                            onClick={() => handleDelete(artId, art.title)}
                            className="bg-[#3d1414] hover:bg-[#571c1c] text-[#f87171] border border-[#f87171]/40 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="bg-[#171520] text-[#a9a296] hover:text-[#eee7dc] px-2.5 py-1.5 rounded-xl text-xs border border-[#272535]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(artId)}
                          className="p-2 rounded-xl bg-[#1a141a] hover:bg-[#2f1818] text-[#8e8578] hover:text-[#f87171] border border-[#27202c] hover:border-[#f87171]/40 transition-colors"
                          title="Delete artwork"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredList.length === 0 && (
                <div className="p-12 text-center bg-[#100f16] border border-[#211f2d] rounded-3xl text-[#787065]">
                  <p className="text-sm">No artworks matched your query.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Detail Preview Lightbox Modal */}
      {previewModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#100f16] border border-[#292738] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setPreviewModalItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-[#a9a296] hover:text-[#fbf8f3]"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={previewModalItem.image}
              alt={previewModalItem.title}
              className="w-full h-72 object-cover"
            />

            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono px-2.5 py-0.5 rounded bg-[#d48b4e]/20 text-[#f2bc88] border border-[#d48b4e]/40">
                  {previewModalItem.category}
                </span>
                <span className="text-xs text-[#8e8578]">{previewModalItem.dimensions}</span>
              </div>
              <h3 className="font-display text-xl text-[#fbf8f3] font-medium">
                {previewModalItem.title}
              </h3>
              <p className="text-xs text-[#ded3c1] leading-relaxed">
                {previewModalItem.description}
              </p>
              {previewModalItem.medium && (
                <div className="text-xs text-[#a9a296]">
                  <strong>Medium: </strong> {previewModalItem.medium}
                </div>
              )}
              {previewModalItem.highlights && previewModalItem.highlights.length > 0 && (
                <div className="pt-2 border-t border-[#1e1c28]">
                  <span className="text-[11px] uppercase tracking-wider text-[#8e8578] block mb-1">
                    Artisan Highlights:
                  </span>
                  <ul className="space-y-1 text-xs text-[#ded3c1]">
                    {previewModalItem.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d48b4e]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#12111a] border border-[#2e2b3e] rounded-3xl max-w-md w-full p-6 text-center shadow-2xl space-y-4">
            <div className="inline-flex p-3 rounded-2xl bg-[#f87171]/10 text-[#f87171] border border-[#f87171]/20">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#fbf8f3]">
              Reset Portfolio to Defaults?
            </h3>
            <p className="text-xs text-[#a9a296] leading-relaxed">
              This will restore the initial portfolio works. Any newly uploaded artworks will be reset.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs bg-[#1a1824] hover:bg-[#252233] text-[#cfc4b2] border border-[#2c293c]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDefaults();
                  setShowResetConfirm(false);
                  showToast('Portfolio restored to defaults.');
                }}
                className="px-4 py-2 rounded-xl text-xs bg-[#4b1919] hover:bg-[#632222] text-[#fca5a5] border border-[#f87171]/40 font-semibold"
              >
                Yes, Reset Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
