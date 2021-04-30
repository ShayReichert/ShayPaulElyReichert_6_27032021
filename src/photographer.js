require("../assets/stylesheets/main.scss");
import data from "../data.json";
import MediaType from "../assets/js/class";

// ******************************* PHOTOGRAPHER SINGLE PAGE ON LOAD ******************************* //

// DOM ELEMENTS
const singleContainer = document.querySelector(".single-wrapper");

// REGEX
const numberRegex = /(\d+)/;

// HELPERS
function extractValueFromUrl(regex) {
  const urlSearch = window.location.search;
  const result = urlSearch.match(regex);

  return result[0];
}

// ON LOAD
initPhotographerSingle();

// FUNCTIONS
function initPhotographerSingle() {
  const id = extractValueFromUrl(numberRegex);
  const photographers = data.photographers;

  const singleData = photographers.filter((photographer) => photographer.id == id);

  // Dynamic document title
  document.title = `${singleData[0].name} - FishEye`;

  displayPhotographerSingle(singleData[0]);
}

function displayPhotographerSingle(singleData) {
  const { name, id, city, country, tags, tagline, price, portrait } = singleData;

  // Photographer's medias...
  const medias = data.media;
  const photographerMedias = medias.filter((media) => media.photographerId == id);

  // ...sort by popularity by default
  const mediasSortByPopularity = photographerMedias.sort(function (a, b) {
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
              <select id="filter" aria-labelledby="sort_by" data-current="likes">
                <option value="popularity">Popularité</option>
                <option value="date">Date</option>
                <option value="title">Titre</option>
              </select>
            </div>
          </div>

          <div class="media-wrapper">

          ${mediasSortByPopularity
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
                    <i class="fas fa-heart heart-icon" aria-label="j'aime"></i>
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
            ${allLikes.likes}
            <i class="fas fa-heart heart-icon" aria-label="j'aime"></i>
          </div>
          <div class="price">
            <span class="hidden">Tarif journalier du ou de la photographe</span>
            ${price}€/jour
          </div>
        </div>`;

  singleContainer.innerHTML = htmlSingle;
}

// ******************************* ACCESSIBILITY  ******************************* //

// Make "tags" cliquable with "Enter" key
function handleKeyPressed(e) {
  if (e.keyCode === 13) {
    this.click();
  }
}

// ******************************* A FAIRE  ******************************* //

// Filtrage dropdown

// classer les données brutes, puis injecter les données dans cette ordre dans le DOM.

// Incrémentation du nombre de like au clic (+ total)

// HTML / CSS lightbox et form

// Lightbox au clic sur média (naviguable)
// LightBox video player, add "controls" :
// <video id="player" playsinline controls>
//   <source src="./images/${media.video}" type="video/mp4" />
// </video>;

// Modal au clic sur "Contactez-moi"

// Commit + push
