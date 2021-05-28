// ******************************* HELPERS ******************************* //

// ------ Extract some values from a URL ------
export function extractValueFromUrl(regex) {
  const urlSearch = window.location.search ? window.location.search : "?tag=none";
  const result = urlSearch.match(regex);

  return result[0];
}

// ------ Wait for an element to exist ------

// MIT Licensed
// Author: jwilson8767

/**
 * @param selector
 * @returns {Promise}
 */
export function elementReady(selector) {
  return new Promise((resolve, reject) => {
    let el = document.querySelector(selector);
    if (el) {
      resolve(el);
    }
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(document.querySelectorAll(selector)).forEach((element) => {
        resolve(element);
        //Once we have resolved we don't need the observer anymore.
        observer.disconnect();
      });
    }).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
}
