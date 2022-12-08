/* global ------------------------------------------------------------------ */
import React from "react";

/* mui --------------------------------------------------------------------- */
import CloseIcon from "@mui/icons-material/Close";

const NoLeftSeatModal = ({ handleModal }) => {
  const modalName = "no-left-seat";
  return (
    <dialog className={`${modalName}-modal__container`}>
      <button className="btn-close" onClick={(e) => handleModal(e, modalName)}>
        <CloseIcon className="btn-close__icon" />
      </button>
      <div>
        <h5>NO LEFT SEAT</h5>
        <p>
          You reached the total amount of invitations according to the room seats that you've set. <br />
          <br />
          You can backtrack on the form to add more players <br />
          <br />
        </p>
      </div>
    </dialog>
  );
};

export default NoLeftSeatModal;
