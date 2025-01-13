import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import languageCodes from "./LanguageCodes";
import notAvailable from "../assets/imageNotAvailable.png";
import SkeletonCard from "./SkeletonCard";

function Card({ data = [], heading, media_type, id }) {
  const [isTrendingClicked, setIsTrendingClicked] = useState(false);

  const loading = useSelector((state) => state.bingebank.loading);
  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    if (!loading && data.length === 0) {
      // Show skeleton during the initial load and delay its removal
      const timeout = setTimeout(() => {
        setDelayedLoading(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }

    if (loading && data.length === 0) {
      // Show skeleton only if data is empty during loading
      setDelayedLoading(true);
    }
  }, [loading, data]);

  const configImageData = useSelector(
    (state) => state.bingebank.configImageData
  );
  const navigate = useNavigate();
  const containerRef = useRef();
  const handlePreviousCard = () => {
    containerRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const handleNextCard = () => {
    containerRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };
  const handleTrendingClick = () => {
    setIsTrendingClicked(!isTrendingClicked);
    navigate("/trending/all");
  };
  const handleNowPlayingClick = () => {
    setIsTrendingClicked(!isTrendingClicked);
    navigate("/movie/now_playing");
  };
  const handleTopRatedClick = () => {
    setIsTrendingClicked(!isTrendingClicked);
    navigate("/movie/top_rated");
  };
  const handleBollywoodClick = () => {
    setIsTrendingClicked(!isTrendingClicked);
    navigate("/movie/bollywood");
  };
  const handleHollywoodClick = () => {
    setIsTrendingClicked(!isTrendingClicked);
    navigate("/movie/hollywood");
  };
  const handleTvSeriesClick = () => {
    setIsTrendingClicked(!isTrendingClicked);
    navigate("/tv/popular");
  };
  const handleSimilarMoviesClick = () => {
    setIsTrendingClicked(!isTrendingClicked);
    navigate(`/movie/${id}/similar`);
  };
  const handleSimilarShowsClick = () => {
    setIsTrendingClicked(!isTrendingClicked);
    navigate(`/tv/${id}/similar`);
  };
  const handleRecommendedMoviesClick = () => {
    setIsTrendingClicked(!isTrendingClicked);
    navigate(`/movie/${id}/recommendations`);
  };
  const handleRecommendedShowsClick = () => {
    setIsTrendingClicked(!isTrendingClicked);
    navigate(`/tv/${id}/recommendations`);
  };
  const handleClickCategory = () => {
    switch (heading) {
      case "Trending":
        handleTrendingClick();
        break;
      case "Now Playing":
        handleNowPlayingClick();
        break;
      case "Top Rated":
        handleTopRatedClick();
        break;
      case "Bollywood":
        handleBollywoodClick();
        break;
      case "Hollywood":
        handleHollywoodClick();
        break;
      case "Popular Shows":
        handleTvSeriesClick();
        break;
      case "Similar Movies":
        handleSimilarMoviesClick();
        break;
      case "Similar Shows":
        handleSimilarShowsClick();
        break;
      case "Recommended Movies":
        handleRecommendedMoviesClick();
        break;
      case "Recommended Shows":
        handleRecommendedShowsClick();
        break;
      default:
        break;
    }
  };

  const handleImageClick = (content) => {
    navigate(`/${content?.media_type || media_type}/details/${content?.id}`);
  };

  return (
    <>
      <div className="min-h-[20vh] w-full px-4 lg:px-6">
        <button
          className="font-poppins flex items-center gap-0 lg:gap-1 text-xl md:text-2xl lg:text-3xl font-[400]"
          onClick={handleClickCategory}
        >
          <h1 className="py-4">{heading}</h1>
          <i className="ri-arrow-right-wide-line"></i>
        </button>

        <div className="w-full relative mx-auto">
          <div className="next&previous text-white text-5xl z-20 hidden lg:flex justify-between absolute w-full top-1/2 -translate-y-1/2 pointer-events-none">
            <button
              className="left pointer-events-auto"
              onClick={handlePreviousCard}
            >
              <i className="ri-arrow-left-wide-line"></i>
            </button>
            <button
              className="right pointer-events-auto"
              onClick={handleNextCard}
            >
              <i className="ri-arrow-right-wide-line"></i>
            </button>
          </div>
          <div
            className="flex gap-4 overflow-x-scroll lg:overflow-hidden scrollbar-hide"
            ref={containerRef}
          >
            {/* for skeleton card loading */}
            {delayedLoading && data.length === 0 && (
              <>
                {Array.from({ length: 10 }, (_, index) => (
                  <div key={index}>
                    <SkeletonCard />
                  </div>
                ))}
              </>
            )}

            {data &&
              data.map((content) => (
                <div
                  key={content.id}
                  className="transition-all duration-500 ease-in-out flex-shrink-0 lg:w-[230px] md:w-[180px] w-[150px]"
                  onClick={() => handleImageClick(content)}
                >
                  <div className="transition-all duration-500 ease-in-out scroll-smooth mx-auto">
                    <div
                      className={`max-w-[230px] aspect-[2/3] cursor-pointer rounded-lg overflow-hidden  transition-transform duration-300 ease-in-out hover:scale-[1.05] relative border border-[#999999]`}
                      key={content.id}
                    >
                      {content?.poster_path ? (
                        <img
                          src={`${configImageData}${content?.poster_path}`}
                          alt={content?.title || content?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={notAvailable}
                          alt={"not-available"}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60 hover:opacity-0 transition-opacity duration-300" />
                      <div className="absolute bottom-0 w-full text-wrap text-center space-x-1 lg:space-x-2 p-1">
                        <div className="font-semibold flex justify-center space-x-2">
                          <h1 className="cursor-auto">
                            {content?.title || content?.name}
                            <span className="font-normal ml-1 cursor-auto">
                              {(
                                content?.release_date || content?.first_air_date
                              )?.substring(0, 4)}
                            </span>
                          </h1>
                        </div>
                        <span className="cursor-auto">
                          {content?.media_type || media_type}
                        </span>
                        <span className="cursor-auto">
                          {languageCodes[content?.original_language] ||
                            "Unknown"}
                        </span>
                        <span className="flex items-center justify-center gap-1 cursor-auto">
                          {content?.vote_average &&
                            content?.vote_average.toFixed(1)}
                          <i className="ri-star-half-line text-sm"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
