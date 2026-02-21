/**
 * AdmiAmigo360 AI Assistant Logic
 * Based on memory2.md training script
 */

document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chatbot-container';
    chatContainer.innerHTML = `
        <button class="chatbot-button" id="chatbot-toggle">
            <i class="fas fa-comment-dots"></i>
        </button>
        <div class="chat-window" id="chatbot-window">
            <div class="chat-header">
                <div class="chat-header-info">
                    <img src="public/logo_pro-photoroom.png" alt="AI">
                    <div>
                        <h3>Asistente Amigo</h3>
                        <span>En línea • IA 360</span>
                    </div>
                </div>
                <button class="close-chat" id="chatbot-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chat-messages" id="chat-messages">
                <div class="message bot-message">
                    ¡Hola! Soy tu asistente virtual de <strong>Admiamigo 360</strong>. Estoy aquí para ayudarte a modernizar la gestión de tu conjunto residencial. ¿En qué puedo apoyarte hoy?
                </div>
            </div>
            <div class="chat-input-area">
                <input type="text" id="chat-input" placeholder="Escribe tu duda aquí..." autocomplete="off">
                <button class="send-btn" id="chat-send">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(chatContainer);

    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const chatWindow = document.getElementById('chatbot-window');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    // Toggle Chat visibility
    toggleBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
        }
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Send Message Logic
    const sendMessage = () => {
        const text = chatInput.value.trim();
        if (text === '') return;

        // User message
        appendMessage('user', text);
        chatInput.value = '';

        // Bot response (Simulated delay)
        setTimeout(() => {
            const response = getBotResponse(text);
            appendMessage('bot', response);
        }, 600);
    };

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    const appendMessage = (sender, text) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        msgDiv.innerHTML = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const getBotResponse = (input) => {
        const query = input.toLowerCase();

        // Knowledge Base based on memory2.md
        if (contains(query, ['hola', 'buenos dias', 'buenas tardes', 'saludos'])) {
            return "¡Hola! Es un gusto saludarte. Soy el asistente de Admiamigo 360. ¿Te gustaría saber cómo podemos optimizar la administración de tu conjunto?";
        }

        if (contains(query, ['qué es', 'que es', 'admiamigo', 'plataforma', 'cómo funciona'])) {
            return "<strong>Admiamigo 360</strong> es una plataforma digital que ayuda a administrar conjuntos residenciales de forma eficiente, transparente y organizada. Gestiona pagos, comunicación, reservas y procesos administrativos desde un solo lugar.";
        }

        if (contains(query, ['pagos', 'finanzas', 'dinero', 'cuota', 'mora', 'cobro'])) {
            return "Facilitamos la gestión financiera permitiendo <strong>pagos en línea</strong>, control transparente del presupuesto, reportes automáticos y herramientas para reducir la mora. Los residentes pueden consultar su estado de cuenta en tiempo real.";
        }

        if (contains(query, ['comunicación', 'mensajes', 'whatsapp', 'noticias', 'avisos'])) {
            return "Mejoramos la convivencia con <strong>comunicados oficiales</strong>, notificaciones inmediatas, gestión de peticiones (PQR) y encuestas comunitarias, reduciendo malentendidos entre la administración y los residentes.";
        }

        if (contains(query, ['reserva', 'zona común', 'piscina', 'salón', 'gimnasio', 'cancha'])) {
            return "Con nuestro módulo de reservas, puedes agendar salones sociales, áreas deportivas y espacios comunes directamente desde la plataforma, con <strong>control de disponibilidad automático</strong>.";
        }

        if (contains(query, ['seguridad', 'datos', 'protección', 'privacidad'])) {
            return "La seguridad es nuestra prioridad. Aseguramos el <strong>acceso controlado</strong> a la información sensible y protegemos todos los datos administrativos y financieros bajo estándares modernos.";
        }

        if (contains(query, ['beneficio', 'por qué', 'ventaja', 'mejorar'])) {
            return "Al usar Admiamigo 360 logras: <br>• Modernizar la gestión.<br>• Reducir carga operativa.<br>• Transparencia financiera total.<br>• Comunicación fluida.<br>• Optimización de reservas.";
        }

        if (contains(query, ['precio', 'costo', 'pagar', 'cuánto', 'cuanto cuesta'])) {
            return "Contamos con planes escalables según el número de unidades. Los precios inician desde <strong>$500,000 COP</strong> mensuales. ¿Te gustaría que un asesor te brinde una cotización exacta?";
        }

        if (contains(query, ['implementar', 'usar', 'contratar', 'comenzar', 'demo'])) {
            return "El proceso es sencillo: realizamos una configuración inicial adaptada a tu conjunto. Ofrecemos <strong>acompañamiento constante</strong>. ¿Quieres que agendemos una demostración?";
        }

        if (contains(query, ['soporte', 'ayuda', 'problema'])) {
            return "Contamos con soporte técnico y acompañamiento durante la implementación y el uso diario de la plataforma. ¡No estás solo!";
        }

        // Default response
        return "Esa es una excelente pregunta. Como asistente de <strong>Admiamigo 360</strong>, mi objetivo es ayudarte con la gestión de tu propiedad horizontal. ¿Podrías darme más detalles o preguntarme sobre pagos, comunicación o reservas?";
    };

    const contains = (text, keywords) => {
        return keywords.some(keyword => text.includes(keyword));
    };
});
