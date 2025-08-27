import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Clock, Phone, LogOut, User } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [applicationData, setApplicationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicationData = async () => {
      if (!user) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        const { data: application } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        const { data: payment } = await supabase
          .from('payments')
          .select('*')
          .eq('application_id', application?.id)
          .single();

        setApplicationData({
          profile,
          application,
          payment,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent to-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="https://i.ibb.co/H6f974h/creditpe-logo.png" 
                alt="CreditPe Logo" 
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-xl font-bold text-primary">CreditPe</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{applicationData?.profile?.full_name || 'User'}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        <Card className="mb-6 border-2 border-green-500 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-700 mb-2">
                  Thank You!
                </h2>
                <p className="text-green-600 text-lg">
                  Your application has been submitted successfully
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Current Status</span>
                <Badge className={getStatusColor(applicationData?.application?.application_status || 'pending')}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(applicationData?.application?.application_status || 'pending')}
                    <span className="capitalize">
                      {applicationData?.application?.application_status || 'Pending'}
                    </span>
                  </div>
                </Badge>
              </div>
              
              {applicationData?.application?.credit_limit && (
                <div className="flex items-center justify-between">
                  <span>Approved Limit</span>
                  <span className="font-semibold text-primary">
                    ₹{applicationData.application.credit_limit.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Application ID</span>
                <span className="font-mono text-sm">
                  {applicationData?.application?.id.slice(-8).toUpperCase()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Joining Fee</span>
                <Badge className={getStatusColor(applicationData?.payment?.payment_status || 'completed')}>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(applicationData?.payment?.payment_status || 'completed')}
                    <span className="capitalize">
                      {applicationData?.payment?.payment_status || 'Completed'}
                    </span>
                  </div>
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Amount Paid</span>
                <span className="font-semibold">
                  ₹{applicationData?.payment?.amount ? (applicationData.payment.amount / 100).toFixed(2) : '799.00'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Verification Process</h4>
                  <p className="text-sm text-muted-foreground">
                    Our team will verify your documents and application details within 24 hours.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Representative Call</h4>
                  <p className="text-sm text-muted-foreground">
                    Our representative will call you within 24 hours to confirm your application.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Card Delivery</h4>
                  <p className="text-sm text-muted-foreground">
                    Your credit card will be delivered to your registered address within 7-10 business days.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Customer Support</p>
                  <p className="text-sm text-muted-foreground">Call us at 1800-XXX-XXXX (Toll Free)</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>Important:</strong> Please keep your application ID handy when contacting customer support. 
                  You can track your application status anytime by logging into this portal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;