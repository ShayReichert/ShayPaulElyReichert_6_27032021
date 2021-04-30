// pattern Factory Method

class MediaType {
  constructor() {
    this.imageOrVideo = function (media) {
      let mediaWrapper;

      // If image AND video url
      if (media.image && media.video) {
        mediaWrapper = `
        <video id="player" playsinline controls data-poster="./images/${media.image}.jpg" data-id="${media.id}">
          <source src="./images/${media.video}" type="video/mp4" />
        </video>
        `;
        // If image url only
      } else if (media.image) {
        mediaWrapper = `
        <img src="./images/${media.image}" alt="${media.description}" loading="lazy" data-id="${media.id}" />
        `;
        // If video url only
      } else if (media.video) {
        mediaWrapper = `
        <video id="player" playsinline data-id="${media.id}" >
          <source src="./images/${media.video}" type="video/mp4" />
        </video>
        `;
      } else {
        // Default placeholder
        mediaWrapper = `
        <img src="./images/placeholder.jpg" alt="placeholder" loading="lazy" />
        `;
      }

      return mediaWrapper;
    };
  }
}

export default MediaType;
