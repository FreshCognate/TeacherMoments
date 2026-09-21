import React from 'react';
import { Link } from 'react-router';
import Body from '~/uikit/content/components/body';
import Title from '~/uikit/content/components/title';

const quickStarts = [
  {
    to: '/scenarios',
    title: 'Browse & build scenarios',
    body: 'Explore the practice-ready library or build your own — add prompts across slides and branch the story based on how learners respond.',
    isPrimary: true,
  },
  {
    to: '/cohorts',
    title: 'Set up your cohorts',
    body: 'Group participants, assign scenarios, and share an invite link. Track their responses and gather rich data as they practice.',
    isPrimary: false,
  },
];

const whatsNew = [
  {
    emoji: '🌿',
    title: 'Branching scenarios',
    body: 'Scenarios can now split: route educators down different paths based on the choices they make or the answers they write. Describe the response you’re looking for in plain language, and AI matches each written answer against it.',
  },
  {
    emoji: '🤖',
    title: 'AI coaching feedback',
    body: 'Set up triggers that analyze participant responses and deliver personalized coaching feedback with teaching tips.',
  },
  {
    emoji: '📊',
    title: 'Rich response data',
    body: 'Review audio recordings, transcripts, and text responses across your cohorts. Export complete datasets for research or debrief discussions.',
  },
];

const Dashboard = ({
}) => {
  return (
    <div className="p-4">
      <div className="relative overflow-hidden border border-lm-3 dark:border-dm-1 bg-lm-0 dark:bg-dm-1 p-8 md:p-12 rounded-lg">
        <img
          src="/static/images/landing/triple-circle-doodle.svg"
          alt=""
          aria-hidden="true"
          className="absolute -top-6 -right-6 w-32 opacity-40 pointer-events-none hidden md:block"
        />

        <div className="relative">
          <span className="inline-block bg-[#853d61]/10 text-[#853d61] dark:bg-[#d99bbb]/10 dark:text-[#d99bbb] font-bold text-sm px-4 py-1.5 rounded-full mb-6">
            New this school year — Branching scenarios
          </span>

          <Title title="Welcome to Teacher Moments" className="text-5xl md:text-6xl mb-4 text-black/80 dark:text-white/80" />

          <div className="max-w-2xl text-black/60 dark:text-white/60">
            <Body body={`Prepare educators for real classroom moments through AI-powered digital simulations. Build practice spaces that adapt to every choice your educators make.`} />
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            {quickStarts.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`block rounded-lg border p-6 transition-colors ${item.isPrimary
                  ? 'border-[#853d61]/30 bg-[#853d61]/5 hover:bg-[#853d61]/10 dark:border-[#d99bbb]/20 dark:bg-[#d99bbb]/5 dark:hover:bg-[#d99bbb]/10'
                  : 'border-lm-3 dark:border-dm-2 hover:bg-lm-1 dark:hover:bg-dm-2'}`}
              >
                <Title title={item.title} className="text-xl mb-2 text-black/80 dark:text-white/80" />
                <Body body={item.body} size="sm" className="text-black/60 dark:text-white/60" />
              </Link>
            ))}
          </div>

          <div className="mt-12 max-w-2xl">
            <Title title={`What’s new`} className="text-xl mb-4 text-black/80 dark:text-white/80" />
            <div className="space-y-4">
              {whatsNew.map((item) => (
                <div key={item.title}>
                  <Body body={`${item.emoji} ${item.title}`} className="text-black/80 dark:text-white/80 font-bold" />
                  <Body body={item.body} size="sm" className="text-black/60 dark:text-white/60" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
