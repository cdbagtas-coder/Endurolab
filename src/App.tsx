import { useState, useMemo, useEffect } from 'react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { ProductCard, Product } from './components/ProductCard';
import { ProductFilters, FilterOptions } from './components/ProductFilters';
import { MyGarage, SavedBike } from './components/MyGarage';
import { UserProfile } from './components/UserProfile';
import { BottomNav } from './components/BottomNav';
import { CategoryBar } from './components/CategoryBar';
import { Cart, CartItem } from './components/Cart';
import { SearchPage } from './components/SearchPage';
import { AuthPage } from './components/AuthPage';
import { RentalScheduling } from './components/RentalScheduling';
import { RentalOnboarding } from './components/RentalOnboarding';
import { PaymentManagement } from './components/PaymentManagement';
import { DeliveryTracking } from './components/DeliveryTracking';
import { MaintenanceLog } from './components/MaintenanceLog';
import { Support } from './components/Support';
import { Settings } from './components/Settings';
import { Notifications, Notification } from './components/Notifications';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { ShoppingCart, Search, Bike, Bell, User } from 'lucide-react';
import { Separator } from './components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './components/ui/dialog';
import { toast } from 'sonner@2.0.3';

// Mock product data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Moto Disc',
    price: 8399,
    category: 'Brakes',
    image: 'https://images.unsplash.com/photo-1682189165011-d4305d2b0ced?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwYnJha2UlMjBkaXNjJTIwcm90b3J8ZW58MXx8fHwxNzYyMzIzMDUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'High-performance floating disc rotor with stainless steel construction. Compatible with most MX bikes.',
    make: ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'KTM', 'Husqvarna'],
    model: ['CRF450R', 'CRF250R', 'YZ450F', 'YZ250F', 'KX450F', 'KX250F', 'RM-Z450', '450 SX-F', '250 SX-F', 'FC 450', 'FC 250'],
    year: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    inStock: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2',
    name: 'Renthal Sprocket Set',
    price: 5599,
    category: 'Drive & Transmission',
    image: 'https://tse1.mm.bing.net/th/id/OIP.v5F0VIp7c4ebw_zEf-0JDQHaHa?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: 'Complete chain and sprocket kit with reinforced links. Perfect for aggressive riding and racing.',
    make: ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'KTM', 'Husqvarna'],
    model: ['CRF450R', 'YZ450F', 'KX450F', 'RM-Z450', '450 SX-F', 'FC 450'],
    year: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    inStock: true,
    rating: 4.9,
    reviews: 89
  },
  {
    id: '3',
    name: 'Acerbis LED Headlight Kit',
    price: 8959,
    category: 'Electrical',
    image: 'https://slavensracing.com/wp-content/uploads/2020/06/LED-Headlight-Mask-KTM-2020-Orange-768x768.jpg',
    description: 'High-intensity LED headlight with durable housing. Improved visibility for night riding.',
    make: ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'KTM', 'Husqvarna', 'Beta', 'GasGas'],
    model: ['CRF450X', 'CRF300L', 'WR450F', 'KX450F', 'RM-Z450', '350 EXC-F', 'TE 300i', 'RR 300', 'EC 300'],
    year: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    inStock: true,
    rating: 4.7,
    reviews: 203
  },
  {
    id: '4',
    name: 'Astra Aurora Handlebars',
    price: 4479,
    category: 'Controls',
    image: 'https://th.bing.com/th/id/R.4d59174a74287521d0aa2335a82ccd04?rik=aVFlLkj44GAajw&riu=http%3a%2f%2fwww.smxoffroad.com%2fcdn%2fshop%2ffiles%2fAurora30mm.webp%3fv%3d1729847150&ehk=YJ6PByRnTsnrT3zltGlML%2blPgZGSDOi9RrtNm5yFc%2fE%3d&risl=&pid=ImgRaw&r=0',
    description: 'Tapered aluminum handlebars with optimal bend. Lightweight and strong construction.',
    make: ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'KTM', 'Husqvarna', 'Beta', 'GasGas'],
    year: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    inStock: true,
    rating: 4.6,
    reviews: 156
  },
  {
    id: '5',
    name: 'Michelin Enduro Medium',
    price: 7279,
    category: 'Wheels & Tires',
    image: 'https://tse2.mm.bing.net/th/id/OIP.aoJz9C5DI1xlIA8_Uhg7swHaHa?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: 'Advanced tread pattern for exceptional traction on all surfaces. Medium compound for extended life.',
    make: ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'KTM', 'Husqvarna', 'Beta', 'GasGas'],
    model: ['CRF450R', 'CRF250R', 'YZ450F', 'YZ250F', 'KX450F', 'RM-Z450', '450 SX-F', '250 SX-F', 'FC 450', 'RR 300', 'EC 300'],
    year: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    inStock: false,
    rating: 4.8,
    reviews: 94
  },
  {
    id: '6',
    name: 'Acerbis Engine Cover',
    price: 11199,
    category: 'Bike Protection',
    image: 'https://cdn11.bigcommerce.com/s-coxd9/images/stencil/1280x1280/products/128492/558528/acerbis-husqvarna-fe-250-2017-2021-x-power-cover-kit-orange-ktm-husqvarna-1__53024.1649086114.jpg?c=2',
    description: 'Heavy-duty engine crash covers to protect engine cases. Bolt-on installation.',
    make: ['KTM', 'Husqvarna','GasGas'],
    model: ['450 SX-F', '350 EXC-F', '300 XC', 'FC 450', 'TE 300i', 'EC 300'],
    year: ['2020', '2021', '2022', '2023'],
    inStock: true,
    rating: 4.9,
    reviews: 178
  },
  {
    id: '7',
    name: 'WP A-kit Shock Absorber',
    price: 19599,
    category: 'Suspension',
    image: 'https://tse1.mm.bing.net/th/id/OIP.OrtLgE25ZDKPc9U3sKFccQHaHa?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: 'Adjustable compression and rebound damping. Premium seals for long-lasting performance.',
    make: ['KTM', 'Husqvarna', 'GasGas'],
    model: ['450 SX-F', '250 SX-F', 'FC 450', 'FC 250', 'MC 450F'],
    year: ['2024', '2025'],
    inStock: true,
    rating: 4.7,
    reviews: 62
  },
  {
    id: '8',
    name: 'Yoshimura RS-9 Slip-on Exhaust',
    price: 33599,
    category: 'Exhaust',
    image: 'https://content.motosport.com/images/items/large/YSH/YSH003H/X001-Y005.jpg',
    description: 'Titanium construction for weight savings and increased horsepower. Race-proven performance.',
    make: ['Honda', 'Yamaha', 'Kawasaki'],
    model: ['CRF450R', 'CRF250R', 'YZ450F', 'YZ250F', 'KX450F', 'KX250F'],
    year: ['2021', '2022', '2023', '2024', '2025'],
    inStock: true,
    rating: 4.8,
    reviews: 45
  },
  {
    id: '9',
    name: 'SKDA Honda CRF Graphics Kit',
    price: 5039,
    category: 'Body & Frame',
    image: 'https://cdn11.bigcommerce.com/s-fdfv6fe5pb/images/stencil/1280x1280/products/4807/24984/BLADE_Red_CR-CRF_Flat_Proof_1__22478.1722576305.png?c=2',
    description: 'Premium vinyl graphics kit with UV-resistant finish. Easy installation with pre-cut panels.',
    make: ['Honda'],
    model: ['CRF450R', 'CRF250R'],
    year: ['2020', '2021', '2022', '2023'],
    inStock: true,
    rating: 4.5,
    reviews: 134
  },
  {
    id: '10',
    name: 'Twin Air Air Filter',
    price: 2799,
    category: 'Air & Fuel',
    image: 'https://tse3.mm.bing.net/th/id/OIP.98ml4V7PiOCNDVUnvH95RgHaHa?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3',
    description: 'Washable and reusable foam filter. Increases airflow for improved throttle response.',
    make: ['Yamaha'],
    model: ['YZ450F', 'YZ250F'],
    year: ['2021', '2022', '2023', '2024', '2025'],
    inStock: true,
    rating: 4.6,
    reviews: 211
  },
  {
    id: '11',
    name: 'Vertex Top-End Rebuild Kit',
    price: 8919,
    category: 'Engine',
    image: 'https://m.fortnine.ca/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/catalogimages/vertex/top-end-piston-kit-standard-bore-7596mm-1281-compression-250cc-vtktc23235a.jpg',
    description: 'Complete piston kit with rings, pin, and clips. Precision-machined for optimal performance.',
    make: ['KTM', 'Husqvarna', 'Gasgas'],
    model: ['450 SX-F', '250 SX-F', 'FC 450', 'FC 250', 'MC 450F'],
    year: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    inStock: true,
    rating: 4.8,
    reviews: 98
  },
  {
    id: '12',
    name: 'Aluminum Handguards',
    price: 3359,
    category: 'Bike Protection',
    image: 'https://images.unsplash.com/photo-1622123255593-983cc2abd888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwaGFuZGd1YXJkc3xlbnwxfHx8fDE3NjIzMjMwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Durable handguards with aluminum frame and plastic shield. Protects hands from branches and debris.',
    make: ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'KTM', 'Husqvarna', 'Beta', 'GasGas'],
    year: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    inStock: true,
    rating: 4.7,
    reviews: 72
  },
  {
    id: '13',
    name: 'Carbon Fiber Racing Helmet',
    price: 25199,
    category: 'Rider Gear',
    subcategory: 'Gears',
    image: 'https://images.unsplash.com/photo-1666978127883-beb6a3ff074b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXJ0JTIwYmlrZSUyMGhlbG1ldHxlbnwxfHx8fDE3NjA1NDIzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Ultra-lightweight carbon fiber shell with advanced ventilation system. DOT and ECE certified.',
    inStock: true,
    rating: 4.8,
    reviews: 187
  },
  {
    id: '14',
    name: 'Anti-Fog Racing Goggles',
    price: 5039,
    category: 'Rider Gear',
    subcategory: 'Gears',
    image: 'https://images.unsplash.com/photo-1666978127883-beb6a3ff074b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvY3Jvc3MlMjBnb2dnbGVzfGVufDF8fHx8MTc2MjMyMzA1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Triple-layer foam with anti-fog lens technology. Includes tear-offs and protective case.',
    inStock: true,
    rating: 4.6,
    reviews: 142
  },
  {
    id: '15',
    name: 'MX Pro Racing Boots',
    price: 22399,
    category: 'Rider Gear',
    subcategory: 'Layers & Protection',
    image: 'https://images.unsplash.com/photo-1707855888708-f5c56bdeef5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvY3Jvc3MlMjByYWNpbmclMjBib290c3xlbnwxfHx8fDE3NjIzMjMwNTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Premium motocross boots with reinforced shin plates and ankle protection. Heat-resistant soles.',
    inStock: true,
    rating: 4.9,
    reviews: 203
  },
  {
    id: '16',
    name: 'Performance Riding Jersey',
    price: 3919,
    category: 'Rider Gear',
    subcategory: 'Gears',
    image: 'https://images.unsplash.com/photo-1689916342542-7212fa4ab9a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvY3Jvc3MlMjBqZXJzZXl8ZW58MXx8fHwxNzYyMzIzMDU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Lightweight moisture-wicking jersey with ventilated mesh panels. Designed for maximum comfort.',
    inStock: true,
    rating: 4.5,
    reviews: 128
  },
  {
    id: '17',
    name: 'Riding Pants - Pro Series',
    price: 6719,
    category: 'Rider Gear',
    subcategory: 'Gears',
    image: 'https://images.unsplash.com/photo-1586708594147-e9c0d72f0c83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvY3Jvc3MlMjByaWRpbmclMjBwYW50c3xlbnwxfHx8fDE3NjIzMjMwNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Durable riding pants with reinforced knees and seat. Multiple stretch panels for flexibility.',
    inStock: true,
    rating: 4.7,
    reviews: 95
  },
  {
    id: '18',
    name: 'Premium Racing Gloves',
    price: 4479,
    category: 'Rider Gear',
    subcategory: 'Gears',
    image: 'https://images.unsplash.com/photo-1713370763729-ebfcaa96c23d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvY3Jvc3MlMjBnbG92ZXN8ZW58MXx8fHwxNzYyMzIzMDU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Ergonomic design with pre-curved fingers and reinforced palm. Superior grip and comfort.',
    inStock: true,
    rating: 4.6,
    reviews: 156
  },
  {
    id: '19',
    name: 'Chest Protector - Impact Shield',
    price: 8959,
    category: 'Rider Gear',
    subcategory: 'Layers & Protection',
    image: 'https://images.unsplash.com/photo-1643653856274-029a87ee0699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvY3Jvc3MlMjByaWRpbmclMjBib290c3xlbnwxfHx8fDE3NjA1NDIzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'CE-certified chest and back protection with adjustable straps. Lightweight and breathable design.',
    inStock: true,
    rating: 4.8,
    reviews: 89
  },
  {
    id: '20',
    name: 'Knee Guards - Pro Protection',
    price: 6159,
    category: 'Rider Gear',
    subcategory: 'Layers & Protection',
    image: 'https://images.unsplash.com/photo-1643653856274-029a87ee0699?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvY3Jvc3MlMjByaWRpbmclMjBib290c3xlbnwxfHx8fDE3NjA1NDIzMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Advanced knee and shin protection with impact-absorbing foam. Adjustable straps for secure fit.',
    inStock: true,
    rating: 4.7,
    reviews: 112
  },
  {
    id: '21',
    name: 'Base Layer Compression Shirt',
    price: 2799,
    category: 'Rider Gear',
    subcategory: 'Layers & Protection',
    image: 'https://images.unsplash.com/photo-1760468252035-56df918f38d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvY3Jvc3MlMjBnbG92ZXMlMjBnZWFyfGVufDF8fHx8fDE3NjA1NDIzMjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Moisture-wicking compression base layer for all-day comfort. Temperature regulating fabric.',
    inStock: true,
    rating: 4.4,
    reviews: 76
  },
  {
    id: '22',
    name: 'Waterproof Rain Gear Set',
    price: 5599,
    category: 'Rider Gear',
    subcategory: 'Layers & Protection',
    image: 'https://images.unsplash.com/photo-1760468252035-56df918f38d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvY3Jvc3MlMjBnbG92ZXMlMjBnZWFyfGVufDF8fHx8fDE3NjA1NDIzMjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Lightweight waterproof jacket and pants combo. Packable design for easy storage.',
    inStock: true,
    rating: 4.5,
    reviews: 64
  }
];

export default function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<{ email: string; name: string } | null>(null);

  // Profile update handler
  const handleUpdateProfile = (data: { name: string; email: string; phone?: string; bio?: string; address?: string; city?: string; state?: string; zipCode?: string }) => {
    // Update the essential user info (name and email) in state and localStorage
    setUserInfo({ email: data.email, name: data.name });
    const authData = { email: data.email, name: data.name };
    localStorage.setItem('endurolab_auth', JSON.stringify(authData));
    
    // Store extended profile data separately
    const profileData = {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      bio: data.bio || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      zipCode: data.zipCode || ''
    };
    localStorage.setItem('endurolab_profile', JSON.stringify(profileData));
  };

  // Check for saved auth on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('endurolab_auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUserInfo(authData);
    }
  }, []);
  
  // TEMPORARY: Add logout button on auth page for testing - remove this later
  // To preview auth page: Clear localStorage or click "Logout" in Profile Settings

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    category: 'All Categories',
    make: 'All Makes',
    model: '',
    year: 'All Years',
    priceRange: [0, 56000],
    sortBy: 'relevance'
  });

  const [savedBikes, setSavedBikes] = useState<SavedBike[]>([]);
  const [selectedBike, setSelectedBike] = useState<SavedBike | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentPage, setCurrentPage] = useState<'home' | 'categories' | 'rentals' | 'cart' | 'profile'>('home');
  const [showSearch, setShowSearch] = useState(false);
  
  // Rental flow state
  const [rentalFlow, setRentalFlow] = useState<'list' | 'onboarding' | 'payment' | 'tracking' | 'maintenance' | null>(null);
  const [selectedRental, setSelectedRental] = useState<any>(null);
  
  // Support state
  const [showSupport, setShowSupport] = useState(false);
  
  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  
  // Checkout flow state
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let results = [...MOCK_PRODUCTS];

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category !== 'All Categories') {
      results = results.filter(p => p.category === filters.category);
    }

    // Make filter
    if (filters.make !== 'All Makes') {
      results = results.filter(p => p.make?.includes(filters.make));
    }

    // Year filter
    if (filters.year !== 'All Years') {
      results = results.filter(p => p.year?.includes(filters.year));
    }

    // Price filter
    results = results.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return results;
  }, [filters]);

  // Check compatibility with selected bike
  const isProductCompatible = (product: Product) => {
    if (!selectedBike || !product.make) return false;
    
    const makeMatch = product.make.includes(selectedBike.make);
    const modelMatch = !product.model || product.model.includes(selectedBike.model);
    const yearMatch = !product.year || product.year.includes(selectedBike.year);
    
    return makeMatch && modelMatch && yearMatch;
  };

  const activeFilterCount = [
    filters.searchQuery !== '',
    filters.category !== 'All Categories',
    filters.make !== 'All Makes',
    filters.year !== 'All Years',
    filters.priceRange[0] !== 0 || filters.priceRange[1] !== 56000
  ].filter(Boolean).length;

  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      }]);
    }
    toast.success('Added to cart!', {
      description: product.name
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success('Removed from cart');
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Handle login
  const handleLogin = (email: string, name: string) => {
    const authData = { email, name };
    localStorage.setItem('endurolab_auth', JSON.stringify(authData));
    // Set flag to indicate user has logged in before
    localStorage.setItem('endurolab_has_logged_in_before', 'true');
    setIsAuthenticated(true);
    setUserInfo(authData);
    // Reset navigation state to home page
    setCurrentPage('home');
    setShowSettings(false);
    setShowSupport(false);
    setShowNotifications(false);
    setShowSearch(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('endurolab_auth');
    setIsAuthenticated(false);
    setUserInfo(null);
    setCartItems([]);
    setSavedBikes([]);
    setCurrentPage('home');
    setShowSettings(false);
    setShowSupport(false);
    setShowNotifications(false);
    setShowSearch(false);
    toast.success('Logged out successfully');
  };

  // Handle page navigation
  const handlePageChange = (page: 'home' | 'categories' | 'rentals' | 'cart' | 'profile') => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    // Check if user has logged in before to determine default view
    const hasLoggedInBefore = localStorage.getItem('endurolab_has_logged_in_before') === 'true';
    return <AuthPage onLogin={handleLogin} defaultToLogin={hasLoggedInBefore} />;
  }

  // Render different pages
  if (showNotifications) {
    return <Notifications onClose={() => setShowNotifications(false)} />;
  }

  if (showSearch) {
    return (
      <SearchPage
        onClose={() => setShowSearch(false)}
        onSearch={(query) => {
          setFilters({ ...filters, searchQuery: query });
          setShowSearch(false);
        }}
        products={MOCK_PRODUCTS}
        onAddToCart={handleAddToCart}
        onQuickView={setSelectedProduct}
        isProductCompatible={isProductCompatible}
      />
    );
  }

  // Support Page - Check before profile page
  if (showSupport) {
    return (
      <>
        <Support onBack={() => {
          setShowSupport(false);
          handlePageChange('profile');
        }} />
        <BottomNav currentPage={currentPage} onPageChange={handlePageChange} cartCount={cartCount} />
      </>
    );
  }

  // Settings Page - Check before profile page
  if (showSettings) {
    return (
      <>
        <Settings 
          onBack={() => {
            setShowSettings(false);
            handlePageChange('profile');
          }} 
          onLogout={handleLogout}
          userInfo={userInfo}
          onUpdateProfile={handleUpdateProfile}
        />
        <BottomNav currentPage={currentPage} onPageChange={handlePageChange} cartCount={cartCount} />
      </>
    );
  }

  if (currentPage === 'profile') {
    return (
      <>
        <UserProfile
          savedBikes={savedBikes}
          onAddBike={(bike) => setSavedBikes([...savedBikes, bike])}
          onRemoveBike={(id) => setSavedBikes(savedBikes.filter(b => b.id !== id))}
          onClose={() => handlePageChange('home')}
          onLogout={handleLogout}
          onOpenSupport={() => setShowSupport(true)}
          onOpenSettings={() => setShowSettings(true)}
        />
        <BottomNav currentPage={currentPage} onPageChange={handlePageChange} cartCount={cartCount} />
      </>
    );
  }

  if (currentPage === 'cart') {
    // Show payment page during checkout
    if (isCheckingOut) {
      return (
        <>
          <PaymentManagement
            rentalInfo={{ totalCost: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) }}
            onboardingData={{}}
            isRental={false}
            onBack={() => setIsCheckingOut(false)}
            onComplete={() => {
              const orderTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
              setCartItems([]);
              setIsCheckingOut(false);
              setCurrentPage('home');
              setHasUnreadNotifications(true);
              toast.success('Payment Processed Successfully!', {
                description: `Order total: ₱${orderTotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Check notifications for details.`
              });
            }}
          />
          <BottomNav currentPage={currentPage} onPageChange={handlePageChange} cartCount={cartCount} />
        </>
      );
    }
    
    return (
      <>
        <Cart
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={() => setIsCheckingOut(true)}
          onBack={() => handlePageChange('home')}
        />
        <BottomNav currentPage={currentPage} onPageChange={handlePageChange} cartCount={cartCount} />
      </>
    );
  }

  if (currentPage === 'categories') {
    return (
      <>
        <SearchPage
          onClose={() => handlePageChange('home')}
          filters={filters}
          onFilterChange={setFilters}
          activeFilterCount={activeFilterCount}
          products={filteredProducts}
          onAddToCart={handleAddToCart}
          onQuickView={setSelectedProduct}
          isProductCompatible={isProductCompatible}
        />
        <BottomNav currentPage={currentPage} onPageChange={handlePageChange} cartCount={cartCount} />
      </>
    );
  }

  // Rental Pages
  if (currentPage === 'rentals') {
    // Rental Maintenance Log
    if (rentalFlow === 'maintenance') {
      return (
        <>
          <MaintenanceLog 
            bikeId={selectedRental?.bike?.id || 'rental-001'}
            bikeName={selectedRental?.bike?.name || 'Rental Bike'}
            onBack={() => setRentalFlow(null)}
          />
          <BottomNav currentPage={currentPage} onPageChange={handlePageChange} cartCount={cartCount} />
        </>
      );
    }

    // Rental Tracking
    if (rentalFlow === 'tracking') {
      return (
        <>
          <DeliveryTracking 
            orderId={selectedRental?.bike?.id || 'RENT-001'}
            orderType="rental"
            deliveryType={selectedRental?.deliveryType || 'delivery'}
            onBack={() => {
              setRentalFlow(null);
              toast.success('Rental delivered successfully!');
            }}
          />
          <BottomNav currentPage={currentPage} onPageChange={handlePageChange} cartCount={cartCount} />
        </>
      );
    }

    // Payment Management
    if (rentalFlow === 'payment' && selectedRental) {
      return (
        <>
          <PaymentManagement 
            rentalInfo={selectedRental}
            onboardingData={{}}
            onComplete={() => {
              setRentalFlow('tracking');
              toast.success('Payment processed successfully!');
            }}
            onBack={() => setRentalFlow('onboarding')}
          />
          <BottomNav currentPage={currentPage} onPageChange={handlePageChange} cartCount={cartCount} />
        </>
      );
    }

    // Rental Onboarding
    if (rentalFlow === 'onboarding' && selectedRental) {
      return (
        <>
          <RentalOnboarding 
            rentalInfo={selectedRental}
            onComplete={() => {
              setRentalFlow('payment');
              toast.success('Documents verified successfully!');
            }}
            onBack={() => setRentalFlow(null)}
          />
          <BottomNav currentPage={currentPage} onPageChange={handlePageChange} cartCount={cartCount} />
        </>
      );
    }

    // Rental Scheduling (List)
    return (
      <>
        <RentalScheduling 
          onScheduleComplete={(booking) => {
            setSelectedRental(booking);
            setRentalFlow('onboarding');
            toast.success('Booking confirmed! Please complete verification.');
          }}
          onBack={() => handlePageChange('home')}
        />
        <BottomNav currentPage={currentPage} onPageChange={handlePageChange} cartCount={cartCount} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-6">
      {/* Top Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-white text-lg sm:text-xl tracking-wider">ENDURO LAB</h1>
              <p className="text-teal-400 text-xs hidden sm:block">Dirt Bike Parts & Gear</p>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <button
                onClick={() => setShowSearch(true)}
                className="relative w-full text-left"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <div className="pl-10 pr-4 h-10 bg-white border-none rounded-md w-full flex items-center text-slate-400">
                  Search for parts, gear, accessories...
                </div>
              </button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="md:hidden p-2 text-white hover:bg-slate-700 rounded-lg"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* My Garage */}
              <div className="hidden lg:block">
                <MyGarage
                  savedBikes={savedBikes}
                  onAddBike={(bike) => setSavedBikes([...savedBikes, bike])}
                  onRemoveBike={(id) => setSavedBikes(savedBikes.filter(b => b.id !== id))}
                  onSelectBike={setSelectedBike}
                  selectedBike={selectedBike}
                />
              </div>

              {/* Notifications */}
              <button 
                onClick={() => setShowNotifications(true)}
                className="hidden sm:block p-2 text-white hover:bg-slate-700 rounded-lg relative"
              >
                <Bell className="w-5 h-5" />
                {hasUnreadNotifications && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Rentals - Desktop */}
              <button
                onClick={() => handlePageChange('rentals')}
                className="hidden lg:flex items-center gap-2 px-4 py-2 text-white hover:bg-slate-700 rounded-lg"
              >
                <Bike className="w-5 h-5" />
                <span>Rentals</span>
              </button>

              {/* Cart - Desktop */}
              <button
                onClick={() => handlePageChange('cart')}
                className="hidden lg:flex items-center gap-2 px-4 py-2 text-white hover:bg-slate-700 rounded-lg relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <Badge className="bg-teal-500 text-white border-none">
                    {cartCount}
                  </Badge>
                )}
              </button>

              {/* Profile - Desktop */}
              <button
                onClick={() => handlePageChange('profile')}
                className="hidden lg:flex items-center gap-2 px-4 py-2 text-white hover:bg-slate-700 rounded-lg"
              >
                <User className="w-5 h-5" />
                <span>Account</span>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {showSearch && (
            <div className="md:hidden mt-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search for parts, gear..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="pl-10 pr-4 h-10 bg-white border-none rounded-lg w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Selected Bike Banner */}
        {selectedBike && (
          <div className="bg-teal-500 px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 text-white text-sm">
                <Bike className="w-4 h-4" />
                <span>Showing parts for: {selectedBike.year} {selectedBike.make} {selectedBike.model}</span>
              </div>
              <button
                onClick={() => setSelectedBike(null)}
                className="text-white text-xs underline"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Category Bar */}
      <CategoryBar
        selectedCategory={filters.category}
        onSelectCategory={(category) => setFilters({ ...filters, category })}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
            activeFilterCount={activeFilterCount}
          />

          {/* Product Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-slate-900">
                  {filters.category !== 'All Categories' ? filters.category : 'All Products'}
                </h2>
                <p className="text-slate-600 text-sm">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>

              {/* My Garage - Mobile */}
              <div className="lg:hidden">
                <MyGarage
                  savedBikes={savedBikes}
                  onAddBike={(bike) => setSavedBikes([...savedBikes, bike])}
                  onRemoveBike={(id) => setSavedBikes(savedBikes.filter(b => b.id !== id))}
                  onSelectBike={setSelectedBike}
                  selectedBike={selectedBike}
                />
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              filters.category === 'Rider Gear' ? (
                <div className="space-y-8">
                  {/* Gears Subcategory */}
                  {filteredProducts.filter(p => p.subcategory === 'Gears').length > 0 && (
                    <div>
                      <div className="mb-4">
                        <h3 className="text-slate-900 flex items-center gap-2">
                          <span className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-3 py-1 rounded-md text-sm">Gears</span>
                        </h3>
                        <p className="text-slate-600 text-sm mt-1">Helmets • Goggles • Riding Gear (Jerseys, Pants, Gloves)</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {filteredProducts.filter(p => p.subcategory === 'Gears').map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            isCompatible={isProductCompatible(product)}
                            onAddToCart={handleAddToCart}
                            onQuickView={setSelectedProduct}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Layers & Protection Subcategory */}
                  {filteredProducts.filter(p => p.subcategory === 'Layers & Protection').length > 0 && (
                    <div>
                      <div className="mb-4">
                        <h3 className="text-slate-900 flex items-center gap-2">
                          <span className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-3 py-1 rounded-md text-sm">Layers & Protection</span>
                        </h3>
                        <p className="text-slate-600 text-sm mt-1">Base Layers • Mid Layers • Rain Gear • Protection • Boots</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {filteredProducts.filter(p => p.subcategory === 'Layers & Protection').map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            isCompatible={isProductCompatible(product)}
                            onAddToCart={handleAddToCart}
                            onQuickView={setSelectedProduct}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isCompatible={isProductCompatible(product)}
                      onAddToCart={handleAddToCart}
                      onQuickView={setSelectedProduct}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-lg">
                <p className="text-slate-600 mb-4">No products found matching your criteria</p>
                <Button
                  onClick={() => setFilters({
                    searchQuery: '',
                    category: 'All Categories',
                    make: 'All Makes',
                    model: '',
                    year: 'All Years',
                    priceRange: [0, 56000],
                    sortBy: 'relevance'
                  })}
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile */}
      <BottomNav currentPage={currentPage} onPageChange={handlePageChange} cartCount={cartCount} />

      {/* Product Quick View Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-slate-900">{selectedProduct.name}</DialogTitle>
                <DialogDescription className="text-slate-600">
                  {selectedProduct.category}
                </DialogDescription>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <ImageWithFallback
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-3xl text-teal-600">₱{selectedProduct.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    {selectedProduct.rating && (
                      <div className="text-sm text-slate-600 mt-1 flex items-center gap-1">
                        <span className="text-amber-500">⭐</span>
                        {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                      </div>
                    )}
                  </div>
                  
                  <Separator className="bg-slate-200" />
                  
                  <div>
                    <p className="text-slate-700">{selectedProduct.description}</p>
                  </div>

                  {selectedProduct.make && selectedProduct.make.length > 0 && (
                    <>
                      <Separator className="bg-slate-200" />
                      <div>
                        <h4 className="text-slate-900 mb-2">Compatibility</h4>
                        <p className="text-sm text-slate-600">
                          <strong>Makes:</strong> {selectedProduct.make.join(', ')}
                        </p>
                        {selectedProduct.model && (
                          <p className="text-sm text-slate-600 mt-1">
                            <strong>Models:</strong> {selectedProduct.model.join(', ')}
                          </p>
                        )}
                        {selectedProduct.year && (
                          <p className="text-sm text-slate-600 mt-1">
                            <strong>Years:</strong> {selectedProduct.year.join(', ')}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  <Button
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white h-12"
                    disabled={!selectedProduct.inStock}
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {selectedProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}