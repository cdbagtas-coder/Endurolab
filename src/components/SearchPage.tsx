import { useState, useRef, useEffect } from 'react';
import { Search, Camera, X, Clock, TrendingUp, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { ProductCard, Product } from './ProductCard';
import { FilterOptions } from './ProductFilters';

interface SearchPageProps {
  onClose?: () => void;
  onSearch?: (query: string) => void;
  filters?: FilterOptions;
  onFilterChange?: (filters: FilterOptions) => void;
  activeFilterCount?: number;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  isProductCompatible: (product: Product) => boolean;
}

// Mock trending searches
const TRENDING_SEARCHES = [
  { id: '1', query: 'brake pads', count: '2.3k searches' },
  { id: '2', query: 'ktm parts', count: '1.8k searches' },
  { id: '3', query: 'racing helmet', count: '1.5k searches' },
  { id: '4', query: 'mx boots', count: '1.2k searches' },
  { id: '5', query: 'chain kit', count: '980 searches' },
];

// Mock popular categories for quick search
const QUICK_SEARCH_CATEGORIES = [
  'Helmets', 'Gloves', 'Boots', 'Brakes', 'Suspension', 'Tires', 'Exhaust', 'Goggles'
];

export function SearchPage({ onClose, onSearch, filters, onFilterChange, activeFilterCount, products, onAddToCart, onQuickView, isProductCompatible }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('enduro-lab-search-history');
    return saved ? JSON.parse(saved) : [];
  });
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Auto-focus search input
    const input = document.getElementById('main-search-input');
    if (input) {
      setTimeout(() => input.focus(), 100);
    }

    return () => {
      // Clean up camera stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    // Add to history
    const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('enduro-lab-search-history', JSON.stringify(newHistory));

    // Perform search
    const results = products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
    setShowResults(true);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('enduro-lab-search-history');
    toast.success('Search history cleared');
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (error) {
      toast.error('Camera access denied', {
        description: 'Please allow camera access to use visual search'
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
        processImage(imageData);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        processImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imageData: string) => {
    setIsProcessingImage(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock image recognition - randomly select relevant products
    // In a real app, this would use AI/ML to analyze the image
    const mockResults = products
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
    
    setSearchResults(mockResults);
    setShowResults(true);
    setIsProcessingImage(false);
    
    toast.success('Visual search complete!', {
      description: `Found ${mockResults.length} similar items`
    });
  };

  if (showResults) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 z-10">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowResults(false)} className="text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  placeholder="Search for parts, gear..."
                  className="pl-10 pr-4 h-10 border-slate-200"
                />
              </div>
              <button onClick={onClose} className="text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="px-4 py-4">
          {capturedImage && (
            <div className="mb-4 flex items-center gap-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
              <img src={capturedImage} alt="Search" className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <div className="flex items-center gap-2 text-teal-700 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm">Visual Search Results</span>
                </div>
                <p className="text-xs text-teal-600">Showing similar items to your image</p>
              </div>
              <button
                onClick={() => {
                  setCapturedImage(null);
                  setShowResults(false);
                }}
                className="text-teal-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="mb-4">
            <h2 className="text-slate-900 mb-1">
              {searchResults.length} Results {searchQuery && `for "${searchQuery}"`}
            </h2>
            <p className="text-sm text-slate-600">
              {capturedImage ? 'Visually similar products' : 'Matching your search'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {searchResults.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isCompatible={isProductCompatible(product)}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            ))}
          </div>

          {searchResults.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-slate-900 mb-2">No results found</h3>
              <p className="text-slate-600 mb-6">Try different keywords or use visual search</p>
              <Button
                onClick={() => setShowResults(false)}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Try Another Search
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-slate-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                id="main-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                placeholder="Search for parts, gear, accessories..."
                className="pl-10 pr-4 h-11 border-slate-200 text-base"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-teal-500 hover:bg-teal-50 rounded-lg"
              title="Search by image"
            >
              <Camera className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Search Options */}
      <div className="px-4 py-4 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-teal-700 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">Visual Search</span>
            </div>
            <p className="text-xs text-teal-600">Find parts by uploading or taking a photo</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={startCamera}
              size="sm"
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              <Camera className="w-4 h-4 mr-1" />
              Camera
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              variant="outline"
              className="border-teal-300 text-teal-700 hover:bg-teal-50"
            >
              <ImageIcon className="w-4 h-4 mr-1" />
              Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Quick Search Categories */}
      <div className="px-4 py-4">
        <h3 className="text-slate-900 text-sm mb-3">Quick Search</h3>
        <div className="flex flex-wrap gap-2">
          {QUICK_SEARCH_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSearchQuery(category);
                handleSearch(category);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-slate-100" />

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <h3 className="text-slate-900 text-sm">Recent Searches</h3>
            </div>
            <button
              onClick={handleClearHistory}
              className="text-xs text-teal-600 hover:text-teal-700"
            >
              Clear all
            </button>
          </div>
          <div className="space-y-2">
            {searchHistory.map((query, index) => (
              <div
                key={index}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg"
              >
                <button
                  onClick={() => {
                    setSearchQuery(query);
                    handleSearch(query);
                  }}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700">{query}</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newHistory = searchHistory.filter((_, i) => i !== index);
                    setSearchHistory(newHistory);
                    localStorage.setItem('enduro-lab-search-history', JSON.stringify(newHistory));
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Remove from history"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator className="bg-slate-100" />

      {/* Trending Searches */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-slate-400" />
          <h3 className="text-slate-900 text-sm">Trending Searches</h3>
        </div>
        <div className="space-y-2">
          {TRENDING_SEARCHES.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSearchQuery(item.query);
                handleSearch(item.query);
              }}
              className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-teal-600" />
                </div>
                <div>
                  <div className="text-slate-700">{item.query}</div>
                  <div className="text-xs text-slate-500">{item.count}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Camera Dialog */}
      <Dialog open={showCamera} onOpenChange={stopCamera}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Visual Search</DialogTitle>
            <DialogDescription className="text-slate-400">
              Point your camera at the part you're looking for
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-64 object-cover rounded-lg bg-black"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={capturePhoto}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              Capture Photo
            </Button>
            <Button
              onClick={stopCamera}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Processing Dialog */}
      <Dialog open={isProcessingImage} onOpenChange={() => {}}>
        <DialogContent className="bg-white border-slate-200 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Analyzing Image</DialogTitle>
            <DialogDescription className="text-slate-600">
              Finding similar products for you
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 border-4 border-teal-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
              <Sparkles className="w-8 h-8 text-teal-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
