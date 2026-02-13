// src/components/abaut/HeaderWithProvider.jsx
import { ContactDrawerProvider } from '../../contexts/ContactDrawerContext';
import ContactDrawer from '../ContactDrawer.jsx';
import Header from './python.jsx';

export default function HeaderWithProvider() {
  return (
    <ContactDrawerProvider>
      <Header />
      <ContactDrawer />
    </ContactDrawerProvider>
  );
}