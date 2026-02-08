// src/components/ContactDrawer.jsx
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useContactDrawer } from '../contexts/ContactDrawerContext';
import Contact from './contacto/Contact.jsx';

export default function ContactDrawer() {
  const { isOpen, closeDrawer } = useContactDrawer();
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Activar animación de entrada
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

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

  // ⚠️ AQUÍ ESTABA EL ERROR - Faltaba closeDrawer en las dependencias
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeDrawer]); // ← AGREGADO closeDrawer

  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => {
      closeDrawer();
      setIsClosing(false);
    }, 600);
  };

  if (!isOpen && !isClosing) return null;

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

        .drawer-overlay.closing {
          animation: fadeOut 0.3s ease-out forwards;
        }

        .drawer-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 600px;
          background: linear-gradient(135deg, #050D1A 0%, #0b1d3387 50%, #060E1B 100%);
          box-shadow: -8px 0 40px rgba(0, 0, 0, 0.5);
          z-index: 9999;
          overflow-y: auto;
          animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .drawer-panel.closing {
          animation: slideOutRight 0.6s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
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

        /* GENIE EFFECT - CONTENIDO */
        .genie-container {
          opacity: 0;
          transform: perspective(1000px) rotateX(-15deg) scale(0.8);
          transform-origin: center bottom;
        }

        .genie-active {
          animation: genieAppear 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes genieAppear {
          0% {
            opacity: 0;
            transform: perspective(1000px) rotateX(-15deg) scale(0.4) translateY(100px);
            filter: blur(10px);
          }
          50% {
            opacity: 0.7;
            transform: perspective(1000px) rotateX(-8deg) scale(0.9) translateY(-20px);
            filter: blur(3px);
          }
          80% {
            transform: perspective(1000px) rotateX(2deg) scale(1.05) translateY(0);
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: perspective(1000px) rotateX(0deg) scale(1) translateY(0);
            filter: blur(0px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
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

        @keyframes slideOutRight {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(100%);
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
        className={`drawer-overlay ${isClosing ? 'closing' : ''}`}
        onClick={handleClose}
      />

      {/* Panel */}
      <div className={`drawer-panel ${isClosing ? 'closing' : ''}`}>
        <button 
          className="close-button"
          onClick={handleClose}
          aria-label="Cerrar"
        >
          <X size={24} />
        </button>

        {/* Componente de contacto con efecto Genie */}
        <div 
          className={`genie-container ${isVisible ? 'genie-active' : ''}`}
          style={{ padding: '20px' }}
        >
          <Contact />
        </div>
      </div>
    </>
  );
}