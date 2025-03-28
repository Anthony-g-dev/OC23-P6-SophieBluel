// CONSTANTS
const rawHTML = {
    addPictureModal: `
    <dialog class="editionModal addPictureModal" id="addPictureModal">
        <i class="editionModal__closeButton fa-solid fa-xmark"></i>
        <i class="addPictureSection__goBackAction fa-solid fa-arrow-left"></i>
        <div class="editionModalContainer addPictureSection" id="addPictureSection">
            <h2 class="editionModal__title">Ajout photo</h2>
            <form action="#" class="addPictureForm form">
                <div class="addPictureForm__pictureInputContainer">
                    <i class="fa-regular fa-image"></i>
                    <label for="picture" class="button">+ Ajouter photo</label>
                    <input type="file" name="picture" id="picture" accept=".jpg, .png">
                    <span>jpg, png : 4mo max</span>
                </div>
                <div class="form__group">
                    <label for="title" class="form__label">Titre</label>
                    <input type="text" name="title" id="title" class="form__textInput"/>
                </div>
                <div class="form__group">
                    <label for="categorySelector" class="form__label">Catégorie</label>
                    <select name="categorySelector" id="categorySelector" class="form__selectInput"></select>
                </div>
                <hr class="editionModal__divider">
                <input type="submit" value="Valider" class="button form__submitButton" disabled>
            </form>
        </div>
    </dialog>`,
    addPictureForm__picturePreview: (pSrc) => {return `<img class="addPictureForm__picturePreview" src="${pSrc}" alt="">`;},
    editionModeBanner: `<div class="editionModeBanner"><i class="editionModeBanner__text fa-regular fa-pen-to-square"></i><span class="editionModeBanner__text">Mode édition</span></div>`,
    editionModal: `
    <dialog class="editionModal galleryViewer" id="galleryViewer">
        <i class="editionModal__closeButton fa-solid fa-xmark"></i>
        <div class="editionModalContainer ">
            <h2 class="editionModal__title">Galerie photo</h2>
            <div class="editionModal__gallery"></div>
            <hr class="editionModal__divider">
            <button class="editionModal__addPictureAction button button--active">Ajouter une photo</button>
        </div>
    </dialog>`,
    categoryOption: (pId) => {return `<option value="${pId}">${DATA["categories"][pId]}</option>`},
    editionModal__galleryItem: (pImgLink, pID) => {return `<div class="editionModal__galleryItem"><img src="${pImgLink}" alt=""><i class="editionModal__galleryDeleteAction fa-solid fa-trash-can" data-id="${pID}"></i></div>`},
    filterButton: (pCategoryName, pCategoryID = "") => {return `<button class="button filter" data-category_id="${pCategoryID}">${pCategoryName}</button>`},
    modificationLink: `<a href="#" class="modificationLink"><i class="fa-regular fa-pen-to-square"></i> modifier</a>`,
    work: (pWorkData) => {return `<figure><img src="${pWorkData.imageUrl}" alt="${pWorkData.title}"><figcaption>${pWorkData.title}</figcaption></figure>`},
}

const DATA = {
    categories: {},
    works: [],
};

const indexElements = {
    filterButtonsContainer: document.querySelector(".filters"),
    loginLink: document.querySelector(".loginLink"),
    portofolioTitle: document.querySelector(".portfolioSection__title"),
    worksContainer: document.querySelector(".gallery"),
}

const routes = {
    works: "http://localhost:5678/api/works",
}


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

const getWorksList = async () => {
    try {
        // Send the Request
        const res = await fetch(routes["works"]);

        // Save & Return data
        DATA.works = await res.json();
        return DATA.works;
    } catch (error) {
        throw error;
    }
};

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

const getCategoriesList = (pWorksList) => {
    // Clear categories
    DATA["categories"] = {};

    // Get all categories from last works request
    pWorksList.forEach(work => {
        if (DATA["categories"][work.category.id] == undefined) {DATA["categories"][work.category.id] = work.category.name};
        return DATA["categories"];
    })
}

const showWorks = (pCategoryID) => {
    // Clear the works container.
    indexElements["worksContainer"].replaceChildren();

    // Get work's list and filter them if a category ID was passed.
    let filteredList = DATA["works"];
    if (pCategoryID != undefined) {filteredList = filteredList.filter((work) => work.category.id == pCategoryID)}

    // Append work's HTML content.
    filteredList.forEach(work => {
        indexElements["worksContainer"].appendChild(createHTMLElementFromString(rawHTML["work"](work)));
    });
}

const loadModalGallery = () => {
    // Clear the works container.
    indexElements["editionModal__gallery"].replaceChildren();

    // Get work's list.
    DATA["works"].forEach(work => {
        indexElements["editionModal__gallery"].appendChild(createHTMLElementFromString(rawHTML["editionModal__galleryItem"](work.imageUrl, work.id)));
    });
}

const loadModalCategory = () => {
    // Clear the categories container.
    indexElements["addPictureModal__categorySelector"].replaceChildren();

    // Get categories's list.
    Object.keys(DATA["categories"]).forEach(id => {
        indexElements["addPictureModal__categorySelector"].appendChild(createHTMLElementFromString(rawHTML["categoryOption"](id)));
    });
}

const showFilters = (pCategoryID = "") => {
    // Clear the filters container.
    indexElements["filterButtonsContainer"].replaceChildren();

    // Append filter's HTML content.
    // "ALL" filter
    indexElements["filterButtonsContainer"].appendChild(createHTMLElementFromString(rawHTML["filterButton"]("Tous"))).addEventListener("click", (e) => {
        filterCallback()
    });

    // Per categories filters
    for (const [pCategoryID, pCategoryName] of Object.entries(DATA["categories"])) {
        indexElements["filterButtonsContainer"].appendChild(createHTMLElementFromString(rawHTML["filterButton"](pCategoryName, pCategoryID))).addEventListener("click", (e) => {
            filterCallback(pCategoryID);
        });;
    }

    // Default filter selection
    document.querySelector(`[data-category_id="${pCategoryID}"]`).classList.add("button--active");
}

const filterCallback = (pCategoryID) => {
    showWorks(pCategoryID);
    document.querySelector(".filter.button--active").classList.remove("button--active");
    document.querySelector(`[data-category_id="${pCategoryID || ""}"]`).classList.add("button--active");
}


// INIT
getWorksList().then((worksList) => {
    getCategoriesList(worksList);
    showWorks();
    showFilters();
    if (sessionStorage.userToken) {loadModalGallery();loadModalCategory();}
});

// Check if the user is connected
if (sessionStorage.userToken) {
    // Switch the id to logoutLink
    indexElements["loginLink"].setAttribute("id", "logoutLink");

    // Select the element and change her text
    indexElements["logoutLink"] = document.getElementById("logoutLink");
    indexElements["logoutLink"].textContent = "logout";

    // Add the callback to the logout link
    indexElements["logoutLink"].addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.removeItem("userToken");
        window.location.href = "index.html";
    });

    // Add the edition mode banner en add margin to body
    document.body.prepend(createHTMLElementFromString(rawHTML["editionModeBanner"]));
    indexElements["editionModeBanner"] = document.querySelector(".editionModeBanner");
    document.body.style.marginTop = `${indexElements["editionModeBanner"].clientHeight}px`;

    // Add the modification link next to the portofolio's section title
    indexElements["modificationLink"] = indexElements["portofolioTitle"].appendChild(createHTMLElementFromString(rawHTML["modificationLink"]));

    // Add the modification modal
    indexElements["editionModal"] = document.body.appendChild(createHTMLElementFromString(rawHTML["editionModal"]));
    indexElements["editionModal__gallery"] = indexElements["editionModal"].querySelector(".editionModal__gallery");
    
    // Add callback to close the editionModal if user click outside
    indexElements["editionModal"].addEventListener("click", (e) => {
        if (e.target === indexElements["editionModal"]) {indexElements["editionModal"].close();}
    });
    
    // Add the callback to the edition modal's close button
    indexElements["editionModal"].querySelector(".editionModal__closeButton").addEventListener("click", (e) => {
        indexElements["editionModal"].close();
    });

    // Add the callback to the addPicture button {
    indexElements["editionModal"].querySelector(".editionModal__addPictureAction").addEventListener("click", (e) => {
        indexElements["editionModal"].close();
        indexElements["addPictureModal"].showModal();
    });

    // Add the addPicture modal
    indexElements["addPictureModal"] = document.body.appendChild(createHTMLElementFromString(rawHTML["addPictureModal"]));
    indexElements["addPictureModal__picture"] = indexElements["addPictureModal"].querySelector("#picture");
    indexElements["addPictureModal__title"] = indexElements["addPictureModal"].querySelector("#title");
    indexElements["addPictureModal__categorySelector"] = indexElements["addPictureModal"].querySelector("#categorySelector");
    indexElements["addPictureModal__submitButton"] = indexElements["addPictureModal"].querySelector(".form__submitButton");

    // Add callbacks to the gallery's delete actions
    indexElements["editionModal__gallery"].addEventListener("click", (e) => {
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

    // Add callback to close the addPicture if user click outside
    indexElements["addPictureModal"].addEventListener("click", (e) => {
        if (e.target === indexElements["addPictureModal"]) {indexElements["addPictureModal"].close();}
    });

    // Add the callback to the addPicture modal's goBack button
    indexElements["addPictureModal"].querySelector(".addPictureSection__goBackAction").addEventListener("click", (e) => {
        indexElements["editionModal"].showModal();
        indexElements["addPictureModal"].close();
    });

    // Add the callback to the addPicture modal's close button
    indexElements["addPictureModal"].querySelector(".editionModal__closeButton").addEventListener("click", (e) => {
        indexElements["addPictureModal"].close();
    });

    // Add the picture preview on change
    indexElements["addPictureModal"].querySelector("#picture").addEventListener("change", (e) => {
        const [file] = indexElements["addPictureModal"].querySelector("#picture").files
        if (file) {
            indexElements["addPictureModal"].querySelector(".addPictureForm__pictureInputContainer").replaceChildren(createHTMLElementFromString(rawHTML["addPictureForm__picturePreview"](window.URL.createObjectURL(file))));
            indexElements["addPictureModal__submitButton"].disabled = false;
        }
    });

    //
    indexElements["addPictureModal__submitButton"].addEventListener("click", (e) => {
        e.preventDefault();
        addWork();
        indexElements["editionModal"].showModal();
        indexElements["addPictureModal"].close();
    });
    
    // Add the callback to the modification link
    indexElements["modificationLink"].addEventListener("click", (e) => {
        e.preventDefault();
        indexElements["editionModal"].showModal();
    });
}