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
          <a class="link" href="/photographer.html" aria-label="${card.name}">
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

// ******************************* HOMEPAGE DATA EVENTS ******************************* //

// DOM ELEMENTS
const allTags = Array.from(document.querySelectorAll(".tags"));
const photographerCards = Array.from(document.querySelectorAll(".photographer-card"));

// EVENTS LISTENER
allTags.forEach((tag) => tag.addEventListener("click", activeThisTag));

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

// ******************************* A FAIRE  ******************************* //
// Filtrer les photographes selons les tags cliqués (1 tag cliquable à la fois)
// Réfléchir sur comment gérer la page photographe : faire passer data via url ?
// Ou modifier tout le html via le JS ?

// ******************************* PHOTOGRAPHER DATA ******************************* //

// ******************************* ACCESSIBILITY  ******************************* //

// KEYBOARD EVENTS LISTENER
allTags.forEach((tag) => tag.addEventListener("keyup", handleKeyPressed));

function handleKeyPressed(e) {
  // on "Enter" key pressed

  if (e.keyCode === 13) {
    this.click();
  }
}
