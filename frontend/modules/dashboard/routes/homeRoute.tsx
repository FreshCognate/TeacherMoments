import React from 'react';
import axios from 'axios';
import Title from '~/uikit/content/components/title';
import Body from '~/uikit/content/components/body';
import Icon from '~/uikit/icons/components/icon';
import DashboardContainer from '../containers/dashboardContainer';

export function meta({ }) {
  return [
    { title: "Teacher Moments" },
    { name: "description", content: "Welcome to Teacher Moments!" },
  ];
}

export default function HomeRoute() {
  return (
    <DashboardContainer />
  );
}