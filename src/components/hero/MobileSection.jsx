import ServiceSection from '@/components/hero/ServiceSection.jsx';

export default function MobileSection() {
  return (
    <ServiceSection
      videoDesktop="/assets/video/cel.mp4"
      videoMobile="/assets/video/cel.mp4"
      poster="/assets/images/cel-poster.jpg"
      title="Desarrollo Móvil"
      description="Apps móviles nativas y multiplataforma que tus usuarios amarán y usarán todos los días"
      link="/servicios/mobile"
      buttonText="Explorar Móvil"
    />
  );
}
