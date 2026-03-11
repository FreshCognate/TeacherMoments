const LandingHero = () => {
  return (
    <section
      className="relative bg-[#f6f6ee] py-12 md:py-24 px-6 overflow-hidden bg-no-repeat bg-center bg-contain"
      style={{ backgroundImage: 'url(/static/images/landing/doodles-hero.svg)' }}
    >
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight md:leading-snug text-[#174650]">
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
      </div>
    </section>
  );
};

export default LandingHero;
