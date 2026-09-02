const LandingHero = () => {
  return (
    <section
      className="relative bg-[#f6f6ee] dark:bg-[#18181b] py-12 md:py-24 px-6 overflow-hidden bg-no-repeat bg-center bg-contain"
      style={{ backgroundImage: 'url(/static/images/landing/doodles-hero.svg)' }}
    >
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <span className="inline-block bg-[#853d61]/10 dark:bg-[#d99bbb]/10 text-[#853d61] dark:text-[#d99bbb] font-bold text-sm md:text-base px-4 py-1.5 rounded-full mb-6">
          New this school year — Branching scenarios
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight md:leading-snug text-[#174650] dark:text-[#e3efef]">
          Preparing{' '}
          <span className="relative inline-block">
            <span className="relative z-10">educators</span>
            <img
              src="/static/images/landing/hero-circle-doodle.svg"
              alt=""
              className="absolute -inset-2 w-[calc(100%+1rem)] h-[calc(100%+1rem)] pointer-events-none z-0"
              aria-hidden="true"
            />
          </span>{' '}
          for real classroom moments through AI-powered digital simulations
        </h1>
        <p className="mt-6 text-lg md:text-2xl text-[#174650]/80 dark:text-[#e3efef]/70 max-w-3xl mx-auto">
          Build practice spaces that adapt to every choice your educators make.
        </p>
      </div>
    </section>
  );
};

export default LandingHero;
