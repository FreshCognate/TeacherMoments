import React from 'react';
import Body from '~/uikit/content/components/body';
import Title from '~/uikit/content/components/title';

const Dashboard = ({
}) => {
  return (
    <div className="p-4">
      <div className="border border-lm-3 dark:border-dm-1 bg-lm-0 dark:bg-dm-1 p-6 rounded-lg">
        <Title title="Welcome to Teacher Moments" className="text-2xl mb-4" />
        <div className="space-y-4">
          <Body body={"Teacher Moments is currently being field-tested by a small cohort of educators to ensure the highest quality experience. We are putting the finishing touches on our immersive scenarios and AI coaching agents."} />
          <Body body={"Full access begins early spring 2026. Get ready to bridge the gap between theory and practice."} />
          <Body body={`Teacher Moments is a "practice space" where teachers can rehearse responses to difficult or high-stakes classroom scenarios—such as addressing student behavior, navigating equity issues, or communicating with parents—in a low-risk, digital environment.`} />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;