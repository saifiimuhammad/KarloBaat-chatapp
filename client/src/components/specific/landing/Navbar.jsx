import {
  Home as HomeIcon,
  Apps as FeatureIcon,
  Star as ReviewIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useRef } from "react";

const Navbar = () => {
  const navMenu = useRef(null);

  const handleMenuOpen = () => {
    navMenu.current.classList.add("show-nav");
  };
  const handleMenuClose = () => {
    navMenu.current.classList.remove("show-nav");
  };

  return (
    <header className="header">
      <nav className="nav container">
        <h2 className="nav-title">Karlobaat!</h2>
        <ul className="nav-menu" ref={navMenu}>
          {[
            { title: "Home", url: "#hero", icon: <HomeIcon /> },
            {
              title: "Features",
              url: "#features-section",
              icon: <FeatureIcon />,
            },
            { title: "Reviews", url: "#reviews", icon: <ReviewIcon /> },
          ].map((value, index) => (
            <li key={index} className="nav-item">
              {value.icon}
              <a href={value.url} className="nav-link hover-effect">
                {value.title}
              </a>
            </li>
          ))}
          <CloseIcon onClick={handleMenuClose} />
        </ul>

        <div className="box">
          <button className="btn-2">Let&apos;s Chat</button>
          <MenuIcon onClick={handleMenuOpen} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
