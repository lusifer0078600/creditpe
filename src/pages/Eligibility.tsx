import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Eligibility = () => {
  const [progress, setProgress] = useState(0);
  const [checking, setChecking] = useState(true);
  const [eligible, setEligible] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate eligibility check process
    const checkEligibility = async () => {
      // Step 1: Document verification
      setTimeout(() => setProgress(20), 500);
      setTimeout(() => setProgress(40), 1000);
      
      // Step 2: CIBIL check simulation
      setTimeout(() => setProgress(60), 1500);
      setTimeout(() => setProgress(80), 2000);
      
      // Step 3: Final approval
      setTimeout(() => {
        setProgress(100);
        // For demo purposes, we'll always approve
        setEligible(true);
        setChecking(false);
        
        toast({
          title: "Eligibility Check Complete",
          description: "Congratulations! You are eligible for a credit card.",
        });
      }, 2500);
    };

    checkEligibility();
  }, [toast]);

  const checkingSteps = [
    { progress: 20, text: "Verifying documents..." },
    { progress: 40, text: "Checking identity..." },
    { progress: 60, text: "Running CIBIL score check..." },
    { progress: 80, text: "Calculating credit limit..." },
    { progress: 100, text: "Finalizing approval..." },
  ];

  const getCurrentStep = () => {
    return checkingSteps.find(step => progress >= step.progress)?.text || "Starting eligibility check...";
  };

  const handleContinue = () => {
    navigate('/offer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">
            {checking ? 'Checking Eligibility' : 'Eligibility Result'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {checking ? (
            <>
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <p className="text-center text-muted-foreground">
                  {getCurrentStep()}
                </p>
                <div className="text-center text-sm text-muted-foreground">
                  {progress}% Complete
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  {progress >= 20 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  )}
                  <span>Document Verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  {progress >= 60 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  )}
                  <span>CIBIL Score Check</span>
                </div>
                <div className="flex items-center space-x-2">
                  {progress >= 100 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                  )}
                  <span>Credit Limit Assessment</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {eligible ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-700">
                    Congratulations!
                  </h3>
                  <p className="text-muted-foreground">
                    You are eligible for a RuPay Credit Card with a limit up to ₹3,00,000
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">What's Next?</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• View your personalized offer</li>
                      <li>• Complete e-Sign process</li>
                      <li>• Pay joining fee</li>
                      <li>• Get your card delivered</li>
                    </ul>
                  </div>
                  <Button onClick={handleContinue} className="w-full">
                    View My Offer
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <AlertCircle className="w-16 h-16 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-700">
                    Application Not Approved
                  </h3>
                  <p className="text-muted-foreground">
                    Unfortunately, you don't meet our current eligibility criteria. 
                    You can reapply after 3 months.
                  </p>
                  <Button variant="outline" onClick={() => navigate('/home')}>
                    Back to Home
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Eligibility;