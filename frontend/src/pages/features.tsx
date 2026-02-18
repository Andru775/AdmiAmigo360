import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeatureCard from '@/components/FeatureCard';

export default function Features() {
  const detailedFeatures = [
    {
      icon: "🤖",
      title: "Módulo Integrador de Solicitudes",
      description: "Gestión centralizada de todas las solicitudes",
      details: [
        "Chatbot IA entrenado en Ley 675 de 2001",
        "Clasificación automática de solicitudes",
        "Resolución de conflictos inteligente",
        "Historial completo de interacciones",
        "Respuestas 24/7 en tiempo real"
      ]
    },
    {
      icon: "💰",
      title: "Control Presupuestal en Tiempo Real",
      description: "Dashboard financiero completo",
      details: [
        "Visualización de ingresos y egresos",
        "Reportes personalizados por unidad",
        "Seguimiento de proyectos internos",
        "Análisis de tendencias financieras",
        "Exportación de reportes"
      ]
    },
    {
      icon: "💳",
      title: "Pasarela de Pagos Integrada",
      description: "Recaudo digital seguro y eficiente",
      details: [
        "Integración con Stripe y PayU",
        "Múltiples métodos de pago",
        "Confirmación instantánea",
        "Gestión de mora automatizada",
        "Conciliación de cuentas"
      ]
    },
    {
      icon: "📅",
      title: "Gestión de Espacios Comunes",
      description: "Reserva digital de zonas comunes",
      details: [
        "Calendario visual interactivo",
        "Validación automática de disponibilidad",
        "Reserva en línea sin intermediarios",
        "Políticas configurables por propiedad",
        "Confirmación de pago en el acto"
      ]
    },
    {
      icon: "🏛️",
      title: "Asambleas Digitales",
      description: "Gestión completa de asambleas",
      details: [
        "Convocatorias automatizadas",
        "Agendas y materiales previos",
        "Votación en línea segura",
        "Validación automática de quórum",
        "Actas digitales con firma"
      ]
    },
    {
      icon: "🤝",
      title: "Economía Colaborativa",
      description: "Marketplace de servicios confiables",
      details: [
        "Directorio de proveedores verificados",
        "Sistema de calificación transparente",
        "Comisiones por intermediación",
        "Publicidad de servicios locales",
        "Seguridad en transacciones"
      ]
    }
  ];

  const benefits = [
    { title: "Eficiencia", description: "Reducir carga administrativa en más del 30%" },
    { title: "Transparencia", description: "Acceso visual a finanzas e información" },
    { title: "Innovación", description: "Tecnología IA y automatización" },
    { title: "Colaboración", description: "Fortalecer redes de apoyo comunitario" },
    { title: "Responsabilidad", description: "Cumplimiento normativo garantizado" },
    { title: "Escalabilidad", description: "Crece con tu propiedad horizontal" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Características Completas</h1>
            <p className="text-xl text-blue-100">
              Todo lo que necesitas para administrar propiedades horizontales modernas
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">6 Módulos Integrados</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {detailedFeatures.map((feature, idx) => (
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

        {/* Benefits */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Beneficios Clave</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-700">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Tecnología Avanzada</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-green-400">Frontend</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3"><span className="text-green-400">✓</span> <span>Next.js 14 (React 18)</span></li>
                  <li className="flex gap-3"><span className="text-green-400">✓</span> <span>TypeScript</span></li>
                  <li className="flex gap-3"><span className="text-green-400">✓</span> <span>TailwindCSS</span></li>
                  <li className="flex gap-3"><span className="text-green-400">✓</span> <span>Vercel Hosting</span></li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-6 text-green-400">Backend</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3"><span className="text-green-400">✓</span> <span>Express.js</span></li>
                  <li className="flex gap-3"><span className="text-green-400">✓</span> <span>PostgreSQL</span></li>
                  <li className="flex gap-3"><span className="text-green-400">✓</span> <span>Prisma ORM</span></li>
                  <li className="flex gap-3"><span className="text-green-400">✓</span> <span>OpenAI API</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-red-500 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Potencia Tu Propiedad Horizontal</h2>
            <button className="bg-white text-red-500 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
              Comenzar Ahora
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
