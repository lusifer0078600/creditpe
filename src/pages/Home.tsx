import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    { title: "25% cashback", description: "on Flipkart, Amazon, Myntra etc.", limit: "Max Cap of ₹2500 per STMT" },
    { title: "10% cashback", description: "on utility bill payments", limit: "Max Cap of ₹250 per STMT" },
    { title: "10% cashback", description: "on Swiggy, Zomato & Bigbasket", limit: "Max Cap of ₹500 per STMT" },
    { title: "1% cashback", description: "on all other spends including UPI", limit: "Valid on spends of ₹50,000+ in prev 3 months" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="https://i.ibb.co/H6f974h/creditpe-logo.png" 
            alt="CreditPe Logo" 
            className="w-20 h-20 mx-auto mb-4 object-contain"
          />
          <h1 className="text-3xl font-bold text-primary mb-2">CreditPe RuPay Credit Card</h1>
          <p className="text-muted-foreground">Smart spending, smarter rewards</p>
        </div>

        {/* Card Info */}
        <Card className="mb-8 border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white">
            <CardTitle className="text-center text-2xl">Card Benefits</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Fees & Charges</h3>
                <div className="space-y-1">
                  <p><span className="font-medium">Joining Fee:</span> ₹799/-</p>
                  <p><span className="font-medium">Annual Fee:</span> ₹0 (waived on ₹3L annual spends)</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Welcome Benefits</h3>
                <p>Amazon eVoucher worth <span className="font-bold text-secondary">₹500</span> on first transaction within 30 days</p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Cashback Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-accent/50">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-bold text-secondary text-xl">{feature.title}</span>
                    </div>
                    <p className="text-sm mb-2">{feature.description}</p>
                    <Badge variant="outline" className="text-xs">{feature.limit}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Apply Button */}
        <div className="text-center">
          <Button 
            onClick={() => navigate('/auth')}
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white px-12 py-6 text-xl font-semibold rounded-full shadow-lg transform transition hover:scale-105"
          >
            Apply Now
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Quick & Easy • Phone + OTP • Get approved in minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;