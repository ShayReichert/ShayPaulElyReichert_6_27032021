require("../assets/stylesheets/main.scss");
import data from "../data.json";
import { extractValueFromUrl } from "../assets/js/helpers";

// ******************************* HOMEPAGE DATA ON LOAD ******************************* //

// DOM ELEMENTS
const photographersContainer = document.querySelector(".photographer-wrapper");
const tagsContainer = document.querySelector(".tags-wrapper");

// FUNCTIONS
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
      <a href="?tag=${tag}" class="tags" data-tag="${tag}">
        #${tag}
        <span class="hidden" aria-label="Tag">${tag}</span>
      </a>
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
          <a class="link" href="/photographer.html?id=${card.id}" aria-label="${card.name}">
            <div class="round-image">
              <img src="./images/${card.portrait}" alt="" loading="lazy" />
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
                <a href="?tag=${tag}" class="tags" data-tag="${tag}">
                    #${tag}
                    <span class="hidden" aria-label="Tag">${tag}</span>
                </a>
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

// FUNCTIONS
filterWithTagInit();

function filterWithTagInit() {
  const tagRegex = /(?<=tag=)\w+/;
  const tagClick = extractValueFromUrl(tagRegex);

  if (tagClick !== "none") {
    filterWithTag(tagClick);
  }
}

// Active the tag clicked
function filterWithTag(tagClick) {
  displayRelatedPhotographers(tagClick);
  activeTagClicked(tagClick);
}

// Compare tag clicked with each photographer's tags
function displayRelatedPhotographers(tagClick) {
  photographerCards.forEach((card) => {
    const cardTags = card.querySelectorAll(".tags");
    const tagsArray = [];

    cardTags.forEach((tag) => {
      const tagName = tag.getAttribute("data-tag");
      tagsArray.push(tagName);
    });

    // if one of photographer's tag match, display the photographer card
    const isMatch = (element) => element === tagClick;

    if (tagsArray.some(isMatch)) {
      card.classList.remove("hide");
    } else {
      card.classList.add("hide");
    }
  });
}

// Add css class to tag clicked
function activeTagClicked(tagClick) {
  allTags.forEach((tag) => {
    const tagAttribute = tag.getAttribute("data-tag");

    if (tagAttribute === tagClick) {
      tag.classList.add("active");
    }
  });
}
