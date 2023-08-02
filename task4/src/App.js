// import logo from './logo.svg';
import './App.css';
import Auth from "./components/Auth/Auth";
import { UserContext } from "./Context/UserContext";
import Modal from "./components/Modal/Modal";
import Dashboard from "./components/Dashboard/dashboard";

import { useMemo, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [msg, setMsg] = useState("");
  const [display, setDisplay] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalColor, setModalColor] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [signature, setSignature] = useState("");

  const value = useMemo(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
      modal,
      setModal,
      msg,
      setMsg,
      display,
      setDisplay,
      modalColor,
      setModalColor,
      email,
      setEmail,
      walletAddress,
      setWalletAddress,
      signature,
      setSignature
    }),
    [
      isLoggedIn,
      setIsLoggedIn,
      modal,
      setModal,
      msg,
      setMsg,
      display,
      setDisplay,
      modalColor,
      setModalColor,
      email,
      setEmail,
      walletAddress,
      setWalletAddress,
      signature,
      setSignature
    ]
  );
  return (
    <UserContext.Provider value={value}>
    <div className="App">
      <Router>
        <Routes>
            <Route exact path="/" element={<Auth />}></Route>
            <Route exact path="/dashboard" element={<Dashboard/>}></Route>
        </Routes>
      </Router>
      {modal && <Modal />}
    </div>
    </UserContext.Provider>
  );
}

export default App;
