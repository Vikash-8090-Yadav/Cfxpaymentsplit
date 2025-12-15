'use client';

import { ContractState } from '@/lib/web3';

interface ContractInfoProps {
  state: ContractState | null;
  contractAddress: string;
}

export default function ContractInfo({ state, contractAddress }: ContractInfoProps) {
  if (!state) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400">Connect wallet to view contract info</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">Contract Information</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Contract Address:</span>
          <span className="text-white font-mono text-sm">{contractAddress.slice(0, 10)}...</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Owner:</span>
          <span className="text-white font-mono text-sm">{state.owner.slice(0, 10)}...</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Total Shares:</span>
          <span className="text-white">{state.totalShares}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Total Released:</span>
          <span className="text-white">{parseFloat(state.totalReleased).toFixed(4)} CFX</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-400">Contract Balance:</span>
          <span className="text-green-400 font-bold">{parseFloat(state.contractBalance).toFixed(4)} CFX</span>
        </div>
      </div>
    </div>
  );
}

