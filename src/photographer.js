require("../assets/stylesheets/main.scss");
import data from "../data.json";
import { MediaType, extractValueFromUrl, CreateComponent, elementReady } from "../assets/js/helpers";

//************************************************************************************************ //
// ******************************* PHOTOGRAPHER SINGLE PAGE ON LOAD ******************************* //
//************************************************************************************************ //

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

               ${new CreateComponent().tagsComponent(tags)}

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

            <div class="custom-select-wrapper" tabindex="0">
              <div class="custom-select">
                <div class="custom-select__trigger"><span>Popularité</span>
                  <div class="arrow"></div>
                </div>
                <div class="custom-options" aria-labelledby="sort_by">
                  <span class="custom-option selected" data-value="likes" tabindex="0" >Popularité</span>
                  <span class="custom-option" data-value="date" tabindex="0">Date</span>
                  <span class="custom-option" data-value="title" tabindex="0">Titre</span>
                </div>
              </div>
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
                  <span class="heart-wrapper" tabindex="0">
                    <span class="heart-count" aria-label="Ajouter un j'aime">${media.likes}</span>
                    <i class="far fa-heart heart-empty heart-icon"></i>
                    <i class="fas fa-heart heart-full heart-icon hide"></i>
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

//************************************************************************************************ //
// ******************************* PHOTOGRAPHER SINGLE EVENTS ******************************* //
//************************************************************************************************ //

// AFTER HTML IS COMPLETLY LOAD
elementReady(".photographer-page").then(() => {
  addEventListenerOnNewElements();
});

// DOM ELEMENTS & EVENT LISTENER
function addEventListenerOnNewElements() {
  const dropdown = document.querySelector(".custom-select-wrapper");
  const optionsDropdown = document.querySelectorAll(".custom-option");
  const heartWrapper = document.querySelectorAll(".heart-wrapper");
  const medias = document.querySelectorAll(".media-link");

  dropdown.addEventListener("keydown", handleEnterDown);
  dropdown.addEventListener("click", handleDropdown);
  optionsDropdown.forEach((option) => option.addEventListener("keydown", handleEnterDown));
  heartWrapper.forEach((heart) => heart.addEventListener("click", handleLikesCount));
  heartWrapper.forEach((heart) => heart.addEventListener("keydown", handleEnterDown));
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

// Dropdown
function handleDropdown() {
  const select = this.querySelector(".custom-select");
  const allOptions = document.querySelectorAll(".custom-option");

  select.classList.toggle("open");

  allOptions.forEach((option) => {
    option.addEventListener("click", switchOption);
  });

  function switchOption() {
    if (!this.classList.contains("selected")) {
      this.parentNode.querySelector(".custom-option.selected").classList.remove("selected");
      this.classList.add("selected");
      this.closest(".custom-select").querySelector(".custom-select__trigger span").textContent = this.textContent;
    }
    filterWithDropdown(this);
  }
}

// Filter medias with dropdown
function filterWithDropdown(selected) {
  const mediaContainer = document.querySelector(".media-wrapper");
  const mediaCards = Array.from(document.querySelectorAll(".media-card"));
  const dropdownValue = selected.getAttribute("data-value");

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

// Accessibility : click an element with Enter key
function handleEnterDown(e) {
  const keyCode = e.keyCode ? e.keyCode : e.which;

  if (keyCode === 13) {
    this.click();
  }
}

//************************************************************************************************ //
// ******************************* LIGHTBOX EVENTS ******************************* //
//************************************************************************************************ //

// DOM ELEMENTS
const body = document.querySelector("body.photographer-page");
const main = document.querySelector("#main");
const lightboxWrapper = document.querySelector(".lightbox-wrapper");
const lightBoxContainer = document.querySelector(".lightbox-slide");
const closeLightboxBtn = document.querySelector(".close-lightbox");
const prevBtn = document.querySelector(".swiper-button-prev");
const nextBtn = document.querySelector(".swiper-button-next");
const mediaContainer = document.querySelector(".media-wrapper");

// EVENT LISTENERS
closeLightboxBtn.addEventListener("click", closeLightbox);
lightboxWrapper.addEventListener("keydown", handleKeysDown);
prevBtn.addEventListener("click", navSlide(-1));
nextBtn.addEventListener("click", navSlide(1));

// Open lightbox
function openLightbox() {
  window.scrollTo(0, 0);
  lightboxWrapper.classList.remove("hide");
  body.classList.add("no-scroll");
  main.setAttribute("aria-hidden", "true");
  main.classList.add("hide");
  lightboxWrapper.setAttribute("aria-hidden", "false");
  closeLightboxBtn.focus();

  // Open the media clicked
  const copyOfMedia = this.cloneNode(true);
  lightBoxContainer.insertBefore(copyOfMedia, closeLightboxBtn);

  addVideoControls();
}

// Add video controls if this media is a video
function addVideoControls() {
  const controls = document.createAttribute("controls");
  const video = lightBoxContainer.querySelector("video");

  if (video) {
    video.setAttributeNode(controls);
  }
}

// Accessibility : navigate with keys
function handleKeysDown(e) {
  const keyCode = e.keyCode ? e.keyCode : e.which;

  switch (keyCode) {
    case 27:
      closeLightbox();
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

// Close the lightbox
function closeLightbox() {
  // Remove the media
  const oldMedia = lightBoxContainer.firstElementChild;

  lightBoxContainer.removeChild(oldMedia);

  body.classList.remove("no-scroll");
  main.setAttribute("aria-hidden", "false");
  main.classList.remove("hide");
  lightboxWrapper.setAttribute("aria-hidden", "true");
  lightboxWrapper.classList.add("hide");
}

// Handle navigation between medias
function navSlide(number) {
  return function () {
    const sourceMedia = document.querySelector(".lightbox-slide .source-media");
    const index = sourceMedia.getAttribute("data-index");
    const nextIndex = number + parseInt(index);
    const prevArrow = document.querySelector(".swiper-button-prev");
    const nextArrow = document.querySelector(".swiper-button-next");

    // if we are not one the first media or the last media
    if (nextIndex !== -1 && totalNumberOfMedias() !== nextIndex) {
      const actualMedia = lightBoxContainer.querySelector(`.source-media[data-index="${index}"]`).parentNode;
      const futurElement = mediaContainer.querySelector(`.source-media[data-index="${nextIndex}"]`).parentNode;
      const copyOfFuturMedia = futurElement.cloneNode(true);
      prevArrow.style.opacity = 1;
      nextArrow.style.opacity = 1;

      lightBoxContainer.removeChild(actualMedia);
      lightBoxContainer.insertBefore(copyOfFuturMedia, closeLightboxBtn);
      addVideoControls();
    }

    // if we are on the first media
    else if (nextIndex === -1) {
      prevArrow.style.opacity = 0.5;

      // if we are on the last media
    } else if (totalNumberOfMedias() === nextIndex) {
      nextArrow.style.opacity = 0.5;
    }
  };
}

// Return the total number of medias on this profil
function totalNumberOfMedias() {
  const allMediasIndex = Array.from(mediaContainer.querySelectorAll("[data-index]"));
  const indexArray = [];

  allMediasIndex.forEach((media) => {
    const index = media.getAttribute("data-index");
    indexArray.push(index);
  });

  return Math.max(...indexArray) + 1;
}

//************************************************************************************************ //
// ******************************* CONTACTFORM EVENTS ******************************* //
//************************************************************************************************ //

// DOM ELEMENTS
const contactformWrapper = document.querySelector(".contactform-wrapper");
const contactBtn = document.querySelector(".contact .btn-submit");
const contactformContent = contactformWrapper.querySelector(".modal-content");
const closeContactBtn = contactformWrapper.querySelector(".close-contact");
const names = contactformWrapper.querySelectorAll(".name-input");
const email = contactformWrapper.querySelector("#email");
const submitContactBtn = contactformWrapper.querySelector(".submit-wrapper .btn-submit");
const nameContainer = contactformWrapper.querySelector(".photographer-name");

// EVENT LISTENERS
contactBtn.addEventListener("click", openContactForm);
closeContactBtn.addEventListener("click", closeContactForm);
names.forEach((input) => input.addEventListener("keyup", checkName));
email.addEventListener("keyup", checkEmail);
submitContactBtn.addEventListener("click", handleSubmit);

// Open the contact form
function openContactForm() {
  window.scrollTo(0, 0);
  contactformWrapper.classList.remove("hide");
  body.classList.add("no-scroll");
  main.setAttribute("aria-hidden", "true");
  contactformWrapper.setAttribute("aria-hidden", "false");
  closeContactBtn.focus();

  // Dynamic Name
  const dynamiclName = singleData[0].name;
  nameContainer.innerHTML = dynamiclName;
}

// Close the contact form
function closeContactForm() {
  if (contactformContent.classList.contains("animate-on-close")) {
    contactformContent.classList.remove("animate-on-close");
  }
  body.classList.remove("no-scroll");
  main.setAttribute("aria-hidden", "false");
  main.classList.remove("hide");
  contactformWrapper.setAttribute("aria-hidden", "true");
  contactformWrapper.classList.add("hide");
}

// Single errors checkers for names inputs
function checkName() {
  const regex = /\w\w+/;
  checkWithRegex(this, regex);
}

// Single errors checkers for emails inputs
function checkEmail() {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  checkWithRegex(this, regex);
}

// General Errors checker
function checkWithRegex(element, regex) {
  const formData = element.parentNode;
  const input = element.value;
  const isValid = regex.test(input);

  setAttributes(isValid, formData);
}

// Handle invalid inputs
function setAttributes(isValid, element) {
  const input = element.querySelector("input");

  if (isValid) {
    input.style.outline = "3px solid green";
    element.setAttribute("data-validate", "yes");
  } else {
    input.style.outline = "3px solid red";
    element.setAttribute("data-validate", "no");
  }
}

// On contact form submit
function handleSubmit(e) {
  const invalides = document.querySelectorAll("[data-validate='no']").length;
  const inputs = document.querySelectorAll(".contactform-wrapper .inputs");

  e.preventDefault();

  // check if a input is empty
  inputs.forEach((input) => {
    input.value ? "" : input.parentNode.setAttribute("data-error-visible", "true");
  });

  if (!invalides) {
    handleSuccess(inputs);
  } else {
    return false;
  }
}

// Handle close button if form submit success
function handleSuccess(inputs) {
  inputs.forEach((input) => {
    console.log(input.value);
    input.value = "";
  });

  contactformContent.classList.add("animate-on-close");

  setTimeout(() => {
    closeContactForm();
  }, 500);
}
