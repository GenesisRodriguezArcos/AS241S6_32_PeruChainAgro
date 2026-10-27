<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
</script>

<div class="welcome-screen">
  <div class="welcome-content">
    <p class="welcome-label">Bienvenida</p>
    
    <div class="logo-container">
      <div class="logo-bg">
        <!-- Imagen de fondo agrícola -->
        <div class="bg-overlay"></div>
        <div class="fruits-decoration">
          <span class="fruit">🌿</span>
          <span class="fruit">🥑</span>
          <span class="fruit">🍋</span>
          <span class="fruit">🌽</span>
        </div>
      </div>
      
      <div class="logo-main">
        <div class="logo-icon">
          <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
            <path d="M 18 30 Q 18 18, 30 15 Q 42 18, 42 30 Q 42 36, 36 39 L 33 45 Q 30 48, 27 45 L 24 39 Q 18 36, 18 30 Z" fill="#2E7D32"/>
            <line x1="30" y1="39" x2="30" y2="45" stroke="#1B5E20" stroke-width="2" stroke-linecap="round"/>
            <line x1="30" y1="21" x2="30" y2="39" stroke="#81C784" stroke-width="1.5" opacity="0.6"/>
          </svg>
        </div>
        <h1 class="logo-text">
          <span class="logo-peru">PeruCHAIN</span>
          <span class="logo-agro">AGRO</span>
        </h1>
      </div>
    </div>

    <div class="buttons-container">
      <button class="btn btn-primary" on:click={() => dispatch('login')}>
        🦊 CONECTAR WALLET
      </button>
    </div>
    
    <p class="wallet-info">
      Compatible con MetaMask, Pali Wallet y otras wallets Web3
    </p>
  </div>
</div>

<style>
  .welcome-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #E8F5E9 0%, #F1F8E9 100%);
    padding: 20px;
  }

  .welcome-content {
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  .welcome-label {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 24px;
    font-weight: 500;
  }

  .logo-container {
    background: white;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    margin-bottom: 32px;
    position: relative;
    overflow: hidden;
  }

  .logo-bg {
    position: relative;
    height: 200px;
    background: linear-gradient(135deg, #87CEEB 0%, #98D8E8 100%);
    border-radius: 16px;
    margin-bottom: 24px;
    overflow: hidden;
  }

  .bg-overlay {
    position: absolute;
    inset: 0;
    background: 
      linear-gradient(180deg, transparent 0%, rgba(76, 175, 80, 0.1) 50%, rgba(46, 125, 50, 0.2) 100%),
      url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="%234CAF50" opacity="0.03"/></svg>');
  }

  .fruits-decoration {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    padding: 16px;
  }

  .fruit {
    font-size: 32px;
    animation: float 3s ease-in-out infinite;
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
  }

  .fruit:nth-child(2) {
    animation-delay: 0.5s;
  }

  .fruit:nth-child(3) {
    animation-delay: 1s;
  }

  .fruit:nth-child(4) {
    animation-delay: 1.5s;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  .logo-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .logo-icon {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-dark) 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3);
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 0;
  }

  .logo-peru {
    font-size: 32px;
    font-weight: 800;
    color: var(--primary-dark);
    letter-spacing: 1px;
  }

  .logo-agro {
    font-size: 18px;
    font-weight: 600;
    color: var(--primary-green);
    letter-spacing: 3px;
  }

  .buttons-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;
  }

  .btn {
    width: 100%;
    padding: 18px 32px;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.5px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
  }

  .btn-primary {
    background: var(--primary-green);
    color: white;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }

  .btn-primary:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
  }

  .wallet-info {
    text-align: center;
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  @media (max-width: 480px) {
    .welcome-content {
      max-width: 100%;
    }

    .logo-bg {
      height: 160px;
    }

    .fruit {
      font-size: 24px;
    }
  }
</style>
