<script>
  // Información del desarrollador - MODIFICA ESTO CON TUS DATOS
  const developer = {
    name: "Tu Nombre",
    role: "Blockchain Developer",
    photo: "https://via.placeholder.com/150", // Reemplaza con tu foto
    email: "tu.email@ejemplo.com",
    github: "https://github.com/tuusuario",
    linkedin: "https://linkedin.com/in/tuusuario"
  };

  const features = [
    {
      icon: "🔒",
      title: "Seguridad",
      description: "Transacciones seguras mediante blockchain"
    },
    {
      icon: "🌍",
      title: "Transparencia",
      description: "Trazabilidad completa de productos agrícolas"
    },
    {
      icon: "💰",
      title: "Tokenización",
      description: "Activos digitales respaldados por producción real"
    },
    {
      icon: "📊",
      title: "Análisis",
      description: "Datos en tiempo real del mercado agrícola"
    }
  ];
</script>

<div class="home-section" id="home">
  <!-- Hero Section -->
  <div class="hero">
    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title fade-in">
            Revolucionando el <span class="highlight">Sector Agrícola</span> con Blockchain
          </h1>
          <p class="hero-subtitle fade-in">
            PeruChain Agro es una plataforma descentralizada que conecta productores, 
            compradores y distribuidores en el ecosistema agrícola peruano mediante 
            tecnología blockchain.
          </p>
          <div class="hero-buttons fade-in">
            <button class="btn btn-primary" on:click={() => document.querySelector('#transactions').scrollIntoView({ behavior: 'smooth' })}>
              Comenzar Ahora
            </button>
            <button class="btn btn-secondary" on:click={() => document.querySelector('#about').scrollIntoView({ behavior: 'smooth' })}>
              Conocer Más
            </button>
          </div>
        </div>
        <div class="hero-image">
          <div class="image-container">
            🌾
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Descripción Section -->
  <div class="section description-section" id="about">
    <div class="container">
      <div class="section-header">
        <h2>📝 Descripción del Proyecto</h2>
        <div class="divider"></div>
      </div>
      <div class="content-box">
        <p>
          <strong>PeruChain Agro</strong> es una aplicación descentralizada (DApp) que utiliza 
          tecnología blockchain para crear un ecosistema transparente y eficiente en el sector 
          agrícola peruano. Nuestra plataforma permite la trazabilidad de productos desde el 
          campo hasta el consumidor final, garantizando autenticidad, calidad y comercio justo.
        </p>
        <p>
          A través de contratos inteligentes y tokens ERC-20, facilitamos transacciones directas 
          entre agricultores y compradores, eliminando intermediarios innecesarios y asegurando 
          precios justos para todos los participantes de la cadena de valor.
        </p>
      </div>
    </div>
  </div>

  <!-- Objetivos Section -->
  <div class="section objectives-section">
    <div class="container">
      <div class="section-header">
        <h2>🎯 Objetivos</h2>
        <div class="divider"></div>
      </div>
      <div class="objectives-grid">
        <div class="objective-card card">
          <div class="objective-number">01</div>
          <h3>Digitalizar el Agro</h3>
          <p>Transformar procesos tradicionales mediante blockchain y smart contracts</p>
        </div>
        <div class="objective-card card">
          <div class="objective-number">02</div>
          <h3>Garantizar Trazabilidad</h3>
          <p>Seguimiento completo desde la siembra hasta el consumidor final</p>
        </div>
        <div class="objective-card card">
          <div class="objective-number">03</div>
          <h3>Facilitar Acceso</h3>
          <p>Conectar productores con mercados nacionales e internacionales</p>
        </div>
        <div class="objective-card card">
          <div class="objective-number">04</div>
          <h3>Promover Sostenibilidad</h3>
          <p>Incentivar prácticas agrícolas responsables y certificadas</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Beneficios Section -->
  <div class="section benefits-section">
    <div class="container">
      <div class="section-header">
        <h2>✨ Beneficios</h2>
        <div class="divider"></div>
      </div>
      <div class="benefits-grid">
        <div class="benefit-card">
          <div class="benefit-icon">👨‍🌾</div>
          <h4>Para Agricultores</h4>
          <ul>
            <li>Acceso directo a compradores</li>
            <li>Precios justos garantizados</li>
            <li>Pagos rápidos y seguros</li>
            <li>Certificación digital de productos</li>
          </ul>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon">🏪</div>
          <h4>Para Compradores</h4>
          <ul>
            <li>Productos verificados y trazables</li>
            <li>Eliminación de intermediarios</li>
            <li>Transparencia en precios</li>
            <li>Calidad garantizada</li>
          </ul>
        </div>
        <div class="benefit-card">
          <div class="benefit-icon">🚚</div>
          <h4>Para Distribuidores</h4>
          <ul>
            <li>Logística optimizada</li>
            <li>Información en tiempo real</li>
            <li>Reducción de costos</li>
            <li>Mayor eficiencia operativa</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Características Section -->
  <div class="section features-section">
    <div class="container">
      <div class="section-header">
        <h2>⚡ Características Principales</h2>
        <div class="divider"></div>
      </div>
      <div class="features-grid">
        {#each features as feature}
          <div class="feature-card card">
            <div class="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Desarrollador Section -->
  <div class="section developer-section" id="developer">
    <div class="container">
      <div class="section-header">
        <h2>👨‍💻 Desarrollador</h2>
        <div class="divider"></div>
      </div>
      <div class="developer-card card">
        <div class="developer-photo">
          <img src={developer.photo} alt={developer.name} />
        </div>
        <div class="developer-info">
          <h3>{developer.name}</h3>
          <p class="developer-role">{developer.role}</p>
          <p class="developer-bio">
            Desarrollador especializado en tecnología blockchain y aplicaciones descentralizadas. 
            Apasionado por crear soluciones innovadoras que impulsen el desarrollo sostenible 
            del sector agrícola mediante la tecnología.
          </p>
          <div class="developer-links">
            <a href={developer.github} target="_blank" rel="noopener" class="dev-link">
              🔗 GitHub
            </a>
            <a href={developer.linkedin} target="_blank" rel="noopener" class="dev-link">
              💼 LinkedIn
            </a>
            <a href="mailto:{developer.email}" class="dev-link">
              📧 Email
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .home-section {
    width: 100%;
  }

  /* Hero Section */
  .hero {
    background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #4CAF50 100%);
    color: white;
    padding: 80px 0;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><path d="M10 10h80v80H10z" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></svg>');
    opacity: 0.3;
  }

  .hero-content {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 60px;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .hero-title {
    font-size: 48px;
    line-height: 1.2;
    margin-bottom: 24px;
    font-weight: 700;
  }

  .highlight {
    color: var(--accent-gold);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .hero-subtitle {
    font-size: 18px;
    line-height: 1.6;
    margin-bottom: 32px;
    opacity: 0.95;
  }

  .hero-buttons {
    display: flex;
    gap: 16px;
  }

  .hero-image .image-container {
    font-size: 200px;
    text-align: center;
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  /* Sections */
  .section {
    padding: 80px 0;
  }

  .section-header {
    text-align: center;
    margin-bottom: 48px;
  }

  .section-header h2 {
    font-size: 36px;
    margin-bottom: 16px;
    color: var(--primary-dark);
  }

  .divider {
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-green), var(--accent-gold));
    margin: 0 auto;
    border-radius: 2px;
  }

  .content-box {
    background: var(--surface);
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    line-height: 1.8;
  }

  .content-box p {
    margin-bottom: 20px;
    font-size: 16px;
    color: var(--text-secondary);
  }

  .content-box p:last-child {
    margin-bottom: 0;
  }

  /* Objectives */
  .objectives-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }

  .objective-card {
    text-align: center;
    padding: 32px;
    position: relative;
    overflow: hidden;
  }

  .objective-number {
    font-size: 60px;
    font-weight: 700;
    color: var(--primary-green);
    opacity: 0.1;
    position: absolute;
    top: -10px;
    right: 20px;
  }

  .objective-card h3 {
    font-size: 20px;
    margin-bottom: 12px;
    color: var(--primary-dark);
    position: relative;
  }

  .objective-card p {
    color: var(--text-secondary);
    font-size: 14px;
    position: relative;
  }

  /* Benefits */
  .benefits-section {
    background: var(--surface);
  }

  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 32px;
  }

  .benefit-card {
    background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%);
    padding: 32px;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .benefit-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .benefit-card h4 {
    font-size: 20px;
    margin-bottom: 16px;
    color: var(--primary-dark);
  }

  .benefit-card ul {
    list-style: none;
    padding: 0;
  }

  .benefit-card li {
    padding: 8px 0;
    padding-left: 24px;
    position: relative;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .benefit-card li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--primary-green);
    font-weight: bold;
  }

  /* Features */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
  }

  .feature-card {
    text-align: center;
    padding: 32px;
    transition: all 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(76, 175, 80, 0.2);
  }

  .feature-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .feature-card h3 {
    font-size: 18px;
    margin-bottom: 12px;
    color: var(--primary-dark);
  }

  .feature-card p {
    color: var(--text-secondary);
    font-size: 14px;
  }

  /* Developer */
  .developer-section {
    background: var(--surface);
  }

  .developer-card {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 40px;
    align-items: center;
    max-width: 800px;
    margin: 0 auto;
    padding: 40px;
  }

  .developer-photo img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .developer-info h3 {
    font-size: 28px;
    margin-bottom: 8px;
    color: var(--primary-dark);
  }

  .developer-role {
    color: var(--primary-green);
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 16px;
  }

  .developer-bio {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .developer-links {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .dev-link {
    padding: 10px 20px;
    background: var(--primary-green);
    color: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .dev-link:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
    color: white;
  }

  @media (max-width: 768px) {
    .hero-content {
      grid-template-columns: 1fr;
      gap: 40px;
    }

    .hero-title {
      font-size: 32px;
    }

    .hero-image .image-container {
      font-size: 120px;
    }

    .section {
      padding: 48px 0;
    }

    .section-header h2 {
      font-size: 28px;
    }

    .developer-card {
      grid-template-columns: 1fr;
      text-align: center;
    }

    .developer-links {
      justify-content: center;
    }
  }
</style>
