const createHTMLElementFromString = (pString) => {
	const div = document.createElement("div");
	div.innerHTML = pString.trim();
	return div.firstChild;
}