export default {
  showLoading(context) {
    context.commit('changeLoading', true);
  },
  hideLoading(context) {
    context.commit('changeLoading', false);
  },
  showError(context, str) {
    context.commit('changeError', str);
  }
};
