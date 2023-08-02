import { Link, useNavigate } from "react-router-dom";
import styles from "./dashboard.module.css";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../Context/UserContext";

const Dashboard = () => {
  const [logout, setlogout] = useState(false);

  useEffect(() => {
    if (logout) {
      navigate("/");
    }
  }, [logout]);

  const navigate = useNavigate();

  const {
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
    setSignature,
  } = useContext(UserContext);
 

  return (
    <div className={styles.parent_container}>
      <div className={styles.main_container}>
        <div>
          <div className={styles.heading_container}>
            <h1>Dashboard</h1>
          </div>
          {email != null ? (
            <div className={styles.row}>
              <h3>Email:</h3>
              <h4 className={styles.h4text}>{email}</h4>
            </div>
          ) : (
            <>
              <div className={styles.row}>
                <h3>Wallet address:</h3>
                <h4 className={styles.h4text}>{walletAddress}</h4>
              </div>
              <div className={styles.row}>
                <h3>Signature:</h3>
                <h4 className={styles.h4text}>{signature}</h4>
              </div>
            </>
          )}

       

          <button
            type="submit"
            onClick={() => setlogout(true)}
            className={styles.button}
          >
            Logout
          </button>
        </div>
      </div>

      {}
    </div>
   
  );
};

export default Dashboard;
