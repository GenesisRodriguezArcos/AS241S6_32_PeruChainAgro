<script>
  import { createEventDispatcher } from 'svelte';
  import { userStore } from '../stores/userStore';
  import { walletStore } from '../stores/walletStore';
  
  import Home from './Home.svelte';
  import Transactions from './Transactions.svelte';
  import BalanceChecker from './BalanceChecker.svelte';
  import NetworkSwitcher from './NetworkSwitcher.svelte';
  import SaleDetails from './SaleDetails.svelte';
  
  const dispatch = createEventDispatcher();
  
  let currentView = 'home'; // home, transactions, balance, networks, saleDetails
  let selectedSale = null;

  const recentActivities = [
    { id: 1, type: 'sale', product: 'Papa Blanca', amount: 's/24.50', date: '10/23' },
    { id: 2, type: 'verification', product: 'Las vacas en blandia', amount: '', date: '9/22' }
  ];

  function handleViewSale(sale) {
    selectedSale = {
      hash: '2E45-2026-I6FSK8D',
      product: 'Papa Hass',
      producer: 'Jorge (Arequipa)',
      buyer: 'Agrosarmiento',
      quantity: '1,300 kg',
      pricePerKg: 's/6.90',
      total: 's/8,970',
      date: '23/10/2024',
      status: 'confirmed'
    };
    currentView = 'saleDetails';
  }
</script>

<div class="dashboard">
  {#if currentView === 'home'}
    <!-- Dashboard Principal -->
    <div class="dashboard-content">
      <!-- Header -->
      <div class="dashboard-header">
        <div>
          <p class="greeting">Inicio</p>
          <h2 class="user-name">Buenos días<br/><strong>{$userStore.name}</strong></h2>
        </div>
        <button class="notification-btn">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span class="notification-badge">3</span>
        </button>
      </div>

      <!-- Balance Card -->
      <div class="balance-card">
        <p class="balance-label">Ventas del mes</p>
        <h1 class="balance-amount">s/{$userStore.balance.toLocaleString('es-PE', {minimumFractionDigits: 0})}</h1>
        <p class="balance-update">Actualizado hace 2 horas</p>
        
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-icon">📦</div>
            <div class="stat-info">
              <p class="stat-value">{$userStore.sales}</p>
              <p class="stat-label">Ventas</p>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">✓</div>
            <div class="stat-info">
              <p class="stat-value">{$userStore.verifications}</p>
              <p class="stat-label">Verificadas</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section-header">
        <h3>Acciones rápidas</h3>
        <button class="see-more" on:click={() => currentView = 'transactions'}>ver todo</button>
      </div>
      
      <div class="quick-actions">
        <button class="action-btn" on:click={() => currentView = 'transactions'}>
          <div class="action-icon green">➕</div>
          <span>Publicar</span>
        </button>
        <button class="action-btn" on:click={() => currentView = 'balance'}>
          <div class="action-icon green">🛒</div>
          <span>Mercado</span>
        </button>
      </div>

      <!-- Recent Activity -->
      <div class="section-header">
        <h3>Actividad reciente</h3>
        <button class="see-more">Hoy</button>
      </div>

      <div class="activity-list">
        {#each recentActivities as activity}
          <button class="activity-item" on:click={() => handleViewSale(activity)}>
            <div class="activity-content">
              <p class="activity-product">{activity.product}</p>
              <p class="activity-date">{activity.date}</p>
            </div>
            {#if activity.amount}
              <span class="activity-amount">{activity.amount}</span>
            {/if}
          </button>
        {/each}
      </div>

      <!-- Bottom Navigation -->
      <nav class="bottom-nav">
        <button class="nav-btn active" on:click={() => currentView = 'home'}>
          <svg width="24" height="24" fill="currentColor">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
          <span>Inicio</span>
        </button>
        <button class="nav-btn" on:click={() => currentView = 'balance'}>
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
            <path d="M12 18V6"/>
          </svg>
          <span>Mercado</span>
        </button>
        <button class="nav-btn center">
          <div class="center-btn" on:click={() => currentView = 'transactions'}>
            <svg width="28" height="28" fill="white">
              <path d="M14 3v18M3 14h18"/>
            </svg>
          </div>
        </button>
        <button class="nav-btn" on:click={() => currentView = 'networks'}>
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          </svg>
          <span>Verificadas</span>
        </button>
        <button class="nav-btn" on:click={() => dispatch('logout')}>
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          <span>Perfil</span>
        </button>
      </nav>
    </div>

  {:else if currentView === 'transactions'}
    <div class="full-page">
      <div class="page-header">
        <button class="back-btn" on:click={() => currentView = 'home'}>←</button>
        <h2>Transacciones</h2>
      </div>
      <Transactions />
    </div>

  {:else if currentView === 'balance'}
    <div class="full-page">
      <div class="page-header">
        <button class="back-btn" on:click={() => currentView = 'home'}>←</button>
        <h2>Consultar Saldo</h2>
      </div>
      <BalanceChecker />
    </div>

  {:else if currentView === 'networks'}
    <div class="full-page">
      <div class="page-header">
        <button class="back-btn" on:click={() => currentView = 'home'}>←</button>
        <h2>Redes Blockchain</h2>
      </div>
      <NetworkSwitcher />
    </div>

  {:else if currentView === 'saleDetails'}
    <SaleDetails sale={selectedSale} on:back={() => currentView = 'home'} />
  {/if}
</div>

<style>
  .dashboard {
    min-height: 100vh;
    background: var(--background);
  }

  .dashboard-content {
    max-width: 480px;
    margin: 0 auto;
    padding: 20px 20px 90px;
  }

  /* Header */
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .greeting {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 4px;
  }

  .user-name {
    font-size: 24px;
    font-weight: 400;
    color: var(--text-primary);
    line-height: 1.3;
  }

  .user-name strong {
    font-weight: 700;
  }

  .notification-btn {
    position: relative;
    background: white;
    border: 2px solid var(--border);
    border-radius: 12px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .notification-btn:hover {
    border-color: var(--primary-green);
  }

  .notification-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: var(--error);
    color: white;
    font-size: 10px;
    font-weight: 700;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Balance Card */
  .balance-card {
    background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-dark) 100%);
    border-radius: 20px;
    padding: 24px;
    color: white;
    margin-bottom: 24px;
    box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);
  }

  .balance-label {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 8px;
  }

  .balance-amount {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .balance-update {
    font-size: 12px;
    opacity: 0.8;
    margin-bottom: 24px;
  }

  .stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .stat-item {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .stat-icon {
    font-size: 32px;
    background: rgba(255, 255, 255, 0.2);
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 2px;
  }

  .stat-label {
    font-size: 12px;
    opacity: 0.9;
  }

  /* Section Header */
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .section-header h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .see-more {
    background: none;
    border: none;
    color: var(--primary-green);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  /* Quick Actions */
  .quick-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 32px;
  }

  .action-btn {
    background: white;
    border: 2px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .action-btn:hover {
    border-color: var(--primary-green);
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(76, 175, 80, 0.2);
  }

  .action-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    background: var(--background);
  }

  .action-icon.green {
    background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%);
  }

  .action-btn span {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
  }

  /* Activity List */
  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .activity-item {
    background: white;
    border: 2px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    width: 100%;
  }

  .activity-item:hover {
    border-color: var(--primary-green);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
  }

  .activity-content {
    flex: 1;
  }

  .activity-product {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .activity-date {
    font-size: 13px;
    color: var(--text-secondary);
  }

  .activity-amount {
    font-size: 15px;
    font-weight: 700;
    color: var(--primary-green);
  }

  /* Bottom Navigation */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid var(--border);
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    padding: 8px 8px 12px;
    max-width: 480px;
    margin: 0 auto;
    z-index: 100;
  }

  .nav-btn {
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

  .nav-btn.active {
    color: var(--primary-green);
  }

  .nav-btn.center {
    position: relative;
  }

  .center-btn {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-dark) 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
    position: absolute;
    top: -28px;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .center-btn:hover {
    transform: translateX(-50%) scale(1.1);
  }

  /* Full Page Views */
  .full-page {
    min-height: 100vh;
    background: var(--background);
    padding-bottom: 90px;
  }

  .page-header {
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
    font-size: 24px;
    color: var(--text-primary);
    cursor: pointer;
    padding: 8px;
  }

  .page-header h2 {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
  }

  @media (max-width: 480px) {
    .balance-amount {
      font-size: 40px;
    }
  }
</style>
