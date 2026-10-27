// Servicio para comunicarse con el backend API

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
  
  // Guardar transacción en la base de datos
  static async saveTransaction(transaction) {
    try {
      const response = await fetch(`${API_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar transacción');
      }

      return data;
    } catch (error) {
      console.error('Error en saveTransaction:', error);
      throw error;
    }
  }

  // Obtener transacciones (todas o por chainId)
  static async getTransactions(chainId = null) {
    try {
      const url = chainId 
        ? `${API_URL}/api/transactions?chainId=${chainId}`
        : `${API_URL}/api/transactions`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener transacciones');
      }

      return data.data || [];
    } catch (error) {
      console.error('Error en getTransactions:', error);
      throw error;
    }
  }

  // Eliminar transacción
  static async deleteTransaction(hash) {
    try {
      const response = await fetch(`${API_URL}/api/transactions/${hash}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar transacción');
      }

      return data;
    } catch (error) {
      console.error('Error en deleteTransaction:', error);
      throw error;
    }
  }

  // Obtener estadísticas (todas o por chainId)
  static async getStatistics(chainId = null) {
    try {
      const url = chainId 
        ? `${API_URL}/api/statistics?chainId=${chainId}`
        : `${API_URL}/api/statistics`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener estadísticas');
      }

      return data.data;
    } catch (error) {
      console.error('Error en getStatistics:', error);
      throw error;
    }
  }

  // Verificar que el servidor esté funcionando
  static async healthCheck() {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      return data.status === 'OK';
    } catch (error) {
      console.error('Error en healthCheck:', error);
      return false;
    }
  }
}

export default ApiService;
