<script>
  import { createEventDispatcher } from 'svelte';
  import { networkStore } from '../stores/networkStore';
  
  export let sale;
  
  const dispatch = createEventDispatcher();
  
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert('¡Hash copiado al portapapeles!');
  }
  
  function downloadReceipt() {
    alert('Descargando comprobante...');
  }
</script>

<div class="sale-details">
  <!-- Header -->
  <div class="header">
    <button class="back-btn" on:click={() => dispatch('back')}>
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    </button>
    <h2>Detalles de venta</h2>
  </div>

  <div class="content">
    <!-- Status Card -->
    <div class="status-card">
      <div class="status-icon confirmed">
        <svg width="48" height="48" fill="white" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      </div>
      
      <h3 class="status-title">¡Venta confirmada!</h3>
      <p class="status-subtitle">Transacción verificada exitosamente</p>

      <!-- QR Code -->
      <div class="qr-container">
        <div class="qr-placeholder">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <!-- Simulación de QR Code -->
            <rect x="0" y="0" width="120" height="120" fill="white"/>
            <g fill="black">
              <!-- Esquina superior izquierda -->
              <rect x="10" y="10" width="30" height="30"/>
              <rect x="15" y="15" width="20" height="20" fill="white"/>
              <rect x="20" y="20" width="10" height="10"/>
              
              <!-- Esquina superior derecha -->
              <rect x="80" y="10" width="30" height="30"/>
              <rect x="85" y="15" width="20" height="20" fill="white"/>
              <rect x="90" y="20" width="10" height="10"/>
              
              <!-- Esquina inferior izquierda -->
              <rect x="10" y="80" width="30" height="30"/>
              <rect x="15" y="85" width="20" height="20" fill="white"/>
              <rect x="20" y="90" width="10" height="10"/>
              
              <!-- Patrón central -->
              <rect x="50" y="50" width="5" height="5"/>
              <rect x="60" y="50" width="5" height="5"/>
              <rect x="55" y="55" width="5" height="5"/>
              <rect x="50" y="60" width="5" height="5"/>
              <rect x="60" y="60" width="5" height="5"/>
            </g>
          </svg>
        </div>
        <p class="qr-label">Código para verificar autenticidad</p>
      </div>

      <!-- Transaction Hash -->
      <div class="hash-section">
        <p class="hash-label">Hash de transacción</p>
        <button class="hash-value" on:click={() => copyToClipboard(sale.hash)}>
          {sale.hash}
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="4" width="12" height="12" rx="2"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Details List -->
    <div class="details-list">
      <div class="detail-row">
        <div class="detail-icon">📦</div>
        <div class="detail-content">
          <p class="detail-label">Producto</p>
          <p class="detail-value">{sale.product}</p>
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-icon">👨‍🌾</div>
        <div class="detail-content">
          <p class="detail-label">Productor</p>
          <p class="detail-value">{sale.producer}</p>
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-icon">🏪</div>
        <div class="detail-content">
          <p class="detail-label">Comprador</p>
          <p class="detail-value">{sale.buyer}</p>
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-icon">⚖️</div>
        <div class="detail-content">
          <p class="detail-label">Cantidad</p>
          <p class="detail-value">{sale.quantity}</p>
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-icon">💰</div>
        <div class="detail-content">
          <p class="detail-label">Precio por Kg</p>
          <p class="detail-value">{sale.pricePerKg}</p>
        </div>
      </div>
    </div>

    <!-- Total Section -->
    <div class="total-section">
      <div class="total-row">
        <span class="total-label">Monto total</span>
        <span class="total-amount">{sale.total}</span>
      </div>
      <div class="total-row">
        <span class="total-label">Fecha de venta</span>
        <span class="total-date">{sale.date}</span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button class="btn btn-outline" on:click={downloadReceipt}>
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
        Ver trazabilidad del producto
      </button>
      
      <button class="btn btn-primary" on:click={downloadReceipt}>
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
        Descargar comprobante
      </button>
    </div>
  </div>

  <!-- Bottom Navigation Mini -->
  <div class="bottom-mini-nav">
    <button class="mini-nav-btn" on:click={() => dispatch('back')}>
      <svg width="24" height="24" fill="currentColor">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg>
      <span>Inicio</span>
    </button>
    <button class="mini-nav-btn">
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
      </svg>
      <span>Mercado</span>
    </button>
    <button class="mini-nav-btn active">
      <svg width="24" height="24" fill="currentColor">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      </svg>
      <span>Verificadas</span>
    </button>
    <button class="mini-nav-btn">
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.25M15.54 15.54l4.24 4.25M1 12h6M17 12h6M4.22 19.78l4.24-4.25M15.54 8.46l4.24-4.25"/>
      </svg>
      <span>Perfil</span>
    </button>
  </div>
</div>

<style>
  .sale-details {
    min-height: 100vh;
    background: #F5F5F5;
    padding-bottom: 80px;
  }

  .header {
    background: white;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .back-btn {
    background: none;
    border: none;
    color: var(--text-primary);
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .back-btn:hover {
    background: var(--background);
  }

  .header h2 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .content {
    max-width: 480px;
    margin: 0 auto;
    padding: 20px;
  }

  /* Status Card */
  .status-card {
    background: linear-gradient(180deg, #E8F5E9 0%, #F1F8E9 100%);
    border-radius: 20px;
    padding: 32px 24px;
    text-align: center;
    margin-bottom: 20px;
  }

  .status-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  .status-icon.confirmed {
    background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-dark) 100%);
    box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);
  }

  .status-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .status-subtitle {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 24px;
  }

  /* QR Code */
  .qr-container {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .qr-placeholder {
    display: flex;
    justify-content: center;
    margin-bottom: 12px;
  }

  .qr-label {
    font-size: 13px;
    color: var(--text-secondary);
  }

  /* Hash Section */
  .hash-section {
    text-align: center;
  }

  .hash-label {
    font-size: 12px;
    color: var(--text-secondary);
    margin-bottom: 8px;
    font-weight: 500;
  }

  .hash-value {
    background: white;
    border: 2px solid var(--primary-green);
    border-radius: 12px;
    padding: 12px 16px;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    font-weight: 600;
    color: var(--primary-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .hash-value:hover {
    background: var(--primary-green);
    color: white;
  }

  /* Details List */
  .details-list {
    background: white;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .detail-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }

  .detail-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .detail-icon {
    font-size: 28px;
    width: 48px;
    height: 48px;
    background: var(--background);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .detail-content {
    flex: 1;
  }

  .detail-label {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 4px;
  }

  .detail-value {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
  }

  /* Total Section */
  .total-section {
    background: white;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .total-label {
    font-size: 14px;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .total-amount {
    font-size: 24px;
    font-weight: 700;
    color: var(--primary-green);
  }

  .total-date {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }

  /* Action Buttons */
  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .btn {
    width: 100%;
    padding: 16px 24px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-primary {
    background: var(--primary-green);
    color: white;
    border: none;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }

  .btn-primary:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
  }

  .btn-outline {
    background: white;
    color: var(--primary-green);
    border: 2px solid var(--primary-green);
  }

  .btn-outline:hover {
    background: var(--primary-green);
    color: white;
  }

  /* Bottom Mini Nav */
  .bottom-mini-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid var(--border);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: 8px 8px 12px;
    max-width: 480px;
    margin: 0 auto;
    z-index: 100;
  }

  .mini-nav-btn {
    background: none;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 11px;
  }

  .mini-nav-btn.active {
    color: var(--primary-green);
  }

  @media (max-width: 480px) {
    .status-title {
      font-size: 20px;
    }
  }
</style>
