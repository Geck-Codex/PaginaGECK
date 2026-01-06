// src/contexts/ContactDrawerContext.jsx
import { createContext, useContext, useState } from 'react';

const ContactDrawerContext = createContext();

export function ContactDrawerProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  return (
    <ContactDrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer }}>
      {children}
    </ContactDrawerContext.Provider>
  );
}

export function useContactDrawer() {
  const context = useContext(ContactDrawerContext);
  if (!context) {
    throw new Error('useContactDrawer debe usarse dentro de ContactDrawerProvider');
  }
  return context;
}
export default ContactDrawerProvider;