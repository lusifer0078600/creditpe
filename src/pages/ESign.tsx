import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileText, Shield, CheckCircle } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const ESign = () => {
  const [step, setStep] = useState<'consent' | 'aadhaar-otp' | 'verify-otp'>('consent');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    esign: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleConsentSubmit = () => {
    if (!agreements.terms || !agreements.privacy || !agreements.esign) {
      toast({
        title: "Agreement Required",
        description: "Please accept all terms and conditions to continue",
        variant: "destructive",
      });
      return;
    }
    setStep('aadhaar-otp');
  };

  const handleSendAadhaarOTP = async () => {
    if (aadhaarNumber.length !== 12) {
      toast({
        title: "Invalid Aadhaar",
        description: "Please enter a valid 12-digit Aadhaar number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      setStep('verify-otp');
      toast({
        title: "OTP Sent",
        description: "OTP has been sent to your Aadhaar registered mobile number",
      });
    }, 2000);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "e-Sign Successful",
        description: "Your documents have been digitally signed successfully!",
      });
      navigate('/payment');
    }, 2000);
  };

  const documents = [
    'Credit Card Application Form',
    'Terms and Conditions',
    'Privacy Policy',
    'Credit Card Agreement',
    'Most Important Terms and Conditions (MITC)',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary flex items-center justify-center">
              <FileText className="w-8 h-8 mr-3" />
              Digital e-Sign
            </CardTitle>
            <p className="text-muted-foreground">
              Digitally sign your credit card application documents
            </p>
          </CardHeader>
          <CardContent>
            {step === 'consent' && (
              <div className="space-y-6">
                {/* Documents List */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Documents to be signed:</h3>
                  <div className="space-y-2">
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <FileText className="w-5 h-5 text-primary" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Consent Checkboxes */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={agreements.terms}
                      onCheckedChange={(checked) => 
                        setAgreements(prev => ({ ...prev, terms: checked as boolean }))
                      }
                    />
                    <div className="text-sm">
                      <Label htmlFor="terms" className="cursor-pointer">
                        I agree to the Terms and Conditions and Credit Card Agreement
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="privacy"
                      checked={agreements.privacy}
                      onCheckedChange={(checked) => 
                        setAgreements(prev => ({ ...prev, privacy: checked as boolean }))
                      }
                    />
                    <div className="text-sm">
                      <Label htmlFor="privacy" className="cursor-pointer">
                        I consent to the Privacy Policy and data processing
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="esign"
                      checked={agreements.esign}
                      onCheckedChange={(checked) => 
                        setAgreements(prev => ({ ...prev, esign: checked as boolean }))
                      }
                    />
                    <div className="text-sm">
                      <Label htmlFor="esign" className="cursor-pointer">
                        I authorize digital signature using Aadhaar e-Sign
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-1" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Secure e-Sign Process</p>
                      <p>Your documents will be digitally signed using Aadhaar e-Sign, which is legally equivalent to physical signature and is completely secure.</p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleConsentSubmit} className="w-full">
                  Proceed to e-Sign
                </Button>
              </div>
            )}

            {step === 'aadhaar-otp' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Aadhaar Authentication</h3>
                  <p className="text-muted-foreground">
                    Enter your Aadhaar number to receive OTP for e-Sign
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="aadhaar">Aadhaar Number</Label>
                    <Input
                      id="aadhaar"
                      placeholder="Enter 12-digit Aadhaar number"
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                      maxLength={12}
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-700">
                      <strong>Note:</strong> OTP will be sent to your Aadhaar registered mobile number. 
                      Make sure you have access to that number.
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={handleSendAadhaarOTP} 
                  className="w-full"
                  disabled={loading || aadhaarNumber.length < 12}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </div>
            )}

            {step === 'verify-otp' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Verify OTP</h3>
                  <p className="text-muted-foreground">
                    Enter the 6-digit OTP sent to your Aadhaar registered mobile
                  </p>
                </div>

                <div className="space-y-4">
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

                  <div className="text-center">
                    <Button 
                      variant="ghost" 
                      onClick={handleSendAadhaarOTP}
                      disabled={loading}
                    >
                      Resend OTP
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handleVerifyOTP} 
                  className="w-full"
                  disabled={loading || otp.length < 6}
                >
                  {loading ? 'Verifying...' : 'Complete e-Sign'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ESign;