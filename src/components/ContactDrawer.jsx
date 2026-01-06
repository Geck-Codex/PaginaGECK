// src/components/ContactDrawer.jsx
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useContactDrawer } from '../contexts/ContactDrawerContext';
import Contact from './contacto/Contact.jsx';

export default function ContactDrawer() {
  const { isOpen, closeDrawer } = useContactDrawer();

  // Prevenir scroll cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeDrawer();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeDrawer]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 6, 20, 0.7);
          backdrop-filter: blur(8px);
          z-index: 9998;
          animation: fadeIn 0.3s ease-out;
        }

        .drawer-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 600px;
          background: linear-gradient(135deg, #050D1A 0%, #0B1D33 50%, #060E1B 100%);
          box-shadow: -8px 0 40px rgba(0, 0, 0, 0.5);
          z-index: 9999;
          overflow-y: auto;
          animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .drawer-panel::-webkit-scrollbar {
          width: 8px;
        }

        .drawer-panel::-webkit-scrollbar-track {
          background: rgba(2, 6, 20, 0.3);
        }

        .drawer-panel::-webkit-scrollbar-thumb {
          background: #D4AF37;
          border-radius: 4px;
        }

        .close-button {
          position: sticky;
          top: 20px;
          left: 20px;
          z-index: 10000;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(212, 175, 55, 0.15);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(212, 175, 55, 0.4);
          color: #D4AF37;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: -48px;
          float: left;
        }

        .close-button:hover {
          background: rgba(212, 175, 55, 0.25);
          border-color: rgba(212, 175, 55, 0.6);
          transform: rotate(90deg) scale(1.1);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .drawer-panel {
            max-width: 100%;
          }
        }
      `}</style>

      {/* Overlay */}
      <div 
        className="drawer-overlay" 
        onClick={closeDrawer}
      />

      {/* Panel */}
      <div className="drawer-panel">
        <button 
          className="close-button"
          onClick={closeDrawer}
          aria-label="Cerrar"
        >
          <X size={24} />
        </button>

        {/* Componente de contacto */}
        <div style={{ padding: '20px' }}>
          <Contact />
        </div>
      </div>
    </>
  );
}