<script>
  import { transactionStore } from '../stores/transactionStore';
  import { networkStore, NETWORKS } from '../stores/networkStore';
  import { onMount } from 'svelte';
  import ApiService from '../services/apiService';

  let transactions = [];
  let filteredTransactions = [];
  let selectedFilter = 'all'; // all, current, specific
  let selectedNetworkChainId = null;
  let searchTerm = '';
  let sortBy = 'date'; // date, amount, product
  let isLoading = false;
  let errorMessage = '';

  $: availableNetworks = Object.values(NETWORKS).filter(net => net.type === 'EVM');

  // Suscribirse al store de transacciones
  $: {
    transactionStore.subscribe(value => {
      transactions = value;
      applyFilters();
    });
  }

  // Aplicar filtros cuando cambien
  $: if (selectedFilter || selectedNetworkChainId || searchTerm || sortBy || $networkStore.currentNetwork) {
    applyFilters();
  }

  async function loadTransactions() {
    isLoading = true;
    errorMessage = '';
    
    try {
      let chainId = null;
      
      if (selectedFilter === 'current') {
        chainId = $networkStore.currentNetwork.chainId;
      } else if (selectedFilter === 'specific' && selectedNetworkChainId) {
        chainId = selectedNetworkChainId;
      }
      
      // Cargar desde la API
      await transactionStore.loadTransactions(chainId);
    } catch (error) {
      console.error('Error cargando transacciones:', error);
      errorMessage = 'Error al cargar transacciones desde el servidor';
    } finally {
      isLoading = false;
    }
  }

  function applyFilters() {
    let result = [...transactions];

    // Filtro por red (ya viene filtrado si se usó chainId en loadTransactions)
    if (selectedFilter === 'current') {
      result = result.filter(tx => tx.chainId === $networkStore.currentNetwork.chainId);
    } else if (selectedFilter === 'specific' && selectedNetworkChainId) {
      result = result.filter(tx => tx.chainId === selectedNetworkChainId);
    }

    // Búsqueda por texto
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(tx => 
        tx.productName?.toLowerCase().includes(term) ||
        tx.producerName?.toLowerCase().includes(term) ||
        tx.networkName?.toLowerCase().includes(term) ||
        tx.hash?.toLowerCase().includes(term)
      );
    }

    // Ordenamiento
    if (sortBy === 'date') {
      result.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortBy === 'amount') {
      result.sort((a, b) => (parseFloat(b.totalPriceSoles) || 0) - (parseFloat(a.totalPriceSoles) || 0));
    } else if (sortBy === 'product') {
      result.sort((a, b) => (a.productName || '').localeCompare(b.productName || ''));
    }

    filteredTransactions = result;
  }

  async function clearHistory() {
    if (confirm('¿Estás seguro? Esta acción eliminará TODAS las transacciones de la base de datos.')) {
      isLoading = true;
      errorMessage = '';
      
      try {
        // Eliminar todas una por una (podrías agregar un endpoint para esto)
        for (const tx of transactions) {
          await transactionStore.removeTransaction(tx.hash);
        }
        
        alert('Historial limpiado correctamente');
        await loadTransactions();
      } catch (error) {
        console.error('Error limpiando historial:', error);
        errorMessage = 'Error al limpiar el historial';
      } finally {
        isLoading = false;
      }
    }
  }

  async function deleteTransaction(txHash) {
    if (confirm('¿Eliminar esta transacción de la base de datos?')) {
      isLoading = true;
      errorMessage = '';
      
      try {
        await transactionStore.removeTransaction(txHash);
        alert('Transacción eliminada correctamente');
      } catch (error) {
        console.error('Error eliminando transacción:', error);
        errorMessage = 'Error al eliminar la transacción';
      } finally {
        isLoading = false;
      }
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert('¡Copiado al portapapeles!');
  }

  function getNetworkBadgeColor(chainId) {
    const colors = {
      1: '#627EEA',      // Ethereum
      11155111: '#9B51E0', // Sepolia
      17000: '#F6851B',  // Hoodi
      137: '#8247E5',    // Polygon
      56: '#F0B90B',     // BSC
      57: '#0089FF',     // Syscoin
      5700: '#00C9FF',   // Syscoin Testnet
      570: '#7B3FE4',    // Rollux
      300: '#1E69FF',    // zkSync
      43114: '#E84142'   // Avalanche
    };
    return colors[chainId] || '#4CAF50';
  }

  // Recargar cuando cambia el filtro
  $: if (selectedFilter || selectedNetworkChainId) {
    loadTransactions();
  }

  onMount(() => {
    loadTransactions();
  });
</script>

<div class="history-page">
  <div class="content-wrapper">
    <!-- Header -->
    <div class="page-header">
      <h1>📜 Historial de Transacciones</h1>
      <p>Todas tus transacciones registradas en blockchain</p>
    </div>

    <!-- Controles -->
    <div class="controls-card">
      <!-- Filtros -->
      <div class="filter-section">
        <h3>🔍 Filtrar por Red</h3>
        <div class="filter-buttons">
          <button 
            class="filter-btn {selectedFilter === 'all' ? 'active' : ''}"
            on:click={() => selectedFilter = 'all'}
          >
            🌐 Todas las Redes
          </button>
          <button 
            class="filter-btn {selectedFilter === 'current' ? 'active' : ''}"
            on:click={() => selectedFilter = 'current'}
          >
            ⚡ Red Actual ({$networkStore.currentNetwork.name})
          </button>
          <button 
            class="filter-btn {selectedFilter === 'specific' ? 'active' : ''}"
            on:click={() => selectedFilter = 'specific'}
          >
            🎯 Red Específica
          </button>
        </div>

        {#if selectedFilter === 'specific'}
          <div class="network-selector">
            <label for="networkSelect">Seleccionar Red:</label>
            <select 
              id="networkSelect" 
              bind:value={selectedNetworkChainId}
              on:change={applyFilters}
            >
              <option value={null}>Seleccione una red...</option>
              {#each availableNetworks as network}
                <option value={network.chainId}>
                  {network.name} ({network.symbol})
                </option>
              {/each}
            </select>
          </div>
        {/if}
      </div>

      <!-- Búsqueda y Ordenamiento -->
      <div class="search-sort-section">
        <div class="search-box">
          <span class="search-icon">🔎</span>
          <input 
            type="text" 
            placeholder="Buscar por producto, productor, red o hash..."
            bind:value={searchTerm}
          />
        </div>

        <div class="sort-box">
          <label for="sortSelect">Ordenar por:</label>
          <select id="sortSelect" bind:value={sortBy} on:change={applyFilters}>
            <option value="date">Fecha (más reciente)</option>
            <option value="amount">Monto (mayor a menor)</option>
            <option value="product">Producto (A-Z)</option>
          </select>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="stats-section">
        <div class="stat-card">
          <span class="stat-icon">📊</span>
          <div>
            <p class="stat-value">{filteredTransactions.length}</p>
            <p class="stat-label">Transacciones</p>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">🌐</span>
          <div>
            <p class="stat-value">{new Set(filteredTransactions.map(tx => tx.chainId)).size}</p>
            <p class="stat-label">Redes Usadas</p>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">💰</span>
          <div>
            <p class="stat-value">
              S/ {filteredTransactions.reduce((sum, tx) => sum + (parseFloat(tx.totalPriceSoles) || 0), 0).toFixed(2)}
            </p>
            <p class="stat-label">Total Ventas</p>
          </div>
        </div>
        {#if transactions.length > 0}
          <button class="clear-btn" on:click={clearHistory}>
            🗑️ Limpiar Historial
          </button>
        {/if}
      </div>
    </div>

    <!-- Lista de Transacciones -->
    {#if isLoading}
      <div class="loading-state">
        <div class="spinner-large"></div>
        <h3>Cargando transacciones...</h3>
        <p>Consultando base de datos</p>
      </div>
    {:else if errorMessage}
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>Error al cargar datos</h3>
        <p>{errorMessage}</p>
        <button class="retry-btn" on:click={loadTransactions}>
          Reintentar
        </button>
      </div>
    {:else if filteredTransactions.length === 0}
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No hay transacciones</h3>
        <p>
          {#if transactions.length === 0}
            Aún no has registrado ninguna transacción.
          {:else}
            No se encontraron transacciones con los filtros aplicados.
          {/if}
        </p>
      </div>
    {:else}
      <div class="transactions-list">
        {#each filteredTransactions as tx (tx.hash)}
          <div class="transaction-card">
            <!-- Header de la transacción -->
            <div class="tx-header">
              <div class="tx-header-left">
                <span class="product-icon">{tx.productIcon || '🌾'}</span>
                <div class="tx-title-section">
                  <h4>{tx.productName || 'Transacción'}</h4>
                  <p class="tx-date">{tx.date}</p>
                </div>
              </div>
              <div class="tx-header-right">
                <span 
                  class="network-badge" 
                  style="background-color: {getNetworkBadgeColor(tx.chainId)}"
                >
                  {tx.networkName}
                </span>
                <span class="status-badge status-{tx.status}">
                  {tx.status === 'confirmed' ? '✅ Confirmada' : '❌ Fallida'}
                </span>
              </div>
            </div>

            <!-- Detalles de la transacción -->
            <div class="tx-body">
              <div class="tx-details-grid">
                <div class="detail-group">
                  <span class="detail-icon">⚖️</span>
                  <div>
                    <p class="detail-label">Cantidad</p>
                    <p class="detail-value">{parseFloat(tx.quantity || 0).toFixed(2)} kg</p>
                  </div>
                </div>
                <div class="detail-group">
                  <span class="detail-icon">💵</span>
                  <div>
                    <p class="detail-label">Precio/kg</p>
                    <p class="detail-value">S/ {parseFloat(tx.pricePerKg || 0).toFixed(2)}</p>
                  </div>
                </div>
                <div class="detail-group highlight">
                  <span class="detail-icon">💰</span>
                  <div>
                    <p class="detail-label">Total</p>
                    <p class="detail-value">S/ {parseFloat(tx.totalPriceSoles || 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div class="tx-info-section">
                <div class="info-row">
                  <span class="info-label">👨‍🌾 Productor:</span>
                  <span class="info-text">{tx.producerName} ({tx.producerLocation})</span>
                </div>
                <div class="info-row">
                  <span class="info-label">🔗 Hash:</span>
                  <div class="hash-display">
                    <code class="hash-code">{tx.hash.slice(0, 20)}...{tx.hash.slice(-18)}</code>
                    <button class="icon-btn" on:click={() => copyToClipboard(tx.hash)} title="Copiar">
                      📋
                    </button>
                  </div>
                </div>
                <div class="info-row">
                  <span class="info-label">📦 Bloque:</span>
                  <span class="info-text">#{tx.blockNumber}</span>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="tx-footer">
              <a 
                href={tx.explorerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                class="action-link"
              >
                🔍 Ver en Explorador
              </a>
              <button class="delete-btn" on:click={() => deleteTransaction(tx.hash)}>
                🗑️ Eliminar
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .history-page {
    min-height: 100vh;
    padding: 40px 20px;
    background: #F5F5F5;
  }

  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Header */
  .page-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .page-header h1 {
    font-size: 36px;
    font-weight: 700;
    color: #2E7D32;
    margin: 0 0 8px 0;
  }

  .page-header p {
    font-size: 16px;
    color: #558B2F;
    margin: 0;
  }

  /* Controls Card */
  .controls-card {
    background: white;
    border-radius: 20px;
    padding: 32px;
    margin-bottom: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .filter-section {
    margin-bottom: 28px;
  }

  .filter-section h3 {
    font-size: 18px;
    color: #2E7D32;
    margin: 0 0 16px 0;
    font-weight: 600;
  }

  .filter-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .filter-btn {
    padding: 12px 20px;
    background: #F5F5F5;
    border: 2px solid #E0E0E0;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #424242;
  }

  .filter-btn:hover {
    border-color: #4CAF50;
    background: #E8F5E9;
  }

  .filter-btn.active {
    background: #4CAF50;
    color: white;
    border-color: #4CAF50;
  }

  .network-selector {
    margin-top: 16px;
  }

  .network-selector label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #424242;
    margin-bottom: 8px;
  }

  .network-selector select {
    width: 100%;
    max-width: 400px;
    padding: 12px 16px;
    border: 2px solid #E0E0E0;
    border-radius: 10px;
    font-size: 14px;
    font-family: inherit;
  }

  /* Search and Sort */
  .search-sort-section {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 16px;
    margin-bottom: 28px;
  }

  .search-box {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-icon {
    position: absolute;
    left: 14px;
    font-size: 18px;
  }

  .search-box input {
    width: 100%;
    padding: 12px 16px 12px 44px;
    border: 2px solid #E0E0E0;
    border-radius: 10px;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .search-box input:focus {
    outline: none;
    border-color: #4CAF50;
  }

  .sort-box {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .sort-box label {
    font-size: 14px;
    font-weight: 500;
    color: #424242;
    white-space: nowrap;
  }

  .sort-box select {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #E0E0E0;
    border-radius: 10px;
    font-size: 14px;
    font-family: inherit;
  }

  /* Stats Section */
  .stats-section {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .stat-card {
    background: #F1F8E9;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    border-left: 4px solid #4CAF50;
  }

  .stat-icon {
    font-size: 32px;
  }

  .stat-value {
    font-size: 20px;
    font-weight: 700;
    color: #2E7D32;
    margin: 0 0 4px 0;
  }

  .stat-label {
    font-size: 12px;
    color: #558B2F;
    margin: 0;
  }

  .clear-btn {
    background: #FFEBEE;
    border: 2px solid #EF5350;
    color: #C62828;
    border-radius: 12px;
    padding: 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .clear-btn:hover {
    background: #EF5350;
    color: white;
  }

  /* Empty State */
  .empty-state {
    background: white;
    border-radius: 20px;
    padding: 60px 40px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .empty-icon {
    font-size: 80px;
    margin-bottom: 20px;
  }

  .empty-state h3 {
    font-size: 24px;
    color: #424242;
    margin: 0 0 8px 0;
  }

  .empty-state p {
    font-size: 16px;
    color: #757575;
    margin: 0;
  }

  /* Loading State */
  .loading-state {
    background: white;
    border-radius: 20px;
    padding: 60px 40px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .spinner-large {
    width: 60px;
    height: 60px;
    border: 6px solid #E8F5E9;
    border-top-color: #4CAF50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-state h3 {
    font-size: 20px;
    color: #2E7D32;
    margin: 0 0 8px 0;
  }

  .loading-state p {
    font-size: 14px;
    color: #757575;
    margin: 0;
  }

  /* Error State */
  .error-state {
    background: white;
    border-radius: 20px;
    padding: 60px 40px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .error-icon {
    font-size: 80px;
    margin-bottom: 20px;
  }

  .error-state h3 {
    font-size: 24px;
    color: #C62828;
    margin: 0 0 8px 0;
  }

  .error-state p {
    font-size: 16px;
    color: #757575;
    margin: 0 0 20px 0;
  }

  .retry-btn {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 12px 32px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .retry-btn:hover {
    background: #2E7D32;
    transform: translateY(-2px);
  }

  /* Transactions List */
  .transactions-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .transaction-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
  }

  .transaction-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
  }

  /* Transaction Header */
  .tx-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 2px solid #F5F5F5;
  }

  .tx-header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .product-icon {
    font-size: 40px;
    background: #E8F5E9;
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tx-title-section h4 {
    font-size: 18px;
    color: #2E7D32;
    margin: 0 0 4px 0;
    font-weight: 600;
  }

  .tx-date {
    font-size: 13px;
    color: #757575;
    margin: 0;
  }

  .tx-header-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }

  .network-badge {
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    color: white;
  }

  .status-badge {
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
  }

  .status-confirmed {
    background: #E8F5E9;
    color: #2E7D32;
  }

  .status-failed {
    background: #FFEBEE;
    color: #C62828;
  }

  /* Transaction Body */
  .tx-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .tx-details-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }

  .detail-group {
    background: #F5F5F5;
    border-radius: 10px;
    padding: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    border: 2px solid transparent;
  }

  .detail-group.highlight {
    background: #E8F5E9;
    border-color: #4CAF50;
  }

  .detail-icon {
    font-size: 28px;
  }

  .detail-label {
    font-size: 12px;
    color: #757575;
    margin: 0 0 4px 0;
  }

  .detail-value {
    font-size: 16px;
    color: #424242;
    font-weight: 600;
    margin: 0;
  }

  .tx-info-section {
    background: #F9F9F9;
    border-radius: 10px;
    padding: 16px;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #E0E0E0;
  }

  .info-row:last-child {
    border-bottom: none;
  }

  .info-label {
    font-size: 14px;
    color: #757575;
    font-weight: 500;
  }

  .info-text {
    font-size: 14px;
    color: #424242;
    font-weight: 600;
  }

  .hash-display {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .hash-code {
    font-size: 12px;
    background: white;
    padding: 6px 10px;
    border-radius: 6px;
    color: #424242;
  }

  .icon-btn {
    background: #4CAF50;
    border: none;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .icon-btn:hover {
    background: #2E7D32;
    transform: scale(1.1);
  }

  /* Transaction Footer */
  .tx-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 2px solid #F5F5F5;
  }

  .action-link {
    color: #4CAF50;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .action-link:hover {
    color: #2E7D32;
    text-decoration: underline;
  }

  .delete-btn {
    background: #FFEBEE;
    border: 1px solid #EF5350;
    color: #C62828;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .delete-btn:hover {
    background: #EF5350;
    color: white;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .stats-section {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .search-sort-section {
      grid-template-columns: 1fr;
    }

    .tx-details-grid {
      grid-template-columns: 1fr;
    }

    .stats-section {
      grid-template-columns: 1fr;
    }

    .tx-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .tx-header-right {
      align-items: flex-start;
    }

    .tx-footer {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
    }

    .action-link,
    .delete-btn {
      text-align: center;
    }
  }
</style>
