// ROUTES
// const WORKS_ROUTE = "http://localhost:5678/api/works";

// DATA
const DATA = {
	works: [],
	categories: [],
}

// ELEMENTS
const FILTER_BUTTONS_CONTAINER = document.querySelector(".filters");
const LOGIN_LINK = document.querySelector(".loginLink");
const PORTOFOLIO_TITLE = document.querySelector(".portfolioSection__title");
const WORKS_CONTAINER = document.querySelector(".gallery");

// TEMPLATES ELEMENTS
const WORKS_TEMPLATE = document.getElementById("worksTemplate");

// FUNCTIONS
/** 
	* Show the works in the works container
	* @param {number} pCategoryID - The category ID to filter the works
*/
const showWorks = (pCategoryID) => {
	// Clear the works container.
	WORKS_CONTAINER.replaceChildren();

	// Get work's list and filter them if a category ID was passed.
	let filteredList = (pCategoryID !== undefined) ? DATA["works"].filter((work) => work.category.id == pCategoryID) : DATA["works"];

	// Append work's HTML content.
	filteredList.forEach(work => {
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
}

// INITIALIZATION
getWorksList().then((worksList) => {
	showWorks();
});