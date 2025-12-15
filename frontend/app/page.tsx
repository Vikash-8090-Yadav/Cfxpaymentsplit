'use client';

import { useState, useEffect } from 'react';
import { Web3Service, ContractState, CONTRACT_ADDRESS } from '@/lib/web3';
import WalletButton from '@/components/WalletButton';
import ContractInfo from '@/components/ContractInfo';
import PayeeList from '@/components/PayeeList';

export default function Home() {
  const [web3Service, setWeb3Service] = useState<Web3Service | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [contractState, setContractState] = useState<ContractState | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [newPayeeAddress, setNewPayeeAddress] = useState('');
  const [newPayeeShares, setNewPayeeShares] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [checkAddress, setCheckAddress] = useState('');
  const [pendingAmount, setPendingAmount] = useState<string | null>(null);

  useEffect(() => {
    if (web3Service && currentAddress) {
      loadContractState();
    }
  }, [web3Service, currentAddress]);

  const loadContractState = async () => {
    if (!web3Service) return;
    
    try {
      const state = await web3Service.getContractState();
      setContractState(state);
      setIsOwner(state.owner.toLowerCase() === currentAddress?.toLowerCase());
    } catch (error: any) {
      console.error('Error loading contract state:', error);
    }
  };

  const handleConnect = async (address: string) => {
    const service = new Web3Service();
    await service.connectWallet();
    setWeb3Service(service);
    setCurrentAddress(address);
  };

  const handleDisconnect = () => {
    setWeb3Service(null);
    setCurrentAddress(null);
    setContractState(null);
    setIsOwner(false);
  };

  const handleAddPayee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!web3Service) {
      alert('Please connect wallet first');
      return;
    }

    setLoading(true);
    try {
      const tx = await web3Service.addPayee(newPayeeAddress, newPayeeShares);
      await tx.wait();
      alert('Payee added successfully!');
      setNewPayeeAddress('');
      setNewPayeeShares('');
      loadContractState();
    } catch (error: any) {
      console.error('Error adding payee:', error);
      alert(`Failed to add payee: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!web3Service) {
      alert('Please connect wallet first');
      return;
    }

    setLoading(true);
    try {
      const tx = await web3Service.deposit(depositAmount);
      await tx.wait();
      alert('Deposit successful!');
      setDepositAmount('');
      loadContractState();
    } catch (error: any) {
      console.error('Error depositing:', error);
      alert(`Failed to deposit: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckPending = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!web3Service) {
      alert('Please connect wallet first');
      return;
    }

    try {
      const pending = await web3Service.getPending(checkAddress);
      setPendingAmount(pending);
    } catch (error: any) {
      console.error('Error checking pending:', error);
      alert(`Failed to check pending: ${error.message}`);
    }
  };

  const handleReleaseMyPayment = async () => {
    if (!web3Service || !currentAddress) {
      alert('Please connect wallet first');
      return;
    }

    setLoading(true);
    try {
      const tx = await web3Service.release(currentAddress);
      await tx.wait();
      alert('Payment released successfully!');
      loadContractState();
    } catch (error: any) {
      console.error('Error releasing payment:', error);
      alert(`Failed to release payment: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Conflux Payment Splitter</h1>
            <p className="text-gray-400">Dynamic payment distribution on Conflux eSpace Testnet</p>
          </div>
          <WalletButton onConnect={handleConnect} onDisconnect={handleDisconnect} />
        </div>

        {/* Contract Address Warning */}
        {!CONTRACT_ADDRESS && (
          <div className="mb-6 bg-yellow-900/50 border border-yellow-600 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-300">Contract Address Not Configured</h3>
                <div className="mt-2 text-sm text-yellow-200">
                  <p>Please set <code className="bg-yellow-900/50 px-1 py-0.5 rounded">NEXT_PUBLIC_CONTRACT_ADDRESS</code> in your <code className="bg-yellow-900/50 px-1 py-0.5 rounded">.env</code> file.</p>
                  <p className="mt-2">Steps:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Deploy the contract using: <code className="bg-yellow-900/50 px-1 py-0.5 rounded">cd SmartContract && npm run deploy:testnet</code></li>
                    <li>Copy the deployed contract address</li>
                    <li>Add it to <code className="bg-yellow-900/50 px-1 py-0.5 rounded">frontend/.env</code>: <code className="bg-yellow-900/50 px-1 py-0.5 rounded">NEXT_PUBLIC_CONTRACT_ADDRESS=0x...</code></li>
                    <li>Restart the dev server</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contract Info */}
        <div className="mb-6">
          <ContractInfo state={contractState} contractAddress={CONTRACT_ADDRESS || 'Not deployed'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Add Payee (Owner Only) */}
            {isOwner && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Add Payee (Owner Only)</h2>
                <form onSubmit={handleAddPayee} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Payee Address</label>
                    <input
                      type="text"
                      value={newPayeeAddress}
                      onChange={(e) => setNewPayeeAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Shares</label>
                    <input
                      type="number"
                      value={newPayeeShares}
                      onChange={(e) => setNewPayeeShares(e.target.value)}
                      placeholder="100"
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min="1"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    {loading ? 'Adding...' : 'Add Payee'}
                  </button>
                </form>
              </div>
            )}

            {/* Deposit */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Deposit CFX</h2>
              <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Amount (CFX)</label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="1.0"
                    step="0.001"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  {loading ? 'Depositing...' : 'Deposit'}
                </button>
              </form>
            </div>

            {/* Check Pending */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Check Pending Payment</h2>
              <form onSubmit={handleCheckPending} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Address</label>
                  <input
                    type="text"
                    value={checkAddress}
                    onChange={(e) => setCheckAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Check Pending
                </button>
                {pendingAmount !== null && (
                  <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                    <p className="text-white">
                      Pending: <span className="font-bold text-green-400">{parseFloat(pendingAmount).toFixed(4)} CFX</span>
                    </p>
                  </div>
                )}
              </form>
            </div>

            {/* Release My Payment */}
            {currentAddress && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">My Payment</h2>
                <button
                  onClick={handleReleaseMyPayment}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  {loading ? 'Releasing...' : 'Release My Payment'}
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Payee List */}
          <div>
            <PayeeList
              web3Service={web3Service}
              currentAddress={currentAddress}
              onRefresh={loadContractState}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

