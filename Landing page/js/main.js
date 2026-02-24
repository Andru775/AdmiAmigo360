/**
 * AdmiAmigo 360 - Interactive Logic Core
 * Handles dashboard simulation, animations, and conversion flows
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Dashboard Interactive Experience ---
    const menuItems = document.querySelectorAll('.dash-menu-item');
    const dashBody = document.querySelector('.dash-main-body');
    const dashTitle = document.querySelector('.dash-main h2');

    const dashData = {
        resumen: {
            title: "Resultados en Tiempo Real",
            html: `
                <div class="dash-grid">
                    <div class="dash-card">
                        <label>Ingresos Hoy</label>
                        <div class="value">$12.4M</div>
                    </div>
                    <div class="dash-card">
                        <label>Efectividad IA</label>
                        <div class="value" style="color: var(--success);">98.2%</div>
                    </div>
                    <div class="dash-card">
                        <label>Atención PQR</label>
                        <div class="value">9 min</div>
                    </div>
                </div>
                <div style="background: rgba(255,255,255,0.02); height: 200px; border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 0.9rem;">
                    [ Simulación de gráfico de recaudo activo ]
                </div>
            `
        },
        clientes: {
            title: "Base de Residentes",
            html: `
                <div class="dash-actions">
                    <button class="btn-dash btn-sim-action" data-action="Add">Agregar Cliente</button>
                    <button class="btn-dash">Exportar Reporte</button>
                </div>
                <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); color: var(--text-muted); text-align: left;">
                        <th style="padding: 12px;">Unidad</th>
                        <th>Nombre</th>
                        <th>Estado</th>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 12px;">Casa 102</td>
                        <td>Carlos Rodríguez</td>
                        <td><span style="color: var(--success);">● Al día</span></td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 12px;">Torre 2 - 504</td>
                        <td>Elena Martínez</td>
                        <td><span style="color: var(--error);">● Mora</span></td>
                    </tr>
                </table>
                <div id="sim-feedback" style="margin-top: 15px; color: var(--brand); font-weight: 700; height: 20px;"></div>
            `
        },
        ia: {
            title: "Control de Automatización",
            html: `
                <div style="text-align: center; padding: 3rem;">
                    <i class="fas fa-robot" style="font-size: 5rem; color: var(--brand); margin-bottom: 1.5rem;"></i>
                    <h3>El Chatbot IA está resolviendo el 70% de tus dudas.</h3>
                    <p style="color: var(--text-muted); margin-bottom: 2rem;">Activa el seguidor automático para reducir la mora un 40%.</p>
                    <button class="btn btn-primary btn-sim-action" data-action="IA" style="padding: 10px 20px; font-size: 0.9rem;">Ejecutar Automatización</button>
                </div>
            `
        }
    };

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.getAttribute('data-tab');
            const data = dashData[tab];

            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            dashTitle.style.transform = "translateY(10px)";
            dashTitle.style.opacity = "0";

            setTimeout(() => {
                dashTitle.innerText = data.title;
                dashBody.innerHTML = data.html;
                dashTitle.style.transform = "translateY(0)";
                dashTitle.style.opacity = "1";

                // Re-bind buttons inside the simulation
                bindSimButtons();
            }, 200);
        });
    });

    function bindSimButtons() {
        document.querySelectorAll('.btn-sim-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                const feedback = document.getElementById('sim-feedback');

                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

                setTimeout(() => {
                    if (action === 'Add') {
                        btn.innerHTML = 'Agregar Cliente';
                        if (feedback) feedback.innerText = "✓ Cliente 204 agregado al registro";
                    } else if (action === 'IA') {
                        btn.innerHTML = '¡Automatización Exitosa!';
                        btn.style.background = "var(--success)";
                    }

                    if (feedback) setTimeout(() => feedback.innerText = "", 2000);
                }, 1000);
            });
        });
    }

    // --- 2. Scroll Reveal ---
    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 120) el.classList.add('active');
        });
    };
    window.addEventListener('scroll', reveal);
    reveal();

    // --- 3. Navbar Sticky & Floating CTA ---
    const header = document.querySelector('.header');
    const floatCta = document.querySelector('.cta-float');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            header.classList.add('active');
            floatCta.classList.add('active');
        } else {
            header.classList.remove('active');
            floatCta.classList.remove('active');
        }
    });

    // --- 4. Counter Animation (Simple) ---
    const animateCounters = () => {
        const counters = document.querySelectorAll('.count');
        counters.forEach(c => {
            const target = +c.getAttribute('data-target');
            const update = () => {
                const current = +c.innerText;
                const inc = target / 200;
                if (current < target) {
                    c.innerText = Math.ceil(current + inc);
                    setTimeout(update, 1);
                } else {
                    c.innerText = target;
                }
            };
            update();
        });
    };

    // Trigger counters only once
    const metricsSection = document.querySelector('.benefits');
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            observer.disconnect();
        }
    }, { threshold: 0.5 });

    if (metricsSection) observer.observe(metricsSection);
});
