// Footer.jsx
function Footer() {
  const cols = [
    { h: 'Agency', items: ['About', 'Capabilities', 'Work', 'Careers'] },
    { h: 'Capabilities', items: ['Strategy', 'Creative', 'Social', 'Experience'] },
    { h: 'Connect', items: ['Instagram', 'LinkedIn', 'X / Twitter', 'Behance'] },
  ];
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img className="footer__logo" src="../../assets/fineries-logo-white-3x.png" alt="Fineries Digital" />
          <img className="footer__slogan" src="../../assets/slogan-color-dark.svg" alt="We build brands people love" />
          <p>We help ambitious brands accelerate growth. Lagos, Nigeria.</p>
        </div>
        <div className="footer__cols">
          {cols.map(c => (
            <div className="footer__col" key={c.h}>
              <div className="footer__h">{c.h}</div>
              {c.items.map(i => <a key={i} href="#">{i}</a>)}
            </div>
          ))}
        </div>
      </div>
      <div className="footer__bar">
        <span>© 2026 Fineries Digital</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}
window.Footer = Footer;
