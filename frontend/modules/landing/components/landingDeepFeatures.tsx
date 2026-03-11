const features = [
  {
    title: 'Track responses for facilitation and research',
    description: 'Review audio recordings, transcripts, and text responses from your participants. Export complete datasets for research or use them to prepare for debrief discussions.',
    image: '/static/images/landing/deep-feature-data-frame.png',
    alt: 'Participant response with audio playback and transcript',
    doodle: '/static/images/landing/red-squiggle-doodle.svg',
  },
  {
    title: 'AI-generated coaching feedback',
    description: 'Set up triggers that analyze participant responses and deliver personalized coaching feedback with teaching tips — powered by AI.',
    image: '/static/images/landing/deep-feature-ai-frame.png',
    alt: 'AI coaching feedback with teaching tips',
    doodle: '/static/images/landing/purple-scenario-doodle.svg',
  },
  {
    title: 'Capture rich learner responses',
    description: 'Ask learners to respond through text, audio recording, or multiple choice — all within a single scenario. Audio responses are automatically transcribed.',
    image: '/static/images/landing/deep-feature-prompts-frame.png',
    alt: 'Scenario player with text, audio, and multiple choice prompts',
    doodle: '/static/images/landing/triple-circle-doodle.svg',
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
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">
          {features.map((feature) => (
            <li key={feature.title} className="relative">
              <img
                src={feature.doodle}
                alt=""
                className="absolute -top-6 -right-6 w-16 opacity-80 pointer-events-none hidden md:block"
                aria-hidden="true"
              />
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
