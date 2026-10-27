import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

// Crear conexión a Neon PostgreSQL
const sql = neon(process.env.DATABASE_URL);

// Función para inicializar la base de datos
export async function initDatabase() {
  try {
    // Crear tabla de transacciones si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        hash VARCHAR(66) UNIQUE NOT NULL,
        type VARCHAR(50) DEFAULT 'agriculture_sale',
        product_name VARCHAR(255),
        product_type VARCHAR(50),
        product_icon VARCHAR(10),
        quantity DECIMAL(10, 2),
        price_per_kg DECIMAL(10, 2),
        total_price_soles DECIMAL(12, 2),
        amount_in_eth VARCHAR(50),
        producer_name VARCHAR(255),
        producer_location VARCHAR(255),
        producer_address VARCHAR(42),
        buyer_address VARCHAR(42),
        network_name VARCHAR(100),
        network_symbol VARCHAR(20),
        chain_id INTEGER NOT NULL,
        block_number INTEGER,
        timestamp BIGINT NOT NULL,
        date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'confirmed',
        explorer_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Crear índices para mejorar el rendimiento
    await sql`
      CREATE INDEX IF NOT EXISTS idx_chain_id ON transactions(chain_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_timestamp ON transactions(timestamp DESC)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_hash ON transactions(hash)
    `;

    console.log('✅ Base de datos inicializada correctamente');
    console.log('✅ Tabla "transactions" creada/verificada');
    console.log('✅ Índices creados para mejor rendimiento');
    
    return true;
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  }
}

// Función para guardar una transacción
export async function saveTransaction(transaction) {
  try {
    const result = await sql`
      INSERT INTO transactions (
        hash, type, product_name, product_type, product_icon,
        quantity, price_per_kg, total_price_soles, amount_in_eth,
        producer_name, producer_location, producer_address, buyer_address,
        network_name, network_symbol, chain_id, block_number,
        timestamp, status, explorer_url
      ) VALUES (
        ${transaction.hash},
        ${transaction.type || 'agriculture_sale'},
        ${transaction.productName || null},
        ${transaction.productType || null},
        ${transaction.productIcon || null},
        ${transaction.quantity || null},
        ${transaction.pricePerKg || null},
        ${transaction.totalPriceSoles || null},
        ${transaction.amountInEth || null},
        ${transaction.producerName || null},
        ${transaction.producerLocation || null},
        ${transaction.producerAddress || null},
        ${transaction.buyerAddress || null},
        ${transaction.networkName},
        ${transaction.networkSymbol},
        ${transaction.chainId},
        ${transaction.blockNumber || null},
        ${transaction.timestamp},
        ${transaction.status || 'confirmed'},
        ${transaction.explorerUrl || null}
      )
      ON CONFLICT (hash) DO NOTHING
      RETURNING *
    `;

    return result[0];
  } catch (error) {
    console.error('Error al guardar transacción:', error);
    throw error;
  }
}

// Función para obtener transacciones por chainId
export async function getTransactionsByChainId(chainId) {
  try {
    const result = await sql`
      SELECT 
        id, hash, type, product_name as "productName", 
        product_type as "productType", product_icon as "productIcon",
        quantity, price_per_kg as "pricePerKg", 
        total_price_soles as "totalPriceSoles",
        amount_in_eth as "amountInEth",
        producer_name as "producerName", 
        producer_location as "producerLocation",
        producer_address as "producerAddress",
        buyer_address as "buyerAddress",
        network_name as "networkName", 
        network_symbol as "networkSymbol",
        chain_id as "chainId", block_number as "blockNumber",
        timestamp, status, explorer_url as "explorerUrl",
        created_at as "createdAt"
      FROM transactions
      WHERE chain_id = ${chainId}
      ORDER BY timestamp DESC
    `;

    return result;
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    throw error;
  }
}

// Función para obtener todas las transacciones
export async function getAllTransactions() {
  try {
    const result = await sql`
      SELECT 
        id, hash, type, product_name as "productName", 
        product_type as "productType", product_icon as "productIcon",
        quantity, price_per_kg as "pricePerKg", 
        total_price_soles as "totalPriceSoles",
        amount_in_eth as "amountInEth",
        producer_name as "producerName", 
        producer_location as "producerLocation",
        producer_address as "producerAddress",
        buyer_address as "buyerAddress",
        network_name as "networkName", 
        network_symbol as "networkSymbol",
        chain_id as "chainId", block_number as "blockNumber",
        timestamp, status, explorer_url as "explorerUrl",
        created_at as "createdAt"
      FROM transactions
      ORDER BY timestamp DESC
    `;

    return result;
  } catch (error) {
    console.error('Error al obtener todas las transacciones:', error);
    throw error;
  }
}

// Función para obtener estadísticas
export async function getStatistics(chainId = null) {
  try {
    let query;
    
    if (chainId) {
      query = sql`
        SELECT 
          COUNT(*) as total_transactions,
          COUNT(DISTINCT chain_id) as networks_used,
          COALESCE(SUM(total_price_soles), 0) as total_sales
        FROM transactions
        WHERE chain_id = ${chainId}
      `;
    } else {
      query = sql`
        SELECT 
          COUNT(*) as total_transactions,
          COUNT(DISTINCT chain_id) as networks_used,
          COALESCE(SUM(total_price_soles), 0) as total_sales
        FROM transactions
      `;
    }

    const result = await query;
    return result[0];
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
}

// Función para eliminar una transacción (opcional)
export async function deleteTransaction(hash) {
  try {
    const result = await sql`
      DELETE FROM transactions
      WHERE hash = ${hash}
      RETURNING *
    `;

    return result[0];
  } catch (error) {
    console.error('Error al eliminar transacción:', error);
    throw error;
  }
}

export default sql;
