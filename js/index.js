// DATA
const DATA = {
  works: [],
  categories: {},
};

// ELEMENTS
const ELM_EDITION_MODE_BANNER = document.querySelector(".editionModeBanner");
const ELM_FILTER_BUTTONS_CONTAINER = document.querySelector(".filters");
const ELM_LOGIN_LINK = document.querySelector(".loginLink");
const ELM_PORTOFOLIO_TITLE = document.querySelector(".portfolioSection__title");
const ELM_WORKS_CONTAINER = document.querySelector(".gallery");
const ELM_MODAL_GALLERY_VIEWER = document.querySelector("#galleryViewerModal");
const ELM_MODAL_GALLERY = document.querySelector(".editionModal__gallery");
const ELM_MODAL_ADD_WORK = document.querySelector("#addWorkModal");

// TEMPLATES ELEMENTS
const TLE_WORKS_TEMPLATE = document.getElementById("worksTemplate");
const TLE_GALLERY_ITEM_TEMPLATE = document.getElementById("galleryItemTemplate");

// TEMPLATES LITERALS
const TLL_MODIFICATION_LINK = `<a href="#" class="modificationLink"><i class="fa-regular fa-pen-to-square"></i> modifier</a>`
const TTL_CATEGORY_OPTION = (pId) => `<option value="${pId}">${DATA["categories"][pId]}</option>`;

// FUNCTIONS
const showWorks = (pCategoryID = "") => {
  // Clear the works container.
  ELM_WORKS_CONTAINER.replaceChildren();

  // Get work's list and filter them if a category ID was passed.
  let filteredList = (pCategoryID !== "") ? DATA["works"].filter((work) => work.category.id == pCategoryID) : DATA["works"];

  // Append work's HTML content.
  filteredList.forEach((work) => {
    // Clone the template.
    const newWork = TLE_WORKS_TEMPLATE.content.cloneNode(true);

    // Fill the template with work's data.
    const workImage = newWork.querySelector("img");
    workImage.src = work.imageUrl;
    workImage.alt = work.title;

    newWork.querySelector("figcaption").textContent = work.title;

    // Append the new work to the works container.
    ELM_WORKS_CONTAINER.appendChild(newWork);
  });
};

const showFilters = (pCategoryID = "") => {
  // Clear the filters container.
  ELM_FILTER_BUTTONS_CONTAINER.replaceChildren();
	const FILTERS_BUTTONS = document.createDocumentFragment();

  // Append filter's HTML content.
  // "ALL" filter
	const newButton = document.createElement("button");
	newButton.classList.add("button", "filter", "button--active");
	newButton.dataset.category_id = "";
	newButton.textContent = "Tous";
  ELM_FILTER_BUTTONS_CONTAINER.appendChild(newButton).addEventListener("click", (e) => {
    filterCallback();
  });
	FILTERS_BUTTONS.appendChild(newButton);

  // Per categories filters
  for (const [pThisCategoryID, pCategoryName] of Object.entries(DATA["categories"])) {
		const newButton = document.createElement("button");
		newButton.classList.add("button", "filter");
		newButton.dataset.category_id = pThisCategoryID;
		newButton.textContent = pCategoryName;
    ELM_FILTER_BUTTONS_CONTAINER.appendChild(newButton).addEventListener("click", (e) => {
			filterCallback(pThisCategoryID);
		});
		FILTERS_BUTTONS.appendChild(newButton);
  }

	// Append the filters buttons to the filters container.
	ELM_FILTER_BUTTONS_CONTAINER.appendChild(FILTERS_BUTTONS);

  // Update the active filter button if a category ID was passed.
	updateActiveFilter(pCategoryID);
};

// function to update the active filter button
const updateActiveFilter = (pCategoryID) => {
	document.querySelector(".filter.button--active").classList.remove("button--active");
	document.querySelector(`[data-category_id="${pCategoryID}"]`).classList.add("button--active");
}

// Callback called when a filter button is clicked.
const filterCallback = (pCategoryID = "") => {
	showWorks(pCategoryID);
	updateActiveFilter(pCategoryID);
}

// Change the login link to a logout link and add the logout callback.
const allowLogout = () => {
	// Switch the id to logoutLink
	ELM_LOGIN_LINK.setAttribute("id", "logoutLink");

	// Select the element and change her text
	const LOGOUT_LINK = document.getElementById("logoutLink");
	LOGOUT_LINK.textContent = "logout";

	// Add the callback to the logout link
	LOGOUT_LINK.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.removeItem("userToken");
    window.location.href = "index.html";
    ELM_EDITION_MODE_BANNER.style.display = "none";
	});
}

const loadModalGallery = () => {
  // // Clear the works container.
  ELM_MODAL_GALLERY.replaceChildren();

  // // Get work's list.
  DATA["works"].forEach(work => {
    // Clone the template.
    const newItem = TLE_GALLERY_ITEM_TEMPLATE.content.cloneNode(true);

    // Fill the template with item's data.
    const itemImage = newItem.querySelector("img");
    itemImage.src = work.imageUrl;
    itemImage.alt = work.title;

    const itemIcon = newItem.querySelector("i");
    itemIcon.setAttribute("data-id", work.id);

    // Append the new work to the works container.
    ELM_MODAL_GALLERY.appendChild(newItem);
  });
}

const addGalleryDeleteAction = () => {
  ELM_MODAL_GALLERY.addEventListener("click", (e) => {
    if (e.target.classList.contains("editionModal__galleryDeleteAction")) {
      e.preventDefault();
      const elementId = e.target.dataset.id;
      const elementTitle = DATA["works"].find((work) => work.id == elementId).title;
      const confirmation = confirm(`Voulez-vous vraiment supprimer "${elementTitle}" ?`);
      if (confirmation) {
        deleteWork(parseInt(elementId));
      }
    }
  })
}

const loadModalCategory = () => {
  // Clear the categories container.
  ELM_MODAL_ADD_WORK.querySelector("#categorySelector").replaceChildren();

  // Get categories's list.
  Object.keys(DATA["categories"]).forEach(id => {
    ELM_MODAL_ADD_WORK.querySelector("#categorySelector").appendChild(createHTMLElementFromString(TTL_CATEGORY_OPTION(id)));
  });
}

// INITIALIZATION
getWorksList().then((worksList) => {
  showWorks();
  getCategoriesList(worksList);
  showFilters();

  // Adapt the page if the user is connected
  if (sessionStorage.userToken) {
    loadModalGallery();
    addGalleryDeleteAction();
    loadModalCategory();

    // Show the edition mode banner
    ELM_EDITION_MODE_BANNER.classList.remove("hidden");
    document.body.style.marginTop = `${document.querySelector(".editionModeBanner").clientHeight}px`;
    // Convert the login link to a logout link
    allowLogout();

    // Add the modification link next to the portofolio's section title
    const modificationLink = createHTMLElementFromString(TLL_MODIFICATION_LINK);
    const ELM_MODIFICATION_LINK = ELM_PORTOFOLIO_TITLE.appendChild(modificationLink);
    ELM_MODIFICATION_LINK.addEventListener("click", (e) => {
      e.preventDefault();
      // Open the edition modal
      ELM_MODAL_GALLERY_VIEWER.showModal();
      // Add the callback for the add picture button
      ELM_MODAL_GALLERY_VIEWER.querySelector(".editionModal__action").addEventListener("click", (e) => {
        e.preventDefault();
        // Open the add picture modal
        ELM_MODAL_ADD_WORK.showModal();
        ELM_MODAL_GALLERY_VIEWER.close();
      });
    });

    // Add the close callback for the modals
    ELM_MODAL_GALLERY_VIEWER.querySelector(".editionModal__close").addEventListener("click", (e) => {
      e.preventDefault();
      ELM_MODAL_GALLERY_VIEWER.close();
    });

    ELM_MODAL_ADD_WORK.querySelector(".editionModal__close").addEventListener("click", (e) => {
      e.preventDefault();
      ELM_MODAL_ADD_WORK.close();
    });

    // Add the callback to open the gallery viewer modal if back button is clicked on the add picture modal
    ELM_MODAL_ADD_WORK.querySelector(".editionModal__back").addEventListener("click", (e) => {
      e.preventDefault();
      ELM_MODAL_GALLERY_VIEWER.showModal();
      ELM_MODAL_ADD_WORK.close();
    });
  }
});