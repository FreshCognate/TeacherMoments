import React from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./.react-router/types/+types/root";
import stylesheet from "./app.css?url";
import axios from 'axios';
import '~/modules/index';
import NavigationContainer from './modules/navigation/containers/navigationContainer';
import DialogsContainer from './core/dialogs/containers/dialogsContainer';

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const shouldRevalidate = () => false;

export async function loader({ request }) {
  const url = new URL(request.url);
  let isAuthenticated;
  let authentication;
  const headers = {};

  for (const pair of request.headers.entries()) {
    headers[pair[0]] = pair[1];
  }

  try {
    const authenticationRequest = await axios.get(`${url.origin}/api/authentication`, {
      headers
    });
    authentication = authenticationRequest.data.authentication;
    isAuthenticated = true;
  } catch (error) {
    isAuthenticated = false;
  }

  return {
    isAuthenticated,
    authentication,
    NODE_ENV: process.env.NODE_ENV
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="overflow-x-hidden">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App(props) {
  if (typeof window !== 'undefined') {
    window.NODE_ENV = props.loaderData.NODE_ENV;
  }

  return (
    <div className="pt-10">
      <DialogsContainer />
      <NavigationContainer loaderData={props.loaderData} />
      <Outlet />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-10 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}