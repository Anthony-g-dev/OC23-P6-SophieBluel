// ROUTES
const WORKS_ROUTE = "http://localhost:5678/api/works";

// FUNCTIONS
const addWork = async () => {
  // Create Request Body
  const reqBody = new FormData();
  reqBody.append("image", ELM_MODAL_ADD_WORK.querySelector("#addWorkForm__picture").files[0]);
  reqBody.append("title", ELM_MODAL_ADD_WORK.querySelector("#addWorkForm__title").value);
  reqBody.append("category", ELM_MODAL_ADD_WORK.querySelector("#addWorkForm__categorySelector").value);

  try {
    // Send the Request
    const res = await fetch(WORKS_ROUTE, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${sessionStorage.userToken}`,
      },
      body: reqBody,
    });
    
    if (res.ok) {
      // Update works
      getWorksList().then((worksList) => {
        // Reset the form and hide the preview
        ELM_MODAL_ADD_WORK.querySelector("#addWorkForm").reset();
        ELM_MODAL_ADD_WORK.querySelector(".addWorkForm__previewImage").src = "";
        ELM_MODAL_ADD_WORK.querySelector(".addWorkForm__preview").classList.toggle("hidden");
        ELM_MODAL_ADD_WORK.querySelector(".addWorkForm__imageInput").classList.toggle("hidden");
        
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