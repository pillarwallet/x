import ReactDom from 'react-dom';

import Modal from './modal';
import { PopapStyles } from './styles';

type PopapProps = {
    showModal?: boolean;
    setShowModal?: (show: boolean) => void;
    createExchange: unknown;
};

function Popap({ showModal, setShowModal, createExchange }: PopapProps) {
    const tooltip = document.getElementById('tooltip_place');

    if (!tooltip) {
        return null;
    }

    return ReactDom.createPortal(
        <>
            <PopapStyles>
                <Modal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    createExchange={createExchange as () => void}
                />
            </PopapStyles>
        </>,
        tooltip,
    );
}

export default Popap;
