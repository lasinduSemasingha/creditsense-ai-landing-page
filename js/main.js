// ── NAV ACTIVE & HAMBURGER ──
document.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  const ham = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (ham) {
    ham.addEventListener('click', () => links.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!ham.contains(e.target) && !links.contains(e.target)) links.classList.remove('open');
    });
  }

  // ── FADE IN OBSERVER ──
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

  // ── CONTACT FORM ──
  const form = document.getElementById('contact-form');
  if (form) {
    const EMAILJS_SERVICE_ID = 'service_8bvvusc';
    const EMAILJS_TEMPLATE_ID = 'template_bvjsnb2';
    const EMAILJS_PUBLIC_KEY = 'CECXBHC_Lr3bDD3q-';

    function ensureEmailJSSDK() {
      return new Promise((resolve, reject) => {
        if (window.emailjs && window.emailjs.send) return resolve(window.emailjs);
        const existing = document.querySelector('script[src="https://cdn.emailjs.com/sdk/3.2.0/email.min.js"]');
        if (existing) {
          existing.addEventListener('load', () => (window.emailjs ? resolve(window.emailjs) : reject(new Error('emailjs did not initialize'))));
          existing.addEventListener('error', () => reject(new Error('failed to load emailjs script')));
          return;
        }
        const s = document.createElement('script');
        s.src = 'https://cdn.emailjs.com/sdk/3.2.0/email.min.js';
        s.onload = () => (window.emailjs ? resolve(window.emailjs) : reject(new Error('emailjs loaded but not available')));
        s.onerror = () => reject(new Error('failed to load emailjs script'));
        document.head.appendChild(s);
      });
    }

    function attachFormHandler() {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('[type=submit]');
        btn.disabled = true;
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';

        const templateParams = {
          first_name: form.first_name.value || '',
          last_name: form.last_name.value || '',
          email: form.email.value || '',
          subject: form.subject.value || '',
          message: form.message.value || ''
        };

        if (!window.emailjs || !emailjs.send) {
          console.error('EmailJS SDK not available at submit time:', window.emailjs);
          btn.textContent = originalText;
          btn.disabled = false;
          alert('Email service unavailable. Please check configuration and network.');
          return;
        }

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
          .then(() => {
            btn.textContent = 'Message Sent ✓';
            btn.style.background = '#00c9a7';
            setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; btn.disabled = false; form.reset(); }, 3000);
          })
          .catch(err => {
            console.error('EmailJS error:', err);
            btn.textContent = originalText;
            btn.disabled = false;
            alert('Sorry — failed to send message. Check console for details.');
          });
      });
    }

    ensureEmailJSSDK()
      .then(() => {
        try { if (emailjs && typeof emailjs.init === 'function') emailjs.init(EMAILJS_PUBLIC_KEY); } catch (e) { console.warn('emailjs.init error', e); }
        attachFormHandler();
      })
      .catch(err => {
        console.error('Failed to load EmailJS SDK:', err);
        // Attach handler that shows a clear error so user can still interact and see logs
        attachFormHandler();
      });
  }
});
