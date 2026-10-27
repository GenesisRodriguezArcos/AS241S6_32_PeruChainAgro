import { writable } from 'svelte/store';

export const NETWORKS = {
  // EVM Networks principales
  ETHEREUM: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth.llamarpc.com',
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
    type: 'EVM'
  },
  SEPOLIA: {
    chainId: 11155111,
    name: 'Ethereum Sepolia',
    rpcUrl: 'https://rpc.sepolia.org',
    symbol: 'ETH',
    explorer: 'https://sepolia.etherscan.io',
    type: 'EVM'
  },
  HOODI: {
    chainId: 17000,
    name: 'Ethereum Hoodi',
    rpcUrl: 'https://ethereum-holesky.publicnode.com',
    symbol: 'ETH',
    explorer: 'https://holesky.etherscan.io',
    type: 'EVM'
  },
  POLYGON: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com',
    type: 'EVM'
  },
  BSC: {
    chainId: 56,
    name: 'BNB Smart Chain',
    rpcUrl: 'https://bsc-dataseed1.binance.org',
    symbol: 'BNB',
    explorer: 'https://bscscan.com',
    type: 'EVM'
  },
  
  // Syscoin Networks
  SYSCOIN_NEVM: {
    chainId: 57,
    name: 'Syscoin NEVM',
    rpcUrl: 'https://rpc.syscoin.org',
    symbol: 'SYS',
    explorer: 'https://explorer.syscoin.org',
    type: 'EVM'
  },
  SYSCOIN_TESTNET: {
    chainId: 5700,
    name: 'Syscoin NEVM Testnet',
    rpcUrl: 'https://rpc.tanenbaum.io',
    symbol: 'tSYS',
    explorer: 'https://tanenbaum.io',
    type: 'EVM'
  },
  
  // Rollux
  ROLLUX: {
    chainId: 570,
    name: 'Rollux',
    rpcUrl: 'https://rpc.rollux.com',
    symbol: 'SYS',
    explorer: 'https://explorer.rollux.com',
    type: 'EVM'
  },
  
  // zkSync
  ZKSYNC_TESTNET: {
    chainId: 300,
    name: 'zkSYS Testnet',
    rpcUrl: 'https://sepolia.era.zksync.dev',
    symbol: 'ETH',
    explorer: 'https://sepolia.explorer.zksync.io',
    type: 'EVM'
  },
  
  AVALANCHE: {
    chainId: 43114,
    name: 'Avalanche C-Chain',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    symbol: 'AVAX',
    explorer: 'https://snowtrace.io',
    type: 'EVM'
  },
  
  // UTXO Networks (simulated for demo)
  BITCOIN: {
    chainId: 'BTC',
    name: 'Bitcoin Mainnet',
    rpcUrl: 'https://blockstream.info/api',
    symbol: 'BTC',
    explorer: 'https://blockstream.info',
    type: 'UTXO'
  },
  LITECOIN: {
    chainId: 'LTC',
    name: 'Litecoin Mainnet',
    rpcUrl: 'https://litecoin.info/api',
    symbol: 'LTC',
    explorer: 'https://blockchair.com/litecoin',
    type: 'UTXO'
  }
};

// Mapa de chainId a nombre de red conocida
export const CHAIN_ID_MAP = {
  1: 'Ethereum Mainnet',
  11155111: 'Ethereum Sepolia',
  17000: 'Ethereum Hoodi',
  137: 'Polygon Mainnet',
  56: 'BNB Smart Chain',
  57: 'Syscoin NEVM',
  5700: 'Syscoin NEVM Testnet',
  570: 'Rollux',
  300: 'zkSYS Testnet',
  43114: 'Avalanche C-Chain'
};

function createNetworkStore() {
  const { subscribe, set, update } = writable({
    currentNetwork: NETWORKS.SEPOLIA,
    availableNetworks: Object.values(NETWORKS),
    detectedNetwork: null // Red detectada de la wallet
  });

  return {
    subscribe,
    setNetwork: (network) => {
      update(state => ({ ...state, currentNetwork: network }));
    },
    setDetectedNetwork: (chainId) => {
      // Buscar la red en nuestras redes conocidas
      const knownNetwork = Object.values(NETWORKS).find(net => net.chainId === chainId);
      
      if (knownNetwork) {
        // Red conocida
        update(state => ({ 
          ...state, 
          currentNetwork: knownNetwork,
          detectedNetwork: knownNetwork 
        }));
      } else {
        // Red desconocida - crear objeto genérico
        const customNetwork = {
          chainId: chainId,
          name: CHAIN_ID_MAP[chainId] || `Red Desconocida (${chainId})`,
          rpcUrl: 'Custom RPC',
          symbol: '???',
          explorer: '#',
          type: 'EVM'
        };
        
        update(state => ({ 
          ...state, 
          currentNetwork: customNetwork,
          detectedNetwork: customNetwork
        }));
      }
    },
    addCustomNetwork: (network) => {
      update(state => ({
        ...state,
        availableNetworks: [...state.availableNetworks, network]
      }));
    }
  };
}

export const networkStore = createNetworkStore();
