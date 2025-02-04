import {
  Home as HomeIcon,
  Apps as FeatureIcon,
  Star as ReviewIcon,
  GitHub as GithubIcon,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-menu">
          <h1 className="footer-title">Karlobaat</h1>
          <ul className="footer-nav-menu">
            {[
              { title: "Home", url: "#hero", icon: <HomeIcon /> },
              { title: "Features", url: "#features", icon: <FeatureIcon /> },
              { title: "Reviews", url: "#reviews", icon: <ReviewIcon /> },
              {
                title: "Github Repo",
                url: "https://github.com/saifiimuhammad/KarloBaat-chatapp",
                icon: <GithubIcon />,
              },
            ].map((value, index) => (
              <li key={index} className="footer-item">
                {value.icon}
                <a href={value.url} className="footer-link hover-effect">
                  {value.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-copyright">
          <h5 className="copy">&copy; 2025 KarloBaat. All rights reserved.</h5>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
