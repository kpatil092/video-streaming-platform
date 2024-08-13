import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shorts from "./pages/Shorts";
import Channel from "./pages/Channel";
import Video from "./pages/Video";
import NotFound from "./pages/NotFound";
import Create from "./pages/Create";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Subscriptions from "./pages/Subscriptions";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserVideos from "./pages/UserVideos";
import Playlist from "./pages/Playlist";
import Error from "./components/Error";
import { EntryRoutes, PrivateRoute } from "./components/PrivateRoute";

const channelName = "channel";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<Error />}>
      <Route index element={<Navigate to="/home" />} />
      <Route path="home" element={<Home />} />

      {/* Entry Routes */}
      <Route element={<EntryRoutes />}>
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Route>

      {/* Secured Routes */}
      <Route element={<PrivateRoute />}>
        <Route path={channelName} element={<Channel />} />
        <Route path={`${channelName}/upload`} element={<Create />} />
        <Route path="shorts/:id" element={<Shorts />} />
        <Route path="video/:id" element={<Video />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="c/videos" element={<UserVideos />} />
        <Route path="playlist" element={<Playlist />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
