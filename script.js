const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-link');
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const themeToggle = document.querySelector('.theme-toggle');

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('portfolio-theme');
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

document.documentElement.dataset.theme = initialTheme;

if (themeToggle) {
  themeToggle.setAttribute('aria-pressed', String(initialTheme === 'dark'));
  themeToggle.setAttribute(
    'aria-label',
    `Switch to ${initialTheme === 'dark' ? 'light' : 'dark'} mode`
  );

  const themeLabel = themeToggle.querySelector('.theme-label');
  if (themeLabel) {
    themeLabel.textContent = initialTheme === 'dark' ? 'Light' : 'Dark';
  }

  themeToggle.addEventListener('click', () => {
    const nextTheme =
      document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';

    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('portfolio-theme', nextTheme);
    themeToggle.setAttribute('aria-pressed', String(nextTheme === 'dark'));
    themeToggle.setAttribute(
      'aria-label',
      `Switch to ${nextTheme === 'dark' ? 'light' : 'dark'} mode`
    );

    if (themeLabel) {
      themeLabel.textContent = nextTheme === 'dark' ? 'Light' : 'Dark';
    }
  });
}

const year = document.querySelector('#year');
if (year) {
  year.textContent = new Date().getFullYear();
}

function setMenu(open) {
  if (!navLinks || !menuToggle) return;
  navLinks.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    setMenu(!navLinks.classList.contains('open'));
  });

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      navItems.forEach((link) => link.classList.remove('active'));
      item.classList.add('active');
      setMenu(false);
    });
  });
}

// Contact form is intentionally local-only. It never sends data to a server.
let database = null;

const databaseRequest = indexedDB.open('yuvarajPortfolio', 1);

databaseRequest.onupgradeneeded = (event) => {
  const db = event.target.result;
  if (!db.objectStoreNames.contains('messages')) {
    db.createObjectStore('messages', {
      keyPath: 'id',
      autoIncrement: true
    });
  }
};

databaseRequest.onsuccess = (event) => {
  database = event.target.result;
};

databaseRequest.onerror = () => {
  if (formStatus) {
    formStatus.textContent =
      'Local storage is unavailable. Your message was not saved. Please email me directly.';
  }
};

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      formStatus.textContent = 'Please correct the highlighted fields.';
      return;
    }

    if (!database) {
      formStatus.textContent =
        'Local storage is unavailable. Your message was not saved. Please email me directly.';
      return;
    }

    const sendButton = contactForm.querySelector('button[type="submit"]');
    if (sendButton && sendButton.disabled) return;

    const formData = new FormData(contactForm);
    const message = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      createdAt: new Date().toISOString()
    };

    if (!message.name || !message.email || !message.message) {
      formStatus.textContent = 'Please complete all fields.';
      return;
    }

    if (message.name.length > 120 || message.message.length > 5000) {
      formStatus.textContent =
        'Please keep your name under 120 characters and message under 5000 characters.';
      return;
    }

    if (sendButton) {
      sendButton.disabled = true;
      sendButton.setAttribute('aria-busy', 'true');
    }

    formStatus.textContent = 'Saving your note locally…';

    let transaction;
    try {
      transaction = database.transaction('messages', 'readwrite');
      transaction.objectStore('messages').add(message);

      transaction.oncomplete = () => {
        formStatus.textContent =
          'Your note was saved locally in this browser. It was not sent to me.';
        contactForm.reset();

        if (sendButton) {
          sendButton.disabled = false;
          sendButton.removeAttribute('aria-busy');
        }
      };

      transaction.onerror = () => {
        formStatus.textContent =
          'The note could not be saved. Please try again or email me directly.';

        if (sendButton) {
          sendButton.disabled = false;
          sendButton.removeAttribute('aria-busy');
        }
      };
    } catch (error) {
      formStatus.textContent =
        'Local storage is unavailable. Your message was not saved. Please email me directly.';

      if (sendButton) {
        sendButton.disabled = false;
        sendButton.removeAttribute('aria-busy');
      }
    }
  });
}
