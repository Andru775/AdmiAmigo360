/**
 * AdmiAmigo 360 - The Product Simulation Core
 * Advanced State Management & Interaction Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Dashboard State Management ---
    const State = {
        clients: JSON.parse(localStorage.getItem('ad360_clients')) || [
            { id: 1, name: "Carlos Ruiz", status: "Cerrado", date: "2024-02-20" },
            { id: 2, name: "Maria Delgado", status: "Nuevo", date: "2024-02-24" }
        ],
        automationActive: localStorage.getItem('ad360_automation') === 'true',
        currentTab: 'dashboard',
        income: 12450000,
        activeToasts: 0
    };

    const saveState = () => {
        localStorage.setItem('ad360_clients', JSON.stringify(State.clients));
        localStorage.setItem('ad360_automation', State.automationActive);
    };

    // --- 2. DOM Selectors ---
    const simContent = document.getElementById('sim-content');
    const simTitle = document.getElementById('sim-title');
    const simFeed = document.getElementById('sim-feed');
    const menuItems = document.querySelectorAll('.dash-menu-item');
    const modal = document.getElementById('sim-modal-overlay');
    const toastContainer = document.getElementById('toast-container');

    // --- 3. UI Helpers ---
    const showToast = (msg, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i> <span>${msg}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    const logFeed = (msg) => {
        const time = new Date().toLocaleTimeString();
        simFeed.innerHTML = `> [${time}] ${msg}<br>` + simFeed.innerHTML;
        const lines = simFeed.innerHTML.split('<br>');
        if (lines.length > 5) simFeed.innerHTML = lines.slice(0, 5).join('<br>');
    };

    const animateNumber = (el, target) => {
        let current = 0;
        const step = target / 50;
        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                el.innerText = target.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }).split(',')[0];
                clearInterval(interval);
            } else {
                el.innerText = current.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }).split(',')[0];
            }
        }, 20);
    };

    // --- 4. Render Logic ---
    const Renderers = {
        dashboard: () => {
            const efficiency = State.automationActive ? '98.5%' : '72.1%';
            const bars = [40, 70, 55, 90, 65, 85, 95];
            const barHtml = bars.map((h, i) => `<div class="chart-bar" style="height: ${h}%" data-label="Día ${i + 1}"></div>`).join('');

            simContent.innerHTML = `
                <div class="dash-card-grid">
                    <div class="dash-card">
                        <label>Ingresos</label>
                        <div class="value" id="count-income">$0</div>
                    </div>
                    <div class="dash-card">
                        <label>Efectividad IA</label>
                        <div class="value" style="color: ${State.automationActive ? 'var(--success)' : 'var(--brand)'}">${efficiency}</div>
                    </div>
                    <div class="dash-card">
                        <label>Total Clientes</label>
                        <div class="value">${State.clients.length}</div>
                    </div>
                </div>
                <div style="background: rgba(255,255,255,0.02); height: 180px; border-radius: 20px; border: 1px dashed rgba(255,255,255,0.1); position: relative; overflow: hidden; padding-bottom: 25px;">
                    <div class="chart-container">
                        ${barHtml}
                    </div>
                </div>
            `;
            animateNumber(document.getElementById('count-income'), State.income);
        },
        clientes: () => {
            let listHtml = State.clients.map(c => `
                <tr>
                    <td style="font-weight: 600;">${c.name}</td>
                    <td><span class="status-badge ${c.status === 'Cerrado' ? 'status-active' : 'status-new'}">${c.status}</span></td>
                    <td style="color: var(--text-muted); font-size: 0.8rem;">${c.date}</td>
                </tr>
            `).join('');

            simContent.innerHTML = `
                <div class="dash-actions">
                    <button class="btn-dash" id="btn-add-client"><i class="fas fa-plus"></i> Agregar Cliente</button>
                    <button class="btn-dash" style="background: rgba(255,255,255,0.05); color: white;">Exportar</button>
                </div>
                <table class="data-table">
                    ${listHtml || '<tr><td colspan="3" style="text-align:center;">No hay clientes registrados</td></tr>'}
                </table>
            `;

            document.getElementById('btn-add-client').onclick = () => modal.classList.add('active');
        },
        automatizacion: () => {
            simContent.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-robot" style="font-size: 4rem; color: ${State.automationActive ? 'var(--success)' : 'var(--brand)'}; margin-bottom: 2rem;"></i>
                    <h3>Seguimiento 24/7 Inteligente</h3>
                    <p style="color: var(--text-muted); margin-bottom: 2.5rem;">Activa la IA para que AdmiAmigo envíe recordatorios de pago y resuelva dudas por ti.</p>
                    <button class="btn-dash" id="btn-toggle-auto" style="padding: 18px 40px; font-size: 1.1rem; background: ${State.automationActive ? 'var(--error)' : 'var(--brand)'}">
                        ${State.automationActive ? 'Desactivar Sistema' : 'Activar Automatización'}
                    </button>
                </div>
            `;

            document.getElementById('btn-toggle-auto').onclick = () => {
                State.automationActive = !State.automationActive;
                saveState();
                showToast(State.automationActive ? 'Automatización Activada' : 'Sistema Desactivado', State.automationActive ? 'success' : 'info');
                logFeed(State.automationActive ? 'IA: Sistema de seguimiento ON' : 'IA: Sistema de seguimiento OFF');
                Renderers.automatizacion();
            };
        },
        metricas: () => {
            simContent.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div class="dash-card">
                        <label>Retención</label>
                        <div class="value">94%</div>
                    </div>
                    <div class="dash-card">
                        <label>Crecimiento</label>
                        <div class="value" style="color: var(--success);">+12%</div>
                    </div>
                </div>
                <div style="margin-top: 2rem; padding: 2rem; background: rgba(10, 102, 194, 0.05); border-radius: 20px; border: 1px solid var(--brand-glow);">
                    <h4 style="margin-bottom: 1rem;">Optimización Detectada</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted);">El sistema ha identificado que puedes ahorrar 8 horas semanales adicionales activando el módulo de facturación masiva.</p>
                </div>
            `;
        }
    };

    const switchTab = (tab) => {
        State.currentTab = tab;
        simTitle.innerText = tab.charAt(0).toUpperCase() + tab.slice(1);
        menuItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-tab') === tab);
        });
        Renderers[tab]();
    };

    // --- 5. Event Listeners ---
    menuItems.forEach(item => {
        item.onclick = () => switchTab(item.getAttribute('data-tab'));
    });

    document.getElementById('sim-close-modal').onclick = () => modal.classList.remove('active');

    document.getElementById('sim-save-client').onclick = () => {
        const name = document.getElementById('sim-client-name').value;
        const status = document.getElementById('sim-client-status').value;

        if (!name) return showToast('Por favor ingresa un nombre', 'info');

        State.clients.unshift({
            id: Date.now(),
            name,
            status,
            date: new Date().toISOString().split('T')[0]
        });

        saveState();
        modal.classList.remove('active');
        document.getElementById('sim-client-name').value = "";

        showToast('Cliente guardado exitosamente', 'success');
        logFeed(`CLIENTE: Nuevo registro -> ${name}`);

        if (State.currentTab === 'clientes') Renderers.clientes();
        else switchTab('clientes');
    };

    // --- 6. Simulation Loop (Fake Activity) ---
    setInterval(() => {
        if (State.automationActive && Math.random() > 0.7) {
            const msgs = [
                "IA: Recordatorio enviado a Casa 101",
                "IA: Pago conciliado automáticamente",
                "IA: PQR resuelto por chatbot",
                "SISTEMA: Backup diario completado"
            ];
            const msg = msgs[Math.floor(Math.random() * msgs.length)];
            logFeed(msg);
            showToast(msg);
        }
    }, 8000);

    // Initial Render
    switchTab('dashboard');

    // --- 7. General Page Logic (Scroll Reveal / Header) ---
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

        document.querySelectorAll('.reveal').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                el.classList.add('active');
            }
        });
    });
});
