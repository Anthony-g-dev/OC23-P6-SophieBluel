// FUNCTIONS
const getCategoriesList = (pWorksList) => {
  // Clear categories data
  DATA["categories"] = {};

  // Get all categories from the works list
  pWorksList.forEach((work) => {
    if (!DATA["categories"][work.category.id]) {
      DATA["categories"][work.category.id] = work.category.name;
    }
    return DATA["categories"];
  });
};