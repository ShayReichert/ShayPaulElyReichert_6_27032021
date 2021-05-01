require("../assets/stylesheets/main.scss");
import data from "../data.json";
import { MediaType, extractValueFromUrl, elementReady } from "../assets/js/helpers";

// ******************************* PHOTOGRAPHER SINGLE PAGE ON LOAD ******************************* //

// GLOBAL VARIABLES
const singleContainer = document.querySelector(".single-wrapper");
const idRegex = /(\d+)/;
const id = extractValueFromUrl(idRegex);
const photographers = data.photographers;
const medias = data.media;
const singleData = photographers.filter((photographer) => photographer.id == id);

// Dynamic document title
document.title = `${singleData[0].name} - FishEye`;
displayPhotographerSingle(singleData[0]);

function displayPhotographerSingle(singleData) {
  const { name, id, city, country, tags, tagline, price, portrait } = singleData;

  // Photographer's medias...
  const photographerMedias = medias.filter((media) => media.photographerId == id);

  // ...sort by popularity by default
  let mediasSortBy = photographerMedias.sort(function (a, b) {
    return b.likes - a.likes;
  });

  // Total of Likes
  const reducer = (acc, current) => ({
    likes: acc.likes + current.likes,
  });
  const allLikes = photographerMedias.reduce(reducer);

  const htmlSingle = `<section
          class="photographer-presentation"
          role="region"
          aria-label="Profil de ${name}"
        >
          <div class="col-1">
            <div class="infos">
              <h2>${name}</h2>
              <p class="location">${city}, ${country}</p>
              <p class="tagline">${tagline}</p>
              <div class="tags-wrapper">

              ${tags
                .map((tag) => {
                  return `
                <a href="/?tag=${tag}" class="tags" data-tag="${tag}">
                  #${tag}
                  <span class="hidden" aria-label="Tag">${tag}</span>
                </a>
                  `;
                })
                .join("")}

              </div>
            </div>

            <div class="contact">
              <input class="btn btn-submit" type="submit" value="Contactez-moi" />
            </div>
          </div>

          <div class="col-2">
            <div class="round-image">
              <img src="./images/${portrait}" alt="" loading="lazy" />
            </div>
          </div>
        </section>

        <section
          class="photographer-medias"
          role="region"
          aria-label="Photos et vidéos du photographe"
        >
          <div class="sort">
            <label for="filter" id="sort_by">Trier par</label>
            <div class="custom-select">
              <select id="filter" aria-labelledby="sort_by">
                <option value="likes">Popularité</option>
                <option value="date">Date</option>
                <option value="title">Titre</option>
              </select>
            </div>
          </div>

          <div class="media-wrapper">

          ${mediasSortBy
            .map((media) => {
              // pattern Factory Method for differents media type
              const checkMediaType = new MediaType();
              const mediaWrapper = checkMediaType.imageOrVideo(media);

              return `
            <div class="media-card">
              ${mediaWrapper}
              <div class="media-infos">
                <div class="part-1">
                  <span class="media-title">${media.title}</span>
                </div>
                <div class="part-2">
                  <span class="media-price">${media.price} €</span>
                  <span class="heart-wrapper">
                    <span class="heart-count">${media.likes}</span>
                    <i class="far fa-heart heart-empty heart-icon" aria-label="j'aime"></i>
                    <i class="fas fa-heart heart-full heart-icon hide" aria-label="j'aime"></i>
                  </span>
                </div>
              </div>
            </div>
            `;
            })
            .join("")}

          </div>
        </section>

        <div class="extra-infos">
          <div class="wrapper-total-likes">
            <span class="hidden">Nombre total de j'aime</span>
            <span class="total-likes"> ${allLikes.likes} </span>
            <i class="fas fa-heart heart-icon" aria-label="j'aime"></i>
          </div>
          <div class="price">
            <span class="hidden">Tarif journalier du ou de la photographe</span>
            ${price}€/jour
          </div>
        </div>`;

  singleContainer.innerHTML = htmlSingle;
}

// ******************************* PHOTOGRAPHER SINGLE EVENTS ******************************* //

// AFTER DOM IS COMPLETLY LOAD
elementReady(".photographer-page").then(() => {
  addEventListenerOnNewElements();
});

// DOM ELEMENTS & EVENT LISTENER
function addEventListenerOnNewElements() {
  // DOM ELEMENTS
  const dropdown = document.querySelector("#filter");
  const heartWrapper = document.querySelectorAll(".heart-wrapper");
  const medias = document.querySelectorAll(".media-link");

  // EVENT LISTENER
  dropdown.addEventListener("change", filterWithDropdown);
  heartWrapper.forEach((heart) => heart.addEventListener("click", handleLikesCount));
  medias.forEach((media) => media.addEventListener("click", openLightbox));
}

// Increment or decrement number of likes
function handleLikesCount() {
  const emptyHeart = this.querySelector(".heart-empty");
  const fullHeart = this.querySelector(".heart-full");
  const countWrapper = this.querySelector(".heart-count");
  const totalLikesWrapper = document.querySelector(".total-likes");
  let numberOfLikes = countWrapper.textContent;
  let totalNumberOfLikes = totalLikesWrapper.textContent;

  if (!emptyHeart.classList.contains("hide")) {
    emptyHeart.classList.add("hide");
    fullHeart.classList.remove("hide");
    numberOfLikes++;
    totalNumberOfLikes++;
  } else {
    fullHeart.classList.add("hide");
    emptyHeart.classList.remove("hide");
    numberOfLikes--;
    totalNumberOfLikes--;
  }
  countWrapper.innerHTML = `${numberOfLikes}`;
  totalLikesWrapper.innerHTML = `${totalNumberOfLikes}`;
}

// Filter medias with dropdown (a refacto)
function filterWithDropdown() {
  const mediaContainer = document.querySelector(".media-wrapper");
  const dropdownValue = this.value;

  // Photographer's medias...
  const photographerMedias = medias.filter((media) => media.photographerId == singleData[0].id);

  let mediasSortBy;

  if (dropdownValue === "title") {
    // Sort by title
    mediasSortBy = photographerMedias.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  } else if (dropdownValue === "date") {
    // Sort by date
    mediasSortBy = photographerMedias.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  } else {
    // ...sort by popularity by default
    mediasSortBy = photographerMedias.sort(function (a, b) {
      return b.likes - a.likes;
    });
  }

  const htmlMedias = `
          ${mediasSortBy
            .map((media) => {
              // pattern Factory Method for differents media type
              const checkMediaType = new MediaType();
              const mediaWrapper = checkMediaType.imageOrVideo(media);

              return `
            <div class="media-card">
              ${mediaWrapper}
              <div class="media-infos">
                <div class="part-1">
                  <span class="media-title">${media.title}</span>
                </div>
                <div class="part-2">
                  <span class="media-price">${media.price} €</span>
                  <span class="heart-wrapper">
                    <span class="heart-count">${media.likes}</span>
                    <i class="far fa-heart heart-empty heart-icon" aria-label="j'aime"></i>
                    <i class="fas fa-heart heart-full heart-icon hide" aria-label="j'aime"></i>
                  </span>
                </div>
              </div>
            </div>
            `;
            })
            .join("")}
  `;
  mediaContainer.innerHTML = htmlMedias;
  addEventListenerOnNewElements();
}

function openLightbox() {
  const body = document.querySelector("body.photographer-page");
  const lightboxWrapper = document.querySelector(".lightbox-wrapper");

  // Prevent page scrolling when lightbox is open
  body.classList.add("modal-open");
}

// ******************************* A FAIRE  ******************************* //

// Incrémentation du nombre de like au clic (+ total) => local Storage ?

// HTML / CSS lightbox et form

// Lightbox au clic sur média (naviguable)
// LightBox video player, add "controls" :
// <video id="player" playsinline controls>
//   <source src="./images/${media.video}" type="video/mp4" />
// </video>;

// Modal au clic sur "Contactez-moi"

// Commit + push
