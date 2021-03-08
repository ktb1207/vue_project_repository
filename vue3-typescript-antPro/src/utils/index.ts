const util = {
  setToken: (token: string): void => {
    localStorage.setItem('platform_user_token', token);
  },
  getToken: (): string | null => {
    return localStorage.getItem('platform_user_token');
  },
  clearToken: (): void => {
    localStorage.removeItem('platform_user_token');
  },
  hasClass: (node: HTMLElement, className: string): boolean => {
    if (typeof node.getAttribute('class') as string) {
      // 存在class属性
      if ((node.getAttribute('class') as string).indexOf(className) > -1) {
        return true;
      }
      return false;
    }
    return false;
  }
};
export default util;
