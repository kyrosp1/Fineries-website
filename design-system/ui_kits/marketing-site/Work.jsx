// Work.jsx — filterable case-study grid (white cards, color as accent)
const FNR_WORK = [
  { client: 'Lagos Bank', cat: 'Experience', tint: 'blue', metric: '+48% sign-ups', desc: 'A mobile-first banking experience redesign.' },
  { client: 'Verde Foods', cat: 'Social', tint: 'magenta', metric: '3.2M reach', desc: 'Always-on social platform for a challenger FMCG brand.' },
  { client: 'Solis Energy', cat: 'Strategy', tint: 'teal', metric: 'Rebrand', desc: 'Naming, identity and launch for a clean-energy startup.' },
  { client: 'Kano Telco', cat: 'Creative', tint: 'gold', metric: '12 films', desc: 'A national animated campaign series.' },
  { client: 'Ada Retail', cat: 'Experience', tint: 'magenta', metric: '+61% checkout', desc: 'E-commerce experience and conversion overhaul.' },
  { client: 'Hala Travel', cat: 'Social', tint: 'blue', metric: '+220% engagement', desc: 'Influencer-led growth across West Africa.' },
];
const FNR_FILTERS = ['All', 'Strategy', 'Creative', 'Social', 'Experience'];

function WorkCard({ w }) {
  return (
    <article className="work-card" tabIndex="0">
      <div className="work-card__head">
        <span className={'work-card__cat work-card__cat--' + w.tint}>{w.cat}</span>
      </div>
      <div className="work-card__metric">{w.metric}</div>
      <h3 className="work-card__client">{w.client}</h3>
      <p className="work-card__desc">{w.desc}</p>
      <span className="work-card__link">View case study <i data-lucide="arrow-up-right"></i></span>
    </article>
  );
}

function Work() {
  const [filter, setFilter] = React.useState('All');
  const shown = filter === 'All' ? FNR_WORK : FNR_WORK.filter(w => w.cat === filter);
  return (
    <section className="section work" id="work">
      <div className="section__head">
        <div className="eyebrow">SELECTED WORK</div>
        <h2 className="section__title">Results we're proud of.</h2>
      </div>
      <div className="work__filters">
        {FNR_FILTERS.map(f => (
          <button key={f} className={'chip-btn' + (f === filter ? ' chip-btn--on' : '')} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="work__grid">
        {shown.map(w => <WorkCard key={w.client} w={w} />)}
      </div>
    </section>
  );
}
window.Work = Work;
