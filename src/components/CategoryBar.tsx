import { Badge } from './ui/badge';
import { useRef, useState } from 'react';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🏍️' },
  { id: 'Engine', label: 'Engine', icon: '⚙️' },
  { id: 'Brakes', label: 'Brakes', icon: '🔧' },
  { id: 'Exhaust', label: 'Exhaust', icon: '💨' },
  { id: 'Drive & Transmission', label: 'Drive', icon: '⛓️' },
  { id: 'Electrical', label: 'Electrical', icon: '⚡' },
  { id: 'Controls', label: 'Controls', icon: '🎮' },
  { id: 'Air & Fuel', label: 'Air & Fuel', icon: '🌬️' },
  { id: 'Suspension', label: 'Suspension', icon: '🔩' },
  { id: 'Body & Frame', label: 'Body', icon: '🎨' },
  { id: 'Wheels & Tires', label: 'Tires', icon: '🛞' },
  { id: 'Bike Protection', label: 'Protection', icon: '🛡️' },
  { id: 'Rider Gear', label: 'Rider Gear', icon: '🧑‍🏍️' },
];

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryBar({ selectedCategory, onSelectCategory }: CategoryBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    setIsDown(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="bg-slate-800/95 border-b border-slate-700 py-3">
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide cursor-grab select-none"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="flex gap-2 px-4 min-w-max">
          {CATEGORIES.map((category) => {
            const isActive = 
              (category.id === 'all' && selectedCategory === 'All Categories') ||
              category.id === selectedCategory;
            
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id === 'all' ? 'All Categories' : category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <span className="text-sm">{category.icon}</span>
                <span className="text-sm">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}