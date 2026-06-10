(function () {
  const PUSH_MODAL_STATE_KEY = 'pushSubscribeModalState';
  const PUSH_MODAL_DISMISSED_KEY = 'pushSubscribeModalDismissed';

  function hasNotificationPermissionApi() {
    return 'Notification' in window;
  }

  function supportsWebPushNotifications() {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  function hasAcceptedPrivacyPolicy() {
    return !!localStorage.getItem('cookiePreferences');
  }

  function hasActivatedPushSubscription() {
    const state = localStorage.getItem(PUSH_MODAL_STATE_KEY);
    return state === 'subscribed' || (window.Notification && Notification.permission === 'granted');
  }

  function hasDismissedPushModalPermanently() {
    return localStorage.getItem(PUSH_MODAL_DISMISSED_KEY) === 'true';
  }

  function shouldShowPushModal() {
    return hasAcceptedPrivacyPolicy() && !hasActivatedPushSubscription() && !hasDismissedPushModalPermanently();
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  async function subscribeEmailLead(email, source) {
    if (!email) return false;

    const payload = {
      name: 'Inscricao Notificacoes Blog',
      email,
      source: source || 'site-modal',
      wantsEmail: true,
      wantsPush: false
    };

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: payload.name,
          email,
          status: 'new',
          project: 'newsletter',
          message: 'Lead originado no modal de notificacoes do site'
        })
      }).catch(() => {});

      return response.ok;
    } catch (_) {
      return false;
    }
  }

  function injectStyles() {
    if (document.getElementById('consent-push-modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'consent-push-modal-styles';
    style.textContent = `
      .cp-hidden { display: none !important; }
      .cp-backdrop {
        position: fixed;
        inset: 0;
        z-index: 70;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(2, 6, 23, 0.55);
        backdrop-filter: blur(4px);
        padding: 1rem;
      }
      .cp-modal {
        width: 100%;
        max-width: 640px;
        border-radius: 18px;
        background: #ffffff;
        color: #1e293b;
        border: 1px solid #e2e8f0;
        box-shadow: 0 20px 50px rgba(15, 23, 42, 0.28);
        overflow: hidden;
        font-family: Inter, Arial, sans-serif;
      }
      .cp-header {
        padding: 1rem 1.2rem;
        border-bottom: 1px solid #e2e8f0;
        background: linear-gradient(120deg, rgba(37,99,235,.12), rgba(16,185,129,.12));
      }
      .cp-content { padding: 1rem 1.2rem 1.2rem; }
      .cp-title { margin: 0; font-size: 1.25rem; font-weight: 700; color: #0f172a; }
      .cp-subtitle { margin: .65rem 0 0; color: #475569; line-height: 1.45; }
      .cp-list { margin: 0 0 1rem; padding: 0; list-style: none; }
      .cp-list li { margin-bottom: .55rem; color: #475569; }
      .cp-email {
        width: 100%;
        padding: .72rem .85rem;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        margin-bottom: .65rem;
      }
      .cp-feedback { min-height: 1.2rem; margin: 0 0 .8rem; color: #475569; font-size: .92rem; }
      .cp-actions { display: flex; gap: .7rem; flex-wrap: wrap; }
      .cp-btn-primary {
        flex: 1;
        min-width: 170px;
        border: none;
        border-radius: 10px;
        padding: .78rem 1rem;
        color: #fff;
        font-weight: 600;
        cursor: pointer;
        background: linear-gradient(135deg, #2563eb 0%, #10b981 100%);
      }
      .cp-btn-secondary {
        flex: 1;
        min-width: 120px;
        border: 1px solid #2563eb;
        background: #fff;
        color: #2563eb;
        border-radius: 10px;
        padding: .78rem 1rem;
        font-weight: 600;
        cursor: pointer;
      }
      .cp-close {
        border: 0;
        background: transparent;
        color: #64748b;
        cursor: pointer;
        font-size: 1.1rem;
      }
      @media (max-width: 640px) {
        .cp-title { font-size: 1.05rem; }
        .cp-content { padding: .9rem 1rem 1rem; }
      }
    `;

    document.head.appendChild(style);
  }

  function injectModals() {
    if (document.getElementById('cp-privacy-modal')) return;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div id="cp-privacy-modal" class="cp-backdrop cp-hidden">
        <div class="cp-modal">
          <div class="cp-header">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.8rem;">
              <h3 class="cp-title">Privacidade e cookies</h3>
              <button id="cp-privacy-close" class="cp-close" aria-label="Fechar">✕</button>
            </div>
          </div>
          <div class="cp-content">
            <p class="cp-subtitle">Utilizamos cookies essenciais e opcionais para melhorar sua experiência. Ao continuar, você aceita nossa política de privacidade.</p>
            <div class="cp-actions" style="margin-top:1rem;">
              <button id="cp-privacy-accept" class="cp-btn-primary">Aceitar e continuar</button>
            </div>
          </div>
        </div>
      </div>

      <div id="cp-push-modal" class="cp-backdrop cp-hidden">
        <div class="cp-modal">
          <div class="cp-header">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.8rem;">
              <div>
                <p style="margin:0 0 .35rem;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:#2563eb;font-weight:700;">Atualizacoes do Blog</p>
                <h3 class="cp-title">Ative notificacoes e receba novos posts</h3>
              </div>
              <button id="cp-push-close" class="cp-close" aria-label="Fechar">✕</button>
            </div>
          </div>
          <div class="cp-content">
            <ul class="cp-list">
              <li>Receba novos artigos assim que forem publicados.</li>
              <li>Notificacoes no navegador e opcao de inscricao por e-mail.</li>
              <li>Conteudo tecnico sem spam.</li>
            </ul>
            <input id="cp-push-email" class="cp-email" type="email" placeholder="voce@dominio.com (opcional)">
            <p id="cp-push-feedback" class="cp-feedback"></p>
            <div class="cp-actions">
              <button id="cp-push-activate" class="cp-btn-primary">Ativar notificacoes</button>
              <button id="cp-push-later" class="cp-btn-secondary">Agora nao</button>
              <button id="cp-push-never" class="cp-btn-secondary">Nao mostrar novamente</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(wrapper);
  }

  function initFlow() {
    injectStyles();
    injectModals();

    const privacyModal = document.getElementById('cp-privacy-modal');
    const privacyClose = document.getElementById('cp-privacy-close');
    const privacyAccept = document.getElementById('cp-privacy-accept');

    const pushModal = document.getElementById('cp-push-modal');
    const pushClose = document.getElementById('cp-push-close');
    const pushLater = document.getElementById('cp-push-later');
    const pushNever = document.getElementById('cp-push-never');
    const pushActivate = document.getElementById('cp-push-activate');
    const pushFeedback = document.getElementById('cp-push-feedback');
    const pushEmail = document.getElementById('cp-push-email');

    function showPrivacyModal() {
      privacyModal.classList.remove('cp-hidden');
    }

    function hidePrivacyModal() {
      privacyModal.classList.add('cp-hidden');
    }

    function showPushModal() {
      pushFeedback.textContent = '';
      pushModal.classList.remove('cp-hidden');
    }

    function hidePushModal() {
      pushModal.classList.add('cp-hidden');
    }

    if (!hasAcceptedPrivacyPolicy()) {
      setTimeout(showPrivacyModal, 5000);
    } else if (shouldShowPushModal()) {
      setTimeout(showPushModal, 1200);
    }

    privacyClose.addEventListener('click', hidePrivacyModal);
    privacyAccept.addEventListener('click', () => {
      localStorage.setItem('cookiePreferences', JSON.stringify({
        performance: true,
        marketing: false,
        essential: true
      }));

      hidePrivacyModal();

      if (shouldShowPushModal()) {
        setTimeout(showPushModal, 600);
      }
    });

    pushClose.addEventListener('click', hidePushModal);
    pushLater.addEventListener('click', hidePushModal);
    pushNever.addEventListener('click', () => {
      localStorage.setItem(PUSH_MODAL_DISMISSED_KEY, 'true');
      hidePushModal();
    });

    pushActivate.addEventListener('click', async () => {
      const originalText = pushActivate.textContent;
      pushActivate.disabled = true;
      pushActivate.textContent = 'Ativando...';

      try {
        const email = pushEmail.value.trim();

        if (!hasNotificationPermissionApi()) {
          if (!email) {
            pushFeedback.textContent = 'Seu navegador nao suporta notificacoes nativas. Informe e-mail para receber atualizacoes.';
            return;
          }

          const ok = await subscribeEmailLead(email, 'modal-no-notification-api');
          if (!ok) {
            pushFeedback.textContent = 'Nao foi possivel concluir sua inscricao agora.';
            return;
          }

          localStorage.setItem(PUSH_MODAL_STATE_KEY, 'subscribed');
          localStorage.removeItem(PUSH_MODAL_DISMISSED_KEY);
          pushFeedback.textContent = 'Inscricao por e-mail confirmada com sucesso.';
          setTimeout(hidePushModal, 900);
          return;
        }

        let permission = Notification.permission;
        if (permission === 'default') {
          permission = await Notification.requestPermission();
        }

        if (permission !== 'granted') {
          if (!email) {
            pushFeedback.textContent = 'Permissao nao concedida. Informe e-mail para receber atualizacoes.';
            return;
          }

          const ok = await subscribeEmailLead(email, 'modal-permission-not-granted');
          if (!ok) {
            pushFeedback.textContent = 'Nao foi possivel concluir sua inscricao por e-mail.';
            return;
          }

          localStorage.setItem(PUSH_MODAL_STATE_KEY, 'subscribed');
          localStorage.removeItem(PUSH_MODAL_DISMISSED_KEY);
          pushFeedback.textContent = 'Inscricao por e-mail confirmada com sucesso.';
          setTimeout(hidePushModal, 900);
          return;
        }

        if (!supportsWebPushNotifications()) {
          if (!email) {
            pushFeedback.textContent = 'Notificacao ativada, mas este navegador nao suporta assinatura web push completa. Informe e-mail para atualizacoes.';
            return;
          }

          const ok = await subscribeEmailLead(email, 'modal-no-web-push');
          if (!ok) {
            pushFeedback.textContent = 'Nao foi possivel concluir sua inscricao por e-mail.';
            return;
          }

          localStorage.setItem(PUSH_MODAL_STATE_KEY, 'subscribed');
          localStorage.removeItem(PUSH_MODAL_DISMISSED_KEY);
          pushFeedback.textContent = 'Inscricao por e-mail confirmada com sucesso.';
          setTimeout(hidePushModal, 900);
          return;
        }

        const keyRes = await fetch('/api/push/vapid-public-key');
        const keyData = await keyRes.json();

        if (!keyRes.ok || !keyData || !keyData.publicKey) {
          pushFeedback.textContent = 'Nao foi possivel obter a configuracao de notificacao.';
          return;
        }

        const registration = await navigator.serviceWorker.register('/sw.js');
        const existing = await registration.pushManager.getSubscription();
        const subscription = existing || await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(keyData.publicKey)
        });

        const subscribeRes = await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscription,
            email,
            source: 'site-modal',
            userAgent: navigator.userAgent || ''
          })
        });

        if (!subscribeRes.ok) {
          pushFeedback.textContent = 'Falha ao concluir assinatura de notificacoes.';
          return;
        }

        localStorage.setItem(PUSH_MODAL_STATE_KEY, 'subscribed');
        localStorage.removeItem(PUSH_MODAL_DISMISSED_KEY);
        pushFeedback.textContent = 'Notificacoes ativadas com sucesso.';
        setTimeout(hidePushModal, 900);
      } catch (_) {
        pushFeedback.textContent = 'Erro ao ativar notificacoes. Tente novamente.';
      } finally {
        pushActivate.disabled = false;
        pushActivate.textContent = originalText;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFlow);
  } else {
    initFlow();
  }
})();
