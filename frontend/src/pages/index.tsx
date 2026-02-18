export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-4">Admiamigo 360</h1>
          <p className="text-xl text-blue-100">
            Plataforma digital integral para la gestión de propiedades horizontales
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: "🤖",
              title: "Chatbot IA",
              description: "Gestión automática de solicitudes 24/7"
            },
            {
              icon: "💰",
              title: "Control Presupuestal",
              description: "Dashboard en tiempo real"
            },
            {
              icon: "💳",
              title: "Pasarela de Pagos",
              description: "Recaudo digital seguro"
            },
            {
              icon: "📅",
              title: "Espacios Comunes",
              description: "Calendario interactivo"
            },
            {
              icon: "🏛️",
              title: "Asambleas Digitales",
              description: "Votaciones en línea"
            },
            {
              icon: "🤝",
              title: "Economía Colaborativa",
              description: "Marketplace de servicios"
            }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-white text-sm">
            Cada decisión cuenta, administra con pasión y compromiso 🏢
          </p>
        </div>
      </main>
    </div>
  );
}
