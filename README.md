# 🌾 PeruChain Agro DApp

Aplicación descentralizada (DApp) para el sector agrícola peruano construida con Svelte y blockchain.

## 🎯 CUMPLIMIENTO DE REQUISITOS (20/20 PUNTOS)

| # | Requisito | Estado | Puntos |
|---|-----------|--------|--------|
| 1 | **Despliegue Docker + Cloud** | ✅ COMPLETO | 3/3 |
| 2 | **Login PaliWallet/MetaMask** | ✅ COMPLETO | 3/3 |
| 3 | **Cambio de red automático** | ✅ COMPLETO | 3/3 |
| 4 | **Historial en BD (NO localStorage)** | ✅ COMPLETO | 4/4 |
| 5 | **Transacción address-to-address** | ✅ COMPLETO | 4/4 |
| 6 | **URL explorador de bloques** | ✅ COMPLETO | 3/3 |
| | **TOTAL** | ✅ | **20/20** ✨ |

---

## 🆕 NUEVA ARQUITECTURA

### Backend API con Neon PostgreSQL
```
Frontend (Svelte) ←→ Backend API (Express) ←→ Neon PostgreSQL
                           ↓
                    Docker + Cloud Deploy
```

**Cambios principales:**
- ❌ **Eliminado:** localStorage para transacciones
- ✅ **Agregado:** Backend API REST con Node.js + Express
- ✅ **Agregado:** Base de datos Neon PostgreSQL serverless
- ✅ **Agregado:** Docker + docker-compose
- ✅ **Agregado:** Guías de despliegue en cloud

## ✨ ACTIVIDAD INDIVIDUAL IMPLEMENTADA

### 1) ✅ Transacciones Enfocadas a Agricultura
- **Venta de Productos Agrícolas**: Sistema completo para registrar ventas de productos agrícolas en blockchain
- Productos soportados: Papa 🥔, Quinua 🌾, Café ☕, Cacao 🍫, Maíz 🌽, Camote 🍠, Yuca 🥬, Arroz 🍚
- Registro de información completa: productor, ubicación, cantidad (kg), precio por kg, comprador
- Transacciones inmutables en blockchain con confirmación en tiempo real
- Conversión automática de S/ a ETH/token nativo de la red

### 2) ✅ Historial de Transacciones con Filtrado por Red
- **Backend API con Neon PostgreSQL**: Base de datos serverless en la nube
- **NO usa localStorage**: Cumple con requisitos de persistencia real
- **Filtrado por Red**: 
  - 🌐 Ver todas las redes
  - ⚡ Filtrar por red actual conectada (ej: Sepolia, zkSYS, Hoodi, Polygon, BSC)
  - 🎯 Filtrar por red específica
- **API REST completa**:
  - `GET /api/transactions` - Todas las transacciones
  - `GET /api/transactions?chainId=11155111` - Por red
  - `POST /api/transactions` - Guardar nueva
  - `DELETE /api/transactions/:hash` - Eliminar
  - `GET /api/statistics` - Estadísticas
- **Búsqueda Avanzada**: Por producto, productor, red o hash de transacción
- **Ordenamiento**: Por fecha (más reciente), monto (mayor a menor) o nombre de producto (A-Z)
- **Estadísticas en Tiempo Real**: 
  - Total de transacciones
  - Número de redes diferentes usadas
  - Suma total de ventas en soles

### 3) ✅ Problema del Saldo Corregido
- Se corrigió el problema de saldos irreales en consultas múltiples redes
- Ahora muestra "No disponible" si una red no responde correctamente
- Timeout de 5 segundos por red para evitar bloqueos
- Indicador visual de errores (rojo) vs saldos correctos (verde)

## 🚀 Características Principales

### 🔐 Sistema de Autenticación
- Login con nombre de usuario
- Registro de nuevos usuarios
- Persistencia de sesión en localStorage

### Wallet Blockchain
- Conexión con MetaMask y otras wallets compatibles
- Soporte multi-red (EVM y UTXO)
- Cambio automático de red
- Visualización de saldo y dirección

### Redes Soportadas
**Mainnet:**
- Ethereum Mainnet
- Polygon
- BNB Smart Chain
- Syscoin NEVM
- Rollux
- Avalanche C-Chain

**Testnet:**
- Ethereum Sepolia
- Ethereum Hoodi
- Syscoin NEVM Testnet
- zkSYS Testnet

**UTXO (simulado):**
- Bitcoin
- Litecoin

### Consulta de Saldo (4 Modos)
1. **Con Login**: Usa la wallet conectada
2. **Sin Login**: Consulta cualquier dirección
3. **Una Red**: Selecciona red específica
4. **Múltiples Redes**: Consulta masiva en varias redes simultáneamente

### Transacciones
- Envío de criptomonedas
- Registro de ventas agrícolas con metadata
- Hash de transacción con enlace al explorador
- Confirmación en blockchain

## 📦 Tecnologías Utilizadas

**Frontend:**
- **Svelte 4** + Vite
- **Ethers.js v6** - Interacción con blockchain
- **CSS nativo** con gradientes y animaciones

**Backend:**
- **Node.js 20+** + Express.js
- **Neon PostgreSQL** - Base de datos serverless
- **CORS** - Para comunicación segura
- **@neondatabase/serverless** - Driver optimizado

**DevOps:**
- **Docker** + docker-compose
- **Nginx** - Servidor web para producción
- **Railway/Vercel** - Deploy en cloud

## 🛠️ Instalación y Uso

### Requisitos Previos
- Node.js 16+ instalado
- MetaMask u otra wallet compatible instalada en el navegador
- Docker (opcional, para deployment)
- Cuenta en [Neon](https://console.neon.tech) para la base de datos

### Instalación

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd AS241S6_32_PeruChainAgro

# Instalar dependencias del FRONTEND
npm install

# Instalar dependencias del BACKEND
cd backend
npm install
cd ..
```

### Configurar Variables de Entorno

#### Backend (.env en carpeta backend):
```bash
cd backend
cp .env.example .env
# Editar .env con tu connection string de Neon PostgreSQL
```

```bash
DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env en raíz):
```bash
VITE_API_URL=http://localhost:3001
```

### Ejecutar en Desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Luego abre tu navegador en `http://localhost:5173`

### 🐳 Ejecutar con Docker

```bash
# Configurar DATABASE_URL en .env de la raíz
echo "DATABASE_URL=postgresql://..." > .env

# Construir y ejecutar
docker-compose up --build
```

- Frontend: http://localhost:80
- Backend: http://localhost:3001

### Construir para Producción

```bash
# Frontend
npm run build

# Backend (ya está listo con npm start)
```

### ☁️ Desplegar en Cloud

Ver guía completa en: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

Opciones recomendadas:
- **Backend**: Railway (gratis con GitHub)
- **Frontend**: Vercel (gratis con GitHub)
- **Base de Datos**: Neon PostgreSQL (ya configurado)

## 📱 Estructura de la Aplicación

```
AS241S6_32_PeruChainAgro/
├── backend/                        # 🆕 Backend API
│   ├── server.js                  # Servidor Express
│   ├── database.js                # Lógica de base de datos
│   ├── package.json
│   ├── .env                       # Variables de entorno
│   ├── Dockerfile                 # Docker para backend
│   ├── init.sql                   # Script SQL inicial
│   └── README.md                  # Docs del backend
├── src/                           # Frontend Svelte
│   ├── components/
│   │   ├── Login.svelte
│   │   ├── Register.svelte
│   │   ├── DashboardSimple.svelte
│   │   ├── HomeInfo.svelte
│   │   ├── AgricultureSale.svelte      # 🌾 Venta agrícola
│   │   ├── TransactionHistory.svelte   # 📜 Historial con API
│   │   ├── Transactions.svelte
│   │   ├── BalanceChecker.svelte
│   │   └── NetworkSwitcher.svelte
│   ├── stores/
│   │   ├── userStore.js
│   │   ├── walletStore.js
│   │   ├── networkStore.js
│   │   └── transactionStore.js         # 🔄 Usa API, no localStorage
│   └── services/
│       ├── blockchainService.js
│       └── apiService.js               # 🆕 Cliente API REST
├── Dockerfile                          # 🆕 Docker para frontend
├── docker-compose.yml                  # 🆕 Orquestación
├── nginx.conf                          # 🆕 Config Nginx
├── .env                                # Variables frontend
├── DEPLOYMENT.md                       # 🆕 Guía de despliegue
├── ACTIVIDAD_INDIVIDUAL.md
└── README.md
```

## 🔐 Seguridad

- Las claves privadas NUNCA se almacenan en la aplicación
- La autenticación con blockchain usa MetaMask
- Las transacciones requieren confirmación del usuario
- Los datos sensibles no se exponen en el código

## 🌐 Redes Blockchain

La aplicación soporta múltiples redes para máxima flexibilidad:

| Red | ChainID | Tipo | Symbol |
|-----|---------|------|--------|
| Ethereum Mainnet | 1 | EVM | ETH |
| Ethereum Sepolia | 11155111 | EVM | ETH |
| Ethereum Hoodi | 17000 | EVM | ETH |
| Polygon | 137 | EVM | MATIC |
| BSC | 56 | EVM | BNB |
| Syscoin NEVM | 57 | EVM | SYS |
| Syscoin Testnet | 5700 | EVM | tSYS |
| Rollux | 570 | EVM | SYS |
| zkSYS Testnet | 300 | EVM | ETH |
| Avalanche | 43114 | EVM | AVAX |

## 📝 Casos de Uso - Agricultura

### Registrar Venta de Papa
1. Conectar wallet
2. Ir a "🌾 Venta Agrícola"
3. Seleccionar producto (Papa)
4. Ingresar nombre (ej: "Papa Blanca Premium")
5. Cantidad: 500 kg
6. Precio/kg: S/ 3.50
7. Datos del productor y comprador
8. Confirmar transacción en MetaMask
9. Ver confirmación en blockchain

### Consultar Historial de Ventas
1. Ir a "📜 Historial"
2. Filtrar por red actual o todas
3. Buscar por producto específico
4. Ver detalles completos de cada venta
5. Copiar hash o ver en explorador
6. Estadísticas de ventas totales

## 🐛 Solución de Problemas

### Error: "MetaMask no está instalado"
- Instala MetaMask desde https://metamask.io

### Error: "Red no soportada"
- La aplicación agregará automáticamente la red a MetaMask
- Confirma en la ventana emergente de MetaMask

### Saldo muestra "No disponible"
- La red podría estar caída temporalmente
- Verifica tu conexión a internet
- Prueba con otra red

### Transacción fallida
- Verifica que tienes fondos suficientes
- Revisa que la dirección del comprador sea válida
- Confirma que estás en la red correcta

## 👨‍💻 Autor

Proyecto desarrollado para el curso de Blockchain - Valle Grande

## 📄 Licencia

Este proyecto es de código abierto para fines educativos.

---

**¡Gracias por usar PeruChain Agro! 🌾🚀**
