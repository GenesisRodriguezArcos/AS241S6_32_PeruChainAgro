<script>
  import { walletStore } from '../stores/walletStore';
  import { networkStore, NETWORKS } from '../stores/networkStore';
  import { BlockchainService } from '../services/blockchainService';

  let queryMode = 'withLogin'; // 4 modos del profesor
  let addressInput = '';
  let selectedNetwork = NETWORKS.SEPOLIA;
  let selectedNetworks = [NETWORKS.SEPOLIA, NETWORKS.POLYGON];
  let balanceResult = null;
  let multiBalanceResults = [];
  let isLoading = false;
  let errorMessage = '';

  $: availableNetworks = Object.values(NETWORKS);

  async function checkBalance() {
    isLoading = true;
    errorMessage = '';
    balanceResult = null;
    multiBalanceResults = [];

    try {
      if (queryMode === 'withLogin') {
        // 1) Con inicio de sesión
        if (!$walletStore.isConnected) {
          errorMessage = 'Debes conectar tu wallet primero';
          isLoading = false;
          return;
        }
        
        const balance = await BlockchainService.getBalance(
          $walletStore.address,
          $networkStore.currentNetwork
        );
        
        balanceResult = {
          address: $walletStore.address,
          network: $networkStore.currentNetwork.name,
          symbol: $networkStore.currentNetwork.symbol,
          balance: balance
        };
      } 
      else if (queryMode === 'withoutLogin') {
        // 2) Sin inicio de sesión
        if (!addressInput) {
          errorMessage = 'Por favor ingresa una dirección';
          isLoading = false;
          return;
        }

        const balance = await BlockchainService.getBalance(
          addressInput,
          $networkStore.currentNetwork
        );
        
        balanceResult = {
          address: addressInput,
          network: $networkStore.currentNetwork.name,
          symbol: $networkStore.currentNetwork.symbol,
          balance: balance
        };
      }
      else if (queryMode === 'singleNetwork') {
        // 3) Consulta en una red específica
        if (!addressInput) {
          errorMessage = 'Por favor ingresa una dirección';
          isLoading = false;
          return;
        }

        const balance = await BlockchainService.getBalance(
          addressInput,
          selectedNetwork
        );
        
        balanceResult = {
          address: addressInput,
          network: selectedNetwork.name,
          symbol: selectedNetwork.symbol,
          balance: balance
        };
      }
      else if (queryMode === 'multiNetwork') {
        // 4) Consulta masiva (múltiples redes)
        if (!addressInput) {
          errorMessage = 'Por favor ingresa una dirección';
          isLoading = false;
          return;
        }

        multiBalanceResults = await BlockchainService.getBalanceMultipleNetworks(
          addressInput,
          selectedNetworks
        );
      }
    } catch (error) {
      console.error('Error:', error);
      errorMessage = error.message || 'Error al consultar el saldo';
    } finally {
      isLoading = false;
    }
  }

  function toggleNetworkSelection(network) {
    const index = selectedNetworks.findIndex(n => n.chainId === network.chainId);
    if (index > -1) {
      selectedNetworks = selectedNetworks.filter(n => n.chainId !== network.chainId);
    } else {
      selectedNetworks = [...selectedNetworks, network];
    }
  }

  function isNetworkSelected(network) {
    return selectedNetworks.some(n => n.chainId === network.chainId);
  }
</script>

<div class="balance-page">
  <div class="content-wrapper">
    <!-- Título -->
    <div class="page-header">
      <h1>💰 Consultar Saldo</h1>
      <p>4 modos de consulta según lo solicitado</p>
    </div>

    <!-- Selector de Modo (LOS 4 MODOS DEL PROFESOR) -->
    <div class="mode-selector">
      <h3>Selecciona el Modo de Consulta</h3>
      <div class="mode-buttons">
        <button
          class="mode-btn {queryMode === 'withLogin' ? 'active' : ''}"
          on:click={() => queryMode = 'withLogin'}
        >
          <span class="mode-icon">🔐</span>
          <div>
            <strong>1) Con Login</strong>
            <small>Usa tu wallet conectada</small>
          </div>
        </button>

        <button
          class="mode-btn {queryMode === 'withoutLogin' ? 'active' : ''}"
          on:click={() => queryMode = 'withoutLogin'}
        >
          <span class="mode-icon">🔍</span>
          <div>
            <strong>2) Sin Login</strong>
            <small>Consulta cualquier dirección</small>
          </div>
        </button>

        <button
          class="mode-btn {queryMode === 'singleNetwork' ? 'active' : ''}"
          on:click={() => queryMode = 'singleNetwork'}
        >
          <span class="mode-icon">🌐</span>
          <div>
            <strong>3) Una Red</strong>
            <small>Selecciona red específica</small>
          </div>
        </button>

        <button
          class="mode-btn {queryMode === 'multiNetwork' ? 'active' : ''}"
          on:click={() => queryMode = 'multiNetwork'}
        >
          <span class="mode-icon">🌍</span>
          <div>
            <strong>4) Múltiples Redes</strong>
            <small>Consulta masiva</small>
          </div>
        </button>
      </div>
    </div>

    <!-- Formulario según el modo -->
    <div class="query-card">
      <h3>Datos de Consulta</h3>

      {#if queryMode === 'withLogin'}
        {#if $walletStore.isConnected}
          <div class="info-box">
            <p><strong>Dirección conectada:</strong></p>
            <code>{$walletStore.address}</code>
            <p><strong>Red actual:</strong></p>
            <span class="badge">{$networkStore.currentNetwork.name}</span>
          </div>
        {:else}
          <div class="warning-box">
            <p>⚠️ Debes conectar tu wallet para usar este modo</p>
          </div>
        {/if}
      {:else}
        <div class="form-group">
          <label for="address">Dirección de la Wallet</label>
          <input
            id="address"
            type="text"
            placeholder="0x..."
            bind:value={addressInput}
            disabled={isLoading}
          />
        </div>
      {/if}

      {#if queryMode === 'singleNetwork'}
        <div class="form-group">
          <label for="network">Seleccionar Red</label>
          <select id="network" bind:value={selectedNetwork} disabled={isLoading}>
            {#each availableNetworks as network}
              <option value={network}>{network.name} ({network.type})</option>
            {/each}
          </select>
        </div>
      {/if}

      {#if queryMode === 'multiNetwork'}
        <div class="form-group">
          <label>Seleccionar Redes (mínimo 1)</label>
          <div class="network-grid">
            {#each availableNetworks as network}
              <button
                class="network-chip {isNetworkSelected(network) ? 'selected' : ''}"
                on:click={() => toggleNetworkSelection(network)}
                disabled={isLoading}
              >
                <span>{network.name}</span>
                <small>{network.type}</small>
              </button>
            {/each}
          </div>
          <small class="help-text">
            {selectedNetworks.length} red{selectedNetworks.length !== 1 ? 'es' : ''} seleccionada{selectedNetworks.length !== 1 ? 's' : ''}
          </small>
        </div>
      {/if}

      {#if errorMessage}
        <div class="error-box">
          <p>❌ {errorMessage}</p>
        </div>
      {/if}

      <button
        class="btn-query"
        on:click={checkBalance}
        disabled={isLoading || (queryMode === 'withLogin' && !$walletStore.isConnected) || 
                 (queryMode === 'multiNetwork' && selectedNetworks.length < 1)}
      >
        {#if isLoading}
          <span class="spinner"></span>
          Consultando...
        {:else}
          Consultar Saldo
        {/if}
      </button>
    </div>

    <!-- Resultado Simple -->
    {#if balanceResult && queryMode !== 'multiNetwork'}
      <div class="result-card">
        <h3>✅ Resultado</h3>
        
        <div class="result-detail">
          <div class="result-header-info">
            <span class="result-icon">💰</span>
            <div>
              <h4>{balanceResult.network}</h4>
              <code>{balanceResult.address.slice(0, 12)}...{balanceResult.address.slice(-10)}</code>
            </div>
          </div>
          
          <div class="balance-display">
            <span class="balance-value">{parseFloat(balanceResult.balance).toFixed(6)}</span>
            <span class="balance-symbol">{balanceResult.symbol}</span>
          </div>
        </div>
      </div>
    {/if}

    <!-- Resultado Múltiple -->
    {#if multiBalanceResults.length > 0}
      <div class="multi-result-card">
        <h3>✅ Resultados Múltiples Redes</h3>
        
        <div class="multi-grid">
          {#each multiBalanceResults as result}
            <div class="mini-card {result.hasError ? 'error' : ''}">
              <div class="mini-header">
                <span class="mini-network">{result.network}</span>
                <span class="badge-type">{result.type}</span>
              </div>
              <div class="mini-balance">
                <span class="mini-value">
                  {result.hasError ? result.errorMessage : parseFloat(result.balance).toFixed(6)}
                </span>
                {#if !result.hasError}
                  <span class="mini-symbol">{result.symbol}</span>
                {/if}
              </div>
            </div>
          {/each}
        </div>

        <div class="summary">
          <p><strong>Total de redes consultadas:</strong> {multiBalanceResults.length}</p>
          <p><strong>Dirección consultada:</strong></p>
          <code>{addressInput}</code>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .balance-page {
    min-height: 100vh;
    padding: 40px 20px;
    background: #F5F5F5;
  }

  .content-wrapper {
    max-width: 900px;
    margin: 0 auto;
  }

  /* Header */
  .page-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .page-header h1 {
    font-size: 32px;
    font-weight: 700;
    color: #2E7D32;
    margin: 0 0 8px 0;
  }

  .page-header p {
    font-size: 16px;
    color: #757575;
    margin: 0;
  }

  /* Mode Selector */
  .mode-selector {
    background: white;
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .mode-selector h3 {
    font-size: 18px;
    color: #2E7D32;
    margin: 0 0 20px 0;
  }

  .mode-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .mode-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: white;
    border: 2px solid #E0E0E0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
  }

  .mode-btn:hover {
    border-color: #2E7D32;
    background: #E8F5E9;
  }

  .mode-btn.active {
    background: #E8F5E9;
    border-color: #2E7D32;
    border-width: 3px;
  }

  .mode-icon {
    font-size: 32px;
  }

  .mode-btn strong {
    display: block;
    font-size: 14px;
    color: #2E7D32;
  }

  .mode-btn small {
    display: block;
    font-size: 12px;
    color: #757575;
  }

  /* Query Card */
  .query-card {
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 24px;
  }

  .query-card h3 {
    font-size: 18px;
    color: #2E7D32;
    margin: 0 0 20px 0;
  }

  /* Form */
  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #424242;
    font-size: 14px;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #E0E0E0;
    border-radius: 10px;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #2E7D32;
  }

  /* Info/Warning/Error Boxes */
  .info-box,
  .warning-box,
  .error-box {
    padding: 16px;
    border-radius: 10px;
    margin-bottom: 20px;
  }

  .info-box {
    background: #E8F5E9;
    border: 2px solid #2E7D32;
  }

  .info-box p {
    margin: 8px 0;
    font-size: 14px;
    color: #2E7D32;
  }

  .info-box code {
    display: block;
    padding: 8px;
    background: white;
    border-radius: 6px;
    font-size: 12px;
    margin: 8px 0;
    word-break: break-all;
  }

  .badge {
    display: inline-block;
    padding: 4px 12px;
    background: #2E7D32;
    color: white;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
  }

  .warning-box {
    background: #FFF3E0;
    border: 2px solid #F57C00;
  }

  .warning-box p {
    margin: 0;
    color: #F57C00;
    font-size: 14px;
    font-weight: 500;
  }

  .error-box {
    background: #FFEBEE;
    border: 2px solid #C62828;
  }

  .error-box p {
    margin: 0;
    color: #C62828;
    font-size: 14px;
    font-weight: 500;
  }

  /* Network Grid */
  .network-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
    margin-bottom: 8px;
  }

  .network-chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 12px;
    background: white;
    border: 2px solid #E0E0E0;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .network-chip:hover {
    border-color: #2E7D32;
  }

  .network-chip.selected {
    background: #2E7D32;
    color: white;
    border-color: #2E7D32;
  }

  .network-chip small {
    font-size: 10px;
    opacity: 0.8;
  }

  .help-text {
    display: block;
    font-size: 12px;
    color: #757575;
    margin-top: 8px;
  }

  /* Button */
  .btn-query {
    width: 100%;
    padding: 16px;
    background: #2E7D32;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .btn-query:hover:not(:disabled) {
    background: #1B5E20;
    transform: translateY(-2px);
  }

  .btn-query:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Result Cards */
  .result-card,
  .multi-result-card {
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    animation: slideUp 0.4s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .result-card h3,
  .multi-result-card h3 {
    font-size: 20px;
    color: #2E7D32;
    margin: 0 0 20px 0;
  }

  .result-detail {
    background: #E8F5E9;
    border: 2px solid #2E7D32;
    border-radius: 12px;
    padding: 24px;
  }

  .result-header-info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
  }

  .result-icon {
    font-size: 48px;
  }

  .result-header-info h4 {
    font-size: 18px;
    color: #2E7D32;
    margin: 0 0 4px 0;
  }

  .result-header-info code {
    font-size: 12px;
    color: #757575;
  }

  .balance-display {
    text-align: center;
    padding: 20px;
    background: #2E7D32;
    border-radius: 10px;
  }

  .balance-value {
    display: block;
    font-size: 36px;
    font-weight: 700;
    color: white;
    margin-bottom: 4px;
  }

  .balance-symbol {
    font-size: 16px;
    color: white;
    opacity: 0.9;
  }

  /* Multi Grid */
  .multi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .mini-card {
    background: #E8F5E9;
    border: 2px solid #2E7D32;
    border-radius: 10px;
    padding: 16px;
  }

  .mini-card.error {
    background: #FFEBEE;
    border-color: #C62828;
  }

  .mini-card.error .mini-network,
  .mini-card.error .mini-value {
    color: #C62828;
  }

  .mini-card.error .badge-type {
    background: #C62828;
  }

  .mini-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #2E7D32;
  }

  .mini-network {
    font-size: 13px;
    font-weight: 600;
    color: #2E7D32;
  }

  .badge-type {
    font-size: 10px;
    padding: 2px 8px;
    background: #2E7D32;
    color: white;
    border-radius: 4px;
  }

  .mini-balance {
    text-align: center;
  }

  .mini-value {
    display: block;
    font-size: 20px;
    font-weight: 700;
    color: #2E7D32;
    margin-bottom: 4px;
  }

  .mini-symbol {
    font-size: 12px;
    color: #757575;
  }

  .summary {
    background: #F5F5F5;
    padding: 16px;
    border-radius: 10px;
  }

  .summary p {
    margin: 8px 0;
    font-size: 14px;
  }

  .summary code {
    display: block;
    padding: 8px;
    background: white;
    border-radius: 6px;
    font-size: 12px;
    margin-top: 8px;
    word-break: break-all;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .mode-buttons {
      grid-template-columns: 1fr;
    }

    .network-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .multi-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
