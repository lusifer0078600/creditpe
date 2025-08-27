import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Smartphone, QrCode, Building, Shield } from 'lucide-react';

const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const joiningFee = 799;
  const gst = Math.round(joiningFee * 0.18);
  const total = joiningFee + gst;

  const paymentMethods = [
    { id: 'card', name: 'Debit/Credit Card', icon: <CreditCard className="w-5 h-5" />, popular: true },
    { id: 'upi', name: 'UPI', icon: <Smartphone className="w-5 h-5" />, popular: true },
    { id: 'netbanking', name: 'Net Banking', icon: <Building className="w-5 h-5" />, popular: false },
    { id: 'qr', name: 'QR Code', icon: <QrCode className="w-5 h-5" />, popular: false },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast({
        title: "Select Payment Method",
        description: "Please select a payment method to continue",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Payment Successful",
        description: "Your joining fee has been paid successfully!",
      });
      navigate('/dashboard');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">Payment</CardTitle>
            <p className="text-muted-foreground">
              Pay your one-time joining fee to activate your credit card
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Joining Fee</span>
                  <span>₹{joiningFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{gst}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span className="text-primary">₹{total}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`${selectedMethod === method.id ? 'text-primary' : 'text-muted-foreground'}`}>
                          {method.icon}
                        </div>
                        <span className="font-medium">{method.name}</span>
                        {method.popular && (
                          <Badge variant="secondary" className="text-xs">Popular</Badge>
                        )}
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedMethod === method.id
                          ? 'border-primary bg-primary'
                          : 'border-gray-300'
                      }`}>
                        {selectedMethod === method.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-green-600 mt-1" />
                <div className="text-sm text-green-700">
                  <p className="font-medium mb-1">100% Secure Payment</p>
                  <p>Your payment is protected by bank-grade security and SSL encryption. We do not store your payment information.</p>
                </div>
              </div>
            </div>

            {/* Refund Policy */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Refund Policy:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Joining fee is non-refundable after card approval</li>
                <li>• Full refund if application is rejected</li>
                <li>• Refund will be processed within 5-7 business days</li>
              </ul>
            </div>

            {/* Payment Button */}
            <Button 
              onClick={handlePayment}
              disabled={loading || !selectedMethod}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white py-6 text-lg font-semibold"
            >
              {loading ? 'Processing Payment...' : `Pay ₹${total}`}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By proceeding with payment, you agree to our terms and conditions. 
              Your card will be dispatched within 7-10 business days after successful payment.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;