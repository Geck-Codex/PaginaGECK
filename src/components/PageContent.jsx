// src/components/PageContent.jsx
import { ContactDrawerProvider } from '@/contexts/ContactDrawerContext';

export default function PageContent({ children }) {
  return (
    <ContactDrawerProvider>
      {children}
    </ContactDrawerProvider>
  );
}