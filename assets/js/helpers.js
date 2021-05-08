// ******************************* HELPERS ******************************* //

// ------ Pattern Factory Method ------
export class MediaType {
  constructor() {
    this.imageOrVideo = function (media, key) {
      let mediaWrapper;

      // If image url only
      if (media.image) {
        mediaWrapper = `
        <a href="javascript:void(0);" class="media-link">
          <img class="source-media" src="./images/${media.image}" 
          alt="${media.description}" loading="lazy" data-id="${media.id}" data-index=${key} />
        </a>
        `;
        // If video url only
      } else if (media.video) {
        mediaWrapper = `
        <a href="javascript:void(0);" class="media-link" >
          <video class="source-media" id="player" playsinline data-id="${media.id}" data-index=${key} >
            <source src="./images/${media.video}" 
            type="video/mp4" />
          </video>
        </a>
        `;
      } else {
        // Default placeholder
        mediaWrapper = `
        <a href="javascript:void(0);" class="media-link">
          <img src="./images/placeholder.jpg" alt="placeholder" loading="lazy" />
        </a>
        `;
      }

      return mediaWrapper;
    };
  }
}

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
 * Waits for an element satisfying selector to exist, then resolves promise with the element.
 * Useful for resolving race conditions.
 *
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
