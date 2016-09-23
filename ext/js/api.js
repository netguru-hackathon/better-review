(() => {
  'use strict';

  window.BetterReview = (() => {
    const defaults = {
      rootUrl: 'https://api.github.com',
      oauthToken: ''
    };

    const api = {
      settings: {
        get: name => {
          const item = localStorage.getItem(name);

          if (item === null) {
            return {}.hasOwnProperty.call(defaults, name) ? defaults[name] : undefined;
          }

          if (item === 'true' || item === 'false') {
            return item === 'true';
          }

          return item;
        },
        set: localStorage.setItem.bind(localStorage),
        remove: localStorage.removeItem.bind(localStorage),
        reset: localStorage.clear.bind(localStorage)
      }
    };

    api.defaults = defaults;

    return api;
  })();

  window.BetterReview.request = url => {
    const token = window.BetterReview.settings.get('oauthToken');
    if (!token) {
      return Promise.reject(new Error('missing token'));
    }

    const headers = Object.assign({
      Authorization: `token ${token}`,
      'If-Modified-Since': ''
    });

    return fetch(url, {headers});
  };

  window.BetterReview.PullRequests = () => {
    const url = `${window.BetterReview.defaults.rootUrl}/repos/sindresorhus/notifier-for-github-chrome/pulls`;

    return window.BetterReview.request(url).then(response => {
      console.log("response", response);
      const status = response.status;
      const interval = Number(response.headers.get('X-Poll-Interval'));
      const lastModifed = response.headers.get('Last-Modified');

      const linkheader = response.headers.get('Link');

      if (linkheader === null) {
        return response.json().then(data => {
          return {count: data.length, interval, lastModifed};
        });
      }

      const lastlink = linkheader.split(', ').find(link => {
        return link.endsWith('rel="last"');
      });
      const count = Number(lastlink.slice(lastlink.lastIndexOf('page=') + 5, lastlink.lastIndexOf('>')));

      if (status >= 500) {
        return Promise.reject(new Error('server error'));
      }

      if (status >= 400) {
        return Promise.reject(new Error(`client error: ${status} ${response.statusText}`));
      }

      return {count, interval, lastModifed};
    });
  };
})();
