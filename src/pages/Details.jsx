import { NavLink, useNavigate, useParams } from "react-router-dom";
import useFetchDetails from "../hooks/useFetchDetails";
import { useSelector } from "react-redux";
import languageCodes from "../components/LanguageCodes";
import notAvailable from "../assets/imageNotAvailable.png";
import useFetchTMDB from "../hooks/useFetchTMDB";
import Card from "../components/Card";
import {
  setGenreType,
  setProviders,
  setRecommededData,
  setSimilarData,
} from "../redux/movieSlice";
import VideoPlay from "../components/VideoPlay";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SkeletonDetails from "../components/SkeletonDetails";
import { useDispatch } from "react-redux";
import axios from "axios";

const Details = () => {
  const { id, explore } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const similarData = useSelector((state) => state.bingebank.similarData);
  const recommededData = useSelector((state) => state.bingebank.recommededData);
  const providers = useSelector((state) => state.bingebank.providers);
  const [videoType, setVideoType] = useState("Trailer");
  const [showVideo, setShowVideo] = useState(false);
  const [dimMode, setDimMode] = useState(false);
  const [selectedCast, setSelectedCast] = useState(null);
  const [positions, setPositions] = useState([]);
  const [positionGenre, setPositionGenre] = useState([]);
  const [tmdbLink, setTmdbLink] = useState("");
  const country = "IN";

  const fetchWatchProviders = async () => {
    try {
      const response = await axios.get(`/${explore}/${id}/watch/providers`);
      const data = response?.data?.results;
      if (data?.[country]) {
        setTmdbLink(data[country]?.link); // Store TMDB's universal link
        dispatch(setProviders(data[country]?.flatrate || []));
      } else {
        dispatch(setProviders([]));
      }
    } catch (error) {
      console.error("Error fetching watch providers:", error);
      dispatch(setProviders([]));
    }
  };

  useEffect(() => {
    fetchWatchProviders();
  }, [explore, id]);

  const handleGenreClick = (type) => {
    dispatch(setGenreType(type));
  };

  const castRef = useRef(null);

  const handleCastClick = (cast) => {
    setSelectedCast(cast);
  };

  const handleClose = () => {
    setSelectedCast(null);
  };

  const {
    data: detailsData,
    loading,
    error,
  } = useFetchDetails(`/${explore}/${id}`);
  const configImageData = useSelector(
    (state) => state.bingebank.configImageData
  );

  const { data: creditsData, loading: creditsLoading } = useFetchDetails(
    `/${explore}/${id}/credits`
  );

  useFetchTMDB(
    `/${explore}/${id}/similar`,
    (data) => data?.results,
    setSimilarData
  );
  useFetchTMDB(
    `/${explore}/${id}/recommendations`,
    (data) => data?.results,
    setRecommededData
  );

  const handleBack = () => {
    navigate(-1);
  };

  const handleShowVideo = (type) => {
    setVideoType(type);
    setShowVideo(true);
  };

  const handleInteractionOutside = (event) => {
    if (castRef.current && !castRef.current.contains(event.target)) {
      setSelectedCast(null);
    }
  };

  useEffect(() => {
    // Initialize positions with the same length as the cast array
    if (creditsData?.cast) {
      const initialPositions = creditsData?.cast.slice(0, 20).map(() => ({
        x: 0,
        y: 0,
      }));
      setPositions(initialPositions);
    }
  }, [creditsData?.cast]);

  // for cast hover move
  const handleMouseMoveCast = (e, index) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - bounds.left - bounds.width / 2) * 0.3;
    const y = (e.clientY - bounds.top - bounds.height / 2) * 0.3;

    setPositions((prev) =>
      prev.map((pos, i) => (i === index ? { x, y } : pos))
    );
  };
  const handleMouseLeaveCast = (index) => {
    setPositions((prev) =>
      prev.map((pos, i) => (i === index ? { x: 0, y: 0 } : pos))
    );
  };

  useEffect(() => {
    // Initialize positions with the same length as the cast array
    if (detailsData?.genres) {
      const initialPositions = detailsData?.genres.map(() => ({
        x: 0,
        y: 0,
      }));
      setPositionGenre(initialPositions);
    }
  }, [detailsData?.genres]);
  // for genre hover move
  const handleMouseMoveGenre = (e, index) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - bounds.left - bounds.width / 2) * 0.3;
    const y = (e.clientY - bounds.top - bounds.height / 2) * 0.3;

    setPositionGenre((prev) =>
      prev.map((pos, i) => (i === index ? { x, y } : pos))
    );
  };
  const handleMouseLeaveGenre = (index) => {
    setPositionGenre((prev) =>
      prev.map((pos, i) => (i === index ? { x: 0, y: 0 } : pos))
    );
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleInteractionOutside); // For clicks
    document.addEventListener("touchstart", handleInteractionOutside); // For touch events
    return () => {
      document.removeEventListener("mousedown", handleInteractionOutside); // For clicks
      document.removeEventListener("touchstart", handleInteractionOutside); // For touch events
    };
  }, []);

  useEffect(() => {
    if (!showVideo) {
      setDimMode(false);
    }
  }, [showVideo]);

  useEffect(() => {
    if (!location.pathname.includes("videos")) {
      setShowVideo(false);
      setDimMode(false);
    }
  }, [location.pathname]);

  if (loading || creditsLoading) {
    return <SkeletonDetails />;
  }

  if (error) {
    return (
      <div className="details-page md:pt-[80px] pt-[70px] w-full min-h-screen flex justify-center items-center font-light">
        <h1 className="md:text-2xl">Error: {error.message}</h1>
      </div>
    );
  }

  return (
    <div className={`${recommededData?.length > 0 ? "pb-12" : "pb-0"}`}>
      <div className="md:pt-[80px] pt-[70px] w-full min-h-screen flex flex-col mx-auto px-4 relative bg-[#151515] dark:bg-[#151515] text-white">
        <div
          className={`absolute  inset-0 bg-black transition-all duration-300 min-h-screen ${
            dimMode ? "opacity-90 z-30" : "opacity-0 z-0"
          }`}
        />
        <button
          className="text-3xl xxs:text-2xl md:text-4xl lg:text-5xl py-4 w-fit text-start z-30"
          onClick={handleBack}
        >
          <i className="ri-arrow-go-back-fill"></i>
        </button>
        <div className="relative w-full h-full lg:-mt-[80px] ">
          <div className="grid grid-cols-1 overflow-hidden  w-full h-full">
            <img
              src={
                detailsData?.poster_path
                  ? `${configImageData}${detailsData?.backdrop_path}`
                  : "https://via.placeholder.com/300"
              }
              alt={detailsData?.title || detailsData?.name}
              className="lg:w-[90%] w-full h-[300px] xxs:h-[250px] object-cover sm:h-[400px] lg:h-[450px] mx-auto"
            />
          </div>
          <div className="absolute lg:w-[90%] w-full left-1/2 -translate-x-1/2 inset-0 bg-gradient-to-b from-transparent to-black opacity-80" />
        </div>
        <div className="poster md:pl-[10vw] sm:pl-[4vw] pl-[2vw] md:-mt-[200px] -mt-[100px] z-20">
          <div className="flex gap-4 w-full">
            <img
              src={
                detailsData?.poster_path
                  ? `${configImageData}${detailsData?.poster_path}`
                  : notAvailable
              }
              alt={detailsData?.title || detailsData?.name}
              className="xl:w-[350px] lg:w-[300px] md:w-[250px] sm:w-[220px] w-[170px] h-[300px] object-cover sm:h-[370px] md:h-[400px] xl:h-[550px] lg:h-[500px] mx-auto rounded-lg xxs:w-[120px] xxs:h-[240px]"
              style={{
                boxShadow: "0 0 10px rgba(255, 255, 255, 0.6)",
              }}
            />
            <div className="flex flex-col w-full md:px-4 px-2 text-wrap text-start text-sm md:text-base">
              <h1 className="font-semibold cursor-auto xl:text-5xl md:text-3xl sm:text-2xl text-xl xxs:text-lg md:mb-4 mb-1 md:w-[90%]">
                {detailsData?.title || detailsData?.name}
              </h1>
              <i
                className={`tagline mb-1 font-light ${
                  detailsData?.tagline ? "block" : "hidden"
                }`}
              >
                {detailsData?.tagline}
              </i>

              <span className="cursor-auto mb-1">
                Release Date:{" "}
                {detailsData?.release_date || detailsData?.first_air_date}
              </span>
              <span className="cursor-auto ">{detailsData?.media_type} </span>

              <span className="cursor-auto mb-1">
                Language:{" "}
                {languageCodes[detailsData?.original_language] || "Unknown"}
              </span>
              {explore === "movie" ? (
                <span className="duration mb-1">
                  Duration:{" "}
                  {detailsData?.runtime
                    ? `${Math.floor(detailsData.runtime / 60)}h ${
                        detailsData.runtime % 60
                      }min`
                    : "N/A"}
                </span>
              ) : (
                <>
                  <span className="numberOfEpisodes">
                    Number of Episodes:{" "}
                    {detailsData?.number_of_episodes || "N/A"}
                  </span>
                  <span className="numberOfSeasons my-1">
                    Number of Seasons: {detailsData?.number_of_seasons || "N/A"}
                  </span>
                  <span className="episodeRuntime mb-1">
                    Runtime: {detailsData?.episode_run_time?.[0] || "N/A"}
                    {detailsData?.episode_run_time?.[0] && "min"}
                  </span>
                </>
              )}
              <div className="flex md:gap-4 gap-2 ">
                <span className="flex items-center gap-1 cursor-auto">
                  {detailsData?.vote_average &&
                    detailsData?.vote_average.toFixed(1)}
                  <i className="ri-star-half-line text-sm"></i>
                </span>
                <span className="voteCount">
                  <span>
                    {detailsData?.vote_count &&
                      detailsData?.vote_count.toFixed(0) + "+"}
                  </span>{" "}
                  views
                </span>
              </div>

              <span className="createdBy my-1 sm:block hidden">
                Creator:{" "}
                {detailsData?.created_by
                  ?.map((creator) => creator.name)
                  .join(", ") || "N/A"}
              </span>
              <span className="director  mb-1 sm:block hidden">
                Director:{" "}
                {creditsData?.crew
                  ?.filter((member) => member.job === "Director")
                  ?.map((director) => director.name)
                  ?.join(", ") || "N/A"}
              </span>

              <motion.ul className="genre flex flex-wrap md:gap-3 gap-2 md:mb-2 mt-2">
                {detailsData?.genres?.map((genre, index) => (
                  <NavLink
                    key={`${genre.id}-${index}`}
                    to={`/${explore}/${genre.name.toLowerCase()}`}
                    onClick={() => handleGenreClick(explore)}
                  >
                    <motion.li
                      whileHover={{
                        scale: 0.9,
                        transition: { duration: 0.3 },
                      }}
                      whileTap={{ scale: 1, transition: { duration: 0.2 } }}
                      className="cursor-pointer ring-1 md:ring rounded-full md:px-4 md:py-2 px-2 py-1 text-sm xxs:text-xs ring-gray-300"
                      animate={{
                        x: positionGenre[index]?.x || 0, // Use updated position
                        y: positionGenre[index]?.y || 0, // Use updated position
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 20,
                      }}
                      onMouseMove={(e) => handleMouseMoveGenre(e, index)}
                      onMouseOut={() => handleMouseLeaveGenre(index)}
                    >
                      {genre.name}
                    </motion.li>
                  </NavLink>
                ))}
              </motion.ul>

              <div className="font-medium cursor-auto lg:text-2xl lg:block hidden">
                Overview
              </div>
              <span className="synopsis lg:w-[90%] lg:block hidden xl:hidden">
                {detailsData?.overview
                  ? detailsData?.overview.slice(0, 300) + "..."
                  : "N/A"}
              </span>

              <span className="synopsis xl:w-[90%] xl:block hidden">
                {detailsData?.overview
                  ? detailsData?.overview.slice(0, 300) + "..."
                  : "N/A"}
              </span>
              {/* play trailer & clip for bigger screens */}
              <div className="flex justify-center gap-4">
                <div className="w-full mt-2 lg:mt-4 -ml-1 sm:flex hidden h-fit">
                  <button
                    className="w-fit h-fit"
                    onClick={() => handleShowVideo("Trailer")}
                  >
                    <i className="ri-play-circle-fill text-5xl flex items-center gap-1 lg:gap-2 text-[#72ad7f] hover:text-white transition-all duration-300">
                      <span className="text-2xl lg:text-3xl text-nowrap font-poppins font-bold text-white hover:text-[#72ad7f] transition-all duration-300">
                        Play Trailer
                      </span>
                    </i>
                  </button>
                </div>

                <div className="w-full mt-2 lg:mt-4 -ml-1 sm:flex hidden h-fit">
                  <button
                    className="w-fit h-fit"
                    onClick={() => handleShowVideo("Clip")}
                  >
                    <i className="ri-play-circle-fill text-5xl flex items-center gap-1 lg:gap-2  text-[#72ad7f] hover:text-white transition-all duration-300">
                      <span className="text-2xl lg:text-3xl text-nowrap font-poppins font-bold text-white hover:text-[#72ad7f] transition-all duration-300">
                        Play Clip
                      </span>
                    </i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* play trailer & clip for smaller screens */}
          <div className="flex justify-center gap-4">
            <button
              className="my-2 -ml-1 flex w-full sm:hidden"
              onClick={() => handleShowVideo("Trailer")}
            >
              <i className="ri-play-circle-fill text-5xl xxs:text-4xl flex items-center gap-1 lg:gap-2 text-[#72ad7f]">
                <span className="text-2xl xxs:text-lg text-nowrap font-poppins font-bold text-white">
                  Play Trailer
                </span>
              </i>
            </button>
            <button
              className="my-2 -ml-1 flex w-full sm:hidden"
              onClick={() => handleShowVideo("Clip")}
            >
              <i className="ri-play-circle-fill text-5xl xxs:text-4xl flex items-center gap-1 lg:gap-2 text-[#72ad7f]">
                <span className="text-2xl xxs:text-lg text-nowrap font-poppins font-bold text-white">
                  Play Clip
                </span>
              </i>
            </button>
          </div>
          <div className="flex flex-col">
            <span className="createdBy my-1 sm:hidden">
              Creator:{" "}
              {detailsData?.created_by
                ?.map((creator) => creator.name)
                .join(", ") || "N/A"}
            </span>
            <span className="director md:mb-4 mb-1 sm:hidden">
              Director:{" "}
              {creditsData?.crew
                ?.filter((member) => member.job === "Director")
                ?.map((director) => director.name)
                ?.join(", ") || "N/A"}
            </span>
          </div>
          <div className="MobileOverview font-medium mb-1 sm:mt-4 md:mt-0  text-start w-full cursor-auto  sm:text-xl text-xl lg:hidden block">
            Overview
          </div>
          <span className="synopsis lg:hidden block ">
            {detailsData?.overview
              ? detailsData?.overview.slice(0, 500) + "..."
              : "N/A"}
          </span>

          {/* Watch providers */}
          <div className="watch-providers flex justify-between items-center md:w-[75vw] sm:w-[85vw] md:gap-4 gap-8 py-4">
            <h2 className="md:text-3xl text-2xl xxs:text-xl font-bold font-jose">
              Where to Watch?🍿{" "}
            </h2>
            <div className="flex flex-col items-center">
              <div
                className={`flex gap-4 ${
                  providers.length > 2 ? "flex-wrap" : "flex-nowrap"
                } justify-center`}
              >
                {providers?.length > 0 ? (
                  providers?.map((provider) => {
                    const providerUrls = {
                      Netflix: "https://www.netflix.com/",
                      "Amazon Prime Video": "https://www.primevideo.com/",
                      "Disney+": "https://www.disneyplus.com/",
                      Hulu: "https://www.hulu.com/",
                      "Apple TV": "https://tv.apple.com/",
                      "HBO Max": "https://www.hbomax.com/",
                      "Jio Cinema": "https://www.jiocinema.com/",
                      Zee5: "https://www.zee5.com/",
                      "Amazon Prime": "https://www.primevideo.com/",
                      Hotstar: "https://www.hotstar.com/",
                      "Disney+ Hotstar": "https://www.hotstar.com/",
                      Voot: "https://www.voot.com/",
                      "Sony Liv": "https://www.sonyliv.com/",
                      "VI movies and tv": "https://moviesandtv.myvi.in/",
                      Crunchyroll: "https://www.crunchyroll.com/",
                    };

                    const providerLink =
                      providerUrls[provider?.provider_name] || tmdbLink; // Use TMDB link if no direct provider link

                    return (
                      <a
                        key={provider?.provider_name}
                        href={providerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center flex-shrink-0"
                      >
                        <motion.img
                          style={{
                            boxShadow: "0 0px 5px rgba(255, 255, 255, 0.3)",
                          }}
                          whileHover={{
                            scale: 1.2,
                            transition: { duration: 0.3 },
                          }}
                          whileTap={{
                            scale: 1,
                            transition: { duration: 0.2 },
                          }}
                          src={`https://image.tmdb.org/t/p/w300${provider?.logo_path}`}
                          alt={provider?.provider_name}
                          className="lg:w-14 lg:h-14 w-12 h-12 rounded-full"
                        />
                        <p className="text-sm text-center max-w-32">
                          {provider?.provider_name}
                        </p>
                      </a>
                    );
                  })
                ) : (
                  <i className="text-[#cecece]">
                    No streaming options available.
                  </i>
                )}
              </div>

              {tmdbLink && (
                <div className="mt-2 text-center">
                  <a
                    href={tmdbLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View all providers on TMDB
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="font-medium cursor-auto pt-4 lg:text-4xl md:text-3xl sm:text-2xl text-xl px-0">
            Cast{creditsData?.cast?.length === 0 && ":"}{" "}
            <span className="font-light">
              {creditsData?.cast?.length === 0 && "N/A"}
            </span>
          </div>
          <div>
            {/* Cast Grid */}
            <div className="cast w-[90%] my-4 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4 justify-center">
              {creditsData?.cast?.slice(0, 20).map((cast, index) => (
                <motion.div
                  key={cast.id}
                  className="cast-member flex flex-col items-center text-center"
                >
                  <motion.img
                    onClick={() => handleCastClick(cast)}
                    whileHover={{ scale: 0.8, transition: { duration: 0.3 } }}
                    whileTap={{ scale: 1.2, transition: { duration: 0.2 } }}
                    animate={{
                      x: positions[index]?.x || 0,
                      y: positions[index]?.y || 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 250,
                      damping: 20,
                    }}
                    onMouseMove={(e) => handleMouseMoveCast(e, index)}
                    onMouseOut={() => handleMouseLeaveCast(index)}
                    src={
                      cast?.profile_path
                        ? `${configImageData}${cast.profile_path}`
                        : notAvailable
                    }
                    alt={cast?.name}
                    className="w-20 h-20 cursor-pointer sm:w-24 sm:h-24 rounded-full object-cover shadow-lg"
                    style={{
                      boxShadow: "0 0px 5px rgba(255, 255, 255, 0.3)",
                    }}
                  />
                  <p className="text-sm sm:text-base font-light mt-2">
                    {cast?.name}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Full-Screen View */}
            <AnimatePresence>
              {selectedCast && (
                <motion.div
                  className="fixed inset-0 z-30 flex justify-center items-center bg-black bg-opacity-90 pt-[170px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    ref={castRef}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      duration: 1,
                    }}
                    className="relative w-3/4 max-w-xl  rounded overflow-hidden max-h-screen"
                  >
                    <button
                      className="absolute md:top-6 md:right-3 top-5 right-2 -translate-y-1/2 bg-[#303030] hover:bg-[#464646] transition-colors duration-200 text-white md:px-3 md:py-1 px-2 py-1/2 rounded"
                      onClick={handleClose}
                    >
                      <i className="ri-close-large-fill"></i>
                    </button>
                    <img
                      src={
                        selectedCast.profile_path
                          ? `${configImageData}${selectedCast.profile_path}`
                          : notAvailable
                      }
                      alt={selectedCast.name}
                      className="w-full object-cover"
                    />
                    <div className="p-4 bg-black">
                      <h2 className="text-lg text-center font-bold">
                        {selectedCast.name}
                      </h2>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div>
        {similarData?.length > 0 ? (
          <Card
            media_type={explore}
            id={id}
            data={similarData}
            heading={
              "Similar" + " " + `${explore === "movie" ? "Movies" : "Shows"}`
            }
          />
        ) : (
          <p className="px-4 lg:px-6 dark:text-[#adadad] text-[#636363] transition-colors duration-300 py-4">
            No similar content available.
          </p>
        )}
        {recommededData?.length > 0 ? (
          <Card
            media_type={explore}
            id={id}
            data={recommededData}
            heading={
              "Recommended" +
              " " +
              `${explore === "movie" ? "Movies" : "Shows"}`
            }
          />
        ) : (
          <p className="px-4 lg:px-6 dark:text-[#adadad]  text-[#636363] transition-colors duration-300 py-4">
            No recommended content available.
          </p>
        )}
      </div>
      {showVideo && (
        <VideoPlay
          mediaId={detailsData?.id}
          mediaType={explore}
          onClose={() => setShowVideo(false)}
          videoType={videoType}
          setDimMode={setDimMode}
          dimMode={dimMode}
        />
      )}
    </div>
  );
};

export default Details;
