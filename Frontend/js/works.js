// ROUTES
const WORKS_ROUTE = "http://localhost:5678/api/works";

// ELEMENTS
const ELM_ADD_WORK_FORM = ELM_MODAL_ADD_WORK.querySelector("#addWorkForm");

// CONSTANTS
const FOUR_MB = 4194304; // 4MB
const ALLOWED_IMAGE_TYPES = ["image/jpg", "image/jpeg", "image/png"];

// VARIABLES
let debounceTimeout;
const DEBOUNCE_DELAY = 300; // 300ms

// FUNCTIONS
// Validate the work form, if the form is valid, return the form data, else return an error message
const validateAddWorkForm = () => {
  const formData = new FormData(ELM_ADD_WORK_FORM);

  const image = formData.get("image");
  const title = formData.get("title");
  const category = formData.get("category");

  // Validate the image existence, size and type
  if (!(image && image instanceof File && image.size > 0)) {return "IMAGE ERROR: Image is required."}
  if (image.size > FOUR_MB) {return "IMAGE ERROR: Image size is too big. Max size is 4MB."}
  if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {return "IMAGE ERROR: Invalid image type. Allowed types are: jpg, jpeg, png."}
  
  // Validate the title
  if (title.trim() === "") {return "TITLE ERROR: Title is required."}

  // Validate the category
  if (!DATA["categories"][category]) {return "CATEGORY ERROR: Incorrect category."}
}

const updateSubmitButtonState = () => {
  const error = validateAddWorkForm();
  // If an Image error occured, reset the image input
  if (error && error.includes("IMAGE ERROR")) {resetImageInput(); handleFormError(error);}
  // If there is no error, enable the submit button else disable it
  ELM_MODAL_ADD_WORK.querySelector(".editionModal__action").disabled = !!error;
}

const handleFormError = (error) => {
  console.error(error);
}

const resetImageInput = () => {
  // Remove the preview and show the image input
  ELM_MODAL_ADD_WORK.querySelector(".addWorkForm__previewImage").src = "";
  ELM_MODAL_ADD_WORK.querySelector(".addWorkForm__preview").classList.add("hidden");
  ELM_MODAL_ADD_WORK.querySelector(".addWorkForm__imageInput").classList.remove("hidden");
}

const resetAddWorkForm = () => {
  ELM_ADD_WORK_FORM.reset();
  resetImageInput();
}

const addWork = async () => {
  // Get the form data
  const payload = new FormData(ELM_ADD_WORK_FORM);
  
  // Validate the form
  const error = validateAddWorkForm();
  if (error) {handleFormError(error); resetAddWorkForm(); return;};

  try {
    // Send the Request
    const res = await fetch(WORKS_ROUTE, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${sessionStorage.userToken}`,
      },
      body: payload,
    });
    
    if (res.ok) {
      // Update works
      getWorksList().then((worksList) => {
        resetAddWorkForm();
        getCategoriesList(worksList);
        showWorks();
        loadModalGallery();
      });
    } else { // Error catcher
      throw new Error("Error");
    }
  } catch (error) {
    console.error(error);
  }
}

const deleteWork = async (pId) => {
  try {
    // Send the Request
    const res = await fetch(`${WORKS_ROUTE}/${pId}`, {
      method: "DELETE",
      headers: {
        "Accept": "*/*",
        "Authorization": `Bearer ${sessionStorage.userToken}`,
      }
    });
    
    if (res.ok) {
      DATA["works"] = DATA["works"].filter(item => item["id"] !== pId);
      showWorks();
      loadModalGallery();
    } else { // Error catcher
      if (res.status === 401) {
        throw new Error("Accès non autorisé. Veuillez vous connecter.");
      } else {
        throw new Error("Erreur réseau");
      }
    }
  } catch (error) {
    console.error(error)
  }
}

const getWorksList = async () => {
	try {
    // Send the Request
    const res = await fetch(WORKS_ROUTE);

    // Save & Return data
    DATA.works = await res.json();
    return DATA.works;
  } catch (error) {
    throw error;
  }
};