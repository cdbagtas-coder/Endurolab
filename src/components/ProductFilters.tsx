import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Search, X, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { useState } from 'react';

export interface FilterOptions {
  searchQuery: string;
  category: string;
  make: string;
  model: string;
  year: string;
  priceRange: [number, number];
  sortBy: string;
}

interface ProductFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  activeFilterCount: number;
}

const CATEGORIES = [
  { value: 'All Categories', label: 'All Categories' },
  { value: 'Engine', label: 'Engine', sub: 'Top-End, Bottom-End, Valve Train' },
  { value: 'Brakes', label: 'Brakes', sub: 'Pads & Shoes, Rotors & Discs, Brake Lines' },
  { value: 'Exhaust', label: 'Exhaust', sub: '2-stroke, 4-stroke, Accessories' },
  { value: 'Drive & Transmission', label: 'Drive & Transmission', sub: 'Chains, Sprockets, Clutch kits' },
  { value: 'Electrical', label: 'Electrical', sub: 'Battery, Ignition, Lighting, Gauges' },
  { value: 'Controls', label: 'Controls', sub: 'Handlebars, Grips, Levers' },
  { value: 'Air & Fuel', label: 'Air & Fuel', sub: 'Air Filter, Fuel Management' },
  { value: 'Suspension', label: 'Suspension', sub: 'Forks & Shocks, Springs, Lowering Kits' },
  { value: 'Body & Frame', label: 'Body & Frame', sub: 'Graphics, Plastics, Seats, Mirrors' },
  { value: 'Wheels & Tires', label: 'Wheels & Tires', sub: 'Tires, Rims, Spokes, Wheel sets' },
  { value: 'Bike Protection', label: 'Bike Protection', sub: 'Crash Bars, Handguards, Frame Sliders' },
  { value: 'Rider Gear', label: 'Rider Gear', sub: 'Helmets, Goggles, Jerseys, Boots, Protection' },
];

const BIKE_MAKES = ['All Makes', 'Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'KTM', 'Husqvarna', 'Beta', 'GasGas', 'Sherco', 'TM Racing', 'Ducati', 'Triumph', 'Fantic'];
const YEARS = ['All Years', ...Array.from({ length: 25 }, (_, i) => (2025 - i).toString())];
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'rating', label: 'Highest Rated' }
];

// Quick filter presets
const PRICE_PRESETS = [
  { label: 'Under ₱5K', value: [0, 5000] as [number, number] },
  { label: '₱5K - ₱15K', value: [5000, 15000] as [number, number] },
  { label: '₱15K - ₱30K', value: [15000, 30000] as [number, number] },
  { label: 'Over ₱30K', value: [30000, 56000] as [number, number] },
];

export function ProductFilters({ filters, onFilterChange, activeFilterCount }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = () => {
    onFilterChange({
      searchQuery: '',
      category: 'All Categories',
      make: 'All Makes',
      model: '',
      year: 'All Years',
      priceRange: [0, 56000],
      sortBy: 'relevance'
    });
  };

  const isPricePresetActive = (preset: [number, number]) => {
    return filters.priceRange[0] === preset[0] && filters.priceRange[1] === preset[1];
  };

  const getActiveFilters = () => {
    const active = [];
    if (filters.category !== 'All Categories') active.push(filters.category);
    if (filters.make !== 'All Makes') active.push(filters.make);
    if (filters.year !== 'All Years') active.push(filters.year);
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 56000) {
      active.push(`₱${filters.priceRange[0].toLocaleString()} - ₱${filters.priceRange[1].toLocaleString()}`);
    }
    return active;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label className="text-slate-300">Search Parts</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name, part number..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-teal-400"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label className="text-slate-300">Category</Label>
        <Select value={filters.category} onValueChange={(value) => onFilterChange({ ...filters, category: value })}>
          <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-[300px]">
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value} className="text-white focus:bg-slate-700 focus:text-white">
                <div className="flex flex-col items-start">
                  <span>{cat.label}</span>
                  {cat.sub && <span className="text-xs text-slate-400">{cat.sub}</span>}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Make */}
      <div className="space-y-2">
        <Label className="text-slate-300">Bike Make</Label>
        <Select value={filters.make} onValueChange={(value) => onFilterChange({ ...filters, make: value })}>
          <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            {BIKE_MAKES.map((make) => (
              <SelectItem key={make} value={make} className="text-white focus:bg-slate-700 focus:text-white">
                {make}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year */}
      <div className="space-y-2">
        <Label className="text-slate-300">Bike Year</Label>
        <Select value={filters.year} onValueChange={(value) => onFilterChange({ ...filters, year: value })}>
          <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-[200px]">
            {YEARS.map((year) => (
              <SelectItem key={year} value={year} className="text-white focus:bg-slate-700 focus:text-white">
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-slate-300">Price Range</Label>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => onFilterChange({ ...filters, priceRange: value as [number, number] })}
            min={0}
            max={56000}
            step={500}
            className="[&_[role=slider]]:bg-teal-500 [&_[role=slider]]:border-teal-500"
          />
        </div>
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>₱{filters.priceRange[0].toLocaleString('en-PH')}</span>
          <span>₱{filters.priceRange[1].toLocaleString('en-PH')}</span>
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <Label className="text-slate-300">Sort By</Label>
        <Select value={filters.sortBy} onValueChange={(value) => onFilterChange({ ...filters, sortBy: value })}>
          <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className="text-white focus:bg-slate-700 focus:text-white">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          className="w-full bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          onClick={handleReset}
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  const MobileFilterContent = () => (
    <div className="space-y-4">
      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-700">Active Filters ({activeFilterCount})</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-7 text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {getActiveFilters().map((filter, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-teal-100 text-teal-700 border-teal-200"
              >
                {filter}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg p-4 border border-slate-200">
        <Label className="text-slate-900 mb-2 block">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search parts, gear..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="pl-10 border-slate-300"
          />
        </div>
      </div>

      {/* Collapsible Sections */}
      <Accordion type="multiple" defaultValue={['category', 'price', 'sort']} className="space-y-3">
        {/* Category Section */}
        <AccordionItem value="category" className="bg-white rounded-lg border border-slate-200">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center justify-between w-full pr-3">
              <span className="text-slate-900">Category</span>
              {filters.category !== 'All Categories' && (
                <Badge className="bg-teal-500 text-white border-none text-xs">
                  {filters.category}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => onFilterChange({ ...filters, category: cat.value })}
                  className={`px-3 py-2 rounded-md text-sm text-left transition-colors ${
                    filters.category === cat.value
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{cat.value === 'All Categories' ? 'All' : cat.label}</span>
                    {cat.sub && filters.category !== cat.value && (
                      <span className="text-xs text-slate-500 line-clamp-1">{cat.sub}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range Section */}
        <AccordionItem value="price" className="bg-white rounded-lg border border-slate-200">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center justify-between w-full pr-3">
              <span className="text-slate-900">Price Range</span>
              {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 56000) && (
                <Badge className="bg-teal-500 text-white border-none text-xs">
                  ₱{filters.priceRange[0].toLocaleString()} - ₱{filters.priceRange[1].toLocaleString()}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-4">
            {/* Quick Price Presets */}
            <div className="grid grid-cols-2 gap-2">
              {PRICE_PRESETS.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => onFilterChange({ ...filters, priceRange: preset.value })}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    isPricePresetActive(preset.value)
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <Separator />

            {/* Custom Range Slider */}
            <div className="space-y-3">
              <Label className="text-slate-700 text-sm">Custom Range</Label>
              <div className="px-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => onFilterChange({ ...filters, priceRange: value as [number, number] })}
                  min={0}
                  max={56000}
                  step={500}
                  className="[&_[role=slider]]:bg-teal-500 [&_[role=slider]]:border-teal-500"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-teal-600">₱{filters.priceRange[0].toLocaleString()}</span>
                <span className="text-teal-600">₱{filters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Bike Compatibility Section */}
        <AccordionItem value="compatibility" className="bg-white rounded-lg border border-slate-200">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center justify-between w-full pr-3">
              <span className="text-slate-900">Bike Compatibility</span>
              {(filters.make !== 'All Makes' || filters.year !== 'All Years') && (
                <Badge className="bg-teal-500 text-white border-none text-xs">
                  {filters.make !== 'All Makes' ? filters.make : filters.year}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-4">
            {/* Make */}
            <div className="space-y-2">
              <Label className="text-slate-700 text-sm">Make</Label>
              <Select value={filters.make} onValueChange={(value) => onFilterChange({ ...filters, make: value })}>
                <SelectTrigger className="border-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {BIKE_MAKES.map((make) => (
                    <SelectItem key={make} value={make}>
                      {make}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year */}
            <div className="space-y-2">
              <Label className="text-slate-700 text-sm">Year</Label>
              <Select value={filters.year} onValueChange={(value) => onFilterChange({ ...filters, year: value })}>
                <SelectTrigger className="border-slate-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sort Section */}
        <AccordionItem value="sort" className="bg-white rounded-lg border border-slate-200">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center justify-between w-full pr-3">
              <span className="text-slate-900">Sort By</span>
              {filters.sortBy !== 'relevance' && (
                <Badge className="bg-teal-500 text-white border-none text-xs">
                  {SORT_OPTIONS.find(opt => opt.value === filters.sortBy)?.label}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onFilterChange({ ...filters, sortBy: option.value })}
                  className={`w-full px-4 py-3 rounded-md text-sm text-left flex items-center justify-between transition-colors ${
                    filters.sortBy === option.value
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{option.label}</span>
                  {filters.sortBy === option.value && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 space-y-6">
        <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-6 sticky top-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </h2>
            {activeFilterCount > 0 && (
              <Badge className="bg-teal-500 text-white border-none">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Button & Sheet */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-full w-14 h-14 shadow-lg relative">
              <SlidersHorizontal className="w-6 h-6" />
              {activeFilterCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white border-none h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="bg-slate-50 border-slate-200 h-[90vh] rounded-t-3xl p-0">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 rounded-t-3xl">
                <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-4"></div>
                <SheetHeader>
                  <SheetTitle className="text-white text-xl flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    Filters & Sort
                  </SheetTitle>
                  <SheetDescription className="text-slate-300">
                    Refine your search to find the perfect parts
                  </SheetDescription>
                </SheetHeader>
              </div>

              {/* Scrollable Content */}
              <ScrollArea className="flex-1 px-4 py-4">
                <MobileFilterContent />
              </ScrollArea>

              {/* Footer Actions */}
              <div className="bg-white border-t border-slate-200 p-4 space-y-2">
                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white h-12"
                >
                  Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </Button>
                {activeFilterCount > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleReset();
                      setIsOpen(false);
                    }}
                    className="w-full h-10 border-slate-300 text-slate-700"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}