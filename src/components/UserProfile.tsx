import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { Toaster } from './ui/sonner';
import { 
  Package,
  Bike,
  Settings,
  ChevronLeft,
  Calendar,
  X,
  Edit,
  Camera,
  MapPin,
  Truck,
  ShoppingBag,
  Receipt,
  RotateCcw,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import { SavedBike } from './MyGarage';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  avatar: string;
  bio: string;
  joinDate: string;
  totalSpent: number;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'delivered' | 'processing' | 'shipped' | 'cancelled';
  items: number;
  orderItems: OrderItem[];
  shippingAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

interface UserProfileProps {
  savedBikes: SavedBike[];
  onAddBike: (bike: SavedBike) => void;
  onRemoveBike: (id: string) => void;
  onClose?: () => void;
  onLogout?: () => void;
  onOpenSupport?: () => void;
  onOpenSettings?: () => void;
}

const MOCK_ORDERS: Order[] = [
  { 
    id: 'ORD-2025-001', 
    date: '2025-10-10', 
    total: 25199, 
    status: 'delivered', 
    items: 2,
    orderItems: [
      { id: '1', name: 'Pro Riding Boots', quantity: 1, price: 16799, image: 'https://images.unsplash.com/photo-1608229192738-4cfbd52b1bf5?w=200' },
      { id: '2', name: 'Helmet Visor Shield', quantity: 2, price: 4200, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200' }
    ],
    shippingAddress: '1234 Trail Blazer Road, Boulder, CO 80301',
    trackingNumber: 'DLV123456789PH'
  },
  { 
    id: 'ORD-2025-002', 
    date: '2025-10-08', 
    total: 8399, 
    status: 'delivered', 
    items: 1,
    orderItems: [
      { id: '1', name: 'Chain Lubricant 500ml', quantity: 1, price: 8399, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200' }
    ],
    shippingAddress: '1234 Trail Blazer Road, Boulder, CO 80301'
  },
  { 
    id: 'ORD-2025-003', 
    date: '2025-10-05', 
    total: 38078, 
    status: 'processing', 
    items: 3,
    orderItems: [
      { id: '1', name: 'Front Brake Rotor', quantity: 1, price: 11199, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200' },
      { id: '2', name: 'Air Filter Kit', quantity: 2, price: 8399, image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200' },
      { id: '3', name: 'Grip Set Premium', quantity: 1, price: 10081, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200' }
    ],
    shippingAddress: '1234 Trail Blazer Road, Boulder, CO 80301',
    estimatedDelivery: '2025-10-25'
  },
  { 
    id: 'ORD-2025-004', 
    date: '2025-09-28', 
    total: 5039, 
    status: 'delivered', 
    items: 1,
    orderItems: [
      { id: '1', name: 'Handlebar Grips', quantity: 1, price: 5039, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200' }
    ],
    shippingAddress: '1234 Trail Blazer Road, Boulder, CO 80301'
  }
];

export function UserProfile({ savedBikes, onAddBike, onRemoveBike, onClose, onLogout, onOpenSupport, onOpenSettings }: UserProfileProps) {
  const [userData] = useState<UserData>({
    firstName: 'Jake',
    lastName: 'Morrison',
    email: 'jake.morrison@endurolab.com',
    phone: '+1 (555) 123-4567',
    address: '1234 Trail Blazer Road',
    city: 'Boulder',
    state: 'CO',
    zipCode: '80301',
    avatar: 'https://images.unsplash.com/photo-1612014207252-f7f2dcd00d97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByaWRlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MDU0MjkxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    bio: 'Passionate enduro rider with 10+ years of experience. Always chasing the next trail!',
    joinDate: '2023-05-15',
    totalSpent: 76715
  });

  const [currentTab, setCurrentTab] = useState<'orders' | 'garage'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'shipped': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getInitials = () => {
    return `${userData.firstName[0]}${userData.lastName[0]}`;
  };

  const formatJoinDate = () => {
    const date = new Date(userData.joinDate);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const handleAvatarClick = () => {
    toast.info('Update Rider Photo', {
      description: 'Photo upload feature is revving up! Coming soon to ENDURO LAB.'
    });
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const handleTrackOrder = (order: Order) => {
    if (order.trackingNumber) {
      toast.success('Tracking Order', {
        description: `Tracking number: ${order.trackingNumber}`
      });
    } else {
      toast.info('Processing Order', {
        description: 'Tracking information will be available soon!'
      });
    }
  };

  const handleReorder = (order: Order) => {
    toast.success('Added to Cart', {
      description: `${order.items} item(s) from order ${order.id} added to cart!`
    });
  };

  const handleViewInvoice = (order: Order) => {
    toast.info('Invoice', {
      description: 'Invoice download feature coming soon!'
    });
  };

  const handleContactSupport = (order: Order) => {
    if (onOpenSupport) {
      onOpenSupport();
      setOrderDetailsOpen(false);
    } else {
      toast.info('Support', {
        description: 'Contact support about order ' + order.id
      });
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-slate-900 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1699542813784-34ee70ca2bc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxHcmFoYW0lMjBKYXJ2aXMlMjBlbmR1cm8lMjBtb3RvcmN5Y2xlJTIwcmFjaW5nJTIwMjAyNXxlbnwxfHx8fDE3NTg2OTM4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Enduro racing background"
            className="w-full h-full object-cover opacity-10 fixed"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/98 to-slate-900"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Simple Header */}
          <header className="bg-slate-800/80 border-b border-slate-700 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {onClose && (
                  <button
                    onClick={onClose}
                    className="text-white hover:text-teal-400 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}
                <div>
                  <h1 className="text-white">
                    {userData.firstName} {userData.lastName}
                  </h1>
                  <p className="text-teal-400 text-xs">@{userData.firstName.toLowerCase()}{userData.lastName.toLowerCase()}</p>
                </div>
              </div>
              
              {/* Settings Button */}
              {onOpenSettings && (
                <button 
                  onClick={onOpenSettings}
                  className="text-white hover:text-teal-400 transition-colors p-2"
                >
                  <Settings className="w-6 h-6" />
                </button>
              )}
            </div>
          </header>

          {/* Profile Section */}
          <div className="max-w-2xl mx-auto px-4 py-6">
            {/* Profile Header */}
            <div className="mb-6">
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="relative group">
                  <button 
                    onClick={handleAvatarClick}
                    className="relative rounded-full transition-all hover:opacity-90"
                  >
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-teal-500">
                      <AvatarImage src={userData.avatar} alt={`${userData.firstName} ${userData.lastName}`} />
                      <AvatarFallback className="bg-slate-700 text-white text-xl">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    {/* Camera icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </button>
                </div>

                {/* Stats */}
                <div className="flex-1 grid grid-cols-3 gap-2 sm:gap-4 text-center pt-2">
                  <div>
                    <p className="text-white text-lg sm:text-xl">{MOCK_ORDERS.length}</p>
                    <p className="text-slate-400 text-xs sm:text-sm">Orders</p>
                  </div>
                  <div>
                    <p className="text-white text-lg sm:text-xl">{savedBikes.length}</p>
                    <p className="text-slate-400 text-xs sm:text-sm">Bikes</p>
                  </div>
                  <div>
                    <p className="text-white text-lg sm:text-xl">₱{(userData.totalSpent / 1000).toFixed(0)}K</p>
                    <p className="text-slate-400 text-xs sm:text-sm">Spent</p>
                  </div>
                </div>
              </div>

              {/* Name and Bio */}
              <div className="mb-4">
                <h2 className="text-white mb-1">
                  {userData.firstName} {userData.lastName}
                </h2>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-teal-500 text-white border-none text-xs">
                    Pro Member
                  </Badge>
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>Joined {formatJoinDate()}</span>
                  </div>
                </div>
                {userData.bio && (
                  <p className="text-slate-300 text-sm leading-relaxed">{userData.bio}</p>
                )}
              </div>
            </div>

            <Separator className="bg-slate-700 mb-6" />

            {/* Edit Profile Button */}
            {onOpenSettings && (
              <Button
                variant="outline"
                className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600 mb-6"
                onClick={onOpenSettings}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-6 border-b border-slate-700">
              <button
                onClick={() => setCurrentTab('orders')}
                className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  currentTab === 'orders'
                    ? 'border-teal-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Orders</span>
              </button>
              <button
                onClick={() => setCurrentTab('garage')}
                className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  currentTab === 'garage'
                    ? 'border-teal-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Bike className="w-5 h-5" />
                <span>My Garage</span>
              </button>
            </div>

            {/* Orders Tab */}
            {currentTab === 'orders' && (
              <div className="space-y-3">
                {MOCK_ORDERS.map((order) => (
                  <Card 
                    key={order.id} 
                    className="bg-slate-800/95 border-slate-700 hover:border-teal-500/50 transition-colors cursor-pointer"
                    onClick={() => handleOrderClick(order)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-700 p-2 rounded">
                            <Package className="w-5 h-5 text-teal-400" />
                          </div>
                          <div>
                            <h3 className="text-white">{order.id}</h3>
                            <p className="text-xs text-slate-400">
                              {new Date(order.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(order.status)} text-white border-none text-xs`}>
                            {order.status}
                          </Badge>
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-400">
                          {order.items} {order.items === 1 ? 'item' : 'items'}
                        </div>
                        <div className="text-right">
                          <p className="text-teal-400">
                            ₱{order.total.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Garage Tab */}
            {currentTab === 'garage' && (
              <div className="space-y-3">
                {savedBikes.length === 0 ? (
                  <div className="text-center py-16 bg-slate-800/50 rounded-lg border border-slate-700">
                    <Bike className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 mb-2">No bikes in your garage</p>
                    <p className="text-sm text-slate-500">Add bikes to check part compatibility</p>
                  </div>
                ) : (
                  savedBikes.map((bike) => (
                    <Card key={bike.id} className="bg-slate-800/95 border-slate-700 hover:border-teal-500/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="bg-slate-700 p-2 rounded">
                              <Bike className="w-5 h-5 text-teal-400" />
                            </div>
                            <div>
                              <h3 className="text-white mb-1">
                                {bike.year} {bike.make}
                              </h3>
                              <p className="text-slate-300 text-sm mb-1">{bike.model}</p>
                              {bike.nickname && (
                                <p className="text-xs text-slate-400 italic">"{bike.nickname}"</p>
                              )}
                            </div>
                          </div>
                          <button
                            className="text-slate-400 hover:text-red-400 p-2 transition-colors"
                            onClick={() => onRemoveBike(bike.id)}
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order Details Sheet */}
        <Sheet open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
          <SheetContent side="bottom" className="bg-slate-800 border-slate-700 h-[90vh] overflow-y-auto">
            {selectedOrder && (
              <>
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-white text-left">
                    Order Details
                  </SheetTitle>
                  <SheetDescription className="text-slate-400">
                    View complete order information and manage your purchase
                  </SheetDescription>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-white text-sm">{selectedOrder.id}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(selectedOrder.date).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(selectedOrder.status)} text-white border-none`}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </SheetHeader>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-white mb-3 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-teal-400" />
                    Items ({selectedOrder.orderItems.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.orderItems.map((item) => (
                      <div key={item.id} className="flex gap-3 bg-slate-700/50 p-3 rounded-md">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="text-white text-sm mb-1">{item.name}</h4>
                          <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white text-sm">
                            ₱{item.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="mb-6">
                  <h3 className="text-white mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-400" />
                    Shipping Address
                  </h3>
                  <div className="bg-slate-700/50 p-4 rounded-md">
                    <p className="text-slate-300 text-sm">{selectedOrder.shippingAddress}</p>
                  </div>
                </div>

                {/* Tracking Information */}
                {(selectedOrder.trackingNumber || selectedOrder.estimatedDelivery) && (
                  <div className="mb-6">
                    <h3 className="text-white mb-3 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-teal-400" />
                      Delivery Information
                    </h3>
                    <div className="bg-slate-700/50 p-4 rounded-md space-y-2">
                      {selectedOrder.trackingNumber && (
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Tracking Number</p>
                          <p className="text-slate-300 text-sm font-mono">{selectedOrder.trackingNumber}</p>
                        </div>
                      )}
                      {selectedOrder.estimatedDelivery && (
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Estimated Delivery</p>
                          <p className="text-slate-300 text-sm">
                            {new Date(selectedOrder.estimatedDelivery).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="mb-6">
                  <h3 className="text-white mb-3 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-teal-400" />
                    Order Summary
                  </h3>
                  <div className="bg-slate-700/50 p-4 rounded-md space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="text-slate-300">
                        ₱{selectedOrder.total.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Shipping</span>
                      <span className="text-slate-300">Free</span>
                    </div>
                    <Separator className="bg-slate-600 my-2" />
                    <div className="flex justify-between">
                      <span className="text-white">Total</span>
                      <span className="text-teal-400">
                        ₱{selectedOrder.total.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pb-6">
                  {(selectedOrder.status === 'processing' || selectedOrder.status === 'shipped') && (
                    <Button
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                      onClick={() => handleTrackOrder(selectedOrder)}
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Track Order
                    </Button>
                  )}
                  
                  {selectedOrder.status === 'delivered' && (
                    <Button
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                      onClick={() => handleReorder(selectedOrder)}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reorder Items
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    onClick={() => handleViewInvoice(selectedOrder)}
                  >
                    <Receipt className="w-4 h-4 mr-2" />
                    View Invoice
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    onClick={() => handleContactSupport(selectedOrder)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
