'use client';

import { useState, useEffect } from 'react';
import { Web3Service } from '@/lib/web3';

interface Payee {
  address: string;
  shares: string;
  pending: string;
}

interface PayeeListProps {
  web3Service: Web3Service | null;
  currentAddress: string | null;
  onRefresh: () => void;
}

export default function PayeeList({ web3Service, currentAddress, onRefresh }: PayeeListProps) {
  const [payees, setPayees] = useState<Payee[]>([]);
  const [loading, setLoading] = useState(false);
  const [releasing, setReleasing] = useState<string | null>(null);

  useEffect(() => {
    if (web3Service) {
      loadPayees();
    }
  }, [web3Service]);

  const loadPayees = async () => {
    if (!web3Service) return;
    
    setLoading(true);
    try {
      const payeeList = await web3Service.getAllPayees();
      setPayees(payeeList);
    } catch (error: any) {
      console.error('Error loading payees:', error);
      alert(`Failed to load payees: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRelease = async (address: string) => {
    if (!web3Service) return;
    
    setReleasing(address);
    try {
      const tx = await web3Service.release(address);
      await tx.wait();
      alert('Payment released successfully!');
      loadPayees();
      onRefresh();
    } catch (error: any) {
      console.error('Error releasing payment:', error);
      alert(`Failed to release payment: ${error.message}`);
    } finally {
      setReleasing(null);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400">Loading payees...</p>
      </div>
    );
  }

  if (payees.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400">No payees added yet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Payees</h2>
        <button
          onClick={loadPayees}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
        >
          Refresh
        </button>
      </div>
      
      <div className="space-y-3">
        {payees.map((payee, index) => (
          <div
            key={index}
            className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
          >
            <div className="flex-1">
              <div className="text-white font-mono text-sm mb-1">{formatAddress(payee.address)}</div>
              <div className="text-gray-400 text-sm">
                Shares: {payee.shares} | Pending: {parseFloat(payee.pending).toFixed(4)} CFX
              </div>
            </div>
            
            {currentAddress?.toLowerCase() === payee.address.toLowerCase() && parseFloat(payee.pending) > 0 && (
              <button
                onClick={() => handleRelease(payee.address)}
                disabled={releasing === payee.address}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded transition-colors"
              >
                {releasing === payee.address ? 'Releasing...' : 'Release'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

