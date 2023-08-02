import { useState, useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import styles from "./Modal.module.css";
import cross from "../../Assets/cross.svg";

const Modal = (props) => {
  const { modal, setModal, msg, setMsg, modalColor, setModalColor } =
    useContext(UserContext);
  const modalButtonHandler = () => {
    setModal(false);
  };
  return (
    <div className={styles.modal} style={{ backgroundColor: modalColor }}>
      {modal && (
        <div>
          <h1>{msg}</h1>
          <img src={cross} onClick={modalButtonHandler} alt="" />
        </div>
      )}
    </div>
  );
};

export default Modal;
