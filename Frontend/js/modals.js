// ELEMENTS
const ELM_MODAL_GALLERY_VIEWER = document.querySelector("#galleryViewerModal");
const ELM_MODAL_GALLERY = document.querySelector(".editionModal__gallery");
const ELM_MODAL_ADD_WORK = document.querySelector("#addWorkModal");

// TEMPLATES ELEMENTS
const TLE_GALLERY_ITEM_TEMPLATE = document.getElementById("galleryItemTemplate");

// TEMPLATES LITERALS
const TTL_CATEGORY_OPTION = (pId) => `<option value="${pId}">${DATA["categories"][pId]}</option>`;

// FUNCTIONS
const loadModalGallery = () => {
  ELM_MODAL_GALLERY.replaceChildren();

  DATA["works"].forEach(work => {
    const newItem = TLE_GALLERY_ITEM_TEMPLATE.content.cloneNode(true);

    const itemImage = newItem.querySelector("img");
    itemImage.src = work.imageUrl;
    itemImage.alt = work.title;

    const itemIcon = newItem.querySelector("i");
    itemIcon.setAttribute("data-id", work.id);

    ELM_MODAL_GALLERY.appendChild(newItem);
  });
}

const addGalleryDeleteAction = () => {
  ELM_MODAL_GALLERY.addEventListener("click", (e) => {
    if (e.target.classList.contains("editionModal__galleryDeleteAction")) {
      e.preventDefault();
      const elementId = parseInt(e.target.dataset.id);
      const elementTitle = DATA["works"].find((work) => work.id == elementId).title;
      const confirmation = confirm(`Voulez-vous vraiment supprimer "${elementTitle}" ?`);
      if (confirmation) {
        deleteWork(elementId);
      }
    }
  })
}

const loadModalCategory = () => {
  ELM_MODAL_ADD_WORK.querySelector("#addWorkForm__category").replaceChildren();

  Object.keys(DATA["categories"]).forEach(id => {
    ELM_MODAL_ADD_WORK.querySelector("#addWorkForm__category").appendChild(createHTMLElementFromString(TTL_CATEGORY_OPTION(id)));
  });
}

const setupModalEvents = () => {
  // On click on the "add photo" button in the gallery viewer modal, show the add work modal
  ELM_MODAL_GALLERY_VIEWER.querySelector(".editionModal__action").addEventListener("click", (e) => {
    e.preventDefault();
    ELM_MODAL_ADD_WORK.showModal();
    ELM_MODAL_GALLERY_VIEWER.close();
  });

  // On click on the "close" buttons in the gallery viewer modal, close the modal
  ELM_MODAL_GALLERY_VIEWER.querySelector(".editionModal__close").addEventListener("click", (e) => {
    e.preventDefault();
    ELM_MODAL_GALLERY_VIEWER.close();
  });

  // On click on the "close" buttons in the add work modal, close the modal
  ELM_MODAL_ADD_WORK.querySelector(".editionModal__close").addEventListener("click", (e) => {
    e.preventDefault();
    ELM_MODAL_ADD_WORK.close();
  });

  // On click on the "back" button in the add work modal, show the gallery viewer modal
  ELM_MODAL_ADD_WORK.querySelector(".editionModal__back").addEventListener("click", (e) => {
    e.preventDefault();
    ELM_MODAL_GALLERY_VIEWER.showModal();
    ELM_MODAL_ADD_WORK.close();
  });

  // On close the modal, reset the form
  ELM_MODAL_ADD_WORK.addEventListener("close", () => {
    resetAddWorkForm();
  });

  // On change of the file input in the add work modal, show the preview image and enable the submit button
  ELM_MODAL_ADD_WORK.querySelector("#addWorkForm__image").addEventListener("change", (e) => {
    const [file] = ELM_MODAL_ADD_WORK.querySelector("#addWorkForm__image").files;
    if (file) {
      ELM_MODAL_ADD_WORK.querySelector(".addWorkForm__previewImage").src = window.URL.createObjectURL(file);
      ELM_MODAL_ADD_WORK.querySelector(".addWorkForm__imageInput").classList.toggle("hidden");
      ELM_MODAL_ADD_WORK.querySelector(".addWorkForm__preview").classList.toggle("hidden");
      ELM_MODAL_ADD_WORK.querySelector(".editionModal__action").disabled = false;
    }
  });

  // On click on the "add photo" button in the add work modal, add the work
  ELM_MODAL_ADD_WORK.querySelector(".editionModal__action").addEventListener("click", (e) => {
    e.preventDefault();
    addWork();
    ELM_MODAL_ADD_WORK.close();
    ELM_MODAL_GALLERY_VIEWER.showModal();
  });
}