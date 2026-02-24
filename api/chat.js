const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured in Vercel' });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const systemMessage = `Eres el asistente virtual de AdmiAmigo360, una startup colombiana líder en gestión de propiedad horizontal. 
                Tu objetivo es ayudar a clientes potenciales, administradores y residentes con información precisa.
                
                Contexto de la empresa:
                - Productos: Módulo Integrador de Solicitudes (IA), Gestión Financiera, Pasarela de Pagos, Agenda de Espacios Comunes, Gestión de Asambleas Digitales y Economía Colaborativa (Marketplace).
                - Planes: 
                  * Básico: Desde $500K COP/mes. Incluye solicitudes IA, tablero financiero básico y asambleas.
                  * Profesional: Desde $1.5M COP/mes. Incluye todo lo básico + pasarela de pagos, control avanzado y economía colaborativa.
                  * Premium: Personalizado. Incluye soporte 24/7 y analítica avanzada.
                - Ubicación: Bogotá, Localidad de Suba.
                - Valores: Eficiencia, Transparencia, Innovación, Colaboración y Responsabilidad.
                - Ley aplicable: Ley 675 de 2001 (Propiedad Horizontal en Colombia).
                
                Instrucciones de estilo:
                - Sé profesional, amable y servicial.
                - Responde siempre en español.
                - Si te preguntan algo fuera del contexto de AdmiAmigo360, intenta redirigir la conversación hacia cómo la plataforma puede ayudar en la gestión de copropiedades.
                - Mantén las respuestas concisas pero completas.`;

        // If history is empty, initialize it with the system message as a user/model pair or just skip for now
        const effectiveHistory = history && history.length > 0 ? history : [
            { role: "user", parts: [{ text: "Actúa como mi asistente de AdmiAmigo360 siguiendo estas instrucciones: " + systemMessage }] },
            { role: "model", parts: [{ text: "Entendido. Soy el asistente virtual de AdmiAmigo360. ¿Cómo puedo ayudarte hoy?" }] }
        ];

        const chat = model.startChat({
            history: effectiveHistory,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ text });
    } catch (error) {
        console.error("Gemini API Error Detail:", error);
        res.status(500).json({
            error: "Error en la API de Gemini",
            details: error.message,
            stack: error.stack ? "Available" : "Not available"
        });
    }
};
