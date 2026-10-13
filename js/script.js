const skillCards = [...document.querySelectorAll('[data-skill-category]')];
const projectCards = [...document.querySelectorAll('[data-project-category]')];
const skillButtons = [...document.querySelectorAll('[data-skill-filter]')];
const projectButtons = [...document.querySelectorAll('[data-project-filter]')];
const skillCount = document.querySelector('[data-skill-count]');
const projectCount = document.querySelector('[data-project-count]');
const toast = document.querySelector('.toast');

function filterItems(items, category, attribute) {
  let visible = 0;

  items.forEach(item => {
    const show = category === 'Todas' || item.dataset[attribute] === category;
    item.hidden = !show;
    if (show) visible += 1;
  });

  return visible;
}

function activateFilter(buttons, selectedButton) {
  buttons.forEach(button => button.classList.toggle('active', button === selectedButton));
}

skillButtons.forEach(button => {
  button.addEventListener('click', () => {
    activateFilter(skillButtons, button);
    const visible = filterItems(skillCards, button.dataset.skillFilter, 'skillCategory');
    skillCount.textContent = `${visible} ${visible === 1 ? 'competência' : 'competências'}`;
  });
});

projectButtons.forEach(button => {
  button.addEventListener('click', () => {
    activateFilter(projectButtons, button);
    const visible = filterItems(projectCards, button.dataset.projectFilter, 'projectCategory');
    projectCount.textContent = `${visible} ${visible === 1 ? 'projeto' : 'projetos'}`;
  });
});

document.querySelectorAll('[data-area]').forEach(link => {
  link.addEventListener('click', () => {
    const target = skillButtons.find(button => button.dataset.skillFilter === link.dataset.area);
    if (target) target.click();
  });
});

document.querySelectorAll('.details-button').forEach(button => {
  button.addEventListener('click', () => {
    const details = button.nextElementSibling;
    const opening = details.hidden;
    details.hidden = !opening;
    button.setAttribute('aria-expanded', String(opening));
    button.firstChild.textContent = opening ? 'Fechar detalhes ' : 'Ver minha participação ';
  });
});

const copyTabs = [...document.querySelectorAll('[data-copy-tab]')];
const copyContents = [...document.querySelectorAll('[data-copy-content]')];
let currentCopy = 'resumo';

copyTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    currentCopy = tab.dataset.copyTab;
    copyTabs.forEach(item => item.classList.toggle('active', item === tab));
    copyContents.forEach(content => {
      content.hidden = content.dataset.copyContent !== currentCopy;
    });
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toast.hidden = true; }, 2200);
}

async function copyText(text) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard indisponível');
    await navigator.clipboard.writeText(text);
    showToast('Texto copiado.');
  } catch {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    document.execCommand('copy');
    field.remove();
    showToast('Texto copiado.');
  }
}

document.querySelector('[data-copy-current]').addEventListener('click', () => {
  const content = copyContents.find(item => item.dataset.copyContent === currentCopy);
  copyText(content.textContent.trim());
});

document.querySelector('[data-copy-profile]').addEventListener('click', () => {
  const profile = copyContents.find(item => item.dataset.copyContent === 'resumo');
  copyText(profile.textContent.trim());
});

const navLinks = [...document.querySelectorAll('.nav-link')];
const observedSections = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const observer = new IntersectionObserver(entries => {
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;

  navLinks.forEach(link => {
    link.classList.toggle('nav-active', link.getAttribute('href') === `#${visible.target.id}`);
  });
}, { rootMargin: '-25% 0px -60% 0px', threshold: [0, .2, .5] });

observedSections.forEach(section => observer.observe(section));
