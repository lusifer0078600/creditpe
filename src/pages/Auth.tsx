import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const Auth = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const { signInWithPhone, verifyOtp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('91')) {
      return '+' + cleaned;
    }
    if (cleaned.length === 10) {
      return '+91' + cleaned;
    }
    if (cleaned.startsWith('+91')) {
      return cleaned;
    }
    return '+91' + cleaned;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const formattedPhone = formatPhoneNumber(phone);
    const { error } = await signInWithPhone(formattedPhone);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "OTP Sent",
        description: "Please check your SMS for the verification code",
      });
      setStep('otp');
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const formattedPhone = formatPhoneNumber(phone);
    const { error } = await verifyOtp(formattedPhone, otp);

    if (error) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Phone number verified successfully!",
      });
      navigate('/kyc');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img 
            src="https://i.ibb.co/H6f974h/creditpe-logo.png" 
            alt="CreditPe Logo" 
            className="w-16 h-16 mx-auto mb-4 object-contain"
          />
          <CardTitle className="text-2xl text-primary">
            {step === 'phone' ? 'Enter Phone Number' : 'Verify OTP'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || phone.length < 10}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label>Enter 6-digit OTP sent to +91{phone}</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading || otp.length < 6}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full" 
                onClick={() => setStep('phone')}
              >
                Change Phone Number
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;