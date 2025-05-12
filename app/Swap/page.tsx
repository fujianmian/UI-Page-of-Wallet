"use client";

import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount,
         mintTo,
         createMint, 
         TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import { Sidebar } from '@/components/sidebar';

// Color theme based on provided colors
const theme = {
  primary: '#F1B62A',    // Golden yellow - main action buttons
  secondary: '#573900',  // Dark brown - text and secondary elements
  background: '#F5F4EF', // Light cream - background color
};

type Token = {
    symbol: string
    name: string
    icon: string
    decimals: number
    address: string
}

/**
 * Solana Swap Component
 * 
 * This component allows users to swap tokens on the Solana network.
 * Features:
 * - Token selection
 * - Amount input with max button
 * - Price impact calculation
 * - Slippage tolerance setting
 * - Swap execution
 */
const SolanaSwap = () => {
  const { publicKey, signTransaction, connected } = useWallet();
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5); // Default 0.5%
  const [availableTokens, setAvailableTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock token list - in a real app, fetch this from an API
  useEffect(() => {
    // Simulate fetching tokens
    setAvailableTokens([
      { symbol: 'SOL', name: 'Solana', icon: '◎', decimals: 9, address: 'So11111111111111111111111111111111111111112' },
      { symbol: 'USDC', name: 'USD Coin', icon: '$', decimals: 6, address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
      { symbol: 'BONK', name: 'Bonk', icon: 'B', decimals: 5, address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
      { symbol: 'RAY', name: 'Raydium', icon: 'R', decimals: 6, address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R' },
    ]);
    
    // Set default tokens
    setFromToken({ symbol: 'SOL', name: 'Solana', icon: '◎', decimals: 9, address: 'So11111111111111111111111111111111111111112' });
    setToToken({ symbol: 'USDC', name: 'USD Coin', icon: '$', decimals: 6, address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' });
  }, []);

  // Calculate the swap rate (mock implementation)
  const calculateSwapRate = () => {
    if (!fromToken || !toToken || !fromAmount || parseFloat(fromAmount) === 0) {
      return '0';
    }

    // Mock exchange rates - in a real app, get these from an API or DEX
    const rates: { [key: string]: number } = {
      'SOL-USDC': 45.12,
      'SOL-BONK': 38423.71,
      'SOL-RAY': 9.54,
      'USDC-SOL': 0.022,
      'USDC-BONK': 852.63,
      'USDC-RAY': 0.211,
      'BONK-SOL': 0.000026,
      'BONK-USDC': 0.00117,
      'BONK-RAY': 0.00025,
      'RAY-SOL': 0.105,
      'RAY-USDC': 4.74,
      'RAY-BONK': 4023.15,
    };
    
    const pair = `${fromToken.symbol}-${toToken.symbol}`;
    const rate = rates[pair] || 1;
    
    return (parseFloat(fromAmount) * rate).toFixed(toToken.decimals > 2 ? 4 : toToken.decimals);
  };

  // Update toAmount when fromAmount or tokens change
  useEffect(() => {
    setToAmount(calculateSwapRate());
  }, [fromAmount, fromToken, toToken]);

  // Swap tokens function
  const swapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    // toAmount will be updated by the useEffect
  };

  // Execute swap transaction
  const executeSwap = async () => {
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (!fromToken || !toToken || !fromAmount || parseFloat(fromAmount) <= 0) {
      alert('Please enter a valid amount to swap');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real application, you would:
      // 1. Create a connection to Solana
      // const connection = new Connection('https://api.mainnet-beta.solana.com');
      
      // 2. Create the swap transaction using a DEX SDK like Jupiter Aggregator
      // const swapTransaction = await createSwapTransaction(...);
      
      // 3. Sign the transaction
      // const signedTransaction = await signTransaction(swapTransaction);
      
      // 4. Send the transaction
      // const txId = await connection.sendRawTransaction(signedTransaction.serialize());
      
      // Simulate successful swap
      setTimeout(() => {
        alert(`Swap successful! ${fromAmount} ${fromToken.symbol} swapped for ${toAmount} ${toToken.symbol}`);
        setIsLoading(false);
        setFromAmount('');
        setToAmount('');
      }, 2000);
    } catch (error) {
      console.error('Swap failed:', error);
      alert(`Swap failed: ${(error as Error).message}`);
      setIsLoading(false);
    }
  };

  // Calculate price impact (mock implementation)
  const getPriceImpact = () => {
    if (!fromAmount || parseFloat(fromAmount) === 0) return '0.00';
    // Mock calculation - in reality this would depend on liquidity depth
    return (0.1 + parseFloat(fromAmount) / 1000).toFixed(2);
  };

  return (
    <div style={{
      backgroundColor: theme.background,
      borderRadius: '16px',
      padding: '24px',
      maxWidth: '480px',
      margin: '0 auto',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>

    <div className="w-64 border-r border-amber-400">
            <Sidebar />
          </div>

      
      <h2 style={{ 
        color: theme.secondary, 
        fontSize: '24px', 
        fontWeight: '700', 
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        Swap Tokens
      </h2>
      
      {/* From Token Section */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        padding: '16px',
        marginBottom: '12px',
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '12px' 
        }}>
          <span style={{ color: theme.secondary, fontWeight: '500' }}>From</span>
          <span style={{ color: theme.secondary, fontSize: '14px' }}>
            Balance: {fromToken ? '10.5 ' + fromToken.symbol : '0'}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            style={{
              backgroundColor: 'white',
              border: `1px solid ${theme.primary}`,
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              color: theme.secondary,
              fontWeight: '600',
              cursor: 'pointer',
              minWidth: '120px',
              justifyContent: 'space-between',
            }}
            onClick={() => {
              // Open token selection modal (would be implemented separately)
              alert('Token selection would open here');
            }}
          >
            {fromToken ? (
              <>
                <span>{fromToken.icon} {fromToken.symbol}</span>
                <span>▼</span>
              </>
            ) : 'Select Token'}
          </button>
          
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.00"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '18px',
                borderRadius: '8px',
                border: `1px solid #E5E5E5`,
                backgroundColor: '#FAFAFA',
                color: theme.secondary,
              }}
            />
            <button
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: theme.primary,
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => setFromAmount('10.5')} // Max amount
            >
              MAX
            </button>
          </div>
        </div>
      </div>
      
      {/* Swap Direction Button */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '12px',
      }}>
        <button
          style={{
            backgroundColor: 'white',
            border: `1px solid ${theme.primary}`,
            color: theme.primary,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
          onClick={swapTokens}
        >
          ↓↑
        </button>
      </div>
      
      {/* To Token Section */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        padding: '16px',
        marginBottom: '24px',
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '12px' 
        }}>
          <span style={{ color: theme.secondary, fontWeight: '500' }}>To</span>
          <span style={{ color: theme.secondary, fontSize: '14px' }}>
            Balance: {toToken ? '250 ' + toToken.symbol : '0'}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            style={{
              backgroundColor: 'white',
              border: `1px solid ${theme.primary}`,
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              color: theme.secondary,
              fontWeight: '600',
              cursor: 'pointer',
              minWidth: '120px',
              justifyContent: 'space-between',
            }}
            onClick={() => {
              // Open token selection modal
              alert('Token selection would open here');
            }}
          >
            {toToken ? (
              <>
                <span>{toToken.icon} {toToken.symbol}</span>
                <span>▼</span>
              </>
            ) : 'Select Token'}
          </button>
          
          <div style={{ flex: 1 }}>
            <input
              type="text"
              value={toAmount}
              readOnly
              placeholder="0.00"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '18px',
                borderRadius: '8px',
                border: `1px solid #E5E5E5`,
                backgroundColor: '#FAFAFA',
                color: theme.secondary,
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Swap Details */}
      {fromAmount && parseFloat(fromAmount) > 0 && (
        <div style={{ 
          backgroundColor: 'rgba(241, 182, 42, 0.1)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '24px',
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            color: theme.secondary,
            fontSize: '14px',
            marginBottom: '8px',
          }}>
            <span>Rate</span>
            <span>1 {fromToken?.symbol} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(4)} {toToken?.symbol}</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            color: theme.secondary,
            fontSize: '14px',
            marginBottom: '8px',
          }}>
            <span>Price Impact</span>
            <span>{getPriceImpact()}%</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            color: theme.secondary,
            fontSize: '14px',
          }}>
            <span>Slippage Tolerance</span>
            <div>
              <select 
                value={slippage}
                onChange={(e) => setSlippage(parseFloat(e.target.value))}
                style={{
                  backgroundColor: 'white',
                  border: `1px solid ${theme.primary}`,
                  borderRadius: '4px',
                  color: theme.secondary,
                  padding: '2px 4px',
                }}
              >
                <option value={0.1}>0.1%</option>
                <option value={0.5}>0.5%</option>
                <option value={1.0}>1.0%</option>
                <option value={3.0}>3.0%</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Swap Button */}
      <button
        onClick={executeSwap}
        disabled={!connected || !fromAmount || parseFloat(fromAmount) <= 0 || isLoading}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: !connected || !fromAmount || parseFloat(fromAmount) <= 0 || isLoading
            ? '#ccc'
            : theme.primary,
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: !connected || !fromAmount || parseFloat(fromAmount) <= 0 || isLoading
            ? 'not-allowed'
            : 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        {!connected 
          ? 'Connect Wallet' 
          : isLoading 
            ? 'Swapping...' 
            : !fromAmount || parseFloat(fromAmount) <= 0 
              ? 'Enter Amount' 
              : `Swap ${fromToken?.symbol} to ${toToken?.symbol}`}
      </button>
    </div>
  );
};

export default SolanaSwap;