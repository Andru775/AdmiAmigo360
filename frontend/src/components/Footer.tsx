import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">Admiamigo 360</h3>
            <p className="text-gray-400">
              Plataforma digital integral para la gestión de propiedades horizontales en Bogotá, Colombia.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Producto</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/features" className="hover:text-white transition">Características</Link></li>
              <li><Link href="#" className="hover:text-white transition">Precios</Link></li>
              <li><Link href="#" className="hover:text-white transition">Documentación</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/team" className="hover:text-white transition">Equipo</Link></li>
              <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contacto</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Síguenos</h4>
            <div className="space-y-2 text-gray-400">
              <p><a href="#" className="hover:text-white transition">LinkedIn</a></p>
              <p><a href="#" className="hover:text-white transition">GitHub</a></p>
              <p><a href="#" className="hover:text-white transition">Twitter</a></p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © {currentYear} Admiamigo 360 S.A.S. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-gray-400 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Privacidad</a>
              <a href="#" className="hover:text-white transition">Términos</a>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 pt-8 border-t border-gray-800">
          <p className="text-gray-500 italic">
            Cada decisión cuenta, administra con pasión y compromiso
          </p>
        </div>
      </div>
    </footer>
  );
}
