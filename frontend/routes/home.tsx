import React from 'react';
import axios from 'axios';

export function meta({ }) {
  return [
    { title: "TM" },
    { name: "description", content: "Welcome to TM!" },
  ];
}

export async function loader() {
  console.log('loading');
  const users = await axios.get('http://localhost:4000/api/users');
  return users;
}

export default function Home({ loaderData }) {
  console.log(loaderData);
  return <div>Home</div>;
}