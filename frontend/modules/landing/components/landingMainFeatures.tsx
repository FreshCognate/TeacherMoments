import classnames from 'classnames';

const features = [
  {
    title: 'New this fall: scenarios that follow your learners’ lead',
    description: 'With branching, the story can split: route educators down different paths based on the choices they make or the answers they write. Describe the response you’re looking for in plain language, and AI matches each written answer against it — no exact wording required. Every educator gets practice shaped by their own decisions.',
    image: '/static/images/landing/deep-feature-branching-frame.png',
    alt: 'Branching trigger editor routing responses to different stems',
    doodle: '/static/images/landing/purple-scenario-doodle.svg',
  },
  {
    title: 'AI-generated coaching feedback',
    description: 'Set up triggers that analyze participant responses and deliver personalized coaching feedback with teaching tips — powered by AI.',
    image: '/static/images/landing/deep-feature-ai-frame.png',
    alt: 'AI coaching feedback with teaching tips',
    doodle: '/static/images/landing/red-squiggle-doodle.svg',
  },
];

const LandingMainFeatures = () => {
  return (
    <section className="bg-white dark:bg-[#18181b] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="sr-only">How do I use Teacher Moments?</h2>
        <ul className="flex flex-col gap-12 md:gap-24">
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
                    <img className="w-full max-w-sm mx-auto md:max-w-lg" src={feature.image} alt={feature.alt} />
                  </div>
                  <div className="md:w-1/2 text-center md:text-left">
                    <h3 className="text-3xl md:text-4xl font-black text-[#174650] dark:text-[#e3efef] mb-4">{feature.title}</h3>
                    <p className="text-lg text-[#174650]/80 dark:text-[#e3efef]/70">{feature.description}</p>
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
