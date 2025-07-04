// ROUTES
const WORKS_ROUTE = "http://localhost:5678/api/works";

// FUNCTIONS
const addWork = async () => {
  // Create Request Body
  const reqBody = new FormData();
  reqBody.append("image", indexElements['addPictureModal__picture'].files[0]);
  reqBody.append("title", indexElements['addPictureModal__title'].value);
  reqBody.append("category", indexElements["addPictureModal__categorySelector"].value);

  try {
    // Send the Request
    const res = await fetch(routes["works"], {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${sessionStorage.userToken}`,
      },
      body: reqBody,
    });
    
    if (res.ok) {
      // Update works
      getWorksList().then((worksList) => {
        document.querySelector(".addPictureForm").reset();
        ELM_MODAL_ADD_WORK.querySelector(".addPictureForm__pictureInputContainer").replaceChildren("")
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
    const res = await fetch(`${routes["works"]}/${pId}`, {
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
      if (res.status == 401) {
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