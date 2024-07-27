import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shorts from "./pages/Shorts";
import Channel from "./pages/Channel";
import Video from "./pages/Video";
import NotFound from "./pages/NotFound";
import Create from "./pages/Create";

const channelName = "mychannel";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path={channelName} element={<Channel />} />
      <Route path={`${channelName}/upload`} element={<Create />} />
      <Route path="shorts/:id" element={<Shorts />} />
      <Route path="video/:id" element={<Video />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);
const App = () => <RouterProvider router={router} />;

export default App;
