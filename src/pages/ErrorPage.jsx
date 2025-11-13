import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorPage = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message') || 'An authentication error occurred';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4">
            <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Authentication Error</h1>
          <p className="text-gray-600 mt-4 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-4">
          <Link to="/login">
            <Button className="w-full" icon="ArrowRight">
              Try Again
            </Button>
          </Link>
          
          <Link to="/">
            <Button variant="outline" className="w-full" icon="Home">
              Go to Dashboard
            </Button>
          </Link>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact support for assistance with your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;