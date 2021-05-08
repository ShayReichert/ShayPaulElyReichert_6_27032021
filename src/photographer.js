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
            .map((media, key) => {
              // pattern Factory Method for differents media type
              const checkMediaType = new MediaType();
              const mediaWrapper = checkMediaType.imageOrVideo(media, key);

              return `
            <div class="media-card" data-date="${media.date}" data-title="${media.title}"
            id="${media.title}" data-likes="${media.likes}">
              ${mediaWrapper}
              <div class="media-infos">
                <div class="part-1">
                  <span class="media-title">${media.title}</span>
                </div>
                <div class="part-2">
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
            <span class="total-likes"> ${getAllLikes()} </span>
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
  medias.forEach((media) => media.addEventListener("click", onOpenLightbox));
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

// Filter medias with dropdown
function filterWithDropdown() {
  const mediaContainer = document.querySelector(".media-wrapper");
  const mediaCards = Array.from(document.querySelectorAll(".media-card"));
  const dropdownValue = this.value;

  let mediasSortBy = "";

  if (dropdownValue === "title") {
    // sort by titles
    mediasSortBy = mediaCards.sort(function (a, b) {
      return a.getAttribute("data-title").localeCompare(b.getAttribute("data-title"));
    });
  } else if (dropdownValue === "date") {
    // Sort by date
    mediasSortBy = mediaCards.sort(function (a, b) {
      return new Date(b.getAttribute("data-date")) - new Date(a.getAttribute("data-date"));
    });
  } else {
    // Sort by popularity
    mediasSortBy = mediaCards.sort(function (a, b) {
      return b.getAttribute("data-likes") - a.getAttribute("data-likes");
    });
  }

  mediasSortBy.forEach((media, key) => {
    mediaContainer.appendChild(media);

    // Update the data-index attribute
    const sourceMedia = media.querySelector(".source-media");
    sourceMedia.setAttribute("data-index", key);
  });
}

// Get the total count of likes
function getAllLikes() {
  // Photographer's medias...
  const photographerMedias = medias.filter((media) => media.photographerId == id);

  // Total of Likes
  const reducer = (acc, current) => ({
    likes: acc.likes + current.likes,
  });
  const allLikes = photographerMedias.reduce(reducer);

  return allLikes.likes;
}

// ******************************* LIGHTBOX EVENTS ******************************* //

// DOM ELEMENTS
const body = document.querySelector("body.photographer-page");
const main = document.querySelector("#main");
const lightboxWrapper = document.querySelector(".lightbox-wrapper");
const lightBoxContainer = document.querySelector(".lightbox-slide");
const closeButton = document.querySelector(".close-modal");
const prevBtn = document.querySelector(".swiper-button-prev");
const nextBtn = document.querySelector(".swiper-button-next");
const mediaContainer = document.querySelector(".media-wrapper");

// EVENT LISTENERS
closeButton.addEventListener("click", closeModal);
body.addEventListener("keydown", handleKeyDown);
prevBtn.addEventListener("click", navSlide(-1));
nextBtn.addEventListener("click", navSlide(1));

function onOpenLightbox() {
  window.scrollTo(0, 0);
  lightboxWrapper.classList.remove("hide");
  body.classList.add("no-scroll");
  main.setAttribute("aria-hidden", "true");
  main.classList.add("hide");
  lightboxWrapper.setAttribute("aria-hidden", "false");
  closeButton.focus();

  // Open the media clicked
  const copyOfMedia = this.firstElementChild.cloneNode(true);
  lightBoxContainer.insertBefore(copyOfMedia, closeButton);

  addVideoControls();
}

function addVideoControls() {
  const controls = document.createAttribute("controls");
  const video = lightBoxContainer.querySelector("video");

  if (video) {
    video.setAttributeNode(controls);
  }
}

function handleKeyDown(e) {
  const lightboxWrapper = document.querySelector(".lightbox-wrapper");
  const keyCode = e.keyCode ? e.keyCode : e.which;

  if (lightboxWrapper.getAttribute("aria-hidden") == "false") {
    switch (keyCode) {
      case 27:
        closeModal();
        break;
      case 37:
        prevBtn.click();
        break;
      case 39:
        nextBtn.click();
      default:
        return;
    }
  }
}

function closeModal() {
  // Remove the media
  const oldMedia = lightBoxContainer.firstElementChild;

  lightBoxContainer.removeChild(oldMedia);

  body.classList.remove("no-scroll");
  main.setAttribute("aria-hidden", "false");
  main.classList.remove("hide");
  lightboxWrapper.setAttribute("aria-hidden", "true");
  lightboxWrapper.classList.add("hide");
}

function navSlide(number) {
  return function () {
    const sourceMedia = document.querySelector(".lightbox-slide .source-media");
    const index = sourceMedia.getAttribute("data-index");
    const nextIndex = number + parseInt(index);

    // if we are not one the first media or the last media
    if (nextIndex !== -1 && totalNumberOfMedias() !== nextIndex) {
      const actualMedia = lightBoxContainer.querySelector(`.source-media[data-index="${index}"]`);
      const futurElement = mediaContainer.querySelector(`.source-media[data-index="${nextIndex}"]`);
      const copyOfFuturMedia = futurElement.cloneNode(true);

      lightBoxContainer.removeChild(actualMedia);
      lightBoxContainer.insertBefore(copyOfFuturMedia, closeButton);
      addVideoControls();
    }
  };
}

// return the total number of medias on this profil
function totalNumberOfMedias() {
  const allMediasIndex = Array.from(mediaContainer.querySelectorAll("[data-index]"));
  const indexArray = [];

  allMediasIndex.forEach((media) => {
    const index = media.getAttribute("data-index");
    indexArray.push(index);
  });

  return Math.max(...indexArray) + 1;
}

// ******************************* A FAIRE  ******************************* //

// HTML / CSS Form
// Modal au clic sur "Contactez-moi"
