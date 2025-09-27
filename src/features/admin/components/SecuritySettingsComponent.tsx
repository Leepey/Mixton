// src copy/features/admin/components/SecuritySettingsComponent.tsx
import React, { useState } from 'react';
import { useContractManagement } from '../hooks/useContractManagement';
import { NeonCard } from '../../shared/components/ui/cards/NeonCard';
import { MixButton } from '../../shared/components/ui/buttons/MixButton';
import { NeonText } from '../../shared/components/ui/typography/NeonText';

interface SecuritySettingsComponentProps {
  className?: string;
}

export const SecuritySettingsComponent: React.FC<SecuritySettingsComponentProps> = ({ className }) => {
  const {
    loading,
    error,
    success,
    pauseContract,
    resumeContract,
    emergencyWithdraw,
    processQueue,
    clearMessages,
    stats
  } = useContractManagement();

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawRecipient, setWithdrawRecipient] = useState('');

  const handleEmergencyWithdraw = async () => {
    if (!withdrawAmount || !withdrawRecipient) {
      alert('Please enter both amount and recipient address');
      return;
    }

    try {
      const amount = parseFloat(withdrawAmount);
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
      }

      await emergencyWithdraw(amount, withdrawRecipient);
      setWithdrawAmount('');
      setWithdrawRecipient('');
    } catch (error) {
      console.error('Emergency withdraw failed:', error);
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Status Messages */}
      {error && (
        <NeonCard title="Error" className="border-red-500">
          <div className="bg-red-500/20 rounded-lg p-4">
            <NeonText color="error" className="text-sm">
              {error}
            </NeonText>
          </div>
        </NeonCard>
      )}

      {success && (
        <NeonCard title="Success" className="border-green-500">
          <div className="bg-green-500/20 rounded-lg p-4">
            <NeonText color="success" className="text-sm">
              {success}
            </NeonText>
          </div>
        </NeonCard>
      )}

      {/* Contract Control */}
      <NeonCard title="Contract Control" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <MixButton
            variant="outlined"
            onClick={pauseContract}
            disabled={loading}
            loading={loading}
            className="w-full border-red-500 text-red-500 hover:bg-red-500/10"
          >
            Pause Contract
          </MixButton>
          
          <MixButton
            variant="contained"
            onClick={resumeContract}
            disabled={loading}
            loading={loading}
            className="w-full bg-green-500 text-white hover:bg-green-600"
          >
            Resume Contract
          </MixButton>
        </div>

        <MixButton
          variant="contained"
          onClick={processQueue}
          disabled={loading}
          loading={loading}
          className="w-full"
        >
          Process Queue
        </MixButton>
      </NeonCard>

      {/* Emergency Withdraw */}
      <NeonCard title="Emergency Withdraw" className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Amount (TON)
            </label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Enter amount to withdraw"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={withdrawRecipient}
              onChange={(e) => setWithdrawRecipient(e.target.value)}
              placeholder="Enter recipient address"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              disabled={loading}
            />
          </div>
          
          <MixButton
            variant="outlined"
            onClick={handleEmergencyWithdraw}
            disabled={loading || !withdrawAmount || !withdrawRecipient}
            loading={loading}
            className="w-full border-red-500 text-red-500 hover:bg-red-500/10"
          >
            Emergency Withdraw
          </MixButton>
        </div>
      </NeonCard>

      {/* Security Stats */}
      {stats && (
        <NeonCard title="Security Statistics" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <NeonText color="success" className="text-2xl font-bold">
                {stats.basic.uptime}%
              </NeonText>
              <p className="text-sm text-gray-400">Uptime</p>
            </div>
            
            <div className="text-center">
              <NeonText color="primary" className="text-2xl font-bold">
                {stats.basic.failedTransactions}
              </NeonText>
              <p className="text-sm text-gray-400">Failed Transactions</p>
            </div>
            
            <div className="text-center">
              <NeonText color="warning" className="text-2xl font-bold">
                {stats.transactions.successRate}%
              </NeonText>
              <p className="text-sm text-gray-400">Success Rate</p>
            </div>
          </div>
        </NeonCard>
      )}

      {/* Clear Messages Button */}
      {(error || success) && (
        <MixButton
          variant="text"
          onClick={clearMessages}
          className="w-full"
        >
          Clear Messages
        </MixButton>
      )}
    </div>
  );
};