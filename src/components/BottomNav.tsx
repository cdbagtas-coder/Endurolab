import { Home, Grid3x3, ShoppingCart, User, Bike } from 'lucide-react';
import { Badge } from './ui/badge';

interface BottomNavProps {
  currentPage: 'home' | 'categories' | 'rentals' | 'cart' | 'profile';
  onPageChange: (page: 'home' | 'categories' | 'rentals' | 'cart' | 'profile') => void;
  cartCount: number;
}

export function BottomNav({ currentPage, onPageChange, cartCount }: BottomNavProps) {
  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'categories' as const, icon: Grid3x3, label: 'Shop' },
    { id: 'rentals' as const, icon: Bike, label: 'Rentals' },
    { id: 'cart' as const, icon: ShoppingCart, label: 'Cart', badge: cartCount },
    { id: 'profile' as const, icon: User, label: 'Account' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-800 border-t border-slate-700 lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className="flex flex-col items-center justify-center flex-1 h-full relative transition-colors py-2"
            >
              <div className="relative h-6 flex items-center justify-center">
                <Icon 
                  className={`w-6 h-6 ${
                    isActive ? 'text-teal-400' : 'text-slate-400'
                  }`} 
                />
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-1 -right-3 bg-teal-500 text-white border-none h-4 min-w-4 rounded-full p-0 flex items-center justify-center text-[10px] px-1">
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>
              <span 
                className={`text-xs mt-1 ${
                  isActive ? 'text-teal-400' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}