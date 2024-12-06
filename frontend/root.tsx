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


export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader(props) {
  if (process.env.API_BASE_URL) {
    axios.defaults.baseURL = process.env.API_BASE_URL || '';
  }
  return {
    NODE_ENV: process.env.NODE_ENV,
    API_BASE_URL: process.env.API_BASE_URL
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
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App(props) {
  if (props.loaderData.API_BASE_URL) {
    axios.defaults.baseURL = props.loaderData.API_BASE_URL || '';
  }

  if (typeof window !== 'undefined') {
    window.NODE_ENV = props.loaderData.NODE_ENV;
    window.API_BASE_URL = props.loaderData.API_BASE_URL;
  }

  return <Outlet />;
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
    <main className="pt-16 p-4 container mx-auto">
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