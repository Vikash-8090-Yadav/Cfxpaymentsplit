import { ethers } from 'ethers';
import contractABI from '../contracts/abi.json';

// Conflux eSpace Testnet RPC URL
export const CONFLUX_ESPACE_TESTNET_RPC = 'https://evmtestnet.confluxrpc.com';
export const CONFLUX_ESPACE_TESTNET_CHAIN_ID = 71;

// Contract address - Update this after deploying your contract
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

export interface ContractState {
  owner: string;
  totalShares: string;
  totalReleased: string;
  contractBalance: string;
}

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;

  async connectWallet(): Promise<string> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Please install MetaMask or Fluent Wallet');
    }

    // Check if contract address is configured
    if (!CONTRACT_ADDRESS) {
      console.warn('⚠️ Contract address not configured. Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env file');
    }

    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Create provider
    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    const address = await this.signer.getAddress();

    // Initialize contract if address is configured
    if (CONTRACT_ADDRESS) {
      try {
        this.contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          this.signer
        );
        console.log('✅ Contract initialized at:', CONTRACT_ADDRESS);
      } catch (error) {
        console.error('❌ Failed to initialize contract:', error);
        throw new Error('Failed to initialize contract. Please check the contract address.');
      }
    } else {
      console.warn('⚠️ Contract not initialized - contract address not set');
    }

    // Switch to Conflux eSpace Testnet if needed
    await this.switchNetwork();

    return address;
  }

  async switchNetwork() {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CONFLUX_ESPACE_TESTNET_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${CONFLUX_ESPACE_TESTNET_CHAIN_ID.toString(16)}`,
                chainName: 'Conflux eSpace Testnet',
                nativeCurrency: {
                  name: 'CFX',
                  symbol: 'CFX',
                  decimals: 18,
                },
                rpcUrls: [CONFLUX_ESPACE_TESTNET_RPC],
                blockExplorerUrls: ['https://evmtestnet.confluxscan.net'],
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      }
    }
  }

  getProvider(): ethers.BrowserProvider | null {
    return this.provider;
  }

  getSigner(): ethers.JsonRpcSigner | null {
    return this.signer;
  }

  getContract(): ethers.Contract | null {
    return this.contract;
  }

  async getAccount(): Promise<string | null> {
    if (!this.signer) return null;
    return await this.signer.getAddress();
  }

  async getContractState(): Promise<ContractState> {
    if (!this.contract || !this.provider) {
      if (!CONTRACT_ADDRESS) {
        throw new Error('Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in .env file');
      }
      throw new Error('Contract not initialized. Please connect your wallet first');
    }

    const [owner, totalShares, totalReleased, contractBalance] = await Promise.all([
      this.contract.owner(),
      this.contract.totalShares(),
      this.contract.totalReleased(),
      this.provider.getBalance(CONTRACT_ADDRESS),
    ]);

    return {
      owner,
      totalShares: totalShares.toString(),
      totalReleased: ethers.formatEther(totalReleased),
      contractBalance: ethers.formatEther(contractBalance),
    };
  }

  async addPayee(account: string, shares: string): Promise<ethers.ContractTransactionResponse> {
    if (!this.contract) {
      if (!CONTRACT_ADDRESS) {
        throw new Error('Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in .env file');
      }
      throw new Error('Contract not initialized. Please connect your wallet first');
    }
    return await this.contract.addPayee(account, shares);
  }

  async deposit(amount: string): Promise<ethers.ContractTransactionResponse> {
    if (!this.contract) {
      if (!CONTRACT_ADDRESS) {
        throw new Error('Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in .env file');
      }
      throw new Error('Contract not initialized. Please connect your wallet first');
    }
    const value = ethers.parseEther(amount);
    return await this.contract.deposit({ value });
  }

  async release(account: string): Promise<ethers.ContractTransactionResponse> {
    if (!this.contract) {
      if (!CONTRACT_ADDRESS) {
        throw new Error('Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in .env file');
      }
      throw new Error('Contract not initialized. Please connect your wallet first');
    }
    return await this.contract.release(account);
  }

  async getPending(account: string): Promise<string> {
    if (!this.contract) {
      if (!CONTRACT_ADDRESS) {
        throw new Error('Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in .env file');
      }
      throw new Error('Contract not initialized. Please connect your wallet first');
    }
    const pending = await this.contract.pending(account);
    return ethers.formatEther(pending);
  }

  async getShares(account: string): Promise<string> {
    if (!this.contract) {
      if (!CONTRACT_ADDRESS) {
        throw new Error('Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in .env file');
      }
      throw new Error('Contract not initialized. Please connect your wallet first');
    }
    const shares = await this.contract.shares(account);
    return shares.toString();
  }

  async getTotalPayees(): Promise<number> {
    if (!this.contract) {
      if (!CONTRACT_ADDRESS) {
        throw new Error('Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in .env file');
      }
      throw new Error('Contract not initialized. Please connect your wallet first');
    }
    // We need to iterate until we get an error or find the count
    let count = 0;
    let maxIterations = 100; // Safety limit
    try {
      while (count < maxIterations) {
        try {
          await this.contract.payee(count);
          count++;
        } catch {
          break;
        }
      }
    } catch (error) {
      // If there's an error, return current count
    }
    return count;
  }

  async getAllPayees(): Promise<Array<{ address: string; shares: string; pending: string }>> {
    if (!this.contract) {
      if (!CONTRACT_ADDRESS) {
        throw new Error('Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in .env file');
      }
      throw new Error('Contract not initialized. Please connect your wallet first');
    }
    
    const totalPayees = await this.getTotalPayees();
    const payees = [];

    for (let i = 0; i < totalPayees; i++) {
      const address = await this.contract.payee(i);
      const shares = await this.getShares(address);
      const pending = await this.getPending(address);
      payees.push({ address, shares, pending });
    }

    return payees;
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

