import React from 'react';
import LandingHeader from './landingHeader';
import LandingHero from './landingHero';
import LandingStepper from './landingStepper';
import LandingMainFeatures from './landingMainFeatures';
import LandingTestimonial from './landingTestimonial';
import LandingDeepFeatures from './landingDeepFeatures';
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
      <LandingFooter />
    </div>
  );
};

export default Landing;
