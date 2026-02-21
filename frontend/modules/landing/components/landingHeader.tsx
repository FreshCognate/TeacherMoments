const LandingHeader = ({ onAuthClicked }: { onAuthClicked: () => void }) => {
  return (
    <header className="bg-[#f6f6ee]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/tm-logo.png" alt="" className="w-16" />
          <span className="ml-2 font-extralight leading-4 text-sm text-[#174650]">Teacher<br />Moments</span>
        </div>
        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <button onClick={onAuthClicked} className="text-[#174650] underline hover:opacity-80">Sign in</button>
            </li>
            <li>
              <button onClick={onAuthClicked} className="bg-[#853d61] text-white px-5 py-2 rounded-full font-bold hover:bg-[#5c1a3b] transition-colors">Sign up</button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default LandingHeader;
