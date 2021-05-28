// ******************************* HELPERS ******************************* //

// ------ Classes (Pattern Factory Method) ------

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
        <a href="javascript:void(0);" class="media-link" labelledby="video-description">
          <video class="source-media" id="player" playsinline data-id="${media.id}" data-index=${key} >
            <source src="./images/${media.video}" 
            type="video/mp4" />
          </video>
          <span id="video-description" class="hidden">Vidéo : ${media.title} : ${media.description}</span>
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
