import { writable } from 'svelte/store';
import ApiService from '../services/apiService';

function createTransactionStore() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    
    // Agregar transacción a la base de datos
    addTransaction: async (transaction) => {
      try {
        // Guardar en la base de datos
        await ApiService.saveTransaction(transaction);
        
        // Actualizar el store localmente
        update(transactions => [transaction, ...transactions]);
        
        console.log('✅ Transacción guardada en la base de datos');
        return true;
      } catch (error) {
        console.error('❌ Error al guardar transacción:', error);
        throw error;
      }
    },
    
    // Cargar transacciones desde la API
    loadTransactions: async (chainId = null) => {
      try {
        const transactions = await ApiService.getTransactions(chainId);
        set(transactions);
        console.log(`✅ Transacciones cargadas: ${transactions.length}`);
        return transactions;
      } catch (error) {
        console.error('❌ Error al cargar transacciones:', error);
        set([]);
        throw error;
      }
    },
    
    // Eliminar transacción
    removeTransaction: async (txHash) => {
      try {
        await ApiService.deleteTransaction(txHash);
        update(transactions => transactions.filter(tx => tx.hash !== txHash));
        console.log('✅ Transacción eliminada');
        return true;
      } catch (error) {
        console.error('❌ Error al eliminar transacción:', error);
        throw error;
      }
    },
    
    // Limpiar store local (no afecta la BD)
    clear: () => {
      set([]);
    }
  };
}

export const transactionStore = createTransactionStore();
