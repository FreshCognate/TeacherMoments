import React from 'react';
import axios from 'axios';
import LoginContainer from '~/modules/authentication/containers/loginContainer';

export function meta({ }) {
  return [
    { title: "TM" },
    { name: "description", content: "Welcome to TM!" },
  ];
}

export default function LoginRoute() {
  return (
    <LoginContainer />
  )
}