import { ethers } from 'ethers';
import { NETWORKS } from '../stores/networkStore';

export class BlockchainService {
  
  static async switchNetwork(network) {
    if (!window.ethereum) {
      throw new Error('MetaMask no está instalado');
    }

    const chainIdHex = '0x' + network.chainId.toString(16);

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
      return true;
    } catch (switchError) {
      // La red no existe, intentar agregarla
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainIdHex,
              chainName: network.name,
              nativeCurrency: {
                name: network.symbol,
                symbol: network.symbol,
                decimals: 18
              },
              rpcUrls: [network.rpcUrl],
              blockExplorerUrls: [network.explorer]
            }],
          });
          return true;
        } catch (addError) {
          console.error('Error agregando red:', addError);
          throw new Error('No se pudo agregar la red');
        }
      }
      throw switchError;
    }
  }

  static async getBalance(address, network) {
    if (network.type === 'UTXO') {
      // Para redes UTXO, retornar 0 ya que requieren API diferente
      return '0';
    }

    try {
      // Usar RPC público con timeout
      const provider = new ethers.JsonRpcProvider(network.rpcUrl, {
        chainId: network.chainId,
        name: network.name
      });
      
      // Timeout de 5 segundos
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );
      
      const balancePromise = provider.getBalance(address);
      const balance = await Promise.race([balancePromise, timeoutPromise]);
      
      return ethers.formatEther(balance);
    } catch (error) {
      console.error(`Error obteniendo balance en ${network.name}:`, error.message);
      throw error; // Lanzar error para que se maneje correctamente
    }
  }

  static async getBalanceMultipleNetworks(address, networks) {
    const promises = networks.map(async (network) => {
      try {
        const balance = await this.getBalance(address, network);
        return {
          network: network.name,
          symbol: network.symbol,
          balance: balance,
          type: network.type,
          chainId: network.chainId,
          hasError: false
        };
      } catch (error) {
        return {
          network: network.name,
          symbol: network.symbol,
          balance: '0.000000',
          type: network.type,
          chainId: network.chainId,
          hasError: true,
          errorMessage: 'No disponible'
        };
      }
    });

    return await Promise.all(promises);
  }

  static async sendTransaction(to, amount, provider, signer) {
    try {
      // Asegurarse de que amount sea string
      const amountStr = String(amount);
      
      const tx = await signer.sendTransaction({
        to: to,
        value: ethers.parseEther(amountStr)
      });

      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: amountStr
      };
    } catch (error) {
      console.error('Error enviando transacción:', error);
      throw error;
    }
  }

  static async waitForTransaction(hash, provider) {
    try {
      const receipt = await provider.waitForTransaction(hash);
      return receipt;
    } catch (error) {
      console.error('Error esperando transacción:', error);
      throw error;
    }
  }

  static getExplorerUrl(hash, network) {
    return `${network.explorer}/tx/${hash}`;
  }
}
