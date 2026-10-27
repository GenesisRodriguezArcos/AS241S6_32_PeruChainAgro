<script>
  import { walletStore, shortAddress } from '../stores/walletStore';
  import { networkStore } from '../stores/networkStore';

  let isConnecting = false;

  async function connectWallet() {
    isConnecting = true;
    try {
      await walletStore.connect();
    } catch (error) {
      console.error('Error al conectar wallet desde Header:', error);
      alert(error.message || 'No se pudo conectar con la wallet');
    } finally {
      isConnecting = false;
    }
  }
</script>

<header class="header">
  <div class="container header-content">
    <div class="logo-section">
      <div class="logo">
        <span class="logo-icon">🌿</span>
        <span class="logo-text">
          <strong>PeruCHAIN</strong>
          <small>AGRO</small>
        </span>
      </div>
    </div>

    <nav class="nav-menu">
      <a href="#home" class="nav-link">Inicio</a>
      <a href="#transactions" class="nav-link">Transacciones</a>
      <a href="#balance" class="nav-link">Consultar Saldo</a>
      <a href="#networks" class="nav-link">Redes</a>
    </nav>

    <div class="wallet-section">
      {#if $walletStore.isConnected}
        <div class="wallet-info">
          <div class="network-badge">
            <span class="network-dot"></span>
            {$networkStore.currentNetwork.name}
          </div>
          <button class="wallet-address">
            {$shortAddress}
          </button>
        </div>
      {:else}
        <button class="btn btn-primary" on:click={connectWallet} disabled={isConnecting}>
          {#if isConnecting}
            <span class="spinner"></span>
          {/if}
          Conectar Wallet
        </button>
      {/if}
    </div>
  </div>
</header>

<style>
  .header {
    background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-dark) 100%);
    color: white;
    padding: 16px 0;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 32px;
  }

  .logo-section {
    flex-shrink: 0;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 20px;
  }

  .logo-icon {
    font-size: 32px;
    line-height: 1;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .logo-text strong {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  .logo-text small {
    font-size: 12px;
    font-weight: 500;
    opacity: 0.9;
    letter-spacing: 1px;
  }

  .nav-menu {
    display: flex;
    gap: 24px;
    flex: 1;
    justify-content: center;
  }

  .nav-link {
    color: white;
    font-weight: 500;
    font-size: 14px;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .nav-link:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .wallet-section {
    flex-shrink: 0;
  }

  .wallet-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .network-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.2);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
  }

  .network-dot {
    width: 8px;
    height: 8px;
    background: #4CAF50;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .wallet-address {
    background: white;
    color: var(--primary-green);
    padding: 10px 20px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    .header-content {
      flex-wrap: wrap;
    }

    .nav-menu {
      order: 3;
      width: 100%;
      justify-content: space-around;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }

    .nav-link {
      font-size: 12px;
      padding: 6px 12px;
    }
  }
</style>
