import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import { 
  CreditCard, 
  Wallet,
  Building2,
  Shield,
  Lock,
  CheckCircle2,
  ArrowLeft,
  Info
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'gcash' | 'paymaya' | 'bank';
  name: string;
  icon: any;
  last4?: string;
}

interface PaymentManagementProps {
  rentalInfo: any;
  onboardingData: any;
  onBack: () => void;
  onComplete: () => void;
  isRental?: boolean; // Flag to differentiate between rental and purchase
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'gcash', type: 'gcash', name: 'GCash', icon: Wallet },
  { id: 'paymaya', type: 'paymaya', name: 'PayMaya', icon: Wallet },
  { id: 'card', type: 'card', name: 'Credit/Debit Card', icon: CreditCard },
  { id: 'bank', type: 'bank', name: 'Bank Transfer', icon: Building2 }
];

export function PaymentManagement({ rentalInfo, onboardingData, onBack, onComplete, isRental = true }: PaymentManagementProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [agreeToCharge, setAgreeToCharge] = useState(false);
  const [processing, setProcessing] = useState(false);

  const securityDeposit = isRental ? 10000 : 0;
  const orderCost = rentalInfo?.totalCost || 0;
  const totalAmount = orderCost + securityDeposit;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  const validatePayment = () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return false;
    }

    if (!agreeToCharge) {
      toast.error('Please agree to the payment terms');
      return false;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error('Please enter a valid card number');
        return false;
      }
      if (!cardName) {
        toast.error('Please enter cardholder name');
        return false;
      }
      if (!expiryDate || expiryDate.length !== 5) {
        toast.error('Please enter valid expiry date');
        return false;
      }
      if (!cvv || cvv.length < 3) {
        toast.error('Please enter valid CVV');
        return false;
      }
    }

    if ((paymentMethod === 'gcash' || paymentMethod === 'paymaya') && !phoneNumber) {
      toast.error('Please enter your mobile number');
      return false;
    }

    return true;
  };

  const handleProcessPayment = async () => {
    if (!validatePayment()) return;

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      toast.success('Payment processed successfully!');
      
      // Simulate deposit pre-authorization for rentals only
      if (isRental) {
        setTimeout(() => {
          toast.success(`Security deposit of ₱${securityDeposit.toLocaleString()} pre-authorized`);
          setTimeout(() => {
            onComplete();
          }, 1000);
        }, 1500);
      } else {
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }, 2000);
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
            <div>
              <h1 className="text-white">{isRental ? 'Payment & Deposit' : 'Payment'}</h1>
              <p className="text-sm text-slate-400">Secure payment processing</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Payment Summary */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isRental ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Rental Cost ({rentalInfo?.rentalDays} days)</span>
                  <span className="text-white">₱{orderCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Security Deposit (Refundable)</span>
                  <span className="text-white">₱{securityDeposit.toLocaleString()}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Order Total</span>
                <span className="text-white">₱{orderCost.toLocaleString()}</span>
              </div>
            )}
            <Separator className="bg-slate-700" />
            <div className="flex justify-between">
              <span className="text-white">Total Amount</span>
              <span className="text-teal-400 text-xl">₱{totalAmount.toLocaleString()}</span>
            </div>

            {isRental && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div className="text-sm text-slate-300">
                    The security deposit of ₱{securityDeposit.toLocaleString()} will be pre-authorized on your payment method 
                    and automatically refunded within 5-7 business days after you return the bike in good condition.
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method Selection */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Select Payment Method</CardTitle>
            <CardDescription className="text-slate-400">
              Choose how you'd like to pay
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'border-teal-500 bg-teal-500/10'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <method.icon className="w-6 h-6 text-teal-400" />
                    <Label htmlFor={method.id} className="text-white flex-1 cursor-pointer">
                      {method.name}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {/* Card Details Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 mt-4 pt-4 border-t border-slate-700">
                <div className="space-y-2">
                  <Label className="text-slate-300">Card Number</Label>
                  <div className="relative">
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className="bg-slate-900 border-slate-600 text-white pl-10"
                    />
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Cardholder Name</Label>
                  <Input
                    placeholder="JUAN DELA CRUZ"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    className="bg-slate-900 border-slate-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Expiry Date</Label>
                    <Input
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">CVV</Label>
                    <Input
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      maxLength={4}
                      type="password"
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* E-Wallet Details */}
            {(paymentMethod === 'gcash' || paymentMethod === 'paymaya') && (
              <div className="space-y-4 mt-4 pt-4 border-t border-slate-700">
                <div className="space-y-2">
                  <Label className="text-slate-300">Mobile Number</Label>
                  <Input
                    placeholder="09XX XXX XXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white"
                  />
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-sm text-slate-300">
                    You will be redirected to {paymentMethod === 'gcash' ? 'GCash' : 'PayMaya'} to complete your payment.
                  </p>
                </div>
              </div>
            )}

            {/* Bank Transfer Details */}
            {paymentMethod === 'bank' && (
              <div className="space-y-4 mt-4 pt-4 border-t border-slate-700">
                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <p className="text-white mb-3">Bank Account Details:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bank Name:</span>
                      <span className="text-white">BDO Unibank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account Name:</span>
                      <span className="text-white">ENDURO LAB INC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account Number:</span>
                      <span className="text-white">0012-3456-7890</span>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-sm text-slate-300">
                    Please transfer the exact amount and upload proof of payment. 
                    Your rental will be confirmed upon verification.
                  </p>
                </div>
              </div>
            )}

            <Separator className="bg-slate-700" />

            {/* Save Payment Method */}
            <div className="flex items-center gap-3">
              <Checkbox
                id="save-payment"
                checked={savePaymentMethod}
                onCheckedChange={(checked) => setSavePaymentMethod(checked as boolean)}
              />
              <label htmlFor="save-payment" className="text-sm text-slate-300 cursor-pointer">
                Save this payment method for future rentals
              </label>
            </div>

            {/* Agreement */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="agree-charge"
                checked={agreeToCharge}
                onCheckedChange={(checked) => setAgreeToCharge(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="agree-charge" className="text-sm text-slate-300 cursor-pointer">
                I authorize ENDURO LAB to charge ₱{totalAmount.toLocaleString()} to my selected payment method, 
                including a refundable security deposit of ₱{securityDeposit.toLocaleString()}.
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-teal-500/20 rounded-full p-2">
                <Shield className="w-5 h-5 text-teal-400" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">Secure Payment</p>
                <p className="text-slate-400 text-xs">
                  Your payment information is encrypted and secure
                </p>
              </div>
              <Lock className="w-5 h-5 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={processing}
            className="flex-1 border-slate-600 text-white hover:bg-slate-800"
          >
            Back
          </Button>
          <Button
            onClick={handleProcessPayment}
            disabled={processing || !paymentMethod || !agreeToCharge}
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50"
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              `Pay ₱${totalAmount.toLocaleString()}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
