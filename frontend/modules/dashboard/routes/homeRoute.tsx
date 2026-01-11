import React from 'react';
import axios from 'axios';
import Title from '~/uikit/content/components/title';
import Body from '~/uikit/content/components/body';
import Icon from '~/uikit/icons/components/icon';

export function meta({ }) {
  return [
    { title: "Teacher Moments" },
    { name: "description", content: "Welcome to Teacher Moments!" },
  ];
}

export default function HomeRoute() {
  return (
    <div className="p-4">
      <div className="border border-lm-3 dark:border-dm-1 bg-lm-0 dark:bg-dm-1 p-6 rounded-lg text-center">
        Coming Soon...
      </div>
    </div>
  );
}