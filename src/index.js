require("../assets/stylesheets/main.scss");
import data from "../data.json";

// ******************************* HOMEPAGE DATA ON LOAD ******************************* //

// DOM ELEMENTS
const photographersContainer = document.querySelector(".photographer-wrapper");
const tagsContainer = document.querySelector(".tags-wrapper");

// ON LOAD FUNCTIONS
displayAllTags(data);
displayPhotographers(data);

// Display all existing tags in the header
function displayAllTags(data) {
  const uniqueTags = new Set();

  data.photographers.map((photographer) => {
    photographer.tags.map((tag) => {
      uniqueTags.add(tag);
    });
  });

  const htmlTags = Array.from(uniqueTags)
    .map((tag) => {
      return `
      <span class="tags" data-tag="${tag}" tabindex="0">
        #${tag}
        <span class="hidden" aria-label="Tag">${tag}</span>
      </span>
      `;
    })
    .join("");

  tagsContainer.innerHTML = htmlTags;
}

// Display all photographer into card component
function displayPhotographers(data) {
  const htmlPhotographers = data.photographers
    .map((card) => {
      return `
        <div class="photographer-card">
          <a class="link" href="javascript:void(0);" aria-label="${card.name}" data-id="${card.id}">
            <div class="round-image">
              <img src="./images/${card.portrait}" alt="" />
            </div>
            <h2>${card.name}</h2>
          </a>
          <div class="infos">
            <p class="location">${card.city}, ${card.country}</p>
            <p class="tagline">${card.tagline}</p>
            <p class="price">${card.price}€/jour</p>
          </div>
          <div class="tags-wrapper">

            ${card.tags
              .map((tag) => {
                return `
                <span class="tags" data-tag="${tag}">
                    #${tag}
                    <span class="hidden" aria-label="Tag">${tag}</span>
                </span>
                `;
              })
              .join("")}
     
          </div>
        </div>
        `;
    })
    .join("");

  photographersContainer.innerHTML = htmlPhotographers;
}

// ******************************* HOMEPAGE EVENTS ******************************* //

// DOM ELEMENTS
const allTags = Array.from(document.querySelectorAll(".tags"));
const photographerCards = Array.from(document.querySelectorAll(".photographer-card"));
const photographerLink = Array.from(document.querySelectorAll(".photographer-card .link"));

// EVENTS LISTENER
allTags.forEach((tag) => tag.addEventListener("click", activeThisTag));
photographerLink.forEach((link) => link.addEventListener("click", initPhotographerSingle));

// FUNCTIONS
// Active the tag clicked
function activeThisTag() {
  const currentTag = this.getAttribute("data-tag");

  if (this.classList.contains("active")) {
    this.classList.remove("active");
    displayAllCards();
  } else {
    allTags.forEach((tag) => tag.classList.remove("active"));
    this.classList.add("active");
  }

  filterPhotographers(currentTag);
}

// If no tag is clicked, display all photographers
function displayAllCards() {
  photographerCards.forEach((card) => {
    setTimeout(() => {
      card.classList.remove("hide");
    }, 100);
  });
}

// Compare active tag with each photographer's tags
function filterPhotographers(currentTag) {
  photographerCards.forEach((card) => {
    const cardTags = card.querySelectorAll(".tags");
    const tagsArray = [];

    cardTags.forEach((tag) => {
      const tagName = tag.getAttribute("data-tag");
      tagsArray.push(tagName);
    });

    // if one of photographer's tag match, display the photographer card
    const isMatch = (element) => element === currentTag;

    if (tagsArray.some(isMatch)) {
      card.classList.remove("hide");
    } else {
      card.classList.add("hide");
    }
  });
}

// ******************************* PHOTOGRAPHER SINGLE PAGE ******************************* //

// DOM ELEMENTS
const singleContainer = document.querySelector(".single-wrapper");
const headerMenu = document.querySelector(".nav.tags-wrapper");
const headerTitle = document.querySelector(".main-title");

// FUNCTIONS
function initPhotographerSingle() {
  const id = this.getAttribute("data-id");
  const photographers = data.photographers;
  const singleData = photographers.filter((photographer) => photographer.id == id);

  document.title = `${singleData[0].name} - FishEye`;

  hideDOMElements();
  openPhotographerSingle(singleData[0]);
  // 4. function ajouter eventlistener aux nouveaux éléments à écouter
}

function hideDOMElements() {
  headerMenu.classList.add("hide");
  headerTitle.classList.add("hide");
  photographersContainer.classList.add("hide");
  singleContainer.classList.remove("hide");
}

function openPhotographerSingle(singleData) {
  const { name, id, city, country, tags, tagline, price, portrait } = singleData;

  // Photographer's medias
  const medias = data.media;
  const photographerMedias = medias.filter((media) => media.photographerId == id);

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
              <span class="tags" data-tag="${tag}">
                #${tag}
                <span class="hidden" aria-label="Tag">${tag}</span>
              </span>
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
            <img src="./images/${portrait}" alt="" />
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
              <option value="popularity">Popularité</option>
              <option value="date">Date</option>
              <option value="title">Titre</option>
            </select>
          </div>
        </div>

        <div class="media-wrapper">


        ${photographerMedias
          .map((media) => {
            const mediaSrc = media.image ? media.image : media.video;

            return `
          <div class="media-card">
            <img src="./images/${mediaSrc}" alt="${media.description}" />
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

// KEYBOARD EVENTS LISTENER
allTags.forEach((tag) => tag.addEventListener("keyup", handleKeyPressed));

function handleKeyPressed(e) {
  // on "Enter" key pressed

  if (e.keyCode === 13) {
    this.click();
  }
}

// ******************************* A FAIRE  ******************************* //
// Regarder pour le design pattern Video ou Image

// Au clic sur les tags dans les singles : filtré les images par tags ?

// Filtrage dropdown

// Avant de quitter : commit et créer repo Github (au cas où)
