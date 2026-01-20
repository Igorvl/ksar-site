import { createContext, useContext, useState } from 'react'

const ModalContext = createContext({
    isContactModalOpen: false,
    openContactModal: () => { },
    closeContactModal: () => { },
})

export function ModalProvider({ children }) {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false)

    const openContactModal = () => setIsContactModalOpen(true)
    const closeContactModal = () => setIsContactModalOpen(false)

    return (
        <ModalContext.Provider value={{ isContactModalOpen, openContactModal, closeContactModal }}>
            {children}
        </ModalContext.Provider>
    )
}

export function useModal() {
    return useContext(ModalContext)
}

export default ModalContext
