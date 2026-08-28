export function header(active = ''): string {
  return `<header class="site-header">
    <a class="wordmark" href="/" data-route>Stream Reader <span>Compass</span></a>
    <nav aria-label="Main navigation">
      <a href="/?demo=1" data-route ${active === 'demo' ? 'aria-current="page"' : ''}>Demo</a>
      <a href="/#how" ${active === 'how' ? 'aria-current="page"' : ''}>How it works</a>
      <a href="/privacy" data-route ${active === 'privacy' ? 'aria-current="page"' : ''}>Privacy</a>
    </nav>
  </header>`;
}

export function footer(): string {
  return `<footer class="site-footer">
    <p>Read streaming chats without losing your place.</p>
    <nav aria-label="Footer navigation">
      <a href="/privacy" data-route>Privacy</a>
      <a href="/terms" data-route>Terms</a>
      <a href="https://hello-factory.sociobot.in" rel="noreferrer">Built by Param Factory <span class="sr-only">(opens another site)</span></a>
    </nav>
    <p class="build">v1.0.0 · 2026.08.28 · Generated hero art</p>
  </footer>`;
}
