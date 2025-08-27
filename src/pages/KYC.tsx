import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const kycSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Please select your gender'),
  employmentType: z.string().min(1, 'Please select employment type'),
  monthlyIncome: z.string().min(1, 'Please enter your monthly income'),
  aadhaarNumber: z.string().length(12, 'Aadhaar number must be 12 digits'),
  panNumber: z.string().length(10, 'PAN number must be 10 characters'),
  addressLine1: z.string().min(5, 'Address must be at least 5 characters'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().length(6, 'Pincode must be 6 digits'),
});

type KYCFormData = z.infer<typeof kycSchema>;

const KYC = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      fullName: '',
      email: user?.email || '',
      dateOfBirth: '',
      gender: '',
      employmentType: '',
      monthlyIncome: '',
      aadhaarNumber: '',
      panNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  const onSubmit = async (data: KYCFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please login first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Update profile
      await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          email: data.email,
          date_of_birth: data.dateOfBirth,
          gender: data.gender,
        })
        .eq('user_id', user.id);

      // Create application
      const { data: application, error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          employment_type: data.employmentType,
          monthly_income: parseInt(data.monthlyIncome),
          aadhaar_number: data.aadhaarNumber,
          pan_number: data.panNumber.toUpperCase(),
          address_line1: data.addressLine1,
          address_line2: data.addressLine2,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "KYC details saved successfully!",
      });

      // Store application ID in localStorage for next steps
      localStorage.setItem('applicationId', application.id);
      navigate('/documents');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save KYC details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-background py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">KYC Information</CardTitle>
            <p className="text-muted-foreground">Please provide your details for verification</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Employment Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Employment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="employmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select employment type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="salaried">Salaried</SelectItem>
                              <SelectItem value="self_employed">Self Employed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="monthlyIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Income (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Enter monthly income" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Identity Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Identity Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="aadhaarNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Aadhaar Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="12-digit Aadhaar number" 
                              maxLength={12}
                              {...field} 
                              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="panNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PAN Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="PAN number" 
                              maxLength={10}
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Address Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Address Details</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="addressLine1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 1</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter address line 1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="addressLine2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 2 (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter address line 2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter state" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="6-digit pincode" 
                                maxLength={6}
                                {...field}
                                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Saving...' : 'Continue to Document Upload'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KYC;