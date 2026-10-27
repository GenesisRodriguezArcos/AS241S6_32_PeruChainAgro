import { writable } from 'svelte/store';

function createUserStore() {
  const { subscribe, set, update } = writable({
    isLoggedIn: false,
    name: '',
    email: '',
    balance: 0,
    sales: 24,
    verifications: 18
  });

  return {
    subscribe,
    login: (userData) => {
      const user = {
        isLoggedIn: true,
        name: userData.name || 'Usuario',
        email: userData.email || '',
        balance: userData.balance || 24890,
        sales: userData.sales || 24,
        verifications: userData.verifications || 18
      };
      set(user);
      localStorage.setItem('peruchain_user', JSON.stringify(user));
    },
    logout: () => {
      set({
        isLoggedIn: false,
        name: '',
        email: '',
        balance: 0,
        sales: 0,
        verifications: 0
      });
      localStorage.removeItem('peruchain_user');
    },
    updateBalance: (balance) => {
      update(state => ({ ...state, balance }));
    }
  };
}

export const userStore = createUserStore();
