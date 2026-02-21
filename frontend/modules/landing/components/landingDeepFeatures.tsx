import React from 'react';
import Button from '~/uikit/buttons/components/button';

const features = [
  {
    title: 'Track participant choices for facilitation and debrief',
    description: 'Rich data dashboards allow facilitators to see participant choices and prepare for debriefing, while complete data downloads support rigorous research on teacher learning.',
    image: '/static/images/landing/deep-feature-data-frame.png',
    alt: 'Track participation choices',
  },
  {
    title: 'Choices matter',
    description: 'Through scenario branching, create "choose-your-own" adventure scenarios that let participants understand the consequences of their choices.',
    image: '/static/images/landing/deep-feature-branching-frame.png',
    alt: 'Choice branching',
  },
  {
    title: 'AI coaches',
    description: 'Artificially intelligent coaching agents can listen to participants as they play scenarios and offer dynamic supports to help learners reflect and practice.',
    image: '/static/images/landing/deep-feature-ai-frame.png',
    alt: 'AI coaching',
  },
  {
    title: 'Multiplayer scenarios',
    description: 'Real-time chat allows for participants to roleplay together as teachers and students.',
    image: '/static/images/landing/deep-feature-multiplayer-frame.png',
    alt: 'Real-time chat',
  },
];

const LandingDeepFeatures = ({ onAuthClicked }: { onAuthClicked: () => void }) => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Dive deeper into Teacher Moments</h2>
          <p className="text-lg text-gray-600">Become a power user and explore even more features for creating and running your simulations.</p>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          {features.map((feature) => (
            <li key={feature.title} className="flex gap-6 items-start">
              <img className="w-32 flex-shrink-0 rounded-lg" src={feature.image} alt={feature.alt} />
              <div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="text-center">
          <Button text="Try Teacher Moments" color="primary" onClick={onAuthClicked} />
        </div>
      </div>
    </section>
  );
};

export default LandingDeepFeatures;
