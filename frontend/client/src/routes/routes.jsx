import { createBrowserRouter } from "react-router-dom"

import Wallet from "../pages/wallet"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register";
import CreateNFT from "../pages/CreateNFT";
import Explore from "../pages/Explore";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/wallet",
        element: <Wallet />
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
    path: "/register",
    element: <Register />
    },
    {
    path: "/create-nft",
    element: <CreateNFT />
  },
  {
    path: "/explore",
    element: <Explore />
  }
])