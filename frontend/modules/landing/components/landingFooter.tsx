const links = [
  { label: 'Teaching Systems Lab', href: 'https://tsl.mit.edu/' },
  { label: 'Twitter', href: 'https://twitter.com/mit_tsl' },
  { label: 'Resources', href: 'https://drive.google.com/drive/folders/1A3MxYpjPXSPndW3wMwAUXonZh6kFKYmG?usp=sharing' },
  { label: 'GitHub', href: 'https://github.com/mit-teaching-systems-lab' },
  { label: 'Our team', href: 'https://tsl.mit.edu/team/' },
  { label: 'Get in touch', href: 'mailto:teachermoments@mit.edu' },
];

const LandingFooter = () => {
  return (
    <footer className="bg-[#f6f6ee] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <img src="/tm-logo.png" alt="" className="h-10" />
          <span className="text-lg font-black text-[#174650]">Teacher<br />Moments</span>
        </div>
        <ul className="grid grid-cols-2 gap-x-12 gap-y-3 max-w-sm">
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
