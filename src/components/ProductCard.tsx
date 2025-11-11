import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart, Check } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  image: string;
  description: string;
  make?: string[];
  model?: string[];
  year?: string[];
  inStock: boolean;
  rating?: number;
  reviews?: number;
}

interface ProductCardProps {
  product: Product;
  isCompatible?: boolean;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, isCompatible, onAddToCart, onQuickView }: ProductCardProps) {
  return (
    <div 
      className="bg-white rounded-md overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer"
      onClick={() => onQuickView?.(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-slate-100">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {isCompatible && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-teal-500 text-white border-none text-xs rounded-sm">
              <Check className="w-3 h-3 mr-1" />
              Fits Your Bike
            </Badge>
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
            <Badge variant="destructive" className="rounded-sm">Out of Stock</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow bg-white">
        {/* Product Name */}
        <h3 className="text-slate-900 text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              <span className="text-xs text-amber-500">⭐</span>
              <span className="text-xs text-slate-600 ml-1">{product.rating}</span>
            </div>
            <span className="text-xs text-slate-400">({product.reviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto">
          <div className="text-teal-600 mb-2">₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          
          {/* Add to Cart Button */}
          <Button
            size="sm"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white h-8 text-xs"
            disabled={!product.inStock}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </div>
  );
}