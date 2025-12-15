'use client';

import { useState, useEffect } from 'react';
import { Web3Service } from '@/lib/web3';

interface WalletButtonProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export default function WalletButton({ onConnect, onDisconnect }: WalletButtonProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const web3Service = new Web3Service();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const addr = accounts[0];
          setAddress(addr);
          await web3Service.connectWallet();
          onConnect(addr);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const connect = async () => {
    setLoading(true);
    try {
      const addr = await web3Service.connectWallet();
      setAddress(addr);
      onConnect(addr);
    } catch (error: any) {
      alert(`Failed to connect wallet: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    onDisconnect();
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (address) {
    return (
      <button
        onClick={disconnect}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
      >
        Disconnect {formatAddress(address)}
      </button>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
    >
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}

