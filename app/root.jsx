
import "/styles/styles.css";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { LinksFunction } from "remix";

export const meta = () => ({
  charset: "utf-8",
  title: "Swiftride",
  viewport: "width=device-width,initial-scale=1",
});

export const LinksFunction = () => {
  return [{ rel: "stylesheet", href: "/styles/styles.css" }];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
