import Axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import metamask from "../../Assets/MetaMask_Fox.svg";
import walleconnectlogo from "../../Assets/wclogo.svg";
import { UserContext } from "../../Context/UserContext";
import styles from "./Login.module.css";

const Auth = () => {
  const url = "http://localhost:3000/login";
  const url2 = "http://localhost:3000/register";

  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const {
 
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
  } = useContext(UserContext);

  const [errMsg, setErrMsg] = useState(false);

  const [waitAuth, setWaitAuth] = useState(false);

  const CrossHandler = () => {
    setErrMsg(false);
    setWaitAuth(false);
  };

  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const EmailChange = (e) => {
    setEmail(e.target.value);
  };

  const PasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormToggle = () => {
    setIsRegistering((prevIsRegistering) => !prevIsRegistering);
  };

  const headers = {
    "Content-Type": "application/json",
  };

  async function handleSubmitLogin(e) {
    e.preventDefault();

    const isValidEmail = validateEmail(email);

    if (isValidEmail) {
      localStorage.setItem("email", email);

      Axios.post(
        url,
        {
          email: email,
          password: password,
        },
        headers
      )
        .then((response) => {
          console.log(response);
          localStorage.setItem("token", response.data.token);
          const item = localStorage.getItem("token", response.token);
          console.log(response);
          if (response.data === "Too many requests, please try again later.") {
            setModal(true);
            setMsg("Too many requests please try again...");
            setModalColor("red");
          }
          if (response.data.msg === "Invalid Credentials") {
            setModal(true);
            setMsg("Invalid credentials!");
            setModalColor("red");
          } else {
            setModal(true);
            setMsg("User authenticated!");
            setModalColor("green");
            navigate("/dashboard");
          }

          if (response.data.msg === "No account exists with provided email") {
            setModal(true);
            setMsg("Invalid credentials!");
            setModalColor("red");
          }
          setIsLoggedIn(item);
        })
        .catch((err) => {
          console.log(err.message);
          if (err.message === "Invalid Credentials") {
            setModal(true);
            setMsg("Invalid credentials!");
            setModalColor("red");
          } else if (err.message === "No account exists with provided email") {
            setModal(true);
            setMsg("Invalid credentials!");
            setModalColor("red");
          } else {
            setModal(true);
            setMsg(err.message);
            setModalColor("red");
          }
        });
    } else {
      setModal(true);
      setMsg("Enter Valid Email !");
      setModalColor("red");
    }
  }

  async function handleSubmitRegister(e) {
    e.preventDefault();

    const isValidEmail = validateEmail(email);

    if (isValidEmail) {
      localStorage.setItem("email", email);

      console.log(email);
      console.log(password);

      Axios.post(
        url2,
        {
          email: email,
          password: password,
        },
        headers
      )
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          const item = localStorage.getItem("token", response.token);

          if (response.data === "Too many requests, please try again later.") {
            setModal(true);
            setMsg("Too many requests please try again...");
            setModalColor("red");
          } else {
            setModal(true);
            setMsg("User Created!");
            setModalColor("green");
            navigate("/dashboard");
          }

          setIsLoggedIn(item);
        })
        .catch((err) => {
          console.log(err.response);
          if (err.response.data === "User Already Exist. Please Login") {
            setModal(true);
            setMsg("User Already Exist. Please Login");
            setModalColor("red");
          } else {
            setModal(true);
            setMsg("Please Try again!");
            setModalColor("red");
          }
        });
    } else {
      setModal(true);
      setMsg("Enter Valid Email !");
      setModalColor("red");
    }
  }

  async function metamaskLogin() {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request account access from the user
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        // You now have the user's Ethereum accounts
        console.log("Connected accounts:", accounts);

        const nonce = await Axios.get(
          `http://localhost:3000/${accounts[0]}/nonce`,
          headers
        );

        console.log(nonce);

        const signature = await signMessage(nonce.data.toString());
        console.log(signature);

        const response = await Axios.post(
          `http://localhost:3000/${accounts[0]}/signature`,
          {
            signature: signature,
          },
          headers
        );

        localStorage.setItem("token", response.data.token);

        const item = localStorage.getItem("token", response.token);
        console.log(response);
        if (response.data === "Too many requests, please try again later.") {
          setModal(true);
          setMsg("Too many requests please try again...");
          setModalColor("red");
        } else {
          setModal(true);
          setMsg("User authenticated!");
          setModalColor("green");
        }

        if (response.data.msg === "User Already Exist. Please Login") {
          setModal(true);
          setMsg("User Already Exist. Please Login");
          setModalColor("red");
        }
        setIsLoggedIn(item);
        setWalletAddress(accounts[0])
        setSignature(signature)
        setEmail(null)
        setPassword(null)
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      console.error(
        "MetaMask not found. Please install the MetaMask extension."
      );
    }
  }

  async function signMessage(message) {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length === 0) {
          console.error("No connected accounts.");
          return;
        }

        const signature = await window.ethereum.request({
          method: "personal_sign",
          params: [message, accounts[0]],
        });

        return signature;
      } catch (error) {
        console.error("Error signing message:", error);
      }
    } else {
      console.error(
        "MetaMask not found. Please install the MetaMask extension."
      );
    }
  }

  if (isLoggedIn) {
    navigate("/dashboard");
  }

  return (
    <div className={styles.parent_container}>
      <div className={styles.main_container}>
        <div>
          <div className={styles.heading_container}>
            <h1>{isRegistering ? "Register" : "Sign In"}</h1>
          </div>
          {isRegistering ? (
            <form
              onSubmit={handleSubmitRegister}
              className={styles.form_container}
            >
              <div className={styles.input_container}>
                <div className={styles.fields}>
                  <label htmlFor="Email" className={styles.labelstyle}>
                    Email
                  </label>
                  <input
                    type="text"
                    onChange={EmailChange}
                    value={email}
                    placeholder="Enter Email Address"
                  />
                </div>
                <div className={styles.fields}>
                  <label htmlFor="Password" className={styles.labelstyle}>
                    Password
                  </label>
                  <input
                    type="password"
                    onChange={PasswordChange}
                    value={password}
                    placeholder="Enter Password"
                  />
                </div>
                <div className={styles.forget_check_container}></div>
              </div>
              <button type="submit" className={styles.button}>
                Submit
              </button>
              <button type="button" onClick={handleFormToggle}>
                Already have an account? Sign In
              </button>
              <p>or sign in using</p>
              <div className={styles.imageCont}>
                <Link
                  to="/"
                  onClick={() => {
                    metamaskLogin();
                  }}
                >
                  <img
                    src={metamask}
                    height="80px"
                    width="80px"
                    alt="metamask"
                  />
                </Link>
                {/* <Link>
                <img
                  src={walleconnectlogo}
                  height="80px"
                  width="80px"
                  alt="walletconnect"
                />
              </Link> */}
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleSubmitLogin}
              className={styles.form_container}
            >
              <div className={styles.input_container}>
                <div className={styles.fields}>
                  <label htmlFor="Email" className={styles.labelstyle}>
                    Email
                  </label>
                  <input
                    type="text"
                    onChange={EmailChange}
                    value={email}
                    placeholder="Enter Email Address"
                  />
                </div>
                <div className={styles.fields}>
                  <label htmlFor="Password" className={styles.labelstyle}>
                    Password
                  </label>
                  <input
                    type="password"
                    onChange={PasswordChange}
                    value={password}
                    placeholder="Enter Password"
                  />
                </div>
                <div className={styles.forget_check_container}></div>
              </div>
              <button type="submit" className={styles.button}>
                Submit
              </button>
              <button type="button" onClick={handleFormToggle}>
                New user? Register
              </button>
              <p>or sign in using</p>
              <div className={styles.imageCont}>
                <Link
                  to="/"
                  onClick={() => {
                    metamaskLogin();
                  }}
                >
                  <img
                    src={metamask}
                    height="80px"
                    width="80px"
                    alt="metamask"
                  />
                </Link>
                {/* <Link>
                <img
                  src={walleconnectlogo}
                  height="80px"
                  width="80px"
                  alt="walletconnect"
                />
              </Link> */}
              </div>
            </form>
          )}
        </div>
      </div>

      {/* {errMsg && (
        <div className={styles.err_msg_container}>
          <p>Invalid Credentials</p>
          <img src={cross} onClick={CrossHandler} alt="" />
        </div>
      )}
      {waitAuth && (
        <div className={styles.wait_msg_container}>
          <p>Authenticating user...</p>
        </div>
      )} */}
    </div>
    // </div>
  );
};

export default Auth;
