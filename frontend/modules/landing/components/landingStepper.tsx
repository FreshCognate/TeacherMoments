import React from 'react';
import Button from '~/uikit/buttons/components/button';

const steps = [
  { number: 1, title: 'Create your own scenario' },
  { number: 2, title: 'Assign scenarios to your student cohorts' },
  { number: 3, title: 'Gather rich data from your cohorts' },
];

const LandingStepper = ({ onAuthClicked }: { onAuthClicked: () => void }) => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <ol className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center mb-12">
          {steps.map((step) => (
            <li key={step.number} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary-regular text-white flex items-center justify-center text-2xl font-black mb-4">
                {step.number}
              </div>
              <p className="font-bold text-lg">{step.title}</p>
            </li>
          ))}
        </ol>
        <div className="text-center">
          <Button text="Try Teacher Moments" color="primary" onClick={onAuthClicked} />
        </div>
      </div>
    </section>
  );
};

export default LandingStepper;
