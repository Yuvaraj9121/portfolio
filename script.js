const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-link');
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const themeToggle = document.querySelector('.theme-toggle');

const savedTheme = localStorage.getItem('portfolio-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

document.documentElement.dataset.theme = initialTheme;
themeToggle.setAttribute('aria-pressed', String(initialTheme === 'dark'));
themeToggle.setAttribute('aria-label', `Switch to ${initialTheme === 'dark' ? 'light' : 'dark'} mode`);
themeToggle.querySelector('.theme-label').textContent = initialTheme === 'dark' ? 'Light' : 'Dark';

themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem('portfolio-theme', nextTheme);
  themeToggle.setAttribute('aria-pressed', String(nextTheme === 'dark'));
  themeToggle.setAttribute('aria-label', `Switch to ${nextTheme === 'dark' ? 'light' : 'dark'} mode`);
  themeToggle.querySelector('.theme-label').textContent = nextTheme === 'dark' ? 'Light' : 'Dark';
});

document.querySelector('#year').textContent = new Date().getFullYear();

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((link) => link.classList.remove('active'));
    item.classList.add('active');
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const databaseRequest = indexedDB.open('yuvarajPortfolio', 1);
databaseRequest.onupgradeneeded = (event) => {
  const database = event.target.result;
  database.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
};

databaseRequest.onerror = () => {
  formStatus.textContent = 'The local database is unavailable. Please email me directly.';
};

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const message = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    createdAt: new Date().toISOString()
  };

  const transaction = databaseRequest.result.transaction('messages', 'readwrite');
  transaction.objectStore('messages').add(message);
  transaction.oncomplete = () => {
    formStatus.textContent = 'Thanks, your message has been saved.';
    contactForm.reset();
  };
  transaction.onerror = () => {
    formStatus.textContent = 'Something went wrong. Please try again.';
  };
});
