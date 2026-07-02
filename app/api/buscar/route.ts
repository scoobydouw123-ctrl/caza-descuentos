import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { producto } = await req.json();

  const serperRes = await fetch('https://google.serper.dev/shopping', {
    method: 'POST',
    headers: {
      'X-API-KEY': process.env.SERPER_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ q: producto + ' precio MXN', gl: 'mx', hl: 'es', location: 'Mexico' }),
  });

  const serperData = await serperRes.json();
  const resultados = serperData.shopping?.slice(0, 6) || [];

  const resumenResultados = resultados.map((item: any, i: number) =>
    `${i + 1}. ${item.title} | Precio: ${item.price} | Tienda: ${item.source}`
  ).join('\n');

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente experto en encontrar los mejores precios.
          Analiza los resultados y recomienda las 3 mejores opciones.
          Para cada opción indica: nombre, precio, tienda y confiabilidad.
          NO incluyas links, esos se muestran aparte.
          Responde en español y usa emojis.`,
        },
        {
          role: 'user',
          content: `Busqué "${producto}":\n\n${resumenResultados}\n\nRecomiéndame las 3 mejores opciones.`,
        },
      ],
    }),
  });

  const groqData = await groqRes.json();
  const resultado = groqData.choices?.[0]?.message?.content || 'No se encontraron resultados.';

  return NextResponse.json({ resultado, resultados });
}