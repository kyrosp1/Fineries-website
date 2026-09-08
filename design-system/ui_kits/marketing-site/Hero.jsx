// Hero.jsx — Fineries hero (dark blue field)
function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__inner">
        <div className="hero__eyebrow">DIGITAL ADVERTISING · LAGOS</div>
        <h1 className="hero__title">
          We help ambitious brands<br />
          <span className="hero__accent">accelerate growth.</span>
        </h1>
        <p className="hero__lead">
          Fineries creates digital experiences that drive results — building lasting
          love relationships between brands and humans.
        </p>
        <div className="hero__actions">
          <a href="#contact" className="btn btn--pill btn--pri btn--lg">Start a project <i data-lucide="arrow-right"></i></a>
          <a href="#work" className="btn btn--pill btn--ghost btn--lg">See our work</a>
        </div>
        <div className="hero__strip">
          <span>Strategy · Creative · Social · Experience · Growth</span>
        </div>
      </div>
    </section>
  );
}
window.Hero = Hero;
