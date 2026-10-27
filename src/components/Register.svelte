<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  let name = '';
  let email = '';
  let password = '';
  let confirmPassword = '';
  let isLoading = false;
  let errorMessage = '';

  function handleRegister() {
    errorMessage = '';
    
    if (!name || !email || !password || !confirmPassword) {
      errorMessage = 'Por favor completa todos los campos';
      return;
    }

    if (password !== confirmPassword) {
      errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (password.length < 6) {
      errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    isLoading = true;
    
    // Simulación de registro
    setTimeout(() => {
      dispatch('success', {
        name: name,
        email: email,
        balance: 0,
        sales: 0,
        verifications: 0
      });
      isLoading = false;
    }, 1000);
  }
</script>

<div class="register-screen">
  <div class="register-container">
    <button class="back-button" on:click={() => dispatch('back')}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    </button>

    <div class="register-header">
      <div class="logo-small">
        <svg width="40" height="40" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <path d="M 18 30 Q 18 18, 30 15 Q 42 18, 42 30 Q 42 36, 36 39 L 33 45 Q 30 48, 27 45 L 24 39 Q 18 36, 18 30 Z" fill="#2E7D32"/>
        </svg>
      </div>
      <h2>Crear Cuenta</h2>
      <p class="subtitle">Únete a PeruChain Agro</p>
    </div>

    <div class="register-form">
      <div class="form-group">
        <label for="name">Nombre completo</label>
        <input
          id="name"
          type="text"
          placeholder="Tu nombre"
          bind:value={name}
          disabled={isLoading}
        />
      </div>

      <div class="form-group">
        <label for="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          placeholder="tu@email.com"
          bind:value={email}
          disabled={isLoading}
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input
          id="password"
          type="password"
          placeholder="Mínimo 6 caracteres"
          bind:value={password}
          disabled={isLoading}
        />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmar contraseña</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Repite tu contraseña"
          bind:value={confirmPassword}
          disabled={isLoading}
        />
      </div>

      <label class="checkbox-label terms">
        <input type="checkbox" required />
        <span>Acepto los <button class="link-button">términos y condiciones</button></span>
      </label>

      {#if errorMessage}
        <div class="error-message">
          <span>⚠️</span>
          {errorMessage}
        </div>
      {/if}

      <button 
        class="btn btn-primary btn-large" 
        on:click={handleRegister}
        disabled={isLoading}
      >
        {#if isLoading}
          <span class="spinner"></span>
          Creando cuenta...
        {:else}
          Crear cuenta
        {/if}
      </button>

      <div class="login-link">
        ¿Ya tienes cuenta?
        <button class="link-button" on:click={() => dispatch('login')}>
          Inicia sesión
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .register-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #E8F5E9 0%, #F1F8E9 100%);
    padding: 20px;
  }

  .register-container {
    width: 100%;
    max-width: 440px;
    background: white;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    position: relative;
  }

  .back-button {
    position: absolute;
    top: 24px;
    left: 24px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .back-button:hover {
    background: var(--background);
    color: var(--primary-green);
  }

  .register-header {
    text-align: center;
    margin-bottom: 32px;
    margin-top: 24px;
  }

  .logo-small {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--primary-green) 0%, var(--primary-dark) 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  .register-header h2 {
    font-size: 28px;
    color: var(--text-primary);
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 14px;
    color: var(--text-secondary);
  }

  .register-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-group label {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .form-group input {
    padding: 14px 16px;
    border: 2px solid var(--border);
    border-radius: 12px;
    font-size: 15px;
    transition: all 0.3s ease;
  }

  .form-group input:focus {
    border-color: var(--primary-green);
    outline: none;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }

  .checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    cursor: pointer;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .checkbox-label.terms {
    margin-top: -8px;
  }

  .checkbox-label input[type="checkbox"] {
    margin-top: 2px;
  }

  .link-button {
    background: none;
    border: none;
    color: var(--primary-green);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    display: inline;
  }

  .link-button:hover {
    text-decoration: underline;
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: #FFEBEE;
    color: var(--error);
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
  }

  .btn-large {
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 700;
  }

  .login-link {
    text-align: center;
    font-size: 14px;
    color: var(--text-secondary);
  }

  @media (max-width: 480px) {
    .register-container {
      padding: 24px;
    }
  }
</style>
