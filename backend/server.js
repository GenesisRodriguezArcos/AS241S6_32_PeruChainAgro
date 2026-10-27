import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  initDatabase,
  saveTransaction,
  getTransactionsByChainId,
  getAllTransactions,
  getStatistics,
  deleteTransaction
} from './database.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares - CORS simple para Docker
app.use(cors({
  origin: '*', // Permitir todos los orígenes
  credentials: false
}));
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ========================================
// RUTAS DE LA API
// ========================================

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'PeruChain Agro API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    name: 'PeruChain Agro API',
    version: '1.0.0',
    description: 'API para gestión de transacciones blockchain agrícolas',
    endpoints: {
      health: 'GET /health',
      transactions: {
        getAll: 'GET /api/transactions',
        getByNetwork: 'GET /api/transactions?chainId=11155111',
        create: 'POST /api/transactions',
        delete: 'DELETE /api/transactions/:hash'
      },
      statistics: {
        getAll: 'GET /api/statistics',
        getByNetwork: 'GET /api/statistics?chainId=11155111'
      }
    }
  });
});

// ========================================
// ENDPOINTS DE TRANSACCIONES
// ========================================

// Obtener transacciones (todas o filtradas por chainId)
app.get('/api/transactions', async (req, res) => {
  try {
    const { chainId } = req.query;

    let transactions;
    if (chainId) {
      transactions = await getTransactionsByChainId(parseInt(chainId));
      console.log(`✅ Transacciones obtenidas para chainId ${chainId}: ${transactions.length}`);
    } else {
      transactions = await getAllTransactions();
      console.log(`✅ Todas las transacciones obtenidas: ${transactions.length}`);
    }

    res.json({
      success: true,
      count: transactions.length,
      chainId: chainId ? parseInt(chainId) : null,
      data: transactions
    });
  } catch (error) {
    console.error('❌ Error al obtener transacciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener transacciones',
      message: error.message
    });
  }
});

// Guardar nueva transacción
app.post('/api/transactions', async (req, res) => {
  try {
    const transaction = req.body;

    // Validaciones básicas
    if (!transaction.hash) {
      return res.status(400).json({
        success: false,
        error: 'El hash de la transacción es requerido'
      });
    }

    if (!transaction.chainId) {
      return res.status(400).json({
        success: false,
        error: 'El chainId es requerido'
      });
    }

    // Guardar en la base de datos
    const savedTransaction = await saveTransaction(transaction);

    console.log(`✅ Transacción guardada: ${transaction.hash} en red ${transaction.networkName}`);

    res.status(201).json({
      success: true,
      message: 'Transacción guardada correctamente',
      data: savedTransaction
    });
  } catch (error) {
    console.error('❌ Error al guardar transacción:', error);
    
    // Si el error es por hash duplicado
    if (error.message?.includes('duplicate') || error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Esta transacción ya existe en la base de datos'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al guardar transacción',
      message: error.message
    });
  }
});

// Eliminar transacción por hash
app.delete('/api/transactions/:hash', async (req, res) => {
  try {
    const { hash } = req.params;

    const deletedTransaction = await deleteTransaction(hash);

    if (!deletedTransaction) {
      return res.status(404).json({
        success: false,
        error: 'Transacción no encontrada'
      });
    }

    console.log(`✅ Transacción eliminada: ${hash}`);

    res.json({
      success: true,
      message: 'Transacción eliminada correctamente',
      data: deletedTransaction
    });
  } catch (error) {
    console.error('❌ Error al eliminar transacción:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar transacción',
      message: error.message
    });
  }
});

// ========================================
// ENDPOINTS DE ESTADÍSTICAS
// ========================================

// Obtener estadísticas (todas o filtradas por chainId)
app.get('/api/statistics', async (req, res) => {
  try {
    const { chainId } = req.query;

    const stats = await getStatistics(chainId ? parseInt(chainId) : null);

    res.json({
      success: true,
      chainId: chainId ? parseInt(chainId) : null,
      data: {
        totalTransactions: parseInt(stats.total_transactions),
        networksUsed: parseInt(stats.networks_used),
        totalSales: parseFloat(stats.total_sales)
      }
    });
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas',
      message: error.message
    });
  }
});

// ========================================
// MANEJO DE ERRORES 404
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado',
    path: req.path
  });
});

// ========================================
// INICIAR SERVIDOR
// ========================================

async function startServer() {
  try {
    // Inicializar base de datos
    console.log('🔄 Inicializando base de datos...');
    await initDatabase();
    console.log('✅ Base de datos lista');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('\n🚀 ========================================');
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
      console.log(`🌐 Frontend permitido: ${process.env.FRONTEND_URL}`);
      console.log(`💾 Base de datos: Neon PostgreSQL`);
      console.log(`📝 Endpoints disponibles:`);
      console.log(`   - GET  http://localhost:${PORT}/health`);
      console.log(`   - GET  http://localhost:${PORT}/api/transactions`);
      console.log(`   - POST http://localhost:${PORT}/api/transactions`);
      console.log(`   - GET  http://localhost:${PORT}/api/statistics`);
      console.log('========================================\n');
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

// Iniciar servidor
startServer();

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});
