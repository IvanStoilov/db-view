import React from "react";
import { PropsWithChildren } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "../../components/Layout/Layout";
import { FavoriteDetailsPage } from "../FavoriteDetailsPage/FavoriteDetailsPage";
import { ConnectionPage } from "../ConnectionPage/ConnectionPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "favorites/:favoriteId",
        element: <FavoriteDetailsPage />,
      },
      {
        path: "connections/:connectionId",
        element: <ConnectionPage />,
      },
    ],
  },
]);

export function Router(props: PropsWithChildren) {
  return (
    <>
      {props.children}
      <RouterProvider router={router} />
    </>
  );
}
