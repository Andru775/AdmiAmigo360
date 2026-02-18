import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeatureCard from '@/components/FeatureCard';

export default function Home() {
  const features = [
    {
      icon: "🤖",
      title: "Chatbot IA",
      description: "Gestión automática de solicitudes y conflictos",
      details: [
        "Inteligencia artificial basada en OpenAI",
        "Respuestas automáticas 24/7",
        "Resolución de conflictos comunes",
        "Historial de interacciones trazables"
      ]
    },
    {
      icon: "💰",
      title: "Control Presupuestal",
      description: "Dashboard financiero en tiempo real",
      details: [
        "Seguimiento de ingresos y egresos",
        "Reportes detallados por período",
        "Análisis de ejecución presupuestal",
        "Proyecciones financieras"
      ]
    },
    {
      icon: "💳",
      title: "Pasarela de Pagos",
      description: "Recaudo digital seguro y certificado",
      details: [
        "Integración con Stripe y PayU",
        "Recaudo de cuotas y reservas",
        "Gestión de mora automatizada",
        "Conciliaciones en tiempo real"
      ]
    },
    {
      icon: "📅",
      title: "Espacios Comunes",
      description: "Gestión digital de reservas",
      details: [
        "Calendario interactivo visual",
        "Reserva automática con validación",
        "Políticas internas configurables",
        "Confirmación de pagos instantánea"
      ]
    },
    {
      icon: "🏛️",
      title: "Asambleas Digitales",
      description: "Proceso completo de asambleas virtuales",
      details: [
        "Convocatorias automatizadas",
        "Votaciones en línea seguras",
        "Validación de quórum automática",
        "Generación de actas digitales"
      ]
    },
    {
      icon: "🤝",
      title: "Economía Colaborativa",
      description: "Marketplace de servicios verificados",
      details: [
        "Directorio de proveedores calificados",
        "Sistema de calificación transparente",
        "Comisiones por intermediación",
        "Publicidad de servicios locales"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 via-green-700 to-blue-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  Administra con
                  <span className="text-red-400"> Inteligencia</span>
                </h1>
                <p className="text-xl text-blue-100 mb-8">
                  Plataforma digital integral para la gestión moderna de propiedades horizontales en Bogotá
                </p>
                <div className="flex gap-4">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition">
                    Solicitar Demo
                  </button>
                  <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition">
                    Conocer Más
                  </button>
                </div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-8 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏢</div>
                  <p className="text-lg">
                    Conectando administradores, copropietarios y residentes en un ecosistema digital moderno
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem & Solution */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">¿Por Qué Admiamigo 360?</h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-red-500 mb-6">El Problema Actual</h3>
                <ul className="space-y-4">
                  {[
                    "Administradores sobrecargados con tareas manuales",
                    "Comunicación deficiente entre actores",
                    "Recaudo ineficiente de cuotas",
                    "Conflictos sin resolver",
                    "Falta de transparencia presupuestal",
                    "Bajo cumplimiento normativo"
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="text-red-500 font-bold">✗</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-green-600 mb-6">La Solución</h3>
                <ul className="space-y-4">
                  {[
                    "Automatización completa de procesos",
                    "Comunicación centralizada 24/7",
                    "Recaudo digital seguro",
                    "Resolución automática de conflictos",
                    "Transparencia en tiempo real",
                    "Cumplimiento garantizado"
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Nuestras Características</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <FeatureCard
                  key={idx}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  details={feature.details}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-blue-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">220K+</div>
                <p className="text-blue-100">Propiedades Horizontales Objetivo</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">3</div>
                <p className="text-blue-100">Socios Fundadores</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">6</div>
                <p className="text-blue-100">Módulos Principales</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">2026</div>
                <p className="text-blue-100">Año de Lanzamiento</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">¿Listo para Modernizar tu Propiedad Horizontal?</h2>
            <p className="text-xl mb-8 text-green-100">
              Únete a las propiedades que están transformando su gestión con Admiamigo 360
            </p>
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
              Solicitar Demo Gratuita
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
