import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold">
            <span className="text-blue-900">Admi</span>
            <span className="text-green-600">amigo</span>
            <span className="text-red-500">360</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8">
          <Link href="/" className="text-gray-700 hover:text-blue-900 transition">
            Inicio
          </Link>
          <Link href="/features" className="text-gray-700 hover:text-blue-900 transition">
            Características
          </Link>
          <Link href="/team" className="text-gray-700 hover:text-blue-900 transition">
            Equipo
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-900 transition">
            Contacto
          </Link>
        </div>

        {/* CTA Button */}
        <button className="hidden md:block bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
          Solicitar Demo
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className="block text-gray-700 hover:text-blue-900">
              Inicio
            </Link>
            <Link href="/features" className="block text-gray-700 hover:text-blue-900">
              Características
            </Link>
            <Link href="/team" className="block text-gray-700 hover:text-blue-900">
              Equipo
            </Link>
            <Link href="/contact" className="block text-gray-700 hover:text-blue-900">
              Contacto
            </Link>
            <button className="w-full bg-blue-900 text-white px-4 py-2 rounded-lg">
              Solicitar Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
