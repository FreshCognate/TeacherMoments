const features = [
  {
    title: 'Track participant choices for facilitation and debrief',
    description: 'Rich data dashboards allow facilitators to see participant choices and prepare for debriefing, while complete data downloads support rigorous research on teacher learning.',
    image: '/static/images/landing/deep-feature-data-frame.png',
    alt: 'Track participation choices',
  },
  {
    title: 'Choices matter',
    description: 'Through scenario branching, create "choose-your-own" adventure scenarios that let participants understand the consequences of their choices.',
    image: '/static/images/landing/deep-feature-branching-frame.png',
    alt: 'Choice branching',
  },
  {
    title: 'AI coaches',
    description: 'Artificially intelligent coaching agents can listen to participants as they play scenarios and offer dynamic supports to help learners reflect and practice.',
    image: '/static/images/landing/deep-feature-ai-frame.png',
    alt: 'AI coaching',
  },
  {
    title: 'Multiplayer scenarios',
    description: 'Real-time chat allows for participants to roleplay together as teachers and students.',
    image: '/static/images/landing/deep-feature-multiplayer-frame.png',
    alt: 'Real-time chat',
  },
];

const LandingDeepFeatures = ({ onAuthClicked }: { onAuthClicked: () => void }) => {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-[#174650] mb-4">Dive deeper into Teacher Moments</h2>
          <p className="text-lg text-[#174650]/80">Become a power user and explore even more features for creating and running your simulations.</p>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {features.map((feature) => (
            <li key={feature.title}>
              <img className="w-full mb-6" src={feature.image} alt={feature.alt} />
              <h3 className="text-2xl font-black text-[#174650] mb-2">{feature.title}</h3>
              <p className="text-[#174650]/80">{feature.description}</p>
            </li>
          ))}
        </ul>
        <div className="relative text-center max-w-[480px] mx-auto overflow-hidden">
          <img
            src="/static/images/landing/red-swoop-arrow.svg"
            alt=""
            className="absolute left-0 top-4 w-16 hidden md:block pointer-events-none"
            aria-hidden="true"
          />
          <button
            onClick={onAuthClicked}
            className="bg-[#853d61] text-white text-xl md:text-2xl px-10 py-4 rounded-full font-bold hover:bg-[#5c1a3b] transition-colors"
          >
            Try Teacher Moments
          </button>
          <img
            src="/static/images/landing/yellow-arrows.svg"
            alt=""
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-16 hidden md:block pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

export default LandingDeepFeatures;
