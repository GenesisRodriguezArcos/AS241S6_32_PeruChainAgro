import { writable, derived } from 'svelte/store';

function createWalletStore() {
  const { subscribe, set, update } = writable({
    address: null,
    balance: '0',
    chainId: null,
    networkName: '',
    isConnected: false,
    provider: null,
    signer: null
  });

  return {
    subscribe,
    connect: async () => {
      if (!window.ethereum) {
        throw new Error('Por favor instala MetaMask o Pali Wallet para usar esta aplicación');
      }

      try {
        // Timeout de 30 segundos para la conexión
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Tiempo de espera agotado. Por favor, abre tu wallet y acepta la conexión.')), 30000)
        );

        // Solicitar cuentas
        const accountsPromise = window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });

        const accounts = await Promise.race([accountsPromise, timeout]);
        
        if (!accounts || accounts.length === 0) {
          throw new Error('No se pudo obtener ninguna cuenta de la wallet');
        }
        
        // Obtener chainId de forma rápida
        const chainId = await window.ethereum.request({ 
          method: 'eth_chainId' 
        });

        update(state => ({
          ...state,
          address: accounts[0],
          chainId: parseInt(chainId, 16),
          isConnected: true
        }));

        return true;
      } catch (error) {
        console.error('Error conectando wallet:', error);
        
        // Mejorar el mensaje de error
        let errorMessage = 'Error desconocido al conectar la wallet';
        
        if (error.code === 4001) {
          errorMessage = 'Conexión rechazada por el usuario';
        } else if (error.code === -32002) {
          errorMessage = 'Ya hay una solicitud de conexión pendiente. Por favor revisa tu wallet y acepta la conexión';
        } else if (error.message) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        }
        
        throw new Error(errorMessage);
      }
    },
    setAddress: (address) => {
      update(state => ({ ...state, address, isConnected: !!address }));
    },
    disconnect: () => {
      set({
        address: null,
        balance: '0',
        chainId: null,
        networkName: '',
        isConnected: false,
        provider: null,
        signer: null
      });
    },
    updateBalance: (balance) => {
      update(state => ({ ...state, balance }));
    },
    updateNetwork: (chainId, networkName) => {
      update(state => ({ ...state, chainId, networkName }));
    },
    setProvider: (provider, signer) => {
      update(state => ({ ...state, provider, signer }));
    }
  };
}

export const walletStore = createWalletStore();

export const shortAddress = derived(
  walletStore,
  $wallet => $wallet.address 
    ? `${$wallet.address.slice(0, 6)}...${$wallet.address.slice(-4)}`
    : ''
);
