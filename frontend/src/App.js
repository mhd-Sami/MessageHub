import { Button } from "@chakra-ui/react";
import { Route } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";
import ForgotPassword from "./Components/Authentication/ForgotPassword";
import ResetPassword from "./Components/Authentication/ResetPassword";
import Login from "./Components/Authentication/Login";
import EmailVerify from "./Components/Authentication/EmailVerify";

function App() {
  return (
    <div className="App">
      <Route path="/" component={HomePage} exact />
      <Route path="/chat" component={ChatPage} />
      <Route path="/forgotpassword" component={ForgotPassword} />
      <Route
        path="/resetForgotPassword/:userId/:token"
        component={ResetPassword}
      />
      <Route path="/login" component={Login} />
      <Route path="/user/:id/verify/:token" component={EmailVerify} />
    </div>
  );
}

export default App;
