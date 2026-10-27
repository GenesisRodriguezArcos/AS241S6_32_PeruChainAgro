<script>
  import { walletStore } from '../stores/walletStore';
  import { networkStore } from '../stores/networkStore';
  import { BlockchainService } from '../services/blockchainService';
  import { ethers } from 'ethers';

  let recipientAddress = '';
  let amount = '';
  let isLoading = false;
  let transactionHash = '';
  let transactionDetails = null;
  let errorMessage = '';

  async function sendTransaction() {
    if (!$walletStore.isConnected) {
      errorMessage = 'Por favor conecta tu wallet primero';
      return;
    }

    if (!recipientAddress || !amount) {
      errorMessage = 'Por favor completa todos los campos';
      return;
    }

    if (!ethers.isAddress(recipientAddress)) {
      errorMessage = 'Dirección del destinatario inválida';
      return;
    }

    if (parseFloat(amount) <= 0) {
      errorMessage = 'El monto debe ser mayor a 0';
      return;
    }

    isLoading = true;
    errorMessage = '';
    transactionHash = '';
    transactionDetails = null;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await BlockchainService.sendTransaction(
        recipientAddress,
        amount,
        provider,
        signer
      );

      transactionHash = tx.hash;
      
      // Esperar confirmación
      const receipt = await BlockchainService.waitForTransaction(tx.hash, provider);
      
      transactionDetails = {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        blockNumber: receipt.blockNumber,
        status: receipt.status === 1 ? 'Confirmada' : 'Fallida',
        explorerUrl: BlockchainService.getExplorerUrl(tx.hash, $networkStore.currentNetwork)
      };

      // Limpiar formulario
      recipientAddress = '';
      amount = '';
    } catch (error) {
      console.error('Error:', error);
      errorMessage = error.message || 'Error al enviar la transacción';
    } finally {
      isLoading = false;
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert('¡Copiado al portapapeles!');
  }
</script>

<div class="transactions-page">
  <div class="content-wrapper">
    <!-- Título -->
    <div class="page-header">
      <h1>Transacciones</h1>
      <p>Envía criptomonedas de forma segura mediante blockchain</p>
    </div>

    <!-- Card del formulario centrado -->
    <div class="transaction-card">
      <div class="card-header">
        <h2>Enviar Transacción</h2>
      </div>

      {#if !$walletStore.isConnected}
        <div class="alert alert-warning">
          <p>Debes conectar tu wallet para realizar transacciones</p>
        </div>
      {:else}
        <!-- Red actual -->
        <div class="network-badge">
          <span class="badge-label">Red actual:</span>
          <span class="badge-value">{$networkStore.currentNetwork.name}</span>
        </div>

        <!-- Formulario -->
        <form on:submit|preventDefault={sendTransaction}>
          <div class="form-field">
            <label for="recipient">
              Dirección del destinatario
            </label>
            <input
              id="recipient"
              type="text"
              placeholder="0x..."
              bind:value={recipientAddress}
              disabled={isLoading}
            />
          </div>

          <div class="form-field">
            <label for="amount">
              Cantidad ({$networkStore.currentNetwork.symbol})
            </label>
            <input
              id="amount"
              type="text"
              step="0.000001"
              placeholder="0.0"
              bind:value={amount}
              disabled={isLoading}
            />
          </div>

          {#if errorMessage}
            <div class="alert alert-error">
              <p>{errorMessage}</p>
            </div>
          {/if}

          <button 
            type="submit" 
            class="btn-send"
            disabled={isLoading || !recipientAddress || !amount}
          >
            {#if isLoading}
              <span class="spinner"></span>
              Procesando...
            {:else}
              Enviar Transacción
            {/if}
          </button>
        </form>
      {/if}
    </div>

    <!-- Resultado de transacción -->
    {#if transactionHash}
      <div class="result-card">
        <div class="result-header">
          <h3>Transacción Exitosa</h3>
        </div>
        
        <div class="hash-display">
          <span class="hash-label">Hash de Transacción:</span>
          <div class="hash-box">
            <code>{transactionHash}</code>
            <button 
              class="copy-btn" 
              on:click={() => copyToClipboard(transactionHash)}
              title="Copiar"
            >
              Copiar
            </button>
          </div>
        </div>

        {#if transactionDetails}
          <div class="details-grid">
            <div class="detail">
              <span class="detail-label">De:</span>
              <code>{transactionDetails.from.slice(0, 10)}...{transactionDetails.from.slice(-8)}</code>
            </div>
            
            <div class="detail">
              <span class="detail-label">Para:</span>
              <code>{transactionDetails.to.slice(0, 10)}...{transactionDetails.to.slice(-8)}</code>
            </div>
            
            <div class="detail">
              <span class="detail-label">Monto:</span>
              <span class="detail-value">{amount} {$networkStore.currentNetwork.symbol}</span>
            </div>
            
            <div class="detail">
              <span class="detail-label">Bloque:</span>
              <span class="detail-value">{transactionDetails.blockNumber}</span>
            </div>
          </div>

          <a 
            href={transactionDetails.explorerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            class="explorer-btn"
          >
            Ver en Explorador
          </a>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .transactions-page {
    min-height: 100vh;
    padding: 40px 20px;
    background: #F5F5F5;
  }

  /* Contenido */
  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  /* Header */
  .page-header {
    text-align: center;
    margin-bottom: 48px;
  }

  .page-header h1 {
    font-size: 42px;
    color: #1B5E20;
    margin-bottom: 8px;
    font-weight: 700;
  }

  .page-header p {
    font-size: 16px;
    color: #2E7D32;
    font-weight: 600;
  }

  /* Container principal */
  .main-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: center;
    margin-bottom: 40px;
  }

  /* Card del formulario */
  .transaction-card {
    background: white;
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 32px;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid #E8F5E9;
  }

  .card-header h2 {
    font-size: 22px;
    color: #1B5E20;
    margin: 0;
    font-weight: 600;
  }

  /* Red actual */
  .network-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: #E8F5E9;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  .badge-label {
    font-size: 14px;
    color: #616161;
    font-weight: 500;
  }

  .badge-value {
    font-size: 14px;
    color: #2E7D32;
    font-weight: 600;
  }

  /* Formulario */
  .form-field {
    margin-bottom: 20px;
  }

  .form-field label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #424242;
  }

  .form-field input {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #E0E0E0;
    border-radius: 12px;
    font-size: 15px;
    transition: all 0.3s ease;
  }

  .form-field input:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }

  .form-field input:disabled {
    background: #F5F5F5;
    cursor: not-allowed;
  }

  /* Alertas */
  .alert {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 12px;
    margin-bottom: 20px;
    border-left: 4px solid;
  }

  .alert p {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
  }

  .alert-warning {
    background: #FFF3E0;
    color: #F57C00;
    border-color: #F57C00;
  }

  .alert-error {
    background: #FFEBEE;
    color: #C62828;
    border-color: #C62828;
  }

  .btn-send {
    width: 100%;
    padding: 16px 24px;
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
    box-shadow: 0 4px 16px rgba(46, 125, 50, 0.3);
  }

  .btn-send:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(46, 125, 50, 0.4);
    background: #1B5E20;
  }

  .btn-send:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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

  /* Ilustración */
  .illustration {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .crypto-visual {
    position: relative;
    width: 300px;
    height: 300px;
  }

  .circle {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(46, 125, 50, 0.3));
    animation: pulse 3s infinite ease-in-out;
  }

  .circle-1 {
    width: 200px;
    height: 200px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 0s;
  }

  .circle-2 {
    width: 150px;
    height: 150px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 1s;
  }

  .circle-3 {
    width: 100px;
    height: 100px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 2s;
    background: linear-gradient(135deg, #4CAF50, #2E7D32);
  }

  @keyframes pulse {
    0%, 100% { 
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.6;
    }
    50% { 
      transform: translate(-50%, -50%) scale(1.1);
      opacity: 0.8;
    }
  }

  /* Card de resultado */
  .result-card {
    background: white;
    border-radius: 24px;
    padding: 36px;
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

  .result-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 2px solid #E8F5E9;
  }

  .result-header h3 {
    font-size: 24px;
    color: #2E7D32;
    margin: 0;
    font-weight: 600;
  }

  .hash-display {
    margin-bottom: 24px;
  }

  .hash-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #616161;
    margin-bottom: 8px;
  }

  .hash-box {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: #F5F5F5;
    border-radius: 12px;
    border: 2px solid #4CAF50;
  }

  .hash-box code {
    flex: 1;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    color: #424242;
    word-break: break-all;
  }

  .copy-btn {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .copy-btn:hover {
    background: #2E7D32;
    transform: scale(1.05);
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  .detail {
    padding: 12px;
    background: #F5F5F5;
    border-radius: 10px;
  }

  .detail-label {
    display: block;
    font-size: 12px;
    color: #757575;
    margin-bottom: 4px;
  }

  .detail code,
  .detail-value {
    font-size: 14px;
    color: #424242;
    font-weight: 600;
  }

  .explorer-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 14px 24px;
    background: #E8F5E9;
    color: #2E7D32;
    border: 2px solid #4CAF50;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .explorer-btn:hover {
    background: #4CAF50;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .main-container {
      grid-template-columns: 1fr;
    }

    .illustration {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .page-header h1 {
      font-size: 32px;
    }

    .transaction-card {
      padding: 24px;
    }

    .details-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
