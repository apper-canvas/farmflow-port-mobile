import React, { useEffect } from 'react';

const ResetPassword = () => {
  useEffect(() => {
    if (window.ApperSDK?.ApperUI) {
      const { ApperUI } = window.ApperSDK;
      ApperUI.showResetPassword('#authentication-reset-password');
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div id="authentication-reset-password"></div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;