import React from 'react';
import axios from 'axios';

export function meta({ }) {
  return [
    { title: "TM" },
    { name: "description", content: "Welcome to TM!" },
  ];
}

export async function loader({ request }) {
  const url = new URL(request.url);
  let axiosBaseUrl = process.env.API_BASE_URL || url.origin;
  const users = []
  return { users };
}

export default function Home({ loaderData }) {
  return <div>Home</div>;
}