const LandingTestimonial = () => {
  return (
    <section className="bg-[#f6f6ee] dark:bg-[#111113] py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <figure className="flex gap-3 md:gap-6">
          <span className="text-6xl md:text-8xl font-black text-[#174650] dark:text-[#d99bbb] leading-none shrink-0" aria-hidden="true">&ldquo;</span>
          <div>
            <blockquote className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-[#174650] dark:text-[#e3efef] mb-6 bg-transparent border-l-0 p-0">
              What most impressed me is what a fabulous discussion we had with the teacher after they completed the scenarios. When everyone in the group had completed a teacher moments scenario our conversations were more focused.
            </blockquote>
            <figcaption className="text-[#174650] dark:text-[#e3efef]/70">
              &mdash;Julie Smith, University of North Texas
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
};

export default LandingTestimonial;
