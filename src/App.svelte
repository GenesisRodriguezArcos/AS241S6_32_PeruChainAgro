<script>
  import { onMount } from 'svelte';
  import { walletStore } from './stores/walletStore';
  import { userStore } from './stores/userStore';
  import { networkStore } from './stores/networkStore';
  
  import Welcome from './components/Welcome.svelte';
  import Login from './components/Login.svelte';
  import DashboardSimple from './components/DashboardSimple.svelte';

  let currentView = 'login'; // login, dashboard

  onMount(async () => {
    // Verificar si hay usuario logueado
    const savedUser = localStorage.getItem('peruchain_user');
    if (savedUser) {
      userStore.login(JSON.parse(savedUser));
      
      // Reconectar wallet si hay usuario guardado y window.ethereum disponible
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            // Ya hay cuenta conectada, actualizar el store
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            const chainIdDecimal = parseInt(chainId, 16);
            
            walletStore.setAddress(accounts[0]);
            walletStore.updateNetwork(chainIdDecimal, '');
            
            // Detectar la red actual
            networkStore.setDetectedNetwork(chainIdDecimal);
          }
        } catch (error) {
          console.error('Error al verificar wallet:', error);
        }
      }
      
      currentView = 'dashboard';
    }

    // Escuchar cambios de cuenta en wallet
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          walletStore.disconnect();
        } else {
          // Actualizar la dirección si cambia
          walletStore.setAddress(accounts[0]);
        }
      });

      // 🎯 DETECCIÓN AUTOMÁTICA: Escuchar cambio de red
      window.ethereum.on('chainChanged', async (chainIdHex) => {
        const chainId = parseInt(chainIdHex, 16);
        console.log('🌐 Red cambiada automáticamente a:', chainId);
        
        // Actualizar networkStore con la nueva red detectada
        networkStore.setDetectedNetwork(chainId);
        
        // Actualizar walletStore
        walletStore.updateNetwork(chainId, '');
      });
    }
  });

  function handleLogin(event) {
    userStore.login(event.detail);
    currentView = 'dashboard';
  }

  function handleLogout() {
    userStore.logout();
    walletStore.disconnect();
    currentView = 'login';
  }
</script>

<main class="app">
  {#if currentView === 'login'}
    <Login 
      on:success={handleLogin}
    />
  {:else if currentView === 'dashboard'}
    <DashboardSimple on:logout={handleLogout} />
  {/if}
</main>

<style>
  .app {
    min-height: 100vh;
    background: var(--background);
  }
</style>
