import React from 'react';
import axios from 'axios';
import Title from '~/uikit/content/components/title';
import Body from '~/uikit/content/components/body';
import Icon from '~/uikit/icons/components/icon';

export function meta({ }) {
  return [
    { title: "TM" },
    { name: "description", content: "Welcome to TM!" },
  ];
}

export default function Home({ loaderData }) {
  return (
    <div>
      Dashboard
    </div>
  );
}