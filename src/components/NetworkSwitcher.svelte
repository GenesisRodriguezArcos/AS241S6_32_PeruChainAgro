<script>
  import { networkStore, NETWORKS } from '../stores/networkStore';
  import { BlockchainService } from '../services/blockchainService';

  let isLoading = false;
  let message = '';
  let messageType = ''; // 'success' or 'error'

  $: evmNetworks = Object.entries(NETWORKS).filter(([_, net]) => net.type === 'EVM');
  $: utxoNetworks = Object.entries(NETWORKS).filter(([_, net]) => net.type === 'UTXO');

  async function switchToNetwork(network) {
    if (!window.ethereum) {
      showMessage('Instala una wallet para continuar', 'error');
      return;
    }

    if (network.type === 'UTXO') {
      showMessage(`${network.name} no es soportada por MetaMask (solo simulación)`, 'error');
      setTimeout(() => {
        networkStore.setNetwork(network);
        showMessage(`Vista cambiada a ${network.name}`, 'success');
      }, 1000);
      return;
    }

    isLoading = true;
    message = '';

    try {
      await BlockchainService.switchNetwork(network);
      networkStore.setNetwork(network);
      showMessage(`✓ Cambiado a ${network.name}`, 'success');
    } catch (error) {
      showMessage(error.message || 'Error al cambiar', 'error');
    } finally {
      isLoading = false;
    }
  }

  function showMessage(text, type) {
    message = text;
    messageType = type;
    setTimeout(() => {
      message = '';
    }, 4000);
  }
</script>

<div class="network-switcher">
  <!-- Red Actual (Detectada Automáticamente) -->
  <div class="current-network">
    <div class="section-header">
      <h2>🌐 Red Conectada</h2>
      <p class="auto-detect">Se actualiza automáticamente al cambiar en tu wallet</p>
    </div>
    <div class="current-box">
      <span class="net-icon-display">
        {$networkStore.currentNetwork.type === 'EVM' ? '⚡' : '₿'}
      </span>
      <div>
        <h3>{$networkStore.currentNetwork.name}</h3>
        <p>
          {$networkStore.currentNetwork.symbol} • Chain ID: {$networkStore.currentNetwork.chainId}
        </p>
      </div>
    </div>
  </div>

  {#if message}
    <div class="message message-{messageType}">
      {message}
    </div>
  {/if}

  <!-- Redes EVM Disponibles -->
  <div class="networks-section">
    <h2>⚡ Redes EVM Disponibles</h2>
    <p class="section-desc">Haz clic para cambiar de red desde la DApp</p>
    <div class="networks-grid">
      {#each evmNetworks as [key, network]}
        <button
          class="network-btn {$networkStore.currentNetwork.chainId === network.chainId ? 'active' : ''}"
          on:click={() => switchToNetwork(network)}
          disabled={isLoading}
        >
          <span class="net-icon">⚡</span>
          <div class="net-info">
            <strong>{network.name}</strong>
            <span>{network.symbol} • ID: {network.chainId}</span>
          </div>
          {#if $networkStore.currentNetwork.chainId === network.chainId}
            <span class="check">✓</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <!-- Redes UTXO -->
  <div class="networks-section">
    <h2>₿ Redes UTXO (Simulación)</h2>
    <p class="section-desc">Redes Bitcoin - Solo para demostración educativa</p>
    <div class="networks-grid">
      {#each utxoNetworks as [key, network]}
        <button
          class="network-btn utxo {$networkStore.currentNetwork.chainId === network.chainId ? 'active' : ''}"
          on:click={() => switchToNetwork(network)}
          disabled={isLoading}
        >
          <span class="net-icon">₿</span>
          <div class="net-info">
            <strong>{network.name}</strong>
            <span>{network.symbol}</span>
          </div>
          {#if $networkStore.currentNetwork.chainId === network.chainId}
            <span class="check">✓</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <!-- Nota Informativa -->
  <div class="info-box">
    <span class="info-icon">💡</span>
    <div>
      <p><strong>Tip:</strong> Puedes cambiar de red directamente desde tu Pali Wallet y la DApp lo detectará automáticamente.</p>
      <p class="small">Si tu red no aparece en la lista, aún puedes usarla desde tu wallet y la DApp la reconocerá.</p>
    </div>
  </div>
</div>

<style>
  .network-switcher {
    max-width: 800px;
    margin: 0 auto;
  }

  /* Red Actual */
  .current-network {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .section-header {
    margin-bottom: 16px;
  }

  .section-header h2 {
    font-size: 18px;
    color: var(--primary-dark);
    margin-bottom: 4px;
  }

  .auto-detect {
    font-size: 13px;
    color: var(--primary-green);
    font-weight: 600;
    margin: 0;
  }

  .current-box {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: white;
    color: #2E7D32;
    border: 2px solid #2E7D32;
    border-radius: 12px;
  }

  .net-icon-display {
    font-size: 48px;
  }

  .current-box h3 {
    font-size: 22px;
    margin: 0 0 4px 0;
  }

  .current-box p {
    font-size: 14px;
    margin: 0;
    opacity: 0.85;
  }

  /* Mensajes */
  .message {
    padding: 16px 20px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 24px;
    text-align: center;
  }

  .message-success {
    background: #E8F5E9;
    color: var(--success);
  }

  .message-error {
    background: #FFEBEE;
    color: var(--error);
  }

  /* Secciones de Redes */
  .networks-section {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .networks-section h2 {
    font-size: 18px;
    color: var(--primary-dark);
    margin-bottom: 8px;
  }

  .section-desc {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 0 0 20px 0;
  }

  .networks-grid {
    display: grid;
    gap: 12px;
  }

  .network-btn {
    background: white;
    border: 2px solid #2E7D32;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    text-align: left;
  }

  .network-btn:hover:not(:disabled) {
    border-color: #1B5E20;
    background: #E8F5E9;
    transform: translateX(4px);
  }

  .network-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .network-btn.active {
    background: #E8F5E9;
    border-color: #1B5E20;
    border-width: 3px;
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
  }

  .network-btn.active .net-info strong,
  .network-btn.active .net-info span {
    color: #1B5E20;
  }

  .network-btn.utxo {
    background: #FFF9E6;
    border-color: #2E7D32;
  }

  .network-btn.utxo.active {
    background: #FFF3CD;
    border-color: #1B5E20;
  }

  .net-icon {
    font-size: 32px;
  }

  .info-icon {
    font-size: 32px;
    flex-shrink: 0;
  }

  .net-info {
    flex: 1;
  }

  .net-info strong {
    display: block;
    font-size: 16px;
    color: var(--primary-dark);
    margin-bottom: 4px;
  }

  .net-info span {
    font-size: 13px;
    color: var(--text-secondary);
  }

  .check {
    font-size: 24px;
    color: #2E7D32;
    font-weight: bold;
  }

  /* Info Box */
  .info-box {
    background: white;
    color: #2E7D32;
    border: 2px solid #2E7D32;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }

  .info-box p {
    margin: 0 0 8px 0;
    font-size: 14px;
    line-height: 1.6;
  }

  .info-box p.small {
    font-size: 12px;
    opacity: 0.85;
    margin: 0;
  }

  .info-box strong {
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .current-box {
      flex-direction: column;
      text-align: center;
    }

    .network-btn {
      padding: 14px;
    }

    .net-icon {
      font-size: 28px;
      width: 40px;
      height: 40px;
    }

    .net-info strong {
      font-size: 14px;
    }
  }
</style>
