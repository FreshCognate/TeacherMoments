const FacilitatorIcon = () => (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Person head */}
        <path d="M20 16a6 6 0 1 1 12 0 6 6 0 0 1-12 0Zm2 0a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" fill="#000" />
        {/* Person body */}
        <path d="M14 38v-4a12 12 0 0 1 24 0v4h-2v-4a10 10 0 0 0-20 0v4h-2Z" fill="#000" />
        {/* Clipboard body */}
        <path d="M36 22h16a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H36a2 2 0 0 1-2-2V24a2 2 0 0 1 2-2Zm0 2v20h16V24H36Z" fill="#000" />
        {/* Clipboard clip */}
        <path d="M40 20h8a1 1 0 0 1 1 1v3h-2v-2h-6v2h-2v-3a1 1 0 0 1 1-1Z" fill="#000" />
        {/* Checkmark */}
        <path d="M40.5 33.5 43 36l5-5 1.4 1.4L43 38.8l-3.9-3.9 1.4-1.4Z" fill="#000" />
        {/* Line on clipboard */}
        <rect x="39" y="40" width="10" height="1.5" rx=".75" fill="#000" />
    </svg>
);

const LandingFacilitatorSignup = () => {
    return (
        <section className="bg-[#f0f6f7] py-16 px-6">
            <div className="max-w-3xl mx-auto text-center">
                <div className="mb-6 flex justify-center">
                    <FacilitatorIcon />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#174650] mb-4">
                    Become a Facilitator
                </h2>
                <p className="text-lg text-[#174650]/80 mb-8">
                    Create scenarios, manage cohorts, track learner progress, and analyze response data across your groups.
                </p>
                <a
                    href="https://forms.gle/CeirVbWNcQowXjN49"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#853d61] text-white text-xl md:text-2xl px-6 md:px-10 py-4 rounded-full font-bold hover:bg-[#5c1a3b] transition-colors"
                >
                    Sign Up as a Facilitator
                </a>
            </div>
        </section>
    );
};

export default LandingFacilitatorSignup;

