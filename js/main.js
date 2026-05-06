// ── NAV ACTIVE & HAMBURGER ──
function onReady(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

onReady(() => {

  // ── ACTIVE NAV LINK ──
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // ── HAMBURGER MENU ──
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
  if (!form) return;

  const EMAILJS_SERVICE_ID  = 'service_a0rlfke';
  const EMAILJS_TEMPLATE_ID = 'template_817ox0o';
  const EMAILJS_PUBLIC_KEY  = 'CECXBHC_Lr3bDD3q-';

function loadEmailJS() {
  return new Promise((resolve, reject) => {
    if (window.emailjs) return resolve();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'; // ← updated
    s.onload  = () => resolve();
    s.onerror = () => reject(new Error('Failed to load EmailJS SDK'));
    document.head.appendChild(s);
  });
}

  // Show an inline status message under the button
  function showStatus(msg, color) {
    let el = document.getElementById('form-status');
    if (!el) {
      el = document.createElement('p');
      el.id = 'form-status';
      el.style.cssText = 'margin-top:0.75rem;font-size:0.85rem;text-align:center;';
      form.appendChild(el);
    }
    el.style.color = color;
    el.textContent = msg;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const btn = form.querySelector('[type=submit]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';
    showStatus('', '');

    try {
      await loadEmailJS();
      emailjs.init(EMAILJS_PUBLIC_KEY);

      const result = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        first_name: form.first_name.value.trim(),
        last_name:  form.last_name.value.trim(),
        email:      form.email.value.trim(),
        subject:    form.subject.value,
        message:    form.message.value.trim(),
      });

      console.log('EmailJS success:', result);
      btn.textContent = 'Message Sent ✓';
      btn.style.background = '#00c9a7';
      showStatus('Your message was sent successfully!', '#00c9a7');

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
        showStatus('', '');
      }, 3000);

    } catch (err) {
      // Log full error object so we can see status, text, etc.
      console.error('EmailJS Send failed — full error:', err);
      console.error('Status:', err.status);
      console.error('Text:', err.text);

      const detail = err.text || err.message || JSON.stringify(err);
      showStatus(`Failed: ${detail}`, '#ff5555');

      btn.textContent = originalText;
      btn.disabled = false;
    }
  });

});