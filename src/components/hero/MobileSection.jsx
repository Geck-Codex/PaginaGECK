import ServiceSectionComponent from '@/components/hero/ServiceSection.jsx';

export default function MobileSection() {
  return (
    <ServiceSectionComponent
      videoSrc="/assets/video/cel.mp4"
      title="Desarrollo Móvil"
      description="Apps móviles nativas y multiplataforma que tus usuarios amarán y usarán todos los días"
      link="/servicios/mobile"
      buttonText="Explorar Móvil"
    />
  );
}