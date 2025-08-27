import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SplashScreen = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/home');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="mb-8">
          <img 
            src="https://i.ibb.co/H6f974h/creditpe-logo.png" 
            alt="CreditPe Logo" 
            className="w-32 h-32 mx-auto mb-4 object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">CreditPe</h1>
        <p className="text-white/90 text-lg">Your Credit Card Journey Starts Here</p>
        <div className="mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;