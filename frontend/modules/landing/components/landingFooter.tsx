const links = [
  { label: 'Freshcognate', href: 'https://freshcognate.com/' },
  { label: 'Teaching Systems Lab', href: 'https://tsl.mit.edu/' },
  { label: 'Resources', href: 'https://drive.google.com/drive/folders/1A3MxYpjPXSPndW3wMwAUXonZh6kFKYmG?usp=sharing' },
  { label: 'GitHub', href: 'https://github.com/FreshCognate/TeacherMoments' },
  { label: 'Get in touch', href: 'mailto:doug@freshcognate.com' },
];

const LandingFooter = () => {
  return (
    <footer className="bg-[#f6f6ee] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-8">
          <div className="flex items-center gap-2">
            <img src="/tm-logo.png" alt="" className="h-10" />
            <span className="text-lg font-black text-[#174650]">Teacher<br />Moments</span>
          </div>
          <span className="text-[#174650]/30 text-2xl font-light hidden md:inline" aria-hidden="true">|</span>
          <a href="https://freshcognate.com/" target="_blank" rel="noopener noreferrer">
            <img src="/static/images/landing/freshcognate-logo.png" alt="Freshcognate" className="h-10" />
          </a>
          <span className="text-[#174650]/30 text-2xl font-light hidden md:inline" aria-hidden="true">|</span>
          <a href="https://tsl.mit.edu/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <img src="/static/images/landing/mit-tsl-logo.png" alt="MIT Teaching Systems Lab" className="h-10" />
            <span className="text-sm font-semibold text-[#174650] leading-tight">MIT Teaching<br />Systems Lab</span>
          </a>
        </div>
        <ul className="grid grid-cols-2 gap-x-12 gap-y-3 max-w-sm mx-auto md:mx-0">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="!text-black underline hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default LandingFooter;
