// ROUTES
const WORKS_ROUTE = "http://localhost:5678/api/works";

// FUNCTIONS
/**
	* Get the list of works
	* @returns {Promise<Array<Object>>} The list of works
*/
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
