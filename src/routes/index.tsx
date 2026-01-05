import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import { HomePage } from "./home";
import { RoomPage } from "./room";

const basename = import.meta.env.BASE_URL;

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "room/:roomId",
          element: <RoomPage />,
        },
      ],
    },
  ],
  { basename },
);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
