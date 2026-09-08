// Capabilities.jsx — what Fineries does
const FNR_CAPS = [
  { icon: 'compass', tint: 'blue', title: 'Brand strategy & identity', body: 'Positioning, naming and visual identity that give ambitious brands a clear point of view.' },
  { icon: 'pen-tool', tint: 'magenta', title: 'Content & creative', body: 'Copy, design, photography and animated video that resonate and move people to act.' },
  { icon: 'megaphone', tint: 'gold', title: 'Social & paid media', body: 'Always-on social management, digital campaigns and PPC engineered for reach and ROI.' },
  { icon: 'layout-dashboard', tint: 'teal', title: 'Experience design', body: 'Websites, mobile apps and digital products built to perform across every screen.' },
  { icon: 'trending-up', tint: 'blue', title: 'Digital PR & growth', body: 'SEO, marketing automation and earned placements that compound over time.' },
  { icon: 'sparkles', tint: 'magenta', title: 'Campaign ideas', body: 'Big, bold creative platforms that turn a brand moment into measurable momentum.' },
];

function CapCard({ cap }) {
  return (
    <article className="cap-card">
      <div className={'cap-card__icon cap-card__icon--' + cap.tint}>
        <i data-lucide={cap.icon}></i>
      </div>
      <h3 className="cap-card__title">{cap.title}</h3>
      <p className="cap-card__body">{cap.body}</p>
    </article>
  );
}

function Capabilities() {
  return (
    <section className="section caps" id="capabilities">
      <div className="section__head">
        <div className="eyebrow">WHAT WE DO</div>
        <h2 className="section__title">Everything an ambitious brand needs to grow.</h2>
        <p className="section__sub">One partner across strategy, creative and technology — so your brand shows up sharp and consistent everywhere it matters.</p>
      </div>
      <div className="caps__grid">
        {FNR_CAPS.map(c => <CapCard key={c.title} cap={c} />)}
      </div>
    </section>
  );
}
window.Capabilities = Capabilities;
