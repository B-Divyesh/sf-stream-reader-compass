import './styles.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <header class="site-header"><a class="wordmark" href="/">Stream Reader <span>Compass</span></a><nav aria-label="Main navigation"><a href="/demo">Demo</a><a href="/privacy">Privacy</a></nav></header>
  <main id="main" class="legal not-found"><p class="eyebrow">Edition 404</p><h1>This page is off the record</h1><p>The address does not match a page in this edition.</p><a class="button" href="/">Return to the front page</a></main>
  <footer class="site-footer"><p>Read streaming chats without losing your place.</p><nav aria-label="Footer navigation"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="https://hello-factory.sociobot.in" rel="noreferrer">Built by Param Factory <span class="sr-only">(opens another site)</span></a></nav><p class="build">v1.0.0 · 2026.08.28</p></footer>`;
