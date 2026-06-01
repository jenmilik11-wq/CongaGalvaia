/*
================================================================================
  CONGA & GALVAIA — GRUPO INMOBILIARIO
  Archivo: galvaia-scripts.js

  ÍNDICE:
  1. Sistema de navegación — mostrar/ocultar páginas
  2. Navbar — hamburger mobile
  3. Hero Slider — página Inicio
  4. Galería — páginas de proyectos
  5. FAQ Acordeón — página Inicio
  6. Formulario — validación básica
  7. Inicialización
================================================================================
*/


/* ============================================================
   1. SISTEMA DE NAVEGACIÓN
   Cada página es un <section class="page" id="page-...">
   Para navegar: llamar showPage('nombre-pagina')
   
   Páginas disponibles:
   - inicio
   - nosotros
   - contacto
   - armonika
   - gemalta
   - cataleya
============================================================ */

var paginaActual = 'inicio';

function showPage(nombre) {
  /* Ocultar todas las páginas */
  document.querySelectorAll('.page').forEach(function(p) {
    p.classList.remove('page-active');
  });

  /* Mostrar la página solicitada */
  var pagina = document.getElementById('page-' + nombre);
  if (pagina) {
    pagina.classList.add('page-active');
  }

  /* Actualizar link activo en el nav */
  document.querySelectorAll('.nav-menu > a').forEach(function(a) {
    a.classList.remove('activo');
  });
  var linkActivo = document.querySelector('[data-page="' + nombre + '"]');
  if (linkActivo) linkActivo.classList.add('activo');

  /* Cerrar menú mobile si está abierto */
  cerrarMenu();

  /* Scroll al inicio */
  window.scrollTo({ top: 0, behavior: 'smooth' });

  /* Guardar página actual */
  paginaActual = nombre;
  localStorage.setItem('cgPaginaActual', nombre);

  /* Reiniciar galería al entrar a un proyecto */
  if (['armonika','gemalta','cataleya'].includes(nombre)) {
    galIdx = 0;
    galActualizar();
  }
}


/* ============================================================
   2. NAVBAR — Hamburger mobile
============================================================ */

function toggleNav() {
  var menu = document.getElementById('navMenu');
  var ham  = document.getElementById('hamburger');
  if (!menu || !ham) return;
  var isOpen = menu.classList.toggle('open');
  ham.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
  /* Cerrar submenú al abrir/cerrar el panel */
  cerrarSubMenu();
}

function cerrarMenu() {
  var menu = document.getElementById('navMenu');
  var ham  = document.getElementById('hamburger');
  if (menu) menu.classList.remove('open');
  if (ham)  ham.classList.remove('open');
  document.body.style.overflow = '';
  cerrarSubMenu();
}

/* Toggle submenú Proyectos en mobile */
function toggleSubMenu(e) {
  if (window.innerWidth > 960) return; /* En desktop lo maneja CSS hover */
  e.stopPropagation();
  var drop = document.getElementById('navDropdown');
  if (!drop) return;
  drop.classList.toggle('mob-open');
}

function cerrarSubMenu() {
  var drop = document.getElementById('navDropdown');
  if (drop) drop.classList.remove('mob-open');
}

function cerrarDropdown() {
  var drop = document.getElementById('navDropdown');
  if (!drop) return;
  drop.blur();
  var btn = drop.querySelector('.drop-btn');
  if (btn) btn.blur();
  drop.classList.add('drop-closed');
  setTimeout(function() { drop.classList.remove('drop-closed'); }, 300);
}

/* Cerrar dropdown desktop al hacer clic fuera */
document.addEventListener('click', function(e) {
  if (window.innerWidth > 960) {
    var drop = document.getElementById('navDropdown');
    if (drop && !drop.contains(e.target)) {
      drop.classList.add('drop-closed');
      setTimeout(function() { drop.classList.remove('drop-closed'); }, 300);
    }
  }
});

/* Cerrar panel mobile al hacer clic en el overlay (fuera del panel) */
document.addEventListener('click', function(e) {
  if (window.innerWidth > 960) return;
  var menu = document.getElementById('navMenu');
  var ham  = document.getElementById('hamburger');
  if (menu && menu.classList.contains('open') && !menu.contains(e.target) && !ham.contains(e.target)) {
    cerrarMenu();
  }
});


/* ============================================================
   3. HERO SLIDER — Página Inicio
   Autoplay cada 6000ms (6 segundos)
   PARA CAMBIAR EL TIEMPO: modifica el valor 6000
============================================================ */

var heroIdx   = 0;
var heroTimer = null;

function heroInit() {
  var slides = document.querySelectorAll('#page-inicio .hero-slide');
  if (!slides.length) return;
  heroTimer = setInterval(function() { heroGo(heroIdx + 1); }, 6000);
}

function heroGo(n) {
  var slides   = document.querySelectorAll('#page-inicio .hero-slide');
  var contents = document.querySelectorAll('#page-inicio .hero-slide-content');
  var dots     = document.querySelectorAll('#page-inicio .hero-dot');
  if (!slides.length) return;

  if (slides[heroIdx])   slides[heroIdx].classList.remove('active');
  if (contents[heroIdx]) contents[heroIdx].classList.remove('active');
  if (dots[heroIdx])     dots[heroIdx].classList.remove('active');

  heroIdx = (n + slides.length) % slides.length;

  if (slides[heroIdx])   slides[heroIdx].classList.add('active');
  if (contents[heroIdx]) contents[heroIdx].classList.add('active');
  if (dots[heroIdx])     dots[heroIdx].classList.add('active');

  clearInterval(heroTimer);
  heroTimer = setInterval(function() { heroGo(heroIdx + 1); }, 6000);
}


/* ============================================================
   4. GALERÍA — Páginas de proyectos
   PARA AGREGAR IMÁGENES:
   - Agrega <img> en .galeria-main con class="active" en la primera
   - Agrega <div class="gal-thumb"> correspondiente
============================================================ */

var galIdx = 0;

function galTo(n) {
  var contenedor = document.querySelector('.page-active .galeria-main, .page-active .galeria-carrusel');
  if (!contenedor) return;
  var imgs   = contenedor.querySelectorAll('img');
  var thumbs = document.querySelectorAll('.page-active .gal-thumb');
  if (!imgs.length) return;

  if (imgs[galIdx])   imgs[galIdx].classList.remove('active');
  if (thumbs[galIdx]) thumbs[galIdx].classList.remove('active');

  galIdx = (n + imgs.length) % imgs.length;

  if (imgs[galIdx])   imgs[galIdx].classList.add('active');
  if (thumbs[galIdx]) thumbs[galIdx].classList.add('active');
}

function galMove(d) { galTo(galIdx + d); }

function galActualizar() {
  /* Reiniciar galería al cambiar de proyecto */
  var imgs   = document.querySelectorAll('.page-active .galeria-main img, .page-active .galeria-carrusel img');
  var thumbs = document.querySelectorAll('.page-active .gal-thumb');
  imgs.forEach(function(i)   { i.classList.remove('active'); });
  thumbs.forEach(function(t) { t.classList.remove('active'); });
  if (imgs[0])   imgs[0].classList.add('active');
  if (thumbs[0]) thumbs[0].classList.add('active');
  galIdx = 0;
}


/* ============================================================
   5. FAQ ACORDEÓN — Página Inicio
   Solo un ítem abierto a la vez
============================================================ */

function toggleFaq(btn) {
  var item   = btn.closest('.faq-item');
  if (!item) return;
  var abierto = item.classList.contains('open');
  /* Cerrar todos */
  document.querySelectorAll('.faq-item').forEach(function(el) {
    el.classList.remove('open');
  });
  /* Abrir el clickeado si estaba cerrado */
  if (!abierto) item.classList.add('open');
}


/* ============================================================
   6. FORMULARIO — Validación básica
   PARA CONECTAR CON UN BACKEND:
   - Modifica la sección "AQUÍ VA TU INTEGRACIÓN"
   - Opciones: EmailJS, Formspree, WP REST API, WhatsApp
============================================================ */

function enviarFormulario(e) {
  e.preventDefault();
  var form = e.target;

  /* Limpiar errores previos */
  form.querySelectorAll('.form-error').forEach(function(el) { el.remove(); });
  form.querySelectorAll('input, select, textarea').forEach(function(el) {
    el.style.borderColor = '';
  });

  var errores  = false;
  var nombre   = form.querySelector('[name="nombre"]');
  var celular  = form.querySelector('[name="celular"]');
  var email    = form.querySelector('[name="email"]');
  var privado  = form.querySelector('[name="privacidad"]');

  if (nombre  && nombre.value.trim() === '')     { marcarError(nombre,  'Ingresa tu nombre');           errores = true; }
  if (celular && celular.value.trim() === '')    { marcarError(celular, 'Ingresa tu celular');          errores = true; }
  if (email   && !email.value.includes('@'))     { marcarError(email,   'Ingresa un correo válido');    errores = true; }
  if (privado && !privado.checked)               { marcarError(privado, 'Acepta las políticas');        errores = true; }

  if (!errores) {
    /* ── AQUÍ VA TU INTEGRACIÓN ──────────────────────────────
       Opción A — WhatsApp:
       var msg = 'Nombre: ' + nombre.value + ' | Cel: ' + celular.value;
       window.open('https://wa.me/51976000000?text=' + encodeURIComponent(msg));

       Opción B — Formspree:
       fetch('https://formspree.io/f/TU_ID', { method:'POST', body: new FormData(form) });

       Opción C — EmailJS:
       emailjs.sendForm('SERVICE_ID','TEMPLATE_ID', form);
    ────────────────────────────────────────────────────────── */
    var btn = form.querySelector('.btn-submit');
    if (btn) {
      btn.textContent  = '¡Enviado! Te contactaremos pronto.';
      btn.style.background = '#22c55e';
      btn.disabled = true;
      /* Restaurar botón después de 4 segundos */
      setTimeout(function() {
        btn.textContent  = 'Solicitar Información';
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 4000);
    }
  }
}

function marcarError(campo, msg) {
  var err = document.createElement('span');
  err.className = 'form-error';
  err.style.cssText = 'display:block;color:#ef4444;font-size:11px;margin-top:4px;font-weight:600;';
  err.textContent   = msg;
  campo.parentNode.appendChild(err);
  campo.style.borderColor = '#ef4444';
}


/* ============================================================
   7. INICIALIZACIÓN — Se ejecuta cuando carga la página
============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  /* Restaurar la última página visitada, o inicio por defecto */
  var paginaGuardada = localStorage.getItem('cgPaginaActual') || 'inicio';
  showPage(paginaGuardada);

  /* Iniciar hero slider */
  heroInit();

  /* Iniciar carruseles gal3 */
  gal3Init('armonika');
  gal3Init('gemalta');
  gal3Init('cataleya');
});


/* ============================================================
   8. GALERÍA 3 EN PANTALLA — Carrusel infinito con autoplay
   Clona slides al inicio/final para efecto continuo sin volver al inicio
============================================================ */

var gal3State = {};

function gal3Init(id) {
  var track = document.getElementById('gal3-' + id);
  if (!track || gal3State[id]) return;

  var items = Array.from(track.querySelectorAll('.gal3-item'));
  if (!items.length) return;

  /* Clonar todos los slides al inicio y al final */
  items.forEach(function(item) {
    var clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
  items.forEach(function(item) {
    var clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.insertBefore(clone, track.firstChild);
  });

  var total = items.length;
  gal3State[id] = { idx: total, total: total, timer: null };

  /* Sin animación, saltar al bloque del medio */
  track.style.transition = 'none';
  gal3Apply(id);

  /* Autoplay cada 3 segundos */
  gal3State[id].timer = setInterval(function() { gal3Move(id, 1); }, 3000);
}

function gal3Visible(id) {
  return window.innerWidth <= 640 ? 1 : window.innerWidth <= 960 ? 2 : 3;
}

function gal3Apply(id) {
  var track = document.getElementById('gal3-' + id);
  if (!track) return;
  var items = track.querySelectorAll('.gal3-item');
  if (!items.length) return;
  var gap   = window.innerWidth <= 640 ? 0 : 16;
  var itemW = items[0].offsetWidth + gap;
  track.style.transform = 'translateX(-' + (gal3State[id].idx * itemW) + 'px)';
}

function gal3Move(id, dir) {
  var track = document.getElementById('gal3-' + id);
  if (!track || !gal3State[id]) return;

  var s     = gal3State[id];
  var items = track.querySelectorAll('.gal3-item');
  var total = s.total;

  s.idx += dir;
  track.style.transition = 'transform .42s cubic-bezier(.4,0,.2,1)';
  gal3Apply(id);

  /* Al llegar al clon del final, saltar silenciosamente al inicio real */
  track.addEventListener('transitionend', function onEnd() {
    track.removeEventListener('transitionend', onEnd);
    if (s.idx >= total * 2) {
      s.idx = total;
      track.style.transition = 'none';
      gal3Apply(id);
    }
    if (s.idx <= 0) {
      s.idx = total;
      track.style.transition = 'none';
      gal3Apply(id);
    }
  });

  /* Reiniciar timer al hacer clic manual */
  clearInterval(s.timer);
  s.timer = setInterval(function() { gal3Move(id, 1); }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
  gal3Init('armonika');
  gal3Init('gemalta');
  gal3Init('cataleya');
});


/* ============================================================
   9. CONTADOR ANIMADO — Sección de estadísticas
   Se activa cuando la sección entra en el viewport (IntersectionObserver)
============================================================ */

function animarContadores() {
  var counters = document.querySelectorAll('.counter');
  counters.forEach(function(el) {
    var target    = parseInt(el.getAttribute('data-target'));
    var suffix    = el.getAttribute('data-suffix') || '';
    var separator = el.getAttribute('data-separator') || '';
    var duration  = 1800; /* ms */
    var start     = 0;
    var startTime = null;

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var current  = Math.floor(easeOut(progress) * target);
      var display  = separator ? current.toLocaleString('en-US') : current;
      el.textContent = display + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = (separator ? target.toLocaleString('en-US') : target) + suffix;
    }
    requestAnimationFrame(step);
  });
}

/* Disparar cuando la sección .stats entra en pantalla */
document.addEventListener('DOMContentLoaded', function() {
  var statsEl = document.querySelector('.stats');
  if (!statsEl) return;
  var fired = false;
  var observer = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      animarContadores();
    }
  }, { threshold: 0.4 });
  observer.observe(statsEl);
});


/* ============================================================
   10. GALERÍA CLIENTES — Loop infinito por clonación
   Clona los items para que el scroll sea continuo sin saltos
============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  ['clientesTrack1', 'clientesTrack2', 'galeriaEmpresaTrack'].forEach(function(id) {
    var track = document.getElementById(id);
    if (!track) return;
    var items = Array.from(track.children);
    items.forEach(function(item) { track.appendChild(item.cloneNode(true)); });

    track.querySelectorAll('.cli-img').forEach(function(img) {
      img.addEventListener('mouseenter', function() { track.style.animationPlayState = 'paused'; });
      img.addEventListener('mouseleave', function() { track.style.animationPlayState = 'running'; });
    });
  });
});


/* ============================================================
   11. SLIDER GALERÍA EMPRESA — autoplay + flechas + dots
============================================================ */
var empIdx   = 0;
var empTimer = null;

function empInit() {
  var slider = document.getElementById('empresaSlider');
  if (!slider) return;
  var slides = slider.querySelectorAll('.emp-slide');
  var dotsEl = document.getElementById('empDots');

  /* Crear dots */
  slides.forEach(function(_, i) {
    var d = document.createElement('div');
    d.className = 'emp-dot' + (i === 0 ? ' active' : '');
    d.onclick = function() { empGo(i); };
    dotsEl.appendChild(d);
  });

  /* Autoplay cada 4s */
  empTimer = setInterval(function() { empGo(empIdx + 1); }, 4000);

  /* Pausar al hover */
  slider.addEventListener('mouseenter', function() { clearInterval(empTimer); });
  slider.addEventListener('mouseleave', function() {
    empTimer = setInterval(function() { empGo(empIdx + 1); }, 4000);
  });
}

function empGo(n) {
  var slider = document.getElementById('empresaSlider');
  if (!slider) return;
  var slides = slider.querySelectorAll('.emp-slide');
  var dots   = document.querySelectorAll('.emp-dot');
  if (!slides.length) return;

  slides[empIdx].classList.remove('active');
  if (dots[empIdx]) dots[empIdx].classList.remove('active');

  empIdx = (n + slides.length) % slides.length;

  slides[empIdx].classList.add('active');
  if (dots[empIdx]) dots[empIdx].classList.add('active');
}

function empMove(d) {
  clearInterval(empTimer);
  empGo(empIdx + d);
  empTimer = setInterval(function() { empGo(empIdx + 1); }, 4000);
}

document.addEventListener('DOMContentLoaded', function() {
  empInit();
});
