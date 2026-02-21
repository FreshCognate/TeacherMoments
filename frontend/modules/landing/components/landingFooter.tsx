import React from 'react';

const links = [
  { label: 'Teaching Systems Lab', href: 'https://tsl.mit.edu/' },
  { label: 'Resources', href: 'https://drive.google.com/drive/folders/1A3MxYpjPXSPndW3wMwAUXonZh6kFKYmG?usp=sharing' },
  { label: 'Our team', href: 'https://tsl.mit.edu/team/' },
  { label: 'Twitter', href: 'https://twitter.com/mit_tsl' },
  { label: 'GitHub', href: 'https://github.com/mit-teaching-systems-lab' },
  { label: 'Get in touch', href: 'mailto:teachermoments@mit.edu' },
];

const LandingFooter = () => {
  return (
    <footer className="bg-primary-regular text-white py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="text-xl font-black">Teacher Moments</div>
        <ul className="flex flex-wrap justify-center gap-6">
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="hover:underline" target="_blank" rel="noopener noreferrer">{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default LandingFooter;
