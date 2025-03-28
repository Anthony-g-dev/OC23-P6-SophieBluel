// FUNCTIONS
let createHTMLElementFromString = (pString) => {
	let tempDiv = document.createElement("div");
	tempDiv.innerHTML = pString.trim();
	return tempDiv.firstChild;
}