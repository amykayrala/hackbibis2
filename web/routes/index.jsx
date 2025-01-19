import { useUser } from "@gadgetinc/react";
import { Link } from "react-router";
import backgroundImage from "../components/assets/background.png";

export default function Index() {
  const user = useUser();

  const pageStyle = {
    background: `url(${backgroundImage})`,
    backgroundSize: "cover", // Ensures the image covers the entire background
    backgroundPosition: "center", // Centers the image
    backgroundRepeat: "no-repeat", // Prevents repeating
    width: "100vw", // Ensures it spans the full width
    height: "100vh", // Ensures it spans the full height
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "2rem",
    topmargin: "0rem"
  };

  const headingStyle = {
    color: "#fff",
    marginBottom: "2rem",
    fontSize: "6em",
    fontWeight: "1000",
    textAlign: "center",
    textShadow: "3px 3px 0px #FF69B4, 6px 6px 0px rgba(0,0,0,0.2)",
  };

  const textStyle = {
    color: "#FFF",
    marginBottom: "1rem",
  };

  const buttonStyle = {
    display: "inline-block",
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    color: "#000",
    margin: "0 10px",
    background: "#f7cb46",
    border: "1px solid black",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 200ms",
    textDecoration: "none",
    fontWeight: "500",
    width: "150px"
  };

  const getStartedStyle = {
    display: "inline-block",
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    color: "#000",
    margin: "0 10px",
    background: "#f7cb46",
    border: "1px solid black",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 200ms",
    textDecoration: "none",
    fontWeight: "500",
    width: "150px",
    boxShadow: "2px 2px 0px 0px #000"
  };


  return (
    <div style={pageStyle}>
      <div className="main">
        <h1 style={headingStyle}>Welcome to HBBDB!</h1>

        {user ? (
          <div>
            <p style={textStyle}>
              Hello, {user.email}!
            </p>
            <div className="button-group">
              <Link to="/browse" className="button" style={getStartedStyle}>
                Browse Data
              </Link>
              <Link to="/upload" className="button" style={getStartedStyle}>
                Upload New
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p style={textStyle}>
              Sign up to start parsing your data.
            </p>
            <Link to="/sign-up" className="button" style={getStartedStyle}>Get Started</Link>
          </div>
        )}
      </div>
    </div>
  );
}
