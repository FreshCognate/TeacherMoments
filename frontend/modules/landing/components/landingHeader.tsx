import React from 'react';

const LandingHeader = ({ onAuthClicked }: { onAuthClicked: () => void }) => {
  return (
    <header className="bg-primary-regular text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-xl font-black">Teacher Moments</div>
        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <button onClick={onAuthClicked} className="hover:underline">Sign in</button>
            </li>
            <li>
              <button onClick={onAuthClicked} className="bg-white text-primary-regular px-4 py-2 rounded font-bold hover:bg-lm-2">Sign up</button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default LandingHeader;
