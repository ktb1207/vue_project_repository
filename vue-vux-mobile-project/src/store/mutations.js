export default {
  changeLoading(state, status) {
    state.loadingStatus = status;
  },
  changeError(state, str) {
    state.errorText = str;
  }
};
