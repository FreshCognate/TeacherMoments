import React from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
} from "react-router";

import type { Route } from "./.react-router/types/+types/root";
import stylesheet from "./app.css?url";
import axios from 'axios';
import '~/modules/index';
import NavigationContainer from './modules/navigation/containers/navigationContainer';
import DialogsContainer from './core/dialogs/containers/dialogsContainer';
import each from 'lodash/each';
import classnames from 'classnames';

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
    NODE_ENV: process.env.NODE_ENV,
    STORAGE_NAME: process.env.STORAGE_NAME,
    STORAGE_ENDPOINT: process.env.STORAGE_ENDPOINT,
    TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY,
    TURNSTILE_ENABLED: process.env.TURNSTILE_ENABLED,
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
      <body className="overflow-x-hidden overscroll-none">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App(props) {

  const matches = useMatches();

  let isNavigationVisible = true;

  each(matches, match => {

    if (match.handle && match.handle.isNavigationVisible === false) {
      isNavigationVisible = false;
    }

  });

  if (typeof window !== 'undefined') {
    window.NODE_ENV = props.loaderData.NODE_ENV;
    window.STORAGE_NAME = props.loaderData.STORAGE_NAME;
    window.STORAGE_ENDPOINT = props.loaderData.STORAGE_ENDPOINT;
    window.TURNSTILE_SITE_KEY = props.loaderData.TURNSTILE_SITE_KEY;
    window.TURNSTILE_ENABLED = props.loaderData.TURNSTILE_ENABLED;
  }

  return (
    <div className={classnames({ "pt-14": isNavigationVisible })}>
      <DialogsContainer />
      {(isNavigationVisible) && (
        <NavigationContainer loaderData={props.loaderData} />
      )}
      <div className="max-w-7xl mx-auto">
        <Outlet context={{ loaderData: props.loaderData }} />
      </div>
    </div >
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