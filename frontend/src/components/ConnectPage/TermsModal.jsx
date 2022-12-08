/* global ------------------------------------------------------------------ */
import React from "react";

/* mui --------------------------------------------------------------------- */
import CloseIcon from "@mui/icons-material/Close";

const TermsModal = ({ handleModal }) => {
  return (
    <dialog className="terms-modal__container">
      <button className="btn-close" onClick={handleModal}>
        <CloseIcon className="btn-close__icon" />
      </button>
      <div>
        <h5>TERMS OF SERVICE</h5>
        <p>
          J'atteste de l'exactitude des informations fournies et accepte le traitement de mes données personnelles par
          Tales pour les fins de fonctionnement normal du service et statistiques dans les conditions prévues par la
          Politique de confidentialité. <br />
          <br />
          Ces données seront supprimées au maximum un an après la fin de ma procédure de candidature ou de la fin de ma
          participation à un programme opéré par Tales. <br />
          <br />
          Je dispose à tout moment d'un droit d'accès, de rectification et de suppression qui peut-être exercé en
          contactant l'adresse anicet.celerier@gmail.com.
        </p>
      </div>
    </dialog>
  );
};

export default TermsModal;
