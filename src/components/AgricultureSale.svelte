<script>
  import { walletStore } from '../stores/walletStore';
  import { networkStore } from '../stores/networkStore';
  import { transactionStore } from '../stores/transactionStore';
  import { BlockchainService } from '../services/blockchainService';
  import { ethers } from 'ethers';

  let productName = '';
  let productType = 'papa'; // papa, quinua, cafe, cacao, maiz
  let quantity = '';
  let pricePerKg = '';
  let buyerAddress = '';
  let producerName = '';
  let producerLocation = '';
  let isLoading = false;
  let errorMessage = '';
  let successMessage = '';
  let transactionResult = null;

  const productTypes = [
    { value: 'papa', label: '🥔 Papa', icon: '🥔' },
    { value: 'quinua', label: '🌾 Quinua', icon: '🌾' },
    { value: 'cafe', label: '☕ Café', icon: '☕' },
    { value: 'cacao', label: '🍫 Cacao', icon: '🍫' },
    { value: 'maiz', label: '🌽 Maíz', icon: '🌽' },
    { value: 'camote', label: '🍠 Camote', icon: '🍠' },
    { value: 'yuca', label: '🥬 Yuca', icon: '🥬' },
    { value: 'arroz', label: '🍚 Arroz', icon: '🍚' }
  ];

  $: totalPrice = (parseFloat(quantity) || 0) * (parseFloat(pricePerKg) || 0);
  $: selectedProductIcon = productTypes.find(p => p.value === productType)?.icon || '🌱';

  async function registerSale() {
    errorMessage = '';
    successMessage = '';
    transactionResult = null;

    // Validaciones
    if (!$walletStore.isConnected) {
      errorMessage = 'Por favor conecta tu wallet primero';
      return;
    }

    if (!productName || !quantity || !pricePerKg || !buyerAddress || !producerName || !producerLocation) {
      errorMessage = 'Por favor completa todos los campos';
      return;
    }

    if (!ethers.isAddress(buyerAddress)) {
      errorMessage = 'Dirección del comprador inválida';
      return;
    }

    if (parseFloat(quantity) <= 0 || parseFloat(pricePerKg) <= 0) {
      errorMessage = 'Cantidad y precio deben ser mayores a 0';
      return;
    }

    // Convertir el precio total a ETH (simulado: 1 SOL = 0.001 ETH)
    const totalPriceInSoles = totalPrice;
    const amountInEth = (totalPriceInSoles * 0.001).toFixed(6); // Simulación

    isLoading = true;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Enviar transacción con los datos de la venta
      const tx = await signer.sendTransaction({
        to: buyerAddress,
        value: ethers.parseEther(amountInEth),
        // Guardar metadata en el data field (opcional, cuesta gas extra)
        // data: ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify({ productName, quantity, pricePerKg })))
      });

      successMessage = '¡Transacción enviada! Esperando confirmación...';

      // Esperar confirmación
      const receipt = await provider.waitForTransaction(tx.hash);

      // Crear objeto de transacción completo para el historial
      const saleTransaction = {
        hash: tx.hash,
        type: 'agriculture_sale',
        productName: productName,
        productType: productType,
        productIcon: selectedProductIcon,
        quantity: parseFloat(quantity),
        pricePerKg: parseFloat(pricePerKg),
        totalPriceSoles: totalPriceInSoles,
        amountInEth: amountInEth,
        producerName: producerName,
        producerLocation: producerLocation,
        producerAddress: $walletStore.address,
        buyerAddress: buyerAddress,
        networkName: $networkStore.currentNetwork.name,
        networkSymbol: $networkStore.currentNetwork.symbol,
        chainId: $networkStore.currentNetwork.chainId,
        blockNumber: receipt.blockNumber,
        timestamp: Date.now(),
        date: new Date().toLocaleString('es-PE'),
        status: receipt.status === 1 ? 'confirmed' : 'failed',
        explorerUrl: BlockchainService.getExplorerUrl(tx.hash, $networkStore.currentNetwork)
      };

      // Guardar en el store de transacciones (ahora guarda en BD)
      await transactionStore.addTransaction(saleTransaction);

      transactionResult = saleTransaction;
      successMessage = '¡Venta registrada exitosamente en la blockchain y base de datos!';

      // Limpiar formulario
      productName = '';
      quantity = '';
      pricePerKg = '';
      buyerAddress = '';
      producerName = '';
      producerLocation = '';
      productType = 'papa';

    } catch (error) {
      console.error('Error:', error);
      
      if (error.code === 'ACTION_REJECTED') {
        errorMessage = 'Transacción rechazada por el usuario';
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Fondos insuficientes para completar la transacción';
      } else {
        errorMessage = error.message || 'Error al registrar la venta';
      }
    } finally {
      isLoading = false;
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert('¡Copiado al portapapeles!');
  }
</script>

<div class="agriculture-page">
  <div class="content-wrapper">
    <!-- Header -->
    <div class="page-header">
      <h1>🌾 Venta de Productos Agrícolas</h1>
      <p>Registra tus ventas en blockchain de forma transparente y segura</p>
    </div>

    <!-- Formulario de Venta -->
    <div class="sale-card">
      <div class="card-header">
        <div class="header-icon">{selectedProductIcon}</div>
        <h2>Registrar Nueva Venta</h2>
      </div>

      {#if !$walletStore.isConnected}
        <div class="alert alert-warning">
          <p>⚠️ Debes conectar tu wallet para registrar ventas</p>
        </div>
      {:else}
        <!-- Red actual -->
        <div class="network-info">
          <div class="info-item">
            <span class="info-label">Red:</span>
            <span class="info-value">{$networkStore.currentNetwork.name}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Productor:</span>
            <span class="info-value">{$walletStore.address.slice(0, 8)}...{$walletStore.address.slice(-6)}</span>
          </div>
        </div>

        <!-- Formulario -->
        <form on:submit|preventDefault={registerSale}>
          <div class="form-row">
            <div class="form-field">
              <label for="productType">Tipo de Producto *</label>
              <select id="productType" bind:value={productType} disabled={isLoading}>
                {#each productTypes as product}
                  <option value={product.value}>{product.label}</option>
                {/each}
              </select>
            </div>

            <div class="form-field">
              <label for="productName">Nombre del Producto *</label>
              <input
                id="productName"
                type="text"
                placeholder="Ej: Papa Blanca Premium"
                bind:value={productName}
                disabled={isLoading}
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="quantity">Cantidad (kg) *</label>
              <input
                id="quantity"
                type="number"
                step="0.01"
                placeholder="0.00"
                bind:value={quantity}
                disabled={isLoading}
              />
            </div>

            <div class="form-field">
              <label for="pricePerKg">Precio por kg (S/) *</label>
              <input
                id="pricePerKg"
                type="number"
                step="0.01"
                placeholder="0.00"
                bind:value={pricePerKg}
                disabled={isLoading}
              />
            </div>
          </div>

          <!-- Total en tiempo real -->
          {#if quantity && pricePerKg}
            <div class="total-display">
              <span class="total-label">Total de la Venta:</span>
              <span class="total-value">S/ {totalPrice.toFixed(2)}</span>
              <span class="total-crypto">≈ {(totalPrice * 0.001).toFixed(6)} {$networkStore.currentNetwork.symbol}</span>
            </div>
          {/if}

          <div class="form-row">
            <div class="form-field">
              <label for="producerName">Nombre del Productor *</label>
              <input
                id="producerName"
                type="text"
                placeholder="Ej: Juan Pérez"
                bind:value={producerName}
                disabled={isLoading}
              />
            </div>

            <div class="form-field">
              <label for="producerLocation">Ubicación *</label>
              <input
                id="producerLocation"
                type="text"
                placeholder="Ej: Cusco, Perú"
                bind:value={producerLocation}
                disabled={isLoading}
              />
            </div>
          </div>

          <div class="form-field">
            <label for="buyerAddress">Dirección del Comprador (Wallet) *</label>
            <input
              id="buyerAddress"
              type="text"
              placeholder="0x..."
              bind:value={buyerAddress}
              disabled={isLoading}
            />
            <small class="field-hint">Dirección de la wallet del comprador en la blockchain</small>
          </div>

          {#if errorMessage}
            <div class="alert alert-error">
              <p>❌ {errorMessage}</p>
            </div>
          {/if}

          {#if successMessage && !transactionResult}
            <div class="alert alert-info">
              <p>⏳ {successMessage}</p>
            </div>
          {/if}

          <button 
            type="submit" 
            class="btn-register"
            disabled={isLoading || !productName || !quantity || !pricePerKg || !buyerAddress || !producerName || !producerLocation}
          >
            {#if isLoading}
              <span class="spinner"></span>
              Procesando Venta...
            {:else}
              <span>🌾</span>
              Registrar Venta en Blockchain
            {/if}
          </button>
        </form>
      {/if}
    </div>

    <!-- Resultado de la Venta -->
    {#if transactionResult}
      <div class="result-card">
        <div class="result-header">
          <div class="success-icon">✅</div>
          <div>
            <h3>¡Venta Registrada Exitosamente!</h3>
            <p>Tu venta ha sido confirmada en la blockchain</p>
          </div>
        </div>

        <div class="result-content">
          <!-- Información del Producto -->
          <div class="result-section">
            <h4>📦 Información del Producto</h4>
            <div class="info-grid">
              <div class="info-box">
                <span class="box-icon">{transactionResult.productIcon}</span>
                <div>
                  <p class="box-label">Producto</p>
                  <p class="box-value">{transactionResult.productName}</p>
                </div>
              </div>
              <div class="info-box">
                <span class="box-icon">⚖️</span>
                <div>
                  <p class="box-label">Cantidad</p>
                  <p class="box-value">{transactionResult.quantity} kg</p>
                </div>
              </div>
              <div class="info-box">
                <span class="box-icon">💰</span>
                <div>
                  <p class="box-label">Precio/kg</p>
                  <p class="box-value">S/ {transactionResult.pricePerKg.toFixed(2)}</p>
                </div>
              </div>
              <div class="info-box highlight">
                <span class="box-icon">💵</span>
                <div>
                  <p class="box-label">Total</p>
                  <p class="box-value">S/ {parseFloat(transactionResult.totalPriceSoles || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Información de la Transacción -->
          <div class="result-section">
            <h4>🔗 Detalles Blockchain</h4>
            <div class="detail-list">
              <div class="detail-item">
                <span class="detail-label">Hash de Transacción:</span>
                <div class="detail-value-box">
                  <code>{transactionResult.hash}</code>
                  <button class="copy-btn-small" on:click={() => copyToClipboard(transactionResult.hash)}>
                    📋
                  </button>
                </div>
              </div>
              <div class="detail-item">
                <span class="detail-label">Red:</span>
                <span class="detail-value">{transactionResult.networkName}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Bloque:</span>
                <span class="detail-value">#{transactionResult.blockNumber}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Fecha:</span>
                <span class="detail-value">{transactionResult.date}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Productor:</span>
                <span class="detail-value">{transactionResult.producerName} ({transactionResult.producerLocation})</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Comprador:</span>
                <code>{transactionResult.buyerAddress.slice(0, 12)}...{transactionResult.buyerAddress.slice(-10)}</code>
              </div>
            </div>
          </div>

          <a 
            href={transactionResult.explorerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            class="explorer-btn"
          >
            <span>🔍</span>
            Ver en Explorador de Bloques
          </a>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .agriculture-page {
    min-height: 100vh;
    padding: 40px 20px;
    background: linear-gradient(135deg, #F1F8E9 0%, #E8F5E9 100%);
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

  /* Sale Card */
  .sale-card {
    background: white;
    border-radius: 20px;
    padding: 36px;
    box-shadow: 0 8px 32px rgba(46, 125, 50, 0.15);
    margin-bottom: 32px;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 3px solid #E8F5E9;
  }

  .header-icon {
    font-size: 48px;
    background: #E8F5E9;
    width: 72px;
    height: 72px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-header h2 {
    font-size: 24px;
    color: #2E7D32;
    margin: 0;
    font-weight: 600;
  }

  /* Network Info */
  .network-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 28px;
  }

  .info-item {
    background: #F1F8E9;
    padding: 14px 18px;
    border-radius: 12px;
    border-left: 4px solid #4CAF50;
  }

  .info-label {
    display: block;
    font-size: 12px;
    color: #558B2F;
    font-weight: 600;
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  .info-value {
    font-size: 15px;
    color: #2E7D32;
    font-weight: 600;
  }

  /* Form */
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  .form-field {
    display: flex;
    flex-direction: column;
  }

  .form-field label {
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #424242;
  }

  .form-field input,
  .form-field select {
    width: 100%;
    padding: 14px 16px;
    border: 2px solid #E0E0E0;
    border-radius: 10px;
    font-size: 15px;
    transition: all 0.3s ease;
    font-family: inherit;
  }

  .form-field input:focus,
  .form-field select:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }

  .form-field input:disabled,
  .form-field select:disabled {
    background: #F5F5F5;
    cursor: not-allowed;
  }

  .field-hint {
    font-size: 12px;
    color: #757575;
    margin-top: 6px;
  }

  /* Total Display */
  .total-display {
    background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
    padding: 20px 24px;
    border-radius: 14px;
    margin-bottom: 24px;
    text-align: center;
  }

  .total-label {
    display: block;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 8px;
    font-weight: 500;
  }

  .total-value {
    display: block;
    font-size: 36px;
    font-weight: 700;
    color: white;
    margin-bottom: 4px;
  }

  .total-crypto {
    display: block;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
  }

  /* Alerts */
  .alert {
    padding: 14px 18px;
    border-radius: 10px;
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

  .alert-info {
    background: #E3F2FD;
    color: #1976D2;
    border-color: #1976D2;
  }

  /* Button */
  .btn-register {
    width: 100%;
    padding: 18px 32px;
    background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    box-shadow: 0 6px 20px rgba(46, 125, 50, 0.3);
  }

  .btn-register:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(46, 125, 50, 0.4);
  }

  .btn-register:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .btn-register span:first-child {
    font-size: 20px;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Result Card */
  .result-card {
    background: white;
    border-radius: 20px;
    padding: 36px;
    box-shadow: 0 8px 32px rgba(46, 125, 50, 0.15);
    animation: slideUp 0.5s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .result-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 3px solid #E8F5E9;
  }

  .success-icon {
    font-size: 64px;
    background: #E8F5E9;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .result-header h3 {
    font-size: 24px;
    color: #2E7D32;
    margin: 0 0 4px 0;
    font-weight: 700;
  }

  .result-header p {
    font-size: 14px;
    color: #558B2F;
    margin: 0;
  }

  .result-content {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .result-section h4 {
    font-size: 16px;
    color: #2E7D32;
    margin: 0 0 16px 0;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Info Grid */
  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  .info-box {
    background: #F5F5F5;
    padding: 16px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 14px;
    border: 2px solid #E0E0E0;
  }

  .info-box.highlight {
    background: #E8F5E9;
    border-color: #4CAF50;
  }

  .box-icon {
    font-size: 36px;
  }

  .box-label {
    font-size: 12px;
    color: #757575;
    margin: 0 0 4px 0;
  }

  .box-value {
    font-size: 16px;
    color: #424242;
    font-weight: 600;
    margin: 0;
  }

  /* Detail List */
  .detail-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    background: #F5F5F5;
    border-radius: 10px;
    gap: 12px;
  }

  .detail-label {
    font-size: 14px;
    color: #757575;
    font-weight: 500;
  }

  .detail-value,
  .detail-item code {
    font-size: 14px;
    color: #424242;
    font-weight: 600;
  }

  .detail-value-box {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    justify-content: flex-end;
  }

  .detail-value-box code {
    font-size: 12px;
    background: white;
    padding: 6px 10px;
    border-radius: 6px;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .copy-btn-small {
    background: #4CAF50;
    border: none;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .copy-btn-small:hover {
    background: #2E7D32;
    transform: scale(1.1);
  }

  /* Explorer Button */
  .explorer-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    padding: 16px 24px;
    background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
    color: white;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(46, 125, 50, 0.3);
  }

  .explorer-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(46, 125, 50, 0.4);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .form-row,
    .network-info,
    .info-grid {
      grid-template-columns: 1fr;
    }

    .page-header h1 {
      font-size: 28px;
    }

    .sale-card,
    .result-card {
      padding: 24px;
    }

    .header-icon,
    .success-icon {
      width: 56px;
      height: 56px;
      font-size: 32px;
    }

    .total-value {
      font-size: 28px;
    }
  }
</style>
