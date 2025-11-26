import { useState } from 'react';
import { Calendar } from './ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Bike, 
  Info,
  ArrowLeft,
  Search,
  Star,
  Fuel,
  Gauge,
  ChevronRight,
  Navigation
} from 'lucide-react';

interface RentalBike {
  id: string;
  name: string;
  make: string;
  model: string;
  year: string;
  image: string;
  pricePerDay: number;
  cc: string;
  fuelType: string;
  rating: number;
  available: boolean;
  features: string[];
}

interface DeliveryLocation {
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  deliveryFee: number;
  distance: number;
}

const RENTAL_BIKES: RentalBike[] = [
  {
    id: 'r1',
    name: 'KTM 250 EXC-F',
    make: 'KTM',
    model: '250 EXC-F',
    year: '2024',
    image: 'https://ultimatemotorcycling.com/wp-content/uploads/2019/06/2019-KTM-250-EXC-F-Review-dual-sport-motorcycle-9-696x464.jpg',
    pricePerDay: 2800,
    cc: '250cc',
    fuelType: '4-Stroke',
    rating: 4.9,
    available: true,
    features: ['Electric Start', 'Fuel Injection (FI)', 'WP XACT Suspension']
  },
  {
    id: 'r2',
    name: 'Honda CRF450X',
    make: 'Honda',
    model: 'CRF450X',
    year: '2024',
    image: 'https://dirtbiketest.com/wp-content/uploads/2023/01/23CRF450XFI_07.png',
    pricePerDay: 3200,
    cc: '450cc',
    fuelType: '4-Stroke',
    rating: 4.8,
    available: true,
    features: ['High Performance', 'Trail Ready', 'Heavy Duty']
  },
  {
    id: 'r3',
    name: 'Yamaha YZ250X',
    make: 'Yamaha',
    model: 'YZ250X',
    year: '2023',
    image: 'https://enduro21.com/images/2022/june-2022/yamaha-yz250x-erzberg-pro-bike/07069a80480e1b38e96e488b80d5937c5763959c_xlarge.jpg',
    pricePerDay: 2600,
    cc: '250cc',
    fuelType: '2-Stroke',
    rating: 4.7,
    available: true,
    features: ['Lightweight', '2-Stroke Power', 'Enduro Setup']
  },
  {
    id: 'r4',
    name: 'Husqvarna FE 501',
    make: 'Husqvarna',
    model: 'FE 501',
    year: '2024',
    image: 'https://ultimatemotorcycling.com/wp-content/uploads/2024/07/2023-husqvarna-fe-501s-review-long-term-test-dual-sport-motorcycle-13.webp',
    pricePerDay: 3500,
    cc: '501cc',
    fuelType: '4-Stroke',
    rating: 4.9,
    available: false,
    features: ['Premium', 'Long Range Tank', 'Competition Ready']
  },
  {
    id: 'r5',
    name: 'Beta 300 RR',
    make: 'Beta',
    model: '300 RR',
    year: '2024',
    image: 'https://www.dirtrider.com/resizer/rk37sLF8WGmMIGJ-3kI3e0PA-ng=/1037x0/smart/cloudfront-us-east-1.images.arcpublishing.com/octane/LQDHLDGJENESZDDS53COOJLQSA.jpg',
    pricePerDay: 2900,
    cc: '300cc',
    fuelType: '2-Stroke',
    rating: 4.8,
    available: true,
    features: ['Trail Friendly', 'Smooth Power', 'Italian Quality']
  },
  {
    id: 'r6',
    name: 'GasGas EC 350F',
    make: 'GasGas',
    model: 'EC 350F',
    year: '2023',
    image: 'https://enduro21.com/images/2023/august-2023/2024-gasgas-enduro-models-tested/63143_enduro-_-ec-350f-_-2024-_-static-_-technical-accessories.jpg',
    pricePerDay: 2700,
    cc: '350cc',
    fuelType: '4-Stroke',
    rating: 4.6,
    available: true,
    features: ['Versatile', 'Easy to Ride', 'Reliable']
  }
];

const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM'
];

interface RentalSchedulingProps {
  onBack: () => void;
  onScheduleComplete: (rental: any) => void;
}

export function RentalScheduling({ onBack, onScheduleComplete }: RentalSchedulingProps) {
  const [step, setStep] = useState<'select' | 'schedule' | 'location' | 'confirm'>('select');
  const [selectedBike, setSelectedBike] = useState<RentalBike | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [pickupTime, setPickupTime] = useState<string>('');
  const [returnTime, setReturnTime] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [searchQuery, setSearchQuery] = useState('');

  const calculateDeliveryFee = (address: string): number => {
    // Simulate distance-based delivery fee calculation
    const baseDeliveryFee = 500;
    const perKmFee = 25;
    const estimatedKm = Math.floor(Math.random() * 30) + 5; // Mock: 5-35km
    return baseDeliveryFee + (estimatedKm * perKmFee);
  };

  const calculateRentalDays = (): number => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const calculateTotalCost = (): number => {
    if (!selectedBike) return 0;
    const days = calculateRentalDays();
    const rentalCost = selectedBike.pricePerDay * days;
    const deliveryFee = deliveryType === 'delivery' ? calculateDeliveryFee(deliveryAddress) : 0;
    return rentalCost + deliveryFee;
  };

  const handleBikeSelect = (bike: RentalBike) => {
    if (!bike.available) {
      toast.error('This bike is currently unavailable');
      return;
    }
    setSelectedBike(bike);
    setStep('schedule');
  };

  const handleScheduleNext = () => {
    if (!startDate || !endDate || !pickupTime || !returnTime) {
      toast.error('Please complete all date and time fields');
      return;
    }
    setStep('location');
  };

  const handleLocationNext = () => {
    if (deliveryType === 'delivery' && (!deliveryAddress || !deliveryCity)) {
      toast.error('Please enter your delivery address');
      return;
    }
    setStep('confirm');
  };

  const handleConfirmRental = () => {
    const rental = {
      bike: selectedBike,
      startDate,
      endDate,
      pickupTime,
      returnTime,
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : 'Pickup at ENDURO LAB',
      deliveryCity,
      totalCost: calculateTotalCost(),
      rentalDays: calculateRentalDays()
    };
    
    toast.success('Rental scheduled successfully! Proceeding to contract signing...');
    onScheduleComplete(rental);
  };

  const filteredBikes = RENTAL_BIKES.filter(bike => 
    bike.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bike.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bike.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 pb-20">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-md flex items-center justify-center text-white hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-white">Bike Rental</h1>
              <p className="text-sm text-slate-400">
                {step === 'select' && 'Choose your bike'}
                {step === 'schedule' && 'Select rental period'}
                {step === 'location' && 'Delivery details'}
                {step === 'confirm' && 'Confirm booking'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto px-4 pb-4">
          <div className="flex items-center gap-2">
            {['select', 'schedule', 'location', 'confirm'].map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`h-2 rounded-full flex-1 ${
                  ['select', 'schedule', 'location', 'confirm'].indexOf(step) >= i
                    ? 'bg-teal-500'
                    : 'bg-slate-700'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Step 1: Select Bike */}
        {step === 'select' && (
          <div className="space-y-4">
            {/* Search */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search bikes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-900 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bike List */}
            <div className="space-y-3">
              {filteredBikes.map((bike) => (
                <Card
                  key={bike.id}
                  className={`bg-slate-800 border-slate-700 overflow-hidden cursor-pointer transition-all ${
                    !bike.available ? 'opacity-60' : 'hover:border-teal-500'
                  }`}
                  onClick={() => handleBikeSelect(bike)}
                >
                  <CardContent className="p-0">
                    <div className="flex gap-4">
                      <div className="w-32 h-32 flex-shrink-0 bg-slate-900">
                        <ImageWithFallback
                          src={bike.image}
                          alt={bike.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 py-4 pr-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-white">{bike.name}</h3>
                            <p className="text-sm text-slate-400">{bike.year} • {bike.cc}</p>
                          </div>
                          {!bike.available && (
                            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                              Unavailable
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm text-white">{bike.rating}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {bike.features.slice(0, 2).map((feature, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-slate-600 text-slate-300">
                              {feature}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-teal-400">
                            ₱{bike.pricePerDay.toLocaleString()}/day
                          </div>
                          {bike.available && (
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Schedule */}
        {step === 'schedule' && selectedBike && (
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Selected Bike</CardTitle>
                <CardDescription className="text-slate-400">
                  {selectedBike.name}
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Rental Period</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Start Date</Label>
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date: Date) => date < new Date()}
                      className="bg-slate-900 rounded-md border border-slate-700 w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">End Date</Label>
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date: Date) => date < (startDate || new Date())}
                      className="bg-slate-900 rounded-md border border-slate-700 w-full"
                    />
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Pickup Time</Label>
                    <Select value={pickupTime} onValueChange={setPickupTime}>
                      <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {TIME_SLOTS.map((time) => (
                          <SelectItem key={time} value={time} className="text-white">
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Return Time</Label>
                    <Select value={returnTime} onValueChange={setReturnTime}>
                      <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {TIME_SLOTS.map((time) => (
                          <SelectItem key={time} value={time} className="text-white">
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {startDate && endDate && (
                  <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between text-white">
                      <span>Total Rental Days:</span>
                      <span className="text-teal-400">{calculateRentalDays()} days</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('select')}
                className="flex-1 bg-slate-900 border-slate-600 text-white hover:bg-slate-800"
              >
                Back
              </Button>
              <Button
                onClick={handleScheduleNext}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 'location' && (
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Delivery Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      deliveryType === 'pickup'
                        ? 'border-teal-500 bg-teal-500/10'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    <Bike className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                    <div className="text-white text-sm">Store Pickup</div>
                    <div className="text-xs text-slate-400 mt-1">Free</div>
                  </button>
                  <button
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      deliveryType === 'delivery'
                        ? 'border-teal-500 bg-teal-500/10'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    <Navigation className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                    <div className="text-white text-sm">Delivery</div>
                    <div className="text-xs text-slate-400 mt-1">₱500+</div>
                  </button>
                </div>

                {deliveryType === 'pickup' && (
                  <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-white">ENDURO LAB</div>
                        <div className="text-sm text-slate-400 mt-1">
                          123 Motorsports Ave, Quezon City<br />
                          Metro Manila, 1100
                        </div>
                        <div className="text-sm text-teal-400 mt-2">Open: 8:00 AM - 6:00 PM</div>
                      </div>
                    </div>
                  </div>
                )}

                {deliveryType === 'delivery' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Delivery Address</Label>
                      <Input
                        placeholder="Street address, trailhead, or track location"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="bg-slate-900 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">City/Municipality</Label>
                      <Input
                        placeholder="City"
                        value={deliveryCity}
                        onChange={(e) => setDeliveryCity(e.target.value)}
                        className="bg-slate-900 border-slate-600 text-white"
                      />
                    </div>
                    {deliveryAddress && (
                      <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white text-sm">Estimated Distance:</span>
                          <span className="text-teal-400 text-sm">~{Math.floor(Math.random() * 30) + 5} km</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm">Delivery Fee:</span>
                          <span className="text-teal-400">₱{calculateDeliveryFee(deliveryAddress).toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('schedule')}
                className="flex-1 bg-slate-900 border-slate-600 text-white hover:bg-slate-800"
              >
                Back
              </Button>
              <Button
                onClick={handleLocationNext}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 'confirm' && selectedBike && (
          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <ImageWithFallback
                    src={selectedBike.image}
                    alt={selectedBike.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-white">{selectedBike.name}</h3>
                    <p className="text-sm text-slate-400">{selectedBike.year} • {selectedBike.cc}</p>
                    <p className="text-teal-400 mt-2">₱{selectedBike.pricePerDay.toLocaleString()}/day</p>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rental Period:</span>
                    <span className="text-white">{calculateRentalDays()} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pickup:</span>
                    <span className="text-white">
                      {startDate?.toLocaleDateString()} {pickupTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Return:</span>
                    <span className="text-white">
                      {endDate?.toLocaleDateString()} {returnTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Delivery Method:</span>
                    <span className="text-white capitalize">{deliveryType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-white text-right">
                      {deliveryType === 'delivery' ? deliveryAddress : 'Store Pickup'}
                    </span>
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Rental Cost:</span>
                    <span className="text-white">
                      ₱{(selectedBike.pricePerDay * calculateRentalDays()).toLocaleString()}
                    </span>
                  </div>
                  {deliveryType === 'delivery' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Delivery Fee:</span>
                      <span className="text-white">
                        ₱{calculateDeliveryFee(deliveryAddress).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <Separator className="bg-slate-700" />
                  <div className="flex justify-between">
                    <span className="text-white">Total:</span>
                    <span className="text-teal-400 text-xl">
                      ₱{calculateTotalCost().toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-300">
                      A security deposit will be required during contract signing. 
                      The deposit will be refunded after the bike is returned in good condition.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('location')}
                className="flex-1 bg-slate-900 border-slate-600 text-white hover:bg-slate-800"
              >
                Back
              </Button>
              <Button
                onClick={handleConfirmRental}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
              >
                Confirm & Continue
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
