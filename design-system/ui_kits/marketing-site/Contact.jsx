// Contact.jsx — CTA + interactive contact form
function Contact() {
  const [sent, setSent] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', about: 'Brand strategy', msg: '' });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = e => { e.preventDefault(); setSent(true); };
  return (
    <section className="section contact" id="contact">
      <div className="contact__grid">
        <div className="contact__pitch">
          <div className="eyebrow eyebrow--light">START A PROJECT</div>
          <h2 className="contact__title">Let's build something<br />ambitious together.</h2>
          <p className="contact__lead">Tell us where you want to grow. We'll come back within two working days with a way forward.</p>
          <a className="contact__mail" href="#"><i data-lucide="mail"></i> hello@fineries.net</a>
          <a className="contact__mail" href="#"><i data-lucide="map-pin"></i> Ikeja, Lagos · Nigeria</a>
        </div>
        <div className="contact__card">
          {sent ? (
            <div className="contact__done">
              <div className="contact__done-mark"><i data-lucide="check"></i></div>
              <h3>Thanks, {form.name || 'friend'}!</h3>
              <p>Your brief is in. We'll be in touch at {form.email || 'your inbox'} shortly.</p>
              <button className="btn btn--pill btn--sec" onClick={() => { setSent(false); setForm({ name: '', email: '', about: 'Brand strategy', msg: '' }); }}>Send another</button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="field"><label>Your name</label><input required value={form.name} onChange={set('name')} placeholder="Ada Obi" /></div>
              <div className="field"><label>Work email</label><input required type="email" value={form.email} onChange={set('email')} placeholder="ada@brand.com" /></div>
              <div className="field"><label>What do you need?</label>
                <select value={form.about} onChange={set('about')}>
                  <option>Brand strategy</option><option>Content & creative</option>
                  <option>Social & paid media</option><option>Experience design</option>
                  <option>Something else</option>
                </select>
              </div>
              <div className="field"><label>Tell us more</label><textarea rows="3" value={form.msg} onChange={set('msg')} placeholder="A line or two about your brand and goals…"></textarea></div>
              <button type="submit" className="btn btn--pill btn--pri btn--block">Send brief <i data-lucide="arrow-right"></i></button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
window.Contact = Contact;
