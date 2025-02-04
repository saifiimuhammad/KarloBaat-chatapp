import featureImg from "../../../../public/assets/images/feature.png";

const Feature = () => {
  return (
    <section className="section feature-section">
      <div className="feature-container">
        <div className="features-box box-1">
          <h3
            className="feature"
            style={{
              top: "",
              left: "-2rem",
            }}
          >
            📩 Instant Messaging
          </h3>
          <h3
            className="feature"
            style={{
              top: "7rem",
              left: "-9rem",
            }}
          >
            🔒 End-to-End Encryption
          </h3>
          <h3
            className="feature"
            style={{
              top: "14rem",
              left: "-11rem",
            }}
          >
            📎 Share Files Easily
          </h3>
          <h3
            className="feature"
            style={{
              top: "21rem",
              left: "-13rem",
            }}
          >
            🎨 Custom Themes
          </h3>
        </div>
        <div className="image-container">
          <img src={featureImg} className="feature-img" />
        </div>
        <div className="features-box box-2">
          <h3
            className="feature"
            style={{
              bottom: "21rem",
              right: "-17rem",
            }}
          >
            🌍 Multi-Device Access
          </h3>
          <h3
            className="feature"
            style={{
              bottom: "14rem",
              right: "-16rem",
            }}
          >
            ⚡ Lightning-Fast Delivery
          </h3>
          <h3
            className="feature"
            style={{
              bottom: "7rem",
              right: "-11rem",
            }}
          >
            🤖 Smart AI Suggestions
          </h3>
          <h3
            className="feature"
            style={{
              bottom: "0",
              right: "-5rem",
            }}
          >
            📞 Voice & Video Calls
          </h3>
        </div>
      </div>
    </section>
  );
};
export default Feature;
