import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, CreditCard, Gift, Percent } from 'lucide-react';

const Offer = () => {
  const navigate = useNavigate();

  const offerDetails = {
    creditLimit: '₹3,00,000',
    joiningFee: '₹799',
    annualFee: '₹0',
    welcomeBonus: '₹500 Amazon eVoucher',
  };

  const benefits = [
    { icon: <Percent className="w-5 h-5" />, title: '25% Cashback', description: 'On Flipkart, Amazon, Myntra (Max ₹2500/month)' },
    { icon: <Percent className="w-5 h-5" />, title: '10% Cashback', description: 'On utility bills (Max ₹250/month)' },
    { icon: <Percent className="w-5 h-5" />, title: '10% Cashback', description: 'On Swiggy, Zomato, BigBasket (Max ₹500/month)' },
    { icon: <Percent className="w-5 h-5" />, title: '1% Cashback', description: 'On all other spends including UPI' },
  ];

  const handleAcceptOffer = () => {
    navigate('/esign');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Congratulations Card */}
          <Card className="border-2 border-green-500 bg-green-50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <CardTitle className="text-3xl text-green-700">
                Congratulations!
              </CardTitle>
              <p className="text-green-600 text-lg">
                You are eligible for RuPay Credit Card
              </p>
            </CardHeader>
          </Card>

          {/* Offer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-primary">
                <CreditCard className="w-8 h-8 mr-3" />
                Your Personalized Offer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Credit Limit */}
              <div className="text-center bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
                <h3 className="text-lg font-medium mb-2">Approved Credit Limit</h3>
                <div className="text-4xl font-bold">{offerDetails.creditLimit}</div>
                <p className="text-sm opacity-90 mt-2">Subject to final verification</p>
              </div>

              {/* Fees */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-secondary">{offerDetails.joiningFee}</div>
                  <div className="text-sm text-muted-foreground">One-time Joining Fee</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{offerDetails.annualFee}</div>
                  <div className="text-sm text-muted-foreground">Annual Fee*</div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                *Annual fee waived on annual spends of ₹3 lakh
              </p>

              <Separator />

              {/* Welcome Benefits */}
              <div className="flex items-center justify-center space-x-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <Gift className="w-6 h-6 text-yellow-600" />
                <div>
                  <div className="font-semibold text-yellow-800">Welcome Benefits</div>
                  <div className="text-sm text-yellow-700">{offerDetails.welcomeBonus}</div>
                  <div className="text-xs text-yellow-600">On first transaction within 30 days</div>
                </div>
              </div>

              {/* Cashback Benefits */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Cashback Benefits</h4>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-accent/50 rounded-lg">
                      <div className="text-primary mt-1">{benefit.icon}</div>
                      <div>
                        <div className="font-medium">{benefit.title}</div>
                        <div className="text-sm text-muted-foreground">{benefit.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Terms */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Important Terms:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• This offer is valid for 7 days</li>
                  <li>• Credit limit subject to final verification</li>
                  <li>• Card will be delivered within 7-10 business days</li>
                  <li>• Terms and conditions apply</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleAcceptOffer}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white py-6 text-lg font-semibold"
                >
                  Accept Offer & Continue
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/home')}
                >
                  Decline Offer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Offer;