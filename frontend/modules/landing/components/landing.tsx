import LandingHeader from './landingHeader';
import LandingHero from './landingHero';
import LandingStepper from './landingStepper';
import LandingMainFeatures from './landingMainFeatures';
import LandingTestimonial from './landingTestimonial';
import LandingDeepFeatures from './landingDeepFeatures';
import LandingFacilitatorSignup from './landingFacilitatorSignup';
import LandingFooter from './landingFooter';

const Landing = ({ onAuthClicked }: { onAuthClicked: () => void }) => {
  return (
    <div>
      <LandingHeader onAuthClicked={onAuthClicked} />
      <LandingHero />
      <LandingStepper onAuthClicked={onAuthClicked} />
      <LandingMainFeatures />
      <LandingTestimonial />
      <LandingDeepFeatures onAuthClicked={onAuthClicked} />
      <LandingFacilitatorSignup />
      <LandingFooter />
    </div>
  );
};

export default Landing;
