import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    property: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de envío
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', property: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Ponte en Contacto</h1>
            <p className="text-xl text-red-100">
              Estamos aquí para ayudarte a modernizar tu propiedad horizontal
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-3xl font-bold mb-8">Información de Contacto</h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">Email</h3>
                    <p className="text-gray-700">
                      <a href="mailto:soporte@admiamigo360.com" className="text-blue-600 hover:underline">
                        soporte@admiamigo360.com
                      </a>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">Ubicación</h3>
                    <p className="text-gray-700">
                      Bogotá, D.C.<br />
                      Colombia
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">Horario</h3>
                    <p className="text-gray-700">
                      Lunes a Viernes<br />
                      9:00 AM - 6:00 PM<br />
                      <span className="text-sm text-gray-500">Hora local de Colombia</span>
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">Redes Sociales</h3>
                    <div className="space-y-2">
                      <p><a href="#" className="text-blue-600 hover:underline">LinkedIn</a></p>
                      <p><a href="#" className="text-blue-600 hover:underline">GitHub</a></p>
                      <p><a href="#" className="text-blue-600 hover:underline">Twitter</a></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-3xl font-bold mb-8">Formulario de Contacto</h2>
                  
                  {submitted && (
                    <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                      ✓ ¡Gracias! Tu mensaje fue enviado correctamente. Nos pondremos en contacto pronto.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Nombre</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
                        placeholder="Tu nombre completo"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Propiedad Horizontal</label>
                      <input
                        type="text"
                        name="property"
                        value={formData.property}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
                        placeholder="Nombre de tu propiedad (opcional)"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Mensaje</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
                        placeholder="¿Cómo podemos ayudarte?"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                    >
                      Enviar Mensaje
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  q: "¿Cuál es el costo de Admiamigo 360?",
                  a: "Manejamos un modelo de suscripción mensual escalable según el tamaño de tu propiedad. Contacta para presupuesto personalizado."
                },
                {
                  q: "¿Cuánto tiempo toma implementar la plataforma?",
                  a: "La implementación típica toma 2-4 semanas incluyendo capacitación del equipo administrativo y configuración inicial."
                },
                {
                  q: "¿Cumple con la Ley 675 de 2001?",
                  a: "Sí, Admiamigo 360 asegura cumplimiento total con la normatividad de Propiedad Horizontal en Colombia."
                },
                {
                  q: "¿Qué sucede con mis datos?",
                  a: "Tus datos están protegidos bajo LGPD. Todos los servidores están encriptados y en centros de datos certificados."
                },
                {
                  q: "¿Ofrecen soporte técnico?",
                  a: "Sí, incluimos soporte 24/7, capacitación continua y actualizaciones automáticas en nuestros planes."
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-gray-50 border-l-4 border-blue-900 p-6 rounded">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Comienza Hoy Mismo</h2>
            <p className="text-xl mb-8">Solicita una demostración gratuita y descubre cómo Admiamigo 360 puede transformar tu propiedad</p>
            <button className="bg-red-500 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-red-600 transition">
              Solicitar Demo Gratuita
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
