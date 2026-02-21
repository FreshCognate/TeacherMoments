import classnames from 'classnames';

const features = [
  {
    title: 'Search our existing library of scenarios',
    description: 'Use our robust collection of existing teaching scenarios, developed by MIT teacher educators and partners.',
    image: '/static/images/landing/main-feature-scenarios.png',
    alt: 'Examples of different scenarios',
    doodle: '/static/images/landing/purple-scenario-doodle.svg',
  },
  {
    title: 'Remix scenarios or create your own',
    description: 'With our easy authoring tool, remix existing scenarios or design your own tailored to the needs of your learners.',
    image: '/static/images/landing/main-feature-author.png',
    alt: 'Example of tool that allows author to tailor their scenarios',
    doodle: '/static/images/landing/triple-circle-doodle.svg',
  },
  {
    title: 'Cohorts for teachers to learn together',
    description: 'Through cohorts for classes or PLCs, participants find the scenarios they need to complete and allow you to see their responses easily.',
    image: '/static/images/landing/main-feature-cohorts.png',
    alt: 'Example of different cohorts',
    doodle: '/static/images/landing/red-squiggle-doodle.svg',
  },
];

const LandingMainFeatures = () => {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="sr-only">How do I use Teacher Moments?</h2>
        <ul className="flex flex-col gap-24">
          {features.map((feature, index) => {
            const isReversed = index % 2 !== 0;
            return (
              <li key={feature.title} className="relative">
                <img
                  src={feature.doodle}
                  alt=""
                  className="absolute -top-8 -left-8 w-20 opacity-80 pointer-events-none hidden md:block"
                  aria-hidden="true"
                />
                <div className={classnames(
                  'flex flex-col md:flex-row items-center gap-10',
                  { 'md:flex-row-reverse': isReversed }
                )}>
                  <div className="md:w-1/2">
                    <img className="w-full max-w-lg" src={feature.image} alt={feature.alt} />
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="text-3xl md:text-4xl font-black text-[#174650] mb-4">{feature.title}</h3>
                    <p className="text-lg text-[#174650]/80">{feature.description}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default LandingMainFeatures;
