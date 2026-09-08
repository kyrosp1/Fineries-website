/* @ds-bundle: {"format":4,"namespace":"FineriesDigitalDesignSystem_1087fd","components":[],"sourceHashes":{"ui_kits/marketing-site/Band.jsx":"2acdfcc8c60d","ui_kits/marketing-site/Capabilities.jsx":"c132d07e3bbe","ui_kits/marketing-site/Contact.jsx":"653c1a3a4bf3","ui_kits/marketing-site/FeatureImage.jsx":"28f8c19ecb16","ui_kits/marketing-site/Footer.jsx":"be000ed61191","ui_kits/marketing-site/Hero.jsx":"481fa5e760f5","ui_kits/marketing-site/Nav.jsx":"c1eba2ea8b61","ui_kits/marketing-site/Work.jsx":"246e7a8a1569"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.FineriesDigitalDesignSystem_1087fd = window.FineriesDigitalDesignSystem_1087fd || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/marketing-site/Band.jsx
try { (() => {
// Band.jsx — dark blue stats / proof band
function Band() {
  const stats = [{
    n: '60+',
    l: 'Brands accelerated'
  }, {
    n: '10yrs',
    l: 'Building in Lagos'
  }, {
    n: '4×',
    l: 'Avg. growth uplift'
  }, {
    n: '∞',
    l: 'Love for the craft'
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "band"
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__quote"
  }, /*#__PURE__*/React.createElement("span", {
    className: "band__rule"
  }), /*#__PURE__*/React.createElement("p", null, "\"Our mission is simple \u2014 help brands build lasting love relationships with humans.\"")), /*#__PURE__*/React.createElement("div", {
    className: "band__stats"
  }, stats.map(s => /*#__PURE__*/React.createElement("div", {
    className: "band__stat",
    key: s.l
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__n"
  }, s.n), /*#__PURE__*/React.createElement("div", {
    className: "band__l"
  }, s.l))))));
}
window.Band = Band;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Band.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Capabilities.jsx
try { (() => {
// Capabilities.jsx — what Fineries does
const FNR_CAPS = [{
  icon: 'compass',
  tint: 'blue',
  title: 'Brand strategy & identity',
  body: 'Positioning, naming and visual identity that give ambitious brands a clear point of view.'
}, {
  icon: 'pen-tool',
  tint: 'magenta',
  title: 'Content & creative',
  body: 'Copy, design, photography and animated video that resonate and move people to act.'
}, {
  icon: 'megaphone',
  tint: 'gold',
  title: 'Social & paid media',
  body: 'Always-on social management, digital campaigns and PPC engineered for reach and ROI.'
}, {
  icon: 'layout-dashboard',
  tint: 'teal',
  title: 'Experience design',
  body: 'Websites, mobile apps and digital products built to perform across every screen.'
}, {
  icon: 'trending-up',
  tint: 'blue',
  title: 'Digital PR & growth',
  body: 'SEO, marketing automation and earned placements that compound over time.'
}, {
  icon: 'sparkles',
  tint: 'magenta',
  title: 'Campaign ideas',
  body: 'Big, bold creative platforms that turn a brand moment into measurable momentum.'
}];
function CapCard({
  cap
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "cap-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: 'cap-card__icon cap-card__icon--' + cap.tint
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": cap.icon
  })), /*#__PURE__*/React.createElement("h3", {
    className: "cap-card__title"
  }, cap.title), /*#__PURE__*/React.createElement("p", {
    className: "cap-card__body"
  }, cap.body));
}
function Capabilities() {
  return /*#__PURE__*/React.createElement("section", {
    className: "section caps",
    id: "capabilities"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "WHAT WE DO"), /*#__PURE__*/React.createElement("h2", {
    className: "section__title"
  }, "Everything an ambitious brand needs to grow."), /*#__PURE__*/React.createElement("p", {
    className: "section__sub"
  }, "One partner across strategy, creative and technology \u2014 so your brand shows up sharp and consistent everywhere it matters.")), /*#__PURE__*/React.createElement("div", {
    className: "caps__grid"
  }, FNR_CAPS.map(c => /*#__PURE__*/React.createElement(CapCard, {
    key: c.title,
    cap: c
  }))));
}
window.Capabilities = Capabilities;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Capabilities.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Contact.jsx
try { (() => {
// Contact.jsx — CTA + interactive contact form
function Contact() {
  const [sent, setSent] = React.useState(false);
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    about: 'Brand strategy',
    msg: ''
  });
  const set = k => e => setForm(f => ({
    ...f,
    [k]: e.target.value
  }));
  const submit = e => {
    e.preventDefault();
    setSent(true);
  };
  return /*#__PURE__*/React.createElement("section", {
    className: "section contact",
    id: "contact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "contact__grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "contact__pitch"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow--light"
  }, "START A PROJECT"), /*#__PURE__*/React.createElement("h2", {
    className: "contact__title"
  }, "Let's build something", /*#__PURE__*/React.createElement("br", null), "ambitious together."), /*#__PURE__*/React.createElement("p", {
    className: "contact__lead"
  }, "Tell us where you want to grow. We'll come back within two working days with a way forward."), /*#__PURE__*/React.createElement("a", {
    className: "contact__mail",
    href: "#"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "mail"
  }), " hello@fineries.net"), /*#__PURE__*/React.createElement("a", {
    className: "contact__mail",
    href: "#"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "map-pin"
  }), " Ikeja, Lagos \xB7 Nigeria")), /*#__PURE__*/React.createElement("div", {
    className: "contact__card"
  }, sent ? /*#__PURE__*/React.createElement("div", {
    className: "contact__done"
  }, /*#__PURE__*/React.createElement("div", {
    className: "contact__done-mark"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "check"
  })), /*#__PURE__*/React.createElement("h3", null, "Thanks, ", form.name || 'friend', "!"), /*#__PURE__*/React.createElement("p", null, "Your brief is in. We'll be in touch at ", form.email || 'your inbox', " shortly."), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--pill btn--sec",
    onClick: () => {
      setSent(false);
      setForm({
        name: '',
        email: '',
        about: 'Brand strategy',
        msg: ''
      });
    }
  }, "Send another")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Your name"), /*#__PURE__*/React.createElement("input", {
    required: true,
    value: form.name,
    onChange: set('name'),
    placeholder: "Ada Obi"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Work email"), /*#__PURE__*/React.createElement("input", {
    required: true,
    type: "email",
    value: form.email,
    onChange: set('email'),
    placeholder: "ada@brand.com"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "What do you need?"), /*#__PURE__*/React.createElement("select", {
    value: form.about,
    onChange: set('about')
  }, /*#__PURE__*/React.createElement("option", null, "Brand strategy"), /*#__PURE__*/React.createElement("option", null, "Content & creative"), /*#__PURE__*/React.createElement("option", null, "Social & paid media"), /*#__PURE__*/React.createElement("option", null, "Experience design"), /*#__PURE__*/React.createElement("option", null, "Something else"))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Tell us more"), /*#__PURE__*/React.createElement("textarea", {
    rows: "3",
    value: form.msg,
    onChange: set('msg'),
    placeholder: "A line or two about your brand and goals\u2026"
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn--pill btn--pri btn--block"
  }, "Send brief ", /*#__PURE__*/React.createElement("i", {
    "data-lucide": "arrow-right"
  }))))));
}
window.Contact = Contact;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/FeatureImage.jsx
try { (() => {
// FeatureImage.jsx — Fineries imagery treatment: B&W knockout on the blue field
function FeatureImage() {
  return /*#__PURE__*/React.createElement("section", {
    className: "feature",
    id: "about"
  }, /*#__PURE__*/React.createElement("div", {
    className: "feature__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "feature__copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow--light"
  }, "OUR MISSION"), /*#__PURE__*/React.createElement("div", {
    className: "feature__kw"
  }, "Built on love."), /*#__PURE__*/React.createElement("p", {
    className: "feature__sub"
  }, "We build lasting ", /*#__PURE__*/React.createElement("b", null, "love relationships"), " between brands and humans \u2014 work that moves people, and moves the numbers.")), /*#__PURE__*/React.createElement("div", {
    className: "feature__media"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/examples/photo-knockout-person.png",
    alt: ""
  }))));
}
window.FeatureImage = FeatureImage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/FeatureImage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Footer.jsx
try { (() => {
// Footer.jsx
function Footer() {
  const cols = [{
    h: 'Agency',
    items: ['About', 'Capabilities', 'Work', 'Careers']
  }, {
    h: 'Capabilities',
    items: ['Strategy', 'Creative', 'Social', 'Experience']
  }, {
    h: 'Connect',
    items: ['Instagram', 'LinkedIn', 'X / Twitter', 'Behance']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    className: "footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer__brand"
  }, /*#__PURE__*/React.createElement("img", {
    className: "footer__logo",
    src: "../../assets/fineries-logo-white-3x.png",
    alt: "Fineries Digital"
  }), /*#__PURE__*/React.createElement("img", {
    className: "footer__slogan",
    src: "../../assets/slogan-color-dark.svg",
    alt: "We build brands people love"
  }), /*#__PURE__*/React.createElement("p", null, "We help ambitious brands accelerate growth. Lagos, Nigeria.")), /*#__PURE__*/React.createElement("div", {
    className: "footer__cols"
  }, cols.map(c => /*#__PURE__*/React.createElement("div", {
    className: "footer__col",
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer__h"
  }, c.h), c.items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#"
  }, i)))))), /*#__PURE__*/React.createElement("div", {
    className: "footer__bar"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Fineries Digital"), /*#__PURE__*/React.createElement("span", null, "Privacy \xB7 Terms")));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Hero.jsx
try { (() => {
// Hero.jsx — Fineries hero (dark blue field)
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hero",
    id: "home"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__eyebrow"
  }, "DIGITAL ADVERTISING \xB7 LAGOS"), /*#__PURE__*/React.createElement("h1", {
    className: "hero__title"
  }, "We help ambitious brands", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "hero__accent"
  }, "accelerate growth.")), /*#__PURE__*/React.createElement("p", {
    className: "hero__lead"
  }, "Fineries creates digital experiences that drive results \u2014 building lasting love relationships between brands and humans."), /*#__PURE__*/React.createElement("div", {
    className: "hero__actions"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#contact",
    className: "btn btn--pill btn--pri btn--lg"
  }, "Start a project ", /*#__PURE__*/React.createElement("i", {
    "data-lucide": "arrow-right"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#work",
    className: "btn btn--pill btn--ghost btn--lg"
  }, "See our work")), /*#__PURE__*/React.createElement("div", {
    className: "hero__strip"
  }, /*#__PURE__*/React.createElement("span", null, "Strategy \xB7 Creative \xB7 Social \xB7 Experience \xB7 Growth"))));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Nav.jsx
try { (() => {
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
  return /*#__PURE__*/React.createElement("header", {
    className: 'nav' + (scrolled ? ' nav--solid' : '')
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav__inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "nav__logo",
    href: "#home"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/fineries-logo-white-3x.png",
    className: "nav__logo-white",
    alt: "Fineries Digital"
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/fineries-logo-blue-3x.png",
    className: "nav__logo-blue",
    alt: "Fineries Digital"
  })), /*#__PURE__*/React.createElement("nav", {
    className: "nav__links"
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: '#' + l.toLowerCase(),
    className: "nav__link"
  }, l.toUpperCase()))), /*#__PURE__*/React.createElement("a", {
    href: "#contact",
    className: "btn btn--pill btn--pri nav__cta"
  }, "Start a project ", /*#__PURE__*/React.createElement("i", {
    "data-lucide": "arrow-right"
  })), /*#__PURE__*/React.createElement("button", {
    className: "nav__burger",
    onClick: () => setOpen(o => !o),
    "aria-label": "Menu"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": open ? 'x' : 'menu'
  }))), open && /*#__PURE__*/React.createElement("div", {
    className: "nav__mobile"
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: '#' + l.toLowerCase(),
    onClick: () => setOpen(false)
  }, l))));
}
window.Nav = Nav;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Nav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Work.jsx
try { (() => {
// Work.jsx — filterable case-study grid (white cards, color as accent)
const FNR_WORK = [{
  client: 'Lagos Bank',
  cat: 'Experience',
  tint: 'blue',
  metric: '+48% sign-ups',
  desc: 'A mobile-first banking experience redesign.'
}, {
  client: 'Verde Foods',
  cat: 'Social',
  tint: 'magenta',
  metric: '3.2M reach',
  desc: 'Always-on social platform for a challenger FMCG brand.'
}, {
  client: 'Solis Energy',
  cat: 'Strategy',
  tint: 'teal',
  metric: 'Rebrand',
  desc: 'Naming, identity and launch for a clean-energy startup.'
}, {
  client: 'Kano Telco',
  cat: 'Creative',
  tint: 'gold',
  metric: '12 films',
  desc: 'A national animated campaign series.'
}, {
  client: 'Ada Retail',
  cat: 'Experience',
  tint: 'magenta',
  metric: '+61% checkout',
  desc: 'E-commerce experience and conversion overhaul.'
}, {
  client: 'Hala Travel',
  cat: 'Social',
  tint: 'blue',
  metric: '+220% engagement',
  desc: 'Influencer-led growth across West Africa.'
}];
const FNR_FILTERS = ['All', 'Strategy', 'Creative', 'Social', 'Experience'];
function WorkCard({
  w
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "work-card",
    tabIndex: "0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "work-card__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: 'work-card__cat work-card__cat--' + w.tint
  }, w.cat)), /*#__PURE__*/React.createElement("div", {
    className: "work-card__metric"
  }, w.metric), /*#__PURE__*/React.createElement("h3", {
    className: "work-card__client"
  }, w.client), /*#__PURE__*/React.createElement("p", {
    className: "work-card__desc"
  }, w.desc), /*#__PURE__*/React.createElement("span", {
    className: "work-card__link"
  }, "View case study ", /*#__PURE__*/React.createElement("i", {
    "data-lucide": "arrow-up-right"
  })));
}
function Work() {
  const [filter, setFilter] = React.useState('All');
  const shown = filter === 'All' ? FNR_WORK : FNR_WORK.filter(w => w.cat === filter);
  return /*#__PURE__*/React.createElement("section", {
    className: "section work",
    id: "work"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section__head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "SELECTED WORK"), /*#__PURE__*/React.createElement("h2", {
    className: "section__title"
  }, "Results we're proud of.")), /*#__PURE__*/React.createElement("div", {
    className: "work__filters"
  }, FNR_FILTERS.map(f => /*#__PURE__*/React.createElement("button", {
    key: f,
    className: 'chip-btn' + (f === filter ? ' chip-btn--on' : ''),
    onClick: () => setFilter(f)
  }, f))), /*#__PURE__*/React.createElement("div", {
    className: "work__grid"
  }, shown.map(w => /*#__PURE__*/React.createElement(WorkCard, {
    key: w.client,
    w: w
  }))));
}
window.Work = Work;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Work.jsx", error: String((e && e.message) || e) }); }

})();
