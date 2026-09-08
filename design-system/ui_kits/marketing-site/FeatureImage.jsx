// FeatureImage.jsx — Fineries imagery treatment: B&W knockout on the blue field
function FeatureImage() {
  return (
    <section className="feature" id="about">
      <div className="feature__inner">
        <div className="feature__copy">
          <div className="eyebrow eyebrow--light">OUR MISSION</div>
          <div className="feature__kw">Built on love.</div>
          <p className="feature__sub">
            We build lasting <b>love relationships</b> between brands and humans —
            work that moves people, and moves the numbers.
          </p>
        </div>
        <div className="feature__media">
          <img src="../../assets/examples/photo-knockout-person.png" alt="" />
        </div>
      </div>
    </section>
  );
}
window.FeatureImage = FeatureImage;
