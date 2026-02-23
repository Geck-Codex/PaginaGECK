import { useState } from 'react';

// Test simplificado del modal
export default function TestModal() {
  const [expandedService, setExpandedService] = useState(null);

  const services = [
    { id: 0, name: "Desarrollo Web", desc: "Sitios web increíbles" },
    { id: 1, name: "Apps Móviles", desc: "Apps iOS y Android" },
    { id: 2, name: "IA", desc: "Inteligencia Artificial" }
  ];

  const expandedServiceData = services.find(s => s.id === expandedService);

  console.log('expandedService:', expandedService);
  console.log('expandedServiceData:', expandedServiceData);

  return (
    <div style={{ padding: '20px', background: '#0a0a0a', minHeight: '100vh', color: 'white' }}>
      <h1>Test Modal - Click en las Cards</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
        {services.map(service => (
          <div
            key={service.id}
            onClick={() => {
              console.log('Clicked:', service.id);
              setExpandedService(service.id);
            }}
            style={{
              width: '200px',
              height: '150px',
              background: '#333',
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
              border: expandedService === service.id ? '2px solid gold' : '2px solid transparent'
            }}
          >
            <h3>{service.name}</h3>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>{service.desc}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {expandedServiceData && (
        <>
          <div 
            onClick={() => setExpandedService(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.9)',
              zIndex: 999
            }}
          />
          
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            color: 'black',
            padding: '40px',
            borderRadius: '20px',
            zIndex: 1000,
            minWidth: '400px'
          }}>
            <button 
              onClick={() => setExpandedService(null)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer'
              }}
            >
              X
            </button>
            
            <h2>{expandedServiceData.name}</h2>
            <p>{expandedServiceData.desc}</p>
            <p style={{ marginTop: '20px', opacity: 0.6 }}>
              Service ID: {expandedServiceData.id}
            </p>
          </div>
        </>
      )}
    </div>
  );
}