// ******************************* HELPERS ******************************* //

// ------------------------------------
// ------ Classes (Pattern Factory Method) ------
// ------------------------------------

// Media Type
export class MediaType {
  constructor() {
    this.imageOrVideo = function (media, key) {
      let mediaWrapper;

      // IMAGE
      if (media.image) {
        mediaWrapper = `
        <a href="javascript:void(0);" class="media-link">
          <img class="source-media" src="./images/${media.image}" 
          alt="${media.description}" loading="lazy" data-id="${media.id}" data-index=${key} />
        </a>
        `;
        // VIDEO
      } else if (media.video) {
        mediaWrapper = `
        <a href="javascript:void(0);" class="media-link" >
          <video class="source-media" id="player" title="${media.title} : ${media.description}" playsinline data-id="${media.id}" data-index=${key} >
            <source src="./images/${media.video}" 
            type="video/mp4" />
          </video>
        </a>
        `;
      } else {
        // Default placeholder
        mediaWrapper = `
        <a href="javascript:void(0);" class="media-link" aria-hidden="true">
          <img src="./images/placeholder.jpg" alt="placeholder" loading="lazy" />
        </a>
        `;
      }

      return mediaWrapper;
    };
  }
}

// Components Constructor
export class CreateComponent {
  constructor() {
    this.tagsComponent = function (tags) {
      // ALL TAGS
      if (tags) {
        let allTagsComponent = [...tags];

        return allTagsComponent
          .map((tag) => {
            return `
        <a href="/?tag=${tag}" class="tags" data-tag="${tag}" labelledby="tag-name">
          <span aria-hidden=true"> #${tag}</span>
          <span id="tag-name" class="hidden" aria-label="Tag : ${tag}"></span>
        </a>
        `;
          })
          .join("");
      }
    };
  }
}

// ------------------------------------
// ------ Extract some values from a URL ------
// ------------------------------------

export function extractValueFromUrl(regex) {
  const urlSearch = window.location.search ? window.location.search : "?tag=none";
  const result = urlSearch.match(regex);

  return result[0];
}

// ------------------------------------
// ------ Wait for an element to exist ------
// ------------------------------------
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
