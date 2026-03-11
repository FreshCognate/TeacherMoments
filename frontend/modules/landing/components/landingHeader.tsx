import { useState } from 'react';

const LandingHeader = ({ onAuthClicked }: { onAuthClicked: () => void }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#f6f6ee] relative">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <img src="/tm-logo.png" alt="" className="w-16" />
            <span className="ml-2 font-extralight leading-4 text-sm text-[#174650]">Teacher<br />Moments</span>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-4">
            <li>
              <button onClick={onAuthClicked} className="text-[#174650] underline hover:opacity-80">Sign in</button>
            </li>
            <li>
              <button onClick={onAuthClicked} className="bg-[#853d61] text-white px-5 py-2 rounded-full font-bold hover:bg-[#5c1a3b] transition-colors">Sign up</button>
            </li>
          </ul>
        </nav>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`block w-6 h-0.5 bg-[#174650] transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#174650] transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-[#174650] transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#f6f6ee] border-t border-[#174650]/10 shadow-lg z-50">
          <ul className="flex flex-col items-center gap-4 py-6">
            <li>
              <button onClick={() => { setMenuOpen(false); onAuthClicked(); }} className="text-[#174650] underline hover:opacity-80 text-lg">Sign in</button>
            </li>
            <li>
              <button onClick={() => { setMenuOpen(false); onAuthClicked(); }} className="bg-[#853d61] text-white px-8 py-3 rounded-full font-bold hover:bg-[#5c1a3b] transition-colors text-lg">Sign up</button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
