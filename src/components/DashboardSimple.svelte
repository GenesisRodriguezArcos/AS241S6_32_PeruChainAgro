<script>
  import { createEventDispatcher } from 'svelte';
  import { userStore } from '../stores/userStore';
  import { walletStore } from '../stores/walletStore';
  
  // Importar componentes originales
  import HomeInfo from './HomeInfo.svelte';
  import Transactions from './Transactions.svelte';
  import BalanceChecker from './BalanceChecker.svelte';
  import NetworkSwitcher from './NetworkSwitcher.svelte';
  
  // Importar NUEVOS componentes para agricultura
  import AgricultureSale from './AgricultureSale.svelte';
  import TransactionHistory from './TransactionHistory.svelte';
  
  const dispatch = createEventDispatcher();
  
  let currentView = 'home'; // home, transactions, balance, networks, agriculture, history

  function handleLogout() {
    dispatch('logout');
  }
</script>

<div class="dashboard-layout">
  <!-- Sidebar izquierdo -->
  <aside class="sidebar">
    <!-- Logo/Header -->
    <div class="sidebar-header">
      <h2>PeruChain</h2>
      <span class="subtitle">Agro</span>
    </div>

    <!-- Navegación -->
    <nav class="sidebar-nav">
      <button 
        class="nav-item {currentView === 'home' ? 'active' : ''}"
        on:click={() => currentView = 'home'}
      >
        🏠 Inicio
      </button>
      
      <div class="nav-separator">
        <span>ACTIVIDAD INDIVIDUAL</span>
      </div>
      
      <button 
        class="nav-item {currentView === 'agriculture' ? 'active' : ''}"
        on:click={() => currentView = 'agriculture'}
      >
        🌾 Venta Agrícola
      </button>
      <button 
        class="nav-item {currentView === 'history' ? 'active' : ''}"
        on:click={() => currentView = 'history'}
      >
        📜 Historial
      </button>
      
      <div class="nav-separator">
        <span>OTRAS FUNCIONES</span>
      </div>
      
      <button 
        class="nav-item {currentView === 'transactions' ? 'active' : ''}"
        on:click={() => currentView = 'transactions'}
      >
        💸 Transacciones
      </button>
      <button 
        class="nav-item {currentView === 'networks' ? 'active' : ''}"
        on:click={() => currentView = 'networks'}
      >
        🌐 Redes
      </button>
      <button 
        class="nav-item {currentView === 'balance' ? 'active' : ''}"
        on:click={() => currentView = 'balance'}
      >
        💰 Saldo
      </button>
    </nav>

    <!-- User info y logout -->
    <div class="sidebar-footer">
      <div class="user-info">
        <p>{$userStore.name}</p>
      </div>
      <button class="logout-btn" on:click={handleLogout}>
        Salir
      </button>
    </div>
  </aside>

  <!-- Contenido principal -->
  <main class="main-content">
    {#if currentView === 'home'}
      <HomeInfo />
    {:else if currentView === 'agriculture'}
      <AgricultureSale />
    {:else if currentView === 'history'}
      <TransactionHistory />
    {:else if currentView === 'transactions'}
      <Transactions />
    {:else if currentView === 'balance'}
      <BalanceChecker />
    {:else if currentView === 'networks'}
      <NetworkSwitcher />
    {/if}
  </main>
</div>

<style>
  .dashboard-layout {
    display: flex;
    min-height: 100vh;
    background: #F5F5F5;
  }

  /* Sidebar lateral */
  .sidebar {
    width: 240px;
    background: linear-gradient(180deg, #2E7D32 0%, #1B5E20 100%);
    color: white;
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
  }

  /* Header del sidebar */
  .sidebar-header {
    padding: 32px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    text-align: center;
  }

  .sidebar-header h2 {
    font-size: 24px;
    font-weight: 800;
    margin: 0 0 4px 0;
    letter-spacing: 0.5px;
  }

  .subtitle {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    opacity: 0.9;
  }

  /* Navegación */
  .sidebar-nav {
    flex: 1;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .nav-item {
    background: none;
    border: none;
    color: white;
    padding: 14px 16px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    border: 2px solid transparent;
  }

  .nav-item:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
  }

  .nav-item.active {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  /* Separador de navegación */
  .nav-separator {
    margin: 16px 0 8px 0;
    padding: 0 20px;
  }

  .nav-separator span {
    font-size: 10px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  /* Footer del sidebar */
  .sidebar-footer {
    padding: 20px 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  .user-info {
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    margin-bottom: 12px;
    text-align: center;
  }

  .user-info p {
    margin: 0;
    font-size: 13px;
    font-weight: 500;
    opacity: 0.95;
  }

  .logout-btn {
    width: 100%;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .logout-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  /* Contenido principal */
  .main-content {
    flex: 1;
    margin-left: 240px;
    min-height: 100vh;
    overflow-y: auto;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .sidebar {
      width: 80px;
    }

    .sidebar-header h2 {
      font-size: 16px;
      writing-mode: vertical-rl;
      text-orientation: mixed;
    }

    .subtitle {
      display: none;
    }

    .nav-item {
      padding: 16px 8px;
      font-size: 11px;
      text-align: center;
    }

    .user-info {
      padding: 8px;
    }

    .user-info p {
      font-size: 10px;
      word-break: break-all;
    }

    .logout-btn {
      padding: 10px 8px;
      font-size: 11px;
    }

    .main-content {
      margin-left: 80px;
    }
  }
</style>
