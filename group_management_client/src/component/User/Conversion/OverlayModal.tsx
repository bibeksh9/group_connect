import './addMember.css';
import { AiOutlineClose } from 'react-icons/ai';
const OverlayModal = ({ handleClose, show, children }: any) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                {children}
                <div id="close">
                    <AiOutlineClose onClick={handleClose} />

                </div>

            </section>
        </div>
    );
};
export default OverlayModal;