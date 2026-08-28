import './styles.css';
import { footer, header } from './templates';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  ${header()}
  <main id="main" class="legal not-found" tabindex="-1"><p class="eyebrow">Edition 404</p><h1>Page not found</h1><p>The address does not match a page in this edition.</p><a class="button" href="/">Return to the front page</a></main>
  ${footer()}`;

document.querySelector<HTMLAnchorElement>('.skip-link')?.addEventListener('click', (event) => {
  event.preventDefault();
  document.querySelector<HTMLElement>('#main')?.focus();
  history.replaceState({}, '', '#main');
});
