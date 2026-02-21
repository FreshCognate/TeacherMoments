import React from 'react';

const features = [
  {
    title: 'Search our existing library of scenarios',
    description: 'Use our robust collection of existing teaching scenarios, developed by MIT teacher educators and partners.',
    image: '/static/images/landing/main-feature-scenarios.png',
    alt: 'Examples of different scenarios',
  },
  {
    title: 'Remix scenarios or create your own',
    description: 'With our easy authoring tool, remix existing scenarios or design your own tailored to the needs of your learners.',
    image: '/static/images/landing/main-feature-author.png',
    alt: 'Example of tool that allows author to tailor their scenarios',
  },
  {
    title: 'Cohorts for teachers to learn together',
    description: 'Through cohorts for classes or PLCs, participants find the scenarios they need to complete and allow you to see their responses easily.',
    image: '/static/images/landing/main-feature-cohorts.png',
    alt: 'Example of different cohorts',
  },
];

const LandingMainFeatures = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="sr-only">How do I use Teacher Moments?</h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature) => (
            <li key={feature.title} className="flex flex-col items-center text-center">
              <img className="w-full max-w-xs mb-6 rounded-lg" src={feature.image} alt={feature.alt} />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default LandingMainFeatures;
