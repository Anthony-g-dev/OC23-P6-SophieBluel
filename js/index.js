// DATA
const DATA = {
  works: [],
  categories: [],
};

// ELEMENTS
const EDITION_MODE_BANNER = document.querySelector(".editionModeBanner");
const FILTER_BUTTONS_CONTAINER = document.querySelector(".filters");
const LOGIN_LINK = document.querySelector(".loginLink");
const PORTOFOLIO_TITLE = document.querySelector(".portfolioSection__title");
const WORKS_CONTAINER = document.querySelector(".gallery");

// TEMPLATES ELEMENTS
const WORKS_TEMPLATE = document.getElementById("worksTemplate");

// FUNCTIONS
const showWorks = (pCategoryID = "") => {
  // Clear the works container.
  WORKS_CONTAINER.replaceChildren();

  // Get work's list and filter them if a category ID was passed.
  let filteredList =
    pCategoryID !== ""
      ? DATA["works"].filter((work) => work.category.id == pCategoryID)
      : DATA["works"];

  // Append work's HTML content.
  filteredList.forEach((work) => {
    // Clone the template.
    const newWork = WORKS_TEMPLATE.content.cloneNode(true);

    // Fill the template with work's data.
    const workImage = newWork.querySelector("img");
    workImage.src = work.imageUrl;
    workImage.alt = work.title;

    newWork.querySelector("figcaption").textContent = work.title;

    // Append the new work to the works container.
    WORKS_CONTAINER.appendChild(newWork);
  });
};

const showFilters = (pCategoryID = "") => {
  // Clear the filters container.
  FILTER_BUTTONS_CONTAINER.replaceChildren();
	const FILTERS_BUTTONS = document.createDocumentFragment();

  // Append filter's HTML content.
  // "ALL" filter
	const newButton = document.createElement("button");
	newButton.classList.add("button", "filter", "button--active");
	newButton.dataset.category_id = "";
	newButton.textContent = "Tous";
  FILTER_BUTTONS_CONTAINER.appendChild(newButton).addEventListener("click", (e) => {
    filterCallback();
  });
	FILTERS_BUTTONS.appendChild(newButton);

  // Per categories filters
  for (const [pThisCategoryID, pCategoryName] of Object.entries(DATA["categories"])) {
		const newButton = document.createElement("button");
		newButton.classList.add("button", "filter");
		newButton.dataset.category_id = pThisCategoryID;
		newButton.textContent = pCategoryName;
    FILTER_BUTTONS_CONTAINER.appendChild(newButton).addEventListener("click", (e) => {
			filterCallback(pThisCategoryID);
		});
		FILTERS_BUTTONS.appendChild(newButton);
  }

	// Append the filters buttons to the filters container.
	FILTER_BUTTONS_CONTAINER.appendChild(FILTERS_BUTTONS);

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
	LOGIN_LINK.setAttribute("id", "logoutLink");

	// Select the element and change her text
	LOGOUT_LINK = document.getElementById("logoutLink");
	LOGOUT_LINK.textContent = "logout";

	// Add the callback to the logout link
	LOGOUT_LINK.addEventListener("click", (e) => {
			e.preventDefault();
			sessionStorage.removeItem("userToken");
			window.location.href = "index.html";
			EDITION_MODE_BANNER.style.display = "none";
	});
}

// INITIALIZATION
getWorksList().then((worksList) => {
  showWorks();
  getCategoriesList(worksList);
  showFilters();
});

// Adapt the page if the user is connected
if (sessionStorage.userToken) {
	EDITION_MODE_BANNER.style.display = "flex";
	document.body.style.marginTop = `${document.querySelector(".editionModeBanner").clientHeight}px`;
	allowLogout();
}