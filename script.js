/* ============================================================
   RJ ARTS & EVENTS — Artistic Portfolio
   script.js — matches the christoshrousis.com-inspired design
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Preloader ---------- */
  window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    setTimeout(function () {
      preloader.classList.add('done');
      document.body.style.overflow = '';
      initCounters();
    }, 2800);
  });
  document.body.style.overflow = 'hidden';

  /* ---------- Custom Cursor ---------- */
  var dot = document.querySelector('.cursor-dot');
  var ring = document.querySelector('.cursor-ring');

  if (window.matchMedia('(hover: hover)').matches && dot && ring) {
    var mouseX = 0, mouseY = 0;
    var ringX = 0, ringY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    var hoverTargets = document.querySelectorAll(
      'a, button, .work-card, .service-item, .process-card, .work-filter, .contact-item, .transform-pair, input, textarea, select, .about-img'
    );
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        ring.classList.add('hover');
      });
      el.addEventListener('mouseleave', function () {
        ring.classList.remove('hover');
      });
    });

    // Cursor color zones (work = accent2/blue, contact = green)
    var zoneElements = document.querySelectorAll('[data-cursor-zone]');
    var zoneObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var zone = entry.target.getAttribute('data-cursor-zone');
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          document.body.classList.add('zone-' + zone);
        } else {
          document.body.classList.remove('zone-' + zone);
        }
      });
    }, { threshold: [0, 0.3, 0.6, 1] });

    zoneElements.forEach(function (el) {
      zoneObserver.observe(el);
    });
  }

  /* ---------- Navigation Scroll Effect ---------- */
  var nav = document.getElementById('nav');
  var sections = document.querySelectorAll('section[id]');
  var navLinksAll = document.querySelectorAll('.nav-links a');

  function updateNav() {
    var scrollY = window.scrollY;

    if (scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active section highlighting
    sections.forEach(function (section) {
      var top = section.offsetTop - 120;
      var bottom = top + section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollY >= top && scrollY < bottom) {
        navLinksAll.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ---------- Mobile Navigation ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- Scroll Reveal ---------- */
  var revealElements = document.querySelectorAll('.reveal');

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------- Counter Animation ---------- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1800;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current + '+';
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + '+';
      }
    }
    requestAnimationFrame(step);
  }

  /* ---------- Work Filter (Two-Level) ---------- */
  var workFiltersRow = document.getElementById('workFilters');
  var workSubfiltersRow = document.getElementById('workSubfilters');
  var filterBtns = workFiltersRow.querySelectorAll('.work-filter');
  var workCards = document.querySelectorAll('.work-card');

  var subCategories = {
    film: [
      { label: 'All Film & OTT', value: 'all' },
      { label: 'Netflix', value: 'netflix' },
      { label: 'ZEE5', value: 'zee5' },
      { label: 'Bollywood', value: 'bollywood' }
    ],
    brand: [
      { label: 'All Brands', value: 'all' },
      { label: 'Dell', value: 'dell' },
      { label: 'Teachmint', value: 'teachmint' },
      { label: "Pond's", value: 'ponds' },
      { label: 'Zandu', value: 'zandu' },
      { label: 'Tata AIG', value: 'tataaig' },
      { label: 'Man Matters', value: 'manmatters' },
      { label: '#BuiltThatWay', value: 'builtthatway' }
    ]
  };

  function filterCards(category, subcategory) {
    workCards.forEach(function (card) {
      var cat = card.getAttribute('data-category');
      var sub = card.getAttribute('data-subcategory') || '';
      var show = false;

      if (category === 'all') {
        show = true;
      } else if (subcategory && subcategory !== 'all') {
        show = cat === category && sub === subcategory;
      } else {
        show = cat === category;
      }

      if (show) {
        card.style.display = '';
        card.style.animation = 'fadeReveal .5s var(--ease-out) forwards';
      } else {
        card.style.display = 'none';
      }
    });
  }

  function showSubfilters(category) {
    var subs = subCategories[category];
    if (!subs) return;

    workFiltersRow.style.display = 'none';
    workSubfiltersRow.style.display = '';
    workSubfiltersRow.innerHTML = '';

    // Back button
    var backBtn = document.createElement('button');
    backBtn.className = 'work-filter work-back';
    backBtn.innerHTML = '\u2190 All';
    backBtn.addEventListener('click', function () {
      workSubfiltersRow.style.display = 'none';
      workFiltersRow.style.display = '';
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      filterBtns[0].classList.add('active');
      filterCards('all');
    });
    workSubfiltersRow.appendChild(backBtn);

    // Sub-filter buttons
    subs.forEach(function (sub, i) {
      var btn = document.createElement('button');
      btn.className = 'work-filter' + (i === 0 ? ' active' : '');
      btn.textContent = sub.label;
      btn.setAttribute('data-subfilter', sub.value);
      btn.addEventListener('click', function () {
        workSubfiltersRow.querySelectorAll('.work-filter').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        filterCards(category, sub.value);
      });
      workSubfiltersRow.appendChild(btn);
    });
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');

      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      if (subCategories[filter]) {
        // Has sub-categories — show drill-down
        filterCards(filter);
        showSubfilters(filter);
      } else {
        // No sub-categories — direct filter
        workSubfiltersRow.style.display = 'none';
        workFiltersRow.style.display = '';
        filterCards(filter);
      }
    });
  });

  /* ---------- Gallery Filter ---------- */
  var gFilterBtns = document.querySelectorAll('.gallery-filter');
  var galleryItems = document.querySelectorAll('.gallery-item');

  gFilterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-gfilter');

      gFilterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      galleryItems.forEach(function (item) {
        var category = item.getAttribute('data-gcategory');
        if (filter === 'all' || category === filter) {
          item.style.display = '';
          item.style.animation = 'fadeReveal .5s var(--ease-out) forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ---------- Smooth Scroll for Anchor Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var offset = 72;
        var targetPos = targetEl.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  /* ---------- Back to Top ---------- */
  var btt = document.getElementById('btt');
  if (btt) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) {
        btt.classList.add('show');
      } else {
        btt.classList.remove('show');
      }
    }, { passive: true });

    btt.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Hero Parallax ---------- */
  var heroContent = document.querySelector('.hero-content');
  var heroGrid = document.querySelector('.hero-grid');

  // After intro animations complete, remove them so JS can control opacity
  var heroAnimEls = document.querySelectorAll('.hero-label, .hero-bio, .hero-ctas');
  setTimeout(function () {
    heroAnimEls.forEach(function (el) {
      el.style.animation = 'none';
      el.style.opacity = '1';
    });
  }, 4000);

  if (heroContent && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        // Gradual fade — stays visible much longer while scrolling
        var fade = Math.max(0, 1 - (scrolled / (window.innerHeight * 1.4)));
        heroContent.style.opacity = fade;
        heroContent.style.transform = 'translateY(' + (scrolled * 0.2) + 'px)';
        if (heroGrid) {
          heroGrid.style.transform = 'translateY(' + (scrolled * 0.1) + 'px)';
        }
      }
    }, { passive: true });
  }

  /* ---------- Tilt Effect on Work Cards (Desktop Only) ---------- */
  if (window.matchMedia('(hover: hover)').matches) {
    var cards = document.querySelectorAll('.work-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = (y - centerY) / centerY * -2;
        var rotateY = (x - centerX) / centerX * 2;
        card.style.transform =
          'translateY(-6px) perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ---------- Magnetic Effect on Buttons ---------- */
  if (window.matchMedia('(hover: hover)').matches) {
    var magneticBtns = document.querySelectorAll('.btn, .form-submit');
    magneticBtns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15 - 2) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCounter = document.getElementById('lbCounter');
  var lbCaption = document.getElementById('lbCaption');
  var lbIndex = 0;

  function getVisibleGalleryImages() {
    return Array.from(document.querySelectorAll('.gallery-item')).filter(function (item) {
      return item.style.display !== 'none';
    }).map(function (item) {
      return item.querySelector('img');
    });
  }

  function openLightbox(clickedImg) {
    var images = getVisibleGalleryImages();
    lbIndex = images.indexOf(clickedImg);
    if (lbIndex === -1) lbIndex = 0;
    showLightboxImage(images);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function showLightboxImage(images) {
    if (!images) images = getVisibleGalleryImages();
    var img = images[lbIndex];
    lbImg.classList.add('lb-loading');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = img.alt || '';
    lbCounter.textContent = (lbIndex + 1) + ' / ' + images.length;
    lbImg.onload = function () { lbImg.classList.remove('lb-loading'); };
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextLbImage() {
    var images = getVisibleGalleryImages();
    lbIndex = (lbIndex + 1) % images.length;
    showLightboxImage(images);
  }

  function prevLbImage() {
    var images = getVisibleGalleryImages();
    lbIndex = (lbIndex - 1 + images.length) % images.length;
    showLightboxImage(images);
  }

  // Click on gallery images to open lightbox
  document.querySelectorAll('.gallery-item img').forEach(function (img) {
    img.addEventListener('click', function () {
      openLightbox(this);
    });
  });

  if (lightbox) {
    // Close on backdrop click
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Buttons
    document.querySelector('.lb-close').addEventListener('click', closeLightbox);
    document.querySelector('.lb-prev').addEventListener('click', function (e) {
      e.stopPropagation();
      prevLbImage();
    });
    document.querySelector('.lb-next').addEventListener('click', function (e) {
      e.stopPropagation();
      nextLbImage();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLbImage();
      if (e.key === 'ArrowLeft') prevLbImage();
    });

    // Touch swipe support
    var touchStartX = 0;
    var touchEndX = 0;
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextLbImage();
        else prevLbImage();
      }
    }, { passive: true });
  }

  /* ---------- Legal Modals ---------- */
  document.querySelectorAll('.legal-modal').forEach(function (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.classList.remove('active');
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.legal-modal.active').forEach(function (m) {
        m.classList.remove('active');
      });
    }
  });

  // Add gallery images to cursor hover targets
  document.querySelectorAll('.gallery-item img').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      if (ring) ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', function () {
      if (ring) ring.classList.remove('hover');
    });
  });

  /* ---------- WhatsApp Form Submit ---------- */
  window.sendToWhatsApp = function (e) {
    e.preventDefault();

    var name = document.getElementById('c_name').value.trim();
    var email = document.getElementById('c_email').value.trim();
    var phone = document.getElementById('c_phone').value.trim();
    var type = document.getElementById('c_type').value;
    var msg = document.getElementById('c_msg').value.trim();

    if (!name || !msg) return false;

    // Build the WhatsApp message
    var lines = [];
    lines.push('*New Enquiry from rjartsandevents.in*');
    lines.push('');
    lines.push('*Name:* ' + name);
    if (email) lines.push('*Email:* ' + email);
    if (phone) lines.push('*Phone:* ' + phone);
    if (type) lines.push('*Project Type:* ' + type);
    lines.push('');
    lines.push('*Project Details:*');
    lines.push(msg);

    var text = lines.join('\n');
    var encoded = encodeURIComponent(text);
    var waUrl = 'https://wa.me/919920713327?text=' + encoded;

    // Visual feedback on button
    var btn = document.getElementById('formBtn');
    btn.textContent = 'Opening WhatsApp...';
    btn.classList.add('sent');

    // Open WhatsApp
    window.open(waUrl, '_blank');

    // Reset form after short delay
    setTimeout(function () {
      document.getElementById('contactForm').reset();
      btn.textContent = 'Send via WhatsApp \u2192';
      btn.classList.remove('sent');
    }, 3000);

    return false;
  };

})();
