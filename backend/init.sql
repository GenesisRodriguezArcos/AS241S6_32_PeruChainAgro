-- Script SQL para inicializar la base de datos manualmente en Neon PostgreSQL
-- Puedes ejecutar esto directamente en la consola SQL de Neon

-- Crear tabla de transacciones
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
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_chain_id ON transactions(chain_id);
CREATE INDEX IF NOT EXISTS idx_timestamp ON transactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_hash ON transactions(hash);

-- Comentarios para documentación
COMMENT ON TABLE transactions IS 'Almacena todas las transacciones blockchain del sector agrícola';
COMMENT ON COLUMN transactions.hash IS 'Hash único de la transacción blockchain';
COMMENT ON COLUMN transactions.chain_id IS 'ID de la red blockchain (ej: 11155111 para Sepolia)';
COMMENT ON COLUMN transactions.timestamp IS 'Timestamp Unix en milisegundos';

-- Ver estructura de la tabla
\d transactions

-- Ejemplo de consulta: Ver transacciones por red
-- SELECT * FROM transactions WHERE chain_id = 11155111 ORDER BY timestamp DESC;

-- Ejemplo: Estadísticas generales
-- SELECT 
--   COUNT(*) as total_transactions,
--   COUNT(DISTINCT chain_id) as networks_used,
--   SUM(total_price_soles) as total_sales
-- FROM transactions;
