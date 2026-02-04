/**
 * MedFinder Landing Page - JavaScript
 * Handles smooth scrolling, form submission, and mobile menu
 */

// ========================================
// EmailJS Configuration
// ========================================
const EMAILJS_PUBLIC_KEY = '3-JcXoFCiTmeFsE7W';  // Replace with your public key
const EMAILJS_SERVICE_ID = 'service_arubh7q';  // Replace with your service ID
const EMAILJS_TEMPLATE_ID = 'template_c57yzfp'; // Replace with your template ID

document.addEventListener('DOMContentLoaded', function() {
  // Initialize EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
  // ========================================
  // Mobile Menu Toggle
  // ========================================
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('mobile-open');
      mobileMenuBtn.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navLinks.classList.remove('mobile-open');
        mobileMenuBtn.classList.remove('active');
      });
    });
  }

  // ========================================
  // Smooth Scrolling for Anchor Links
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // Form Submission Handler
  // ========================================
  const signupForm = document.getElementById('signup-form');

  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const formData = new FormData(signupForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        role: formData.get('role'),
        city: formData.get('city'),
        message: formData.get('message')
      };

      // Validate required fields
      if (!data.name || !data.email || !data.role) {
        showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        showNotification('Veuillez entrer une adresse email valide.', 'error');
        return;
      }

      // Simulate form submission (replace with actual API call)
      const submitBtn = signupForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.disabled = true;

      // Send email via EmailJS
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: data.name,
        from_email: data.email,
        role: data.role === 'doctor' ? 'Médecin' : data.role === 'pharmacy' ? 'Pharmacien / Parapharmacien' : 'Autre professionnel de santé',
        city: data.city || 'Non spécifié',
        message: data.message || 'Aucun message',
        to_email: data.email
      })
      .then(function(response) {
        console.log('EmailJS success:', response);
        showNotification('Merci pour votre inscription ! Nous vous contacterons bientôt.', 'success');
        signupForm.reset();
      })
      .catch(function(error) {
        console.error('EmailJS error:', error);
        showNotification('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.', 'error');
      })
      .finally(function() {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  }

  // ========================================
  // Notification System
  // ========================================
  function showNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
      existing.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="notification-close" aria-label="Fermer">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      max-width: 400px;
      padding: 16px 20px;
      background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      font-size: 14px;
    `;

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
        .notification-close {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          opacity: 0.8;
        }
        .notification-close:hover {
          opacity: 1;
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Close button handler
    notification.querySelector('.notification-close').addEventListener('click', function() {
      removeNotification(notification);
    });

    // Auto-remove after 5 seconds
    setTimeout(function() {
      removeNotification(notification);
    }, 5000);
  }

  function removeNotification(notification) {
    if (notification && notification.parentNode) {
      notification.style.animation = 'slideOut 0.3s ease-out forwards';
      setTimeout(function() {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }

  // ========================================
  // Navbar Scroll Effect
  // ========================================
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
    } else {
      navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
  });

  // ========================================
  // Intersection Observer for Animations
  // ========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll('.problem-card, .feature-card, .step, .trust-point').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // Add animate-in styles
  const animateStyle = document.createElement('style');
  animateStyle.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(animateStyle);

  // ========================================
  // Mobile Menu Styles (Dynamic)
  // ========================================
  const mobileMenuStyle = document.createElement('style');
  mobileMenuStyle.textContent = `
    @media (max-width: 768px) {
      .nav-links {
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        background-color: white;
        flex-direction: column;
        padding: 20px;
        gap: 16px;
        border-bottom: 1px solid #e5e7eb;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: transform 0.3s ease, opacity 0.3s ease, visibility 0.3s;
      }
      
      .nav-links.mobile-open {
        display: flex;
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }
      
      .nav-links .btn {
        width: 100%;
        justify-content: center;
      }
      
      .mobile-menu-btn.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }
      
      .mobile-menu-btn.active span:nth-child(2) {
        opacity: 0;
      }
      
      .mobile-menu-btn.active span:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
      }
    }
  `;
  document.head.appendChild(mobileMenuStyle);
});
