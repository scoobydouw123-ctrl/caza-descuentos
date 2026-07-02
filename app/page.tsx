'use client';

import { useState } from 'react';

interface Resultado {
  title: string;
  price: string;
  source: string;
  link: string;
}

export default function Home() {
  const [producto, setProducto] = useState('');
  const [resultado, setResultado] = useState('');
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [cargando, setCargando] = useState(false);

  const buscar = async () => {
    if (!producto) return;
    setCargando(true);
    setResultado('');
    setResultados([]);

    const res = await fetch('/api/buscar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ producto }),
    });

    const data = await res.json();
    setResultado(data.resultado);
    setResultados(data.resultados || []);
    setCargando(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-8">
      <div className="w-full max-w-2xl mt-16">
        <h1 className="text-4xl font-bold mb-2 text-orange-400 text-center">
          Caza Descuentos
        </h1>
        <p className="text-gray-400 mb-8 text-center">
          Dime que producto buscas y te digo donde esta mas barato
        </p>

        <div className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Ej: iPhone 15, audifonos Sony..."
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && buscar()}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400"
          />
          <button
            onClick={buscar}
            disabled={cargando}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold transition"
          >
            {cargando ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        {resultado && (
          <div className="bg-gray-800 rounded-xl p-6 mb-6 whitespace-pre-wrap text-gray-200 leading-relaxed">
            {resultado}
          </div>
        )}

        {resultados.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-orange-400 mb-4">
              Ver productos:
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {resultados.map((item, i) => (
                <div
                  key={i}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex justify-between items-center gap-4"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">{item.title}</p>
                    <p className="text-orange-400 font-bold mt-1">{item.price}</p>
                    <p className="text-gray-400 text-sm">{item.source}</p>
                 </div>
                 <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Ver oferta
                </a>
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
    </main>
  );
}