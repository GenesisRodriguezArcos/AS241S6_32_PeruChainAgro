# 🔌 Backend API - PeruChain Agro

API REST para gestión de transacciones blockchain del sector agrícola.

## 🛠️ Tecnologías

- **Node.js 20+**
- **Express.js** - Framework web
- **Neon PostgreSQL** - Base de datos serverless
- **CORS** - Para comunicación con frontend
- **dotenv** - Gestión de variables de entorno

---

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Neon
```

---

## ⚙️ Variables de Entorno

```bash
# .env
DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 Ejecutar

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

El servidor iniciará en: http://localhost:3001

---

## 📡 Endpoints

### Health Check
```http
GET /health
```

Respuesta:
```json
{
  "status": "OK",
  "message": "PeruChain Agro API funcionando correctamente",
  "timestamp": "2024-10-19T12:00:00.000Z"
}
```

---

### Obtener Todas las Transacciones
```http
GET /api/transactions
```

Respuesta:
```json
{
  "success": true,
  "count": 15,
  "chainId": null,
  "data": [...]
}
```

---

### Obtener Transacciones por Red
```http
GET /api/transactions?chainId=11155111
```

Parámetros:
- `chainId` (query): ID de la red blockchain

Respuesta:
```json
{
  "success": true,
  "count": 5,
  "chainId": 11155111,
  "data": [...]
}
```

---

### Guardar Nueva Transacción
```http
POST /api/transactions
Content-Type: application/json
```

Body:
```json
{
  "hash": "0xabc123...",
  "type": "agriculture_sale",
  "productName": "Papa Blanca",
  "productType": "papa",
  "productIcon": "🥔",
  "quantity": 500,
  "pricePerKg": 3.50,
  "totalPriceSoles": 1750,
  "amountInEth": "0.001750",
  "producerName": "Juan Pérez",
  "producerLocation": "Cusco, Perú",
  "producerAddress": "0x...",
  "buyerAddress": "0x...",
  "networkName": "Ethereum Sepolia",
  "networkSymbol": "ETH",
  "chainId": 11155111,
  "blockNumber": 12345678,
  "timestamp": 1697654321000,
  "status": "confirmed",
  "explorerUrl": "https://sepolia.etherscan.io/tx/0x..."
}
```

Respuesta exitosa:
```json
{
  "success": true,
  "message": "Transacción guardada correctamente",
  "data": {...}
}
```

---

### Eliminar Transacción
```http
DELETE /api/transactions/:hash
```

Parámetros:
- `hash` (path): Hash de la transacción

Respuesta:
```json
{
  "success": true,
  "message": "Transacción eliminada correctamente",
  "data": {...}
}
```

---

### Obtener Estadísticas
```http
GET /api/statistics
```

Respuesta:
```json
{
  "success": true,
  "chainId": null,
  "data": {
    "totalTransactions": 15,
    "networksUsed": 4,
    "totalSales": 45230.50
  }
}
```

---

### Obtener Estadísticas por Red
```http
GET /api/statistics?chainId=11155111
```

Parámetros:
- `chainId` (query): ID de la red blockchain

Respuesta:
```json
{
  "success": true,
  "chainId": 11155111,
  "data": {
    "totalTransactions": 5,
    "networksUsed": 1,
    "totalSales": 8970.00
  }
}
```

---

## 🗄️ Esquema de Base de Datos

### Tabla: `transactions`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | SERIAL | Primary key |
| hash | VARCHAR(66) | Hash de transacción (único) |
| type | VARCHAR(50) | Tipo de transacción |
| product_name | VARCHAR(255) | Nombre del producto |
| product_type | VARCHAR(50) | Tipo de producto |
| product_icon | VARCHAR(10) | Emoji del producto |
| quantity | DECIMAL(10,2) | Cantidad en kg |
| price_per_kg | DECIMAL(10,2) | Precio por kg |
| total_price_soles | DECIMAL(12,2) | Total en soles |
| amount_in_eth | VARCHAR(50) | Monto en ETH |
| producer_name | VARCHAR(255) | Nombre del productor |
| producer_location | VARCHAR(255) | Ubicación |
| producer_address | VARCHAR(42) | Address del productor |
| buyer_address | VARCHAR(42) | Address del comprador |
| network_name | VARCHAR(100) | Nombre de la red |
| network_symbol | VARCHAR(20) | Símbolo de la moneda |
| chain_id | INTEGER | ID de la cadena |
| block_number | INTEGER | Número de bloque |
| timestamp | BIGINT | Timestamp Unix |
| date_time | TIMESTAMP | Fecha y hora |
| status | VARCHAR(20) | Estado (confirmed/failed) |
| explorer_url | TEXT | URL al explorador |
| created_at | TIMESTAMP | Fecha de creación |

**Índices:**
- `idx_chain_id` en `chain_id`
- `idx_timestamp` en `timestamp`
- `idx_hash` en `hash`

---

## 🔒 Seguridad

- ✅ CORS configurado para permitir solo el frontend
- ✅ Validación de datos en endpoints POST
- ✅ Conexión SSL con Neon PostgreSQL
- ✅ Variables de entorno para credenciales
- ✅ Manejo de errores centralizado

---

## 🐳 Docker

```bash
# Construir imagen
docker build -t peruchain-backend .

# Ejecutar contenedor
docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://... \
  -e FRONTEND_URL=http://localhost:5173 \
  peruchain-backend
```

---

## 📊 Monitoreo

Los logs muestran:
- ✅ Conexiones de base de datos
- ✅ Requests HTTP
- ✅ Transacciones guardadas
- ✅ Errores con stack traces

Ejemplo:
```
2024-10-19T12:34:56.789Z - POST /api/transactions
✅ Transacción guardada: 0xabc123... en red Ethereum Sepolia
```

---

## 🧪 Testing

### Probar con cURL:

```bash
# Health check
curl http://localhost:3001/health

# Obtener transacciones
curl http://localhost:3001/api/transactions

# Filtrar por red
curl http://localhost:3001/api/transactions?chainId=11155111

# Guardar transacción
curl -X POST http://localhost:3001/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"hash":"0x123","chainId":11155111,"networkName":"Sepolia"}'
```

---

## 🚨 Troubleshooting

### Error: "Cannot connect to database"
```bash
# Verificar connection string
echo $DATABASE_URL
# Debe incluir ?sslmode=require al final
```

### Error: "CORS blocked"
```bash
# Verificar FRONTEND_URL en .env
# Debe coincidir con el origen del frontend
```

### Puerto ocupado
```bash
# Cambiar PORT en .env
PORT=3002
```

---

## 📝 Licencia

MIT - Uso educativo
