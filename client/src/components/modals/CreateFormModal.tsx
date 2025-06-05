// components/Modal.tsx
import React from 'react';
import styles from '@/components/index.module.css'
interface ModalProps {
    show: boolean;
    setShow: (value: boolean) => void;
    handleCloseCallback?: () => void;
    children: React.ReactNode;
}

const CreateFormModal: React.FC<ModalProps> = ({ show, setShow, children, handleCloseCallback }) => {
    if (!show) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setShow(false);
            if(handleCloseCallback){
                handleCloseCallback();
            }
        }
    };

    return (

        <div className={`${styles.modal_backdrop}`} onClick={handleBackdropClick}>
            <div className={`${styles.modal}`}>
                {children}
            </div>
        </div>


    );
};

export default CreateFormModal;


