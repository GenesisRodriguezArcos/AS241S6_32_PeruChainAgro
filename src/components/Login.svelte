<script>
  import { createEventDispatcher } from 'svelte';
  import { walletStore } from '../stores/walletStore';
  import { networkStore } from '../stores/networkStore';
  
  const dispatch = createEventDispatcher();
  
  let isLoading = false;
  let errorMessage = '';

  async function handleWalletConnect() {
    errorMessage = '';
    isLoading = true;
    
    if (!window.ethereum) {
      errorMessage = 'No se detectó ninguna wallet. Por favor instala MetaMask, Pali Wallet o cualquier wallet compatible.';
      isLoading = false;
      return;
    }

    try {
      const connected = await walletStore.connect();
      
      if (connected) {
        // Detectar la red actual al conectar
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          const chainIdDecimal = parseInt(chainId, 16);
          networkStore.setDetectedNetwork(chainIdDecimal);
        } catch (error) {
          console.error('Error detectando red:', error);
        }
        
        dispatch('success', {
          name: 'Usuario Blockchain',
          email: $walletStore.address,
          balance: 24890,
          sales: 24,
          verifications: 18
        });
      }
    } catch (error) {
      console.error('Error completo al conectar:', error);
      
      // Mejorar el manejo del mensaje de error
      if (error && error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && error.code) {
        errorMessage = `Error ${error.code}: No se pudo conectar con la wallet`;
      } else {
        errorMessage = 'No se pudo conectar con la wallet. Por favor asegúrate de tener una wallet instalada y desbloqueada.';
      }
    }
    
    isLoading = false;
  }
</script>

<div class="login-screen">
  <div class="login-container">
    <!-- Panel Izquierdo con imagen de fondo -->
    <div class="image-panel">
      <div class="overlay"></div>
      <div class="branding-content">
        <div class="logo-main">
          <div class="logo-icon">
            PC
          </div>
          <h1 class="brand-name">
            <span>PeruCHAIN</span>
            <span class="brand-sub">AGRO</span>
          </h1>
        </div>
        
        <p class="tagline">Conectando el campo con la tecnología blockchain</p>
        
        <div class="features-badges">
          <div class="badge-item">Transparencia</div>
          <div class="badge-item">Sostenibilidad</div>
          <div class="badge-item">Trazabilidad</div>
        </div>
      </div>
    </div>

    <!-- Panel Derecho - Login con Wallet -->
    <div class="form-panel">
      <div class="form-content">
        <div class="welcome-header">
          <h2>¡Bienvenido!</h2>
          <p>Conecta tu wallet para acceder a PeruCHAIN Agro</p>
        </div>

        <div class="wallet-illustration">
          <div class="wallet-icon-large">WALLET</div>
        </div>

        {#if !isLoading}
          <div class="info-message">
            <p>Se detectará automáticamente la wallet instalada en tu navegador</p>
          </div>
        {:else}
          <div class="loading-message">
            <p><strong>⏳ Esperando confirmación...</strong></p>
            <p>Por favor, abre tu wallet (MetaMask, PaliWallet, etc.) y acepta la conexión</p>
          </div>
        {/if}

        {#if errorMessage}
          <div class="error-alert">
            <p>{errorMessage}</p>
          </div>
        {/if}

        <button 
          class="btn-connect-wallet"
          on:click={handleWalletConnect}
          disabled={isLoading}
        >
          {#if isLoading}
            <span class="spinner"></span>
            <span>Conectando...</span>
          {:else}
            <span>Conectar Wallet</span>
          {/if}
        </button>

        <div class="security-note">
          <p>Conexión segura mediante Web3</p>
          <p class="small">Compatible con MetaMask, Pali Wallet, Trust Wallet, Coinbase y más</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .login-screen {
    min-height: 100vh;
    background: 
      linear-gradient(135deg, 
        rgba(232, 245, 233, 0.9) 0%, 
        rgba(200, 230, 201, 0.9) 50%,
        rgba(165, 214, 167, 0.9) 100%
      ),
      url('/agrochain.png');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .login-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: 1100px;
    width: 100%;
    min-height: 600px;
    background: white;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }

  /* Panel Izquierdo con Imagen */
  .image-panel {
    position: relative;
    background-image: url('/agrochain.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #2E7D32;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 40px;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(46, 125, 50, 0.75) 0%,
      rgba(27, 94, 32, 0.70) 100%
    );
  }

  .branding-content {
    position: relative;
    z-index: 1;
    color: white;
    text-align: center;
    max-width: 400px;
  }

  .logo-main {
    margin-bottom: 32px;
  }

  .logo-icon {
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    font-size: 36px;
    font-weight: 800;
    color: white;
  }

  .brand-name {
    font-size: 48px;
    font-weight: 800;
    line-height: 1.1;
    margin: 0;
    display: flex;
    flex-direction: column;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  }

  .brand-sub {
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 6px;
    opacity: 0.95;
  }

  .tagline {
    font-size: 18px;
    line-height: 1.6;
    margin: 24px 0 40px;
    opacity: 0.95;
  }

  .features-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
  }

  .badge-item {
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  /* Panel Derecho - Formulario */
  .form-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 50px;
    background: white;
  }

  .form-content {
    width: 100%;
    max-width: 400px;
  }

  .welcome-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .welcome-header h2 {
    font-size: 36px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 12px;
  }

  .welcome-header p {
    font-size: 15px;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  /* Wallet Illustration */
  .wallet-illustration {
    text-align: center;
    margin: 40px 0;
  }

  .wallet-icon-large {
    width: 120px;
    height: 120px;
    margin: 0 auto;
    background: #2E7D32;
    color: white;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 800;
    box-shadow: 0 8px 24px rgba(46, 125, 50, 0.4);
    border: 3px solid #2E7D32;
  }

  /* Info Message */
  .info-message {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background: #E8F5E9;
    border-radius: 12px;
    margin-bottom: 24px;
  }

  .info-message p {
    font-size: 13px;
    color: #2E7D32;
    line-height: 1.5;
    margin: 0;
  }

  /* Loading Message */
  .loading-message {
    padding: 20px;
    background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
    border-radius: 12px;
    margin-bottom: 24px;
    border: 2px solid #FFB74D;
    animation: pulse 2s ease-in-out infinite;
  }

  .loading-message p {
    font-size: 14px;
    color: #E65100;
    line-height: 1.6;
    margin: 0 0 8px 0;
    text-align: center;
  }

  .loading-message p:last-child {
    margin-bottom: 0;
    font-size: 12px;
    font-weight: normal;
  }

  @keyframes pulse {
    0%, 100% { 
      opacity: 1;
      transform: scale(1);
    }
    50% { 
      opacity: 0.9;
      transform: scale(1.02);
    }
  }

  /* Error Alert */
  .error-alert {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    background: #FFEBEE;
    border-radius: 12px;
    margin-bottom: 24px;
    animation: shake 0.5s;
  }

  .error-alert p {
    font-size: 13px;
    color: var(--error);
    line-height: 1.5;
    margin: 0;
    font-weight: 500;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }

  /* Botón Conectar Wallet */
  .btn-connect-wallet {
    width: 100%;
    padding: 20px 32px;
    background: #2E7D32;
    color: white;
    border: none;
    border-radius: 16px;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    box-shadow: 0 8px 24px rgba(46, 125, 50, 0.4);
  }

  .btn-connect-wallet:hover:not(:disabled) {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(46, 125, 50, 0.5);
    background: #1B5E20;
  }

  .btn-connect-wallet:active:not(:disabled) {
    transform: translateY(-2px);
  }

  .btn-connect-wallet:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .wallet-icon-btn {
    font-size: 24px;
  }

  /* Spinner */
  .spinner {
    display: inline-block;
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

  /* Security Note */
  .security-note {
    text-align: center;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
  }

  .security-note p {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 4px 0;
    line-height: 1.5;
  }

  .security-note .small {
    font-size: 11px;
    opacity: 0.8;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .login-container {
      grid-template-columns: 1fr;
      max-width: 500px;
    }

    .image-panel {
      min-height: 300px;
    }

    .form-panel {
      padding: 40px 30px;
    }
  }

  @media (max-width: 480px) {
    .login-screen {
      padding: 0;
    }

    .login-container {
      border-radius: 0;
      min-height: 100vh;
    }

    .image-panel {
      min-height: 250px;
    }

    .brand-name {
      font-size: 36px;
    }

    .brand-sub {
      font-size: 18px;
    }

    .welcome-header h2 {
      font-size: 28px;
    }

    .wallet-icon-large {
      width: 100px;
      height: 100px;
      font-size: 52px;
    }
  }
</style>
