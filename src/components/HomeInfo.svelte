<script>
  // Información del desarrollador
  const developer = {
    name: "Génesis de los Ángeles Rodriguez Arcos",
    role: "Blockchain Developer",
    photo: "/genesis.png",
    github: "https://github.com/GenesisRodriguezArcos"
  };
</script>

<div class="home-info">
  <!-- Header Principal -->
  <div class="hero">
    <h1>PeruChain Agro</h1>
    <p>Blockchain para el sector agrícola peruano</p>
  </div>

  <!-- 1. Descripción (reducida) -->
  <div class="card description-card">
    <h2>Descripción</h2>
    <p>DApp blockchain para trazabilidad agrícola, conectando productores y compradores de forma transparente y segura.</p>
  </div>

  <!-- 2. Objetivos (visual) -->
  <div class="card">
    <h2>Objetivos</h2>
    <div class="objectives">
      <div class="obj-item">
        <span class="icon">💻</span>
        <span>Digitalizar el Agro</span>
      </div>
      <div class="obj-item">
        <span class="icon">🔍</span>
        <span>Trazabilidad Total</span>
      </div>
      <div class="obj-item">
        <span class="icon">🌐</span>
        <span>Acceso a Mercados</span>
      </div>
      <div class="obj-item">
        <span class="icon">♻️</span>
        <span>Sostenibilidad</span>
      </div>
    </div>
  </div>

  <!-- 3. Beneficios (compacto) -->
  <div class="card">
    <h2>Beneficios</h2>
    <div class="benefits">
      <div class="benefit">
        <span class="icon-large">👨‍🌾</span>
        <div>
          <strong>Agricultores</strong>
          <p>Precios justos y pagos rápidos</p>
        </div>
      </div>
      <div class="benefit">
        <span class="icon-large">🏪</span>
        <div>
          <strong>Compradores</strong>
          <p>Productos verificados y trazables</p>
        </div>
      </div>
      <div class="benefit">
        <span class="icon-large">🚚</span>
        <div>
          <strong>Distribuidores</strong>
          <p>Logística optimizada</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 4. Características (iconos grandes) -->
  <div class="card">
    <h2>Características</h2>
    <div class="features">
      <div class="feature">
        <span class="icon-large">🔒</span>
        <strong>Seguridad</strong>
      </div>
      <div class="feature">
        <span class="icon-large">🌍</span>
        <strong>Transparencia</strong>
      </div>
      <div class="feature">
        <span class="icon-large">💰</span>
        <strong>Tokenización</strong>
      </div>
      <div class="feature">
        <span class="icon-large">📊</span>
        <strong>Análisis</strong>
      </div>
    </div>
  </div>

  <!-- 5. Desarrollador (compacto) -->
  <div class="card dev-card">
    <h2>Desarrollador</h2>
    <div class="dev-info">
      <img src={developer.photo} alt={developer.name} />
      <div class="dev-text">
        <h3>{developer.name}</h3>
        <p>{developer.role}</p>
        <a href={developer.github} target="_blank" class="dev-btn">Ver GitHub</a>
      </div>
    </div>
  </div>
</div>

<style>
  .home-info {
    max-width: 800px;
    margin: 0 auto;
  }

  /* Hero */
  .hero {
    text-align: center;
    margin-bottom: 32px;
    padding: 40px 20px;
    background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%);
    border-radius: 20px;
  }

  .hero h1 {
    font-size: 40px;
    color: var(--primary-dark);
    margin-bottom: 8px;
  }

  .hero p {
    font-size: 16px;
    color: var(--text-secondary);
    margin: 0;
  }

  /* Cards */
  .card {
    background: white;
    border-radius: 16px;
    padding: 28px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .card h2 {
    font-size: 22px;
    color: var(--primary-dark);
    margin-bottom: 20px;
  }

  /* Descripción */
  .description-card p {
    font-size: 15px;
    line-height: 1.7;
    color: var(--text-secondary);
    margin: 0;
  }

  /* Objetivos */
  .objectives {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .obj-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: white;
    color: #2E7D32;
    border: 2px solid #2E7D32;
    border-radius: 12px;
    font-weight: 600;
  }

  .icon {
    font-size: 28px;
  }

  .icon-large {
    font-size: 40px;
  }

  /* Beneficios */
  .benefits {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .benefit {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: white;
    color: #2E7D32;
    border: 2px solid #2E7D32;
    border-radius: 12px;
  }

  .benefit strong {
    display: block;
    font-size: 16px;
    margin-bottom: 4px;
  }

  .benefit p {
    font-size: 14px;
    margin: 0;
    opacity: 0.85;
  }

  /* Características */
  .features {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .feature {
    text-align: center;
    padding: 20px;
    background: white;
    color: #2E7D32;
    border: 2px solid #2E7D32;
    border-radius: 12px;
    transition: transform 0.3s ease;
  }

  .feature:hover {
    transform: translateY(-4px);
    background: #E8F5E9;
  }

  .feature strong {
    font-size: 14px;
  }

  /* Desarrollador - Mejorado */
  .dev-card {
    background: white;
    border: 3px solid #2E7D32;
    padding: 40px;
  }

  .dev-info {
    display: flex;
    align-items: center;
    gap: 32px;
    padding: 24px;
    background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%);
    border-radius: 16px;
  }

  .dev-info img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 20px;
    border: 4px solid #2E7D32;
    box-shadow: 0 8px 20px rgba(46, 125, 50, 0.3);
  }

  .dev-text {
    flex: 1;
  }

  .dev-text h3 {
    font-size: 24px;
    color: #2E7D32;
    margin-bottom: 8px;
    font-weight: 700;
  }

  .dev-text p {
    color: #1B5E20;
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 16px;
  }

  .dev-btn {
    display: inline-block;
    padding: 12px 24px;
    background: #2E7D32;
    color: white;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
  }

  .dev-btn:hover {
    background: #1B5E20;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(46, 125, 50, 0.4);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .hero h1 {
      font-size: 32px;
    }

    .objectives {
      grid-template-columns: 1fr;
    }

    .features {
      grid-template-columns: repeat(2, 1fr);
    }

    .dev-info {
      flex-direction: column;
      text-align: center;
    }
  }
</style>
