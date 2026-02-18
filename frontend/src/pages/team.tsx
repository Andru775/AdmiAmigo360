import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TeamMember from '@/components/TeamMember';

export default function Team() {
  const team = [
    {
      name: "Vandessa García",
      role: "CEO - Representante Legal",
      description: "Abogada especializada en Propiedad Horizontal con experiencia en transformación digital y asesoramiento normativo. Lidera la estrategia empresarial y alianzas con constructoras."
    },
    {
      name: "Juan Camilo Díaz",
      role: "CTO - Arquitecto Tecnológico",
      description: "Ingeniero con experiencia en plataformas digitales y sistemas escalables. Anteriormente en Airbnb Medellín. Responsable de la arquitectura técnica e implementación de IA."
    },
    {
      name: "Juan David López",
      role: "COO - Operaciones y Comercial",
      description: "Especialista en operaciones y expansión comercial. Conocedor del mercado inmobiliario bogotano. Lidera la implementación con clientes y estrategia de crecimiento."
    }
  ];

  const values = [
    { title: "Eficiencia", icon: "⚡", description: "Centralizar procesos para reducir tiempos y costos" },
    { title: "Transparencia", icon: "🔍", description: "Garantizar acceso claro a información financiera" },
    { title: "Innovación", icon: "💡", description: "Automatizar y optimizar con tecnología e IA" },
    { title: "Colaboración", icon: "🤝", description: "Fortalecer redes de apoyo comunitario" },
    { title: "Responsabilidad", icon: "📋", description: "Cumplimiento normativo e ética" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Nuestro Equipo</h1>
            <p className="text-xl text-green-100">
              Profesionales apasionados por transformar la gestión de propiedades horizontales
            </p>
          </div>
        </section>

        {/* Team Members */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Fundadores</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, idx) => (
                <TeamMember
                  key={idx}
                  name={member.name}
                  role={member.role}
                  description={member.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Nuestra Historia</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-700 mb-6">
                Somos tres profesionales con formación en Derecho y experiencia en el sector inmobiliario y tecnología. 
                Durante nuestros estudios de maestría, identificamos un problema crítico: Los administradores de propiedades 
                horizontales enfrentan una carga operativa insostenible y los copropietarios carecen de transparencia.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Decidimos crear <strong>Admiamigo 360</strong> como solución integral que moderniza la gestión de propiedades 
                horizontales mediante tecnología, inteligencia artificial y un enfoque centrado en el usuario.
              </p>
              <p className="text-lg text-gray-700">
                Hoy, nos enfocamos en transformar la experiencia de administración en Bogotá y expandir a nivel nacional, 
                promoviendo comunidades modernas, eficientes y transparentes donde todos quieran vivir.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Nuestros Valores</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {values.map((value, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-blue-900">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Por Los Números</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold mb-2">220K+</div>
                <p className="text-blue-100">Propiedades objetivo en Suba</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">200+</div>
                <p className="text-blue-100">Unidades en piloto inicial</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">0.1%</div>
                <p className="text-blue-100">Meta de captura inicial</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">3 años</div>
                <p className="text-blue-100">Expansión nacional proyectada</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">¿Quieres Ser Parte de la Revolución?</h2>
            <p className="text-xl mb-8">Únete a nosotros en transformar la administración de propiedades horizontales</p>
            <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
              Contactanos Hoy
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
