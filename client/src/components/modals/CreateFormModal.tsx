// components/Modal.tsx
import React from 'react';

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
            if (handleCloseCallback) {
                handleCloseCallback();
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
            <div className="bg-white rounded-lg shadow-xl transform transition-all max-w-2xl w-full max-h-[90vh] flex flex-col">

                {children}
            </div>
        </div>
    );
};

export default CreateFormModal;