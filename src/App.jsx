import Home from "./components/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore";
import Details from "./pages/Details";
import SearchMovieShow from "./pages/SearchMovieShow";
import Footer from "./components/Footer";

import {
  setBannerData,
  setBollywoodData,
  setConfigImageData,
  setHollywoodData,
  setNowPlayingData,
  setTopRatedData,
  setTvSeriesData,
} from "./redux/movieSlice";
import useFetchTMDB from "./hooks/useFetchTMDB";
import ScrollToTop from "./components/ScrollToTop";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <Navbar />
        <Home />
        <Footer />
      </div>
    ),
  },
  {
    path: "/:explore/:id/similar",
    element: (
      <div>
        <Navbar />
        <Explore />
      </div>
    ),
  },
  {
    path: "/:explore/:id/recommendations",
    element: (
      <div>
        <Navbar />
        <Explore />
      </div>
    ),
  },
  {
    path: "/:explore/:type",
    element: (
      <div>
        <Navbar />
        <Explore />
      </div>
    ),
  },
  {
    path: "/:explore/details/:id",
    element: (
      <div>
        <Navbar />
        <Details />
      </div>
    ),
  },
  {
    path: "/search",
    element: (
      <div>
        <Navbar />
        <SearchMovieShow />
      </div>
    ),
  },
]);

function App() {
  // Fetch configuration data
  useFetchTMDB(
    "/configuration",
    (data) => data.images.secure_base_url + "original",
    setConfigImageData
  );
  // Fetch trending data
  useFetchTMDB(
    "/trending/all/day?language=en-US&page=1",
    (data) => data?.results,
    setBannerData
  );

  // Fetch now playing data
  useFetchTMDB(
    "/movie/now_playing",
    (data) => data?.results,
    setNowPlayingData
  );

  // Fetch top rated data
  useFetchTMDB("/movie/top_rated", (data) => data?.results, setTopRatedData);

  // Fetch tv series data
  useFetchTMDB("/tv/popular", (data) => data?.results, setTvSeriesData);

  // Fetch bollywood data
  useFetchTMDB(
    "/discover/movie?with_original_language=hi&sort_by=popularity.desc",
    (data) => data?.results,
    setBollywoodData
  );

  // Fetch hollywood data
  useFetchTMDB(
    "/discover/movie?with_original_language=en&sort_by=vote_average.desc",
    (data) => data?.results,
    setHollywoodData
  );

  return (
    <div className="font-poppins bg-[#151515] text-white">
      <RouterProvider router={router}>
        <ScrollToTop />
      </RouterProvider>
    </div>
  );
}

export default App;
