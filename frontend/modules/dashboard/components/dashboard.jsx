import React from 'react';
import Body from '~/uikit/content/components/body';
import Title from '~/uikit/content/components/title';

const Dashboard = ({
}) => {
  return (
    <div className="p-4">
      <div className="border border-lm-3 dark:border-dm-1 bg-lm-0 dark:bg-dm-1 p-12 rounded-lg">
        <Title title="Welcome to Teacher Moments 2.0" className="text-6xl mb-4 text-black/80 dark:text-white/80" />
        <div className="max-w-2xl">
          <div className="space-y-8">
            <Body body={`Rebuilt from the ground up. Smarter, faster, and more secure.`} className='text-black/80 dark:text-white/80' />
            <div className="text-black/60 dark:text-white/60 space-y-4">
              <Body body={`Teacher Moments is a digital "practice space" where educators can rehearse responses to high-stakes classroom scenarios—from navigating equity issues to communicating with parents—in a low-risk environment.`} />
              <Body body={`We are proud to introduce Teacher Moments 2.0, a complete reimagining of our platform designed to better support your professional growth.`} />
            </div>
            <div>
              <Title title={`What’s New in Version 2.0?`} className="text-xl mb-4 text-black/80 dark:text-white/80" />
              <div className="text-black/60 dark:text-white/60 space-y-4">
                <Body body={`🤖 AI-Powered Coaching: Experience our new AI agents that provide real-time, personalized feedback on your responses.`} />
                <Body body={`⚡ Enhanced Performance & Security: We have rebuilt our architecture from scratch to ensure a lightning-fast experience with enterprise-grade data security.`} />
                <Body body={`🎨 Streamlined Interface: A modern, intuitive design that lets you focus entirely on the practice.`} />
              </div>
            </div>
            <div>
              <Title title={`📅 Launch Timeline`} className="text-xl mb-4 text-black/80 dark:text-white/80" />
              <div className="text-black/60 dark:text-white/60 space-y-4">
                <Body body={`Teacher Moments is currently being field-tested by a small cohort of educators to ensure the highest quality experience as we put the finishing touches on our immersive scenarios.`} />
                <Body body={`Full access begins Early Spring 2026. Get ready to bridge the gap between theory and practice.`} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;