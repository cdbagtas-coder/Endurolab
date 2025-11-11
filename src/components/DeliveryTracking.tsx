import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';
import { 
  MapPin, 
  Phone, 
  MessageCircle,
  Navigation,
  Clock,
  CheckCircle2,
  Package,
  Bike,
  ArrowLeft,
  Star,
  AlertCircle,
  Send
} from 'lucide-react';

interface TrackingStatus {
  id: string;
  status: 'confirmed' | 'preparing' | 'in_transit' | 'nearby' | 'delivered';
  label: string;
  time: string;
  completed: boolean;
}

interface DeliveryTrackingProps {
  orderId: string;
  orderType: 'rental' | 'parts';
  deliveryType?: 'pickup' | 'delivery';
  onBack: () => void;
}

export function DeliveryTracking({ orderId, orderType, deliveryType = 'delivery', onBack }: DeliveryTrackingProps) {
  const [currentStatus, setCurrentStatus] = useState<string>('preparing');
  const [estimatedTime, setEstimatedTime] = useState(25);
  const [driverLocation, setDriverLocation] = useState({ lat: 14.5995, lng: 120.9842 });
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // Simulate real-time tracking updates
  useEffect(() => {
    const statuses = ['confirmed', 'preparing', 'in_transit', 'nearby', 'delivered'];
    let currentIndex = statuses.indexOf(currentStatus);

    const interval = setInterval(() => {
      if (currentIndex < statuses.length - 1) {
        currentIndex++;
        setCurrentStatus(statuses[currentIndex]);
        setEstimatedTime(prev => Math.max(0, prev - 8));
        
        // Send push notification
        if (statuses[currentIndex] === 'in_transit') {
          toast.success(deliveryType === 'delivery' ? 'Driver is on the way!' : 'Your order is being prepared!', {
            description: deliveryType === 'delivery' ? 'Your order is en route to your location' : 'Ready for pickup soon'
          });
        } else if (statuses[currentIndex] === 'nearby') {
          toast.success(deliveryType === 'delivery' ? 'Driver is nearby!' : 'Ready for pickup!', {
            description: deliveryType === 'delivery' ? 'Estimated arrival in 5 minutes' : 'You can now pick up your order'
          });
        } else if (statuses[currentIndex] === 'delivered') {
          toast.success(deliveryType === 'delivery' ? 'Delivered!' : 'Pickup Complete!', {
            description: deliveryType === 'delivery' ? 'Your order has been delivered' : 'Thank you for your order'
          });
        }
      }
    }, 10000); // Update every 10 seconds for demo

    return () => clearInterval(interval);
  }, [currentStatus, deliveryType]);

  const trackingSteps: TrackingStatus[] = [
    {
      id: 'confirmed',
      status: 'confirmed',
      label: 'Order Confirmed',
      time: '2:30 PM',
      completed: true
    },
    {
      id: 'preparing',
      status: 'preparing',
      label: orderType === 'rental' ? 'Bike Preparation' : 'Packing Items',
      time: '2:35 PM',
      completed: currentStatus !== 'confirmed'
    },
    {
      id: 'in_transit',
      status: 'in_transit',
      label: deliveryType === 'delivery' ? 'On the Way' : 'Ready for Pickup',
      time: '2:45 PM',
      completed: ['in_transit', 'nearby', 'delivered'].includes(currentStatus)
    },
    {
      id: 'nearby',
      status: 'nearby',
      label: deliveryType === 'delivery' ? 'Nearby' : 'Awaiting Pickup',
      time: '3:05 PM',
      completed: ['nearby', 'delivered'].includes(currentStatus)
    },
    {
      id: 'delivered',
      status: 'delivered',
      label: deliveryType === 'delivery' ? 'Delivered' : 'Picked Up',
      time: currentStatus === 'delivered' ? '3:10 PM' : 'Pending',
      completed: currentStatus === 'delivered'
    }
  ];

  const driverInfo = {
    name: 'Miguel Santos',
    rating: 4.9,
    phone: '+63 912 345 6789',
    vehicle: 'White Toyota Hilux',
    plateNumber: 'ABC 1234',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel'
  };

  const getStatusColor = () => {
    switch (currentStatus) {
      case 'confirmed':
      case 'preparing':
        return 'bg-blue-500';
      case 'in_transit':
        return 'bg-yellow-500';
      case 'nearby':
        return 'bg-orange-500';
      case 'delivered':
        return 'bg-green-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getProgressPercentage = () => {
    const index = trackingSteps.findIndex(step => step.status === currentStatus);
    return ((index + 1) / trackingSteps.length) * 100;
  };

  const handleRatingSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    toast.success('Thank you for your feedback!');
    setShowRatingDialog(false);
    setTimeout(() => {
      onBack();
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    toast.success('Message sent to driver');
    setChatMessage('');
    setShowChat(false);
  };

  const handleCall = () => {
    toast.success(`Calling ${driverInfo.name}...`, {
      description: driverInfo.phone
    });
  };

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
            <div className="flex-1">
              <h1 className="text-white">{deliveryType === 'delivery' ? 'Track Delivery' : 'Track Order'}</h1>
              <p className="text-sm text-slate-400">Order #{orderId}</p>
            </div>
            <Badge className={`${getStatusColor()} text-white border-none`}>
              {trackingSteps.find(s => s.status === currentStatus)?.label}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Map Placeholder - Only show for delivery type */}
        {deliveryType === 'delivery' && (
          <Card className="bg-slate-800 border-slate-700 overflow-hidden">
            <div className="relative h-64 bg-slate-900">
              {/* Simulated Map */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-teal-400 mx-auto mb-2 animate-bounce" />
                  <p className="text-white text-sm">Live Location Tracking</p>
                  <p className="text-slate-400 text-xs mt-1">
                    Driver is {currentStatus === 'nearby' ? '0.5' : '3.2'} km away
                  </p>
                </div>
              </div>

              {/* Mock map overlay */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <path
                    d="M 10,50 Q 30,20 50,50 T 90,50"
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                </svg>
              </div>

              {/* ETA Badge */}
              {currentStatus !== 'delivered' && (
                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-400" />
                    <div>
                      <p className="text-xs text-slate-400">Estimated Arrival</p>
                      <p className="text-white">{estimatedTime} minutes</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Store Pickup Info - Only show for pickup type */}
        {deliveryType === 'pickup' && currentStatus !== 'delivered' && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-8 h-8 text-teal-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-white text-lg mb-2">Pickup Location</h3>
                  <p className="text-slate-300">ENDURO LAB</p>
                  <p className="text-sm text-slate-400 mt-1">
                    123 Motorsports Ave, Quezon City<br />
                    Metro Manila, 1100
                  </p>
                  <div className="mt-3 p-3 bg-teal-500/10 border border-teal-500/30 rounded-md">
                    <p className="text-teal-400 text-sm">Store Hours: 8:00 AM - 6:00 PM</p>
                    <p className="text-slate-300 text-xs mt-1">Please bring a valid ID for pickup</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Driver Info - Only show for delivery type */}
        {deliveryType === 'delivery' && ['in_transit', 'nearby'].includes(currentStatus) && (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-teal-500">
                  <AvatarImage src={driverInfo.avatar} />
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white">{driverInfo.name}</h3>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-white">{driverInfo.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">{driverInfo.vehicle}</p>
                  <p className="text-xs text-slate-500">{driverInfo.plateNumber}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    className="bg-teal-500 hover:bg-teal-600 text-white"
                    onClick={handleCall}
                  >
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    className="bg-slate-900 border border-slate-700 text-teal-400 hover:bg-slate-800"
                    onClick={() => setShowChat(true)}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Timeline */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{deliveryType === 'delivery' ? 'Delivery Status' : 'Order Status'}</CardTitle>
            <Progress value={getProgressPercentage()} className="mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trackingSteps.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed
                        ? 'bg-teal-500'
                        : 'bg-slate-700'
                    }`}>
                      {step.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-slate-500" />
                      )}
                    </div>
                    {index < trackingSteps.length - 1 && (
                      <div className={`w-0.5 h-12 ${
                        step.completed ? 'bg-teal-500' : 'bg-slate-700'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`${step.completed ? 'text-white' : 'text-slate-400'}`}>
                        {step.label}
                      </h4>
                      <span className="text-sm text-slate-500">{step.time}</span>
                    </div>
                    {step.status === currentStatus && (
                      <p className="text-sm text-teal-400">In progress...</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              {orderType === 'rental' ? (
                <Bike className="w-10 h-10 text-teal-400" />
              ) : (
                <Package className="w-10 h-10 text-teal-400" />
              )}
              <div>
                <h4 className="text-white">
                  {orderType === 'rental' ? 'KTM 250 EXC-F Rental' : 'Parts & Gear Order'}
                </h4>
                <p className="text-sm text-slate-400">
                  {orderType === 'rental' ? '3-day rental period' : '5 items'}
                </p>
              </div>
            </div>

            <Separator className="bg-slate-700" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">{deliveryType === 'delivery' ? 'Delivery Address:' : 'Pickup Location:'}</span>
                <span className="text-white text-right">
                  {deliveryType === 'delivery' ? '123 Trail Road, Antipolo City' : 'ENDURO LAB, Quezon City'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Contact Number:</span>
                <span className="text-white">+63 912 345 6789</span>
              </div>
              {deliveryType === 'delivery' && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery Fee:</span>
                  <span className="text-white">₱750</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        {currentStatus === 'nearby' && (
          <Card className="bg-yellow-500/10 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm">
                    {deliveryType === 'delivery' ? 'Driver is nearby!' : 'Ready for pickup!'}
                  </p>
                  <p className="text-slate-300 text-xs mt-1">
                    {deliveryType === 'delivery' 
                      ? `Please prepare to receive your ${orderType === 'rental' ? 'bike' : 'order'}. Make sure you have your ID ready for verification.`
                      : `Your ${orderType === 'rental' ? 'bike' : 'order'} is ready! Please bring a valid ID for verification.`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Delivered State */}
        {currentStatus === 'delivered' && (
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-white text-xl mb-2">
                {deliveryType === 'delivery' ? 'Delivered Successfully!' : 'Pickup Complete!'}
              </h3>
              <p className="text-slate-300 text-sm mb-4">
                Your {orderType === 'rental' ? 'bike rental' : 'order'} has been {deliveryType === 'delivery' ? 'delivered' : 'picked up'}.
              </p>
              <Button 
                className="bg-teal-500 hover:bg-teal-600 text-white"
                onClick={() => setShowRatingDialog(true)}
              >
                Rate Your Experience
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Help */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-3">Need help with your {deliveryType === 'delivery' ? 'delivery' : 'order'}?</p>
              <Button
                variant="outline"
                className="bg-slate-900 border-slate-600 text-white hover:bg-slate-700"
                onClick={() => toast.success('Connecting to support...')}
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Rate Your Experience</DialogTitle>
            <DialogDescription className="text-slate-400">
              How was your {deliveryType === 'delivery' ? 'delivery' : 'pickup'} experience?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= rating
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Comments (Optional)</label>
              <Textarea
                placeholder="Tell us about your experience..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="bg-slate-900 border-slate-600 text-white min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRatingDialog(false)}
              className="bg-slate-900 border-slate-600 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRatingSubmit}
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              Submit Rating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={showChat} onOpenChange={setShowChat}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Message Driver</DialogTitle>
            <DialogDescription className="text-slate-400">
              Send a message to {driverInfo.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Type your message..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="bg-slate-900 border-slate-600 text-white"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowChat(false)}
              className="bg-slate-900 border-slate-600 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
