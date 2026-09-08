// Band.jsx — dark blue stats / proof band
function Band() {
  const stats = [
    { n: '60+', l: 'Brands accelerated' },
    { n: '10yrs', l: 'Building in Lagos' },
    { n: '4×', l: 'Avg. growth uplift' },
    { n: '∞', l: 'Love for the craft' },
  ];
  return (
    <section className="band">
      <div className="band__inner">
        <div className="band__quote">
          <span className="band__rule"></span>
          <p>"Our mission is simple — help brands build lasting love relationships with humans."</p>
        </div>
        <div className="band__stats">
          {stats.map(s => (
            <div className="band__stat" key={s.l}>
              <div className="band__n">{s.n}</div>
              <div className="band__l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
window.Band = Band;
