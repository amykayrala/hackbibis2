import { SignedInOrRedirect, SignedOut, Provider, SignedIn, SignedOutOrRedirect, useAction, useUser } from "@gadgetinc/react";
import { Suspense, useEffect, useCallback } from "react";
import databaseIcon from "./assets/database.png";
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements, useNavigate, useLocation } from "react-router";
import { api } from "../api";
import Index from "../routes/index";
import SignInPage from "../routes/sign-in";
import SignUpPage from "../routes/sign-up";
import ResetPasswordPage from "../routes/reset-password";
import VerifyEmailPage from "../routes/verify-email";
import ChangePassword from "../routes/change-password";
import ForgotPassword from "../routes/forgot-password";
import UploadPage from "../routes/upload";
import BrowseRecords from "../routes/browse";
import "./App.css";
import PageTransition from "./PageTransition";

const App = () => {
  useEffect(() => {
    document.title = `${process.env.GADGET_APP}`;
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}> 
        <Route
          index
          element={<Index />}
        />
        <Route
          path="browse"
          element={
            <SignedInOrRedirect>
              <BrowseRecords />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="upload"
          element={
            <SignedInOrRedirect>
              <UploadPage />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="change-password"
          element={
            <SignedInOrRedirect>
              <ChangePassword />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="forgot-password"
          element={
            <SignedOutOrRedirect>
              <ForgotPassword />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="sign-in"
          element={
            <SignedOutOrRedirect>
              <SignInPage />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="sign-up"
          element={
            <SignedOutOrRedirect>
              <SignUpPage />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="reset-password"
          element={
            <ResetPasswordPage />
          }
        />
        <Route
          path="verify-email"
          element={
            <VerifyEmailPage />
          }
        />
      </Route>
    )
  );

  return (
    <Suspense fallback={<></>}> 
      <RouterProvider router={router} />
    </Suspense>
  );
};

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Provider api={api} navigate={navigate} auth={window.gadgetConfig.authentication}> 
      <Header />
      <div className="app">
        <div className="app-content">

          <div className="main">
            <PageTransition location={location.pathname}>
              <Outlet />
            </PageTransition>
          </div>
        </div>
      </div>
    </Provider>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="header">
      <a href="/" target="_self" rel="noreferrer" style={{ textDecoration: "none" }}>
        <div className="logo"> 
          <img src={databaseIcon} alt="Database icon"></img>
          <div>Hackbibis</div>
        </div>
      </a>
      <div className="header-content">
        {location.pathname !== '/sign-in' && (
          <SignedOut>
            <button onClick={() => navigate("/sign-in")} className="nav-link">Sign in</button>
          </SignedOut>
        )}
        <SignedIn>
          <SignOutButton navigate={navigate} />
        </SignedIn>
      </div>
    </div>
  ); 
};

const SignOutButton = ({ navigate }) => {
  const [{ error, fetching }, signOut] = useAction(api.user.signOut);
  const user = useUser();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut({ id: user?.id });
      navigate("/");
    } catch (e) {
      console.error("Sign out failed:", e);
    }
  }, [signOut, navigate, user?.id]);

  return (
    <> 
      {error && <div style={{ color: "red", marginRight: "1rem" }}>Failed to sign out</div>}
      <button
        onClick={handleSignOut}
        disabled={fetching || !user}
        style={fetching ? { opacity: 0.7, cursor: "not-allowed" } : undefined}
        className="nav-link"
      >
        Sign out
      </button>
    </>
  );
};

export default App;