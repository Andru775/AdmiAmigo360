import { useEffect, useState } from 'react';
import axios from 'axios';

interface HealthStatus {
  status: string;
  timestamp: string;
  service: string;
}

export default function Debug() {
  const [backendStatus, setBackendStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/health`,
          { timeout: 5000 }
        );
        setBackendStatus(response.data);
      } catch (err) {
        setError('No se pudo conectar al backend');
      } finally {
        setLoading(false);
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Estado del Sistema</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Frontend</h2>
          <p className="text-green-600 font-semibold">✓ Funcionando correctamente</p>
          <p className="text-gray-600 text-sm mt-2">Next.js {require('next/package.json').version}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Backend API</h2>
          {loading && <p className="text-blue-600">Verificando...</p>}
          {error && <p className="text-red-600">✗ {error}</p>}
          {backendStatus && (
            <>
              <p className="text-green-600 font-semibold">✓ Conectado</p>
              <pre className="bg-gray-100 p-3 rounded mt-3 text-sm overflow-auto">
                {JSON.stringify(backendStatus, null, 2)}
              </pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
