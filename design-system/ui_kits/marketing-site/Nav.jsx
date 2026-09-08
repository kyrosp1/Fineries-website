// Nav.jsx — Fineries sticky top navigation
function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40 || document.querySelector('.site')?.scrollTop > 40);
    const el = document.querySelector('.site');
    (el || window).addEventListener('scroll', onScroll, true);
    return () => (el || window).removeEventListener('scroll', onScroll, true);
  }, []);
  const links = ['Home', 'Capabilities', 'Work', 'Contact'];
  return (
    <header className={'nav' + (scrolled ? ' nav--solid' : '')}>
      <div className="nav__inner">
        <a className="nav__logo" href="#home">
          <img src="../../assets/fineries-logo-white-3x.png" className="nav__logo-white" alt="Fineries Digital" />
          <img src="../../assets/fineries-logo-blue-3x.png" className="nav__logo-blue" alt="Fineries Digital" />
        </a>
        <nav className="nav__links">
          {links.map(l => (
            <a key={l} href={'#' + l.toLowerCase()} className="nav__link">{l.toUpperCase()}</a>
          ))}
        </nav>
        <a href="#contact" className="btn btn--pill btn--pri nav__cta">Start a project <i data-lucide="arrow-right"></i></a>
        <button className="nav__burger" onClick={() => setOpen(o => !o)} aria-label="Menu">
          <i data-lucide={open ? 'x' : 'menu'}></i>
        </button>
      </div>
      {open && (
        <div className="nav__mobile">
          {links.map(l => <a key={l} href={'#' + l.toLowerCase()} onClick={() => setOpen(false)}>{l}</a>)}
        </div>
      )}
    </header>
  );
}
window.Nav = Nav;
