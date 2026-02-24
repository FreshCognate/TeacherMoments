import classnames from 'classnames';

const features = [
  {
    title: 'Explore a library of teaching scenarios',
    description: 'Choose from practice-ready teaching scenarios developed by teacher educators, or browse publicly shared scenarios from the community.',
    image: '/static/images/landing/main-feature-scenarios.png',
    alt: 'Scenario library with searchable card grid',
    doodle: '/static/images/landing/purple-scenario-doodle.svg',
  },
  {
    title: 'Author scenarios with our block-based editor',
    description: 'Build rich classroom simulations with our drag-and-drop editor — add text, video, images, audio prompts, and multiple choice questions across slides.',
    image: '/static/images/landing/main-feature-author.png',
    alt: 'Two-panel scenario editor with slide navigation and content blocks',
    doodle: '/static/images/landing/triple-circle-doodle.svg',
  },
  {
    title: 'Organize learners into cohorts',
    description: 'Group participants into cohorts, assign scenarios, and track their responses. Share a simple invite link so learners can join and get started.',
    image: '/static/images/landing/main-feature-cohorts.png',
    alt: 'Cohort management with assigned and available scenarios',
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
