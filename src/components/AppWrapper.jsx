// src/components/AppWrapper.jsx
import ContactDrawerProvider from '@/contexts/ContactDrawerContext';
import Navbar from './Navbar';
import ContactDrawer from './ContactDrawer';

export default function AppWrapper() {
  return (
    <ContactDrawerProvider>
      <Navbar />
      <ContactDrawer />
    </ContactDrawerProvider>
  );
}