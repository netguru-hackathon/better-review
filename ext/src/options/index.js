(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const formOauthToken = document.getElementById('oauth_token');

    function loadSettings() {
      formOauthToken.value = BetterReview.settings.get('oauthToken');
    }

    loadSettings();

    function updateBadge() {
      chrome.runtime.sendMessage('update');
    }

    formOauthToken.addEventListener('change', () => {
      BetterReview.settings.set('oauthToken', formOauthToken.value);
      updateBadge();
    });
  });
})();
