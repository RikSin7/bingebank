import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
  name: "bingebank",
  initialState: {
    bannerData: [],
    configImageData: "",
    nowPlayingData: [],
    topRatedData: [],
    tvSeriesData: [],
    bollywoodData: [],
    hollywoodData: [],
    similarData: [],
    recommededData: [],
    genreType: "movie",
    searchInput: "",
    loading: true,
    error: null,
    providers: [],
  },
  reducers: {
    setBannerData: (state, action) => {
      state.bannerData = action.payload;
      state.error = null;
      state.loading = false;
    },
    setConfigImageData: (state, action) => {
      state.configImageData = action.payload;
      state.error = null;
      state.loading = false;
    },
    setNowPlayingData: (state, action) => {
      state.nowPlayingData = action.payload;
      state.error = null;
      state.loading = false;
    },
    setTopRatedData: (state, action) => {
      state.topRatedData = action.payload;
      state.error = null;
      state.loading = false;
    },
    setTvSeriesData: (state, action) => {
      state.tvSeriesData = action.payload;
      state.error = null;
      state.loading = false;
    },
    setBollywoodData: (state, action) => {
      state.bollywoodData = action.payload;
      state.error = null;
      state.loading = false;
    },
    setHollywoodData: (state, action) => {
      state.hollywoodData = action.payload;
      state.error = null;
      state.loading = false;
    },
    setSimilarData: (state, action) => {
      state.similarData = action.payload;
      state.error = null;
      state.loading = false;
    },
    setRecommededData: (state, action) => {
      state.recommededData = action.payload;
      state.error = null;
      state.loading = false;
    },
    setGenreType: (state, action) => {
      state.genreType = action.payload;
      state.error = null; 
      state.loading = false;
    },
    setSearchInput: (state, action) => {
      state.searchInput = action.payload;
      state.error = null;
      state.loading = false;
    },
    setDetailsData: (state, action) => {
      state.detailsData = action.payload;
      state.error = null;
      state.loading = false;
    },
    setProviders: (state, action) => {
      state.providers = action.payload;
      state.error = null;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setBannerData,
  setConfigImageData,
  setNowPlayingData,
  setTopRatedData,
  setTvSeriesData,
  setBollywoodData,
  setHollywoodData,
  setSimilarData,
  setRecommededData,
  setGenreType,
  setSearchInput,
  setDetailsData,
  setProviders,
  setLoading,
  setError,
} = movieSlice.actions;
export default movieSlice.reducer;
