const SearchURL = "http://localhost:8080/";
/**
 * get the search value
 * @param {string} url 
 * @returns {Promise} it will convert the data to JSON
 */
const getSearchData = async (url) => {
    /**
     * try catch block helps not to break the application,
     * however it shows the error in the console
     */
    try {
        const response = await fetch(url);              // it will wait until the fetch request done
        return await response.json();                   // it will wait until the json conversion done
    } catch (error) {
        console.log(error);
    }
}

/**
 * @param {HTMLElement} parentElement 
 */
const clearSearchResults = (parentElement) => {

    /**
     * remove all the children until
     * there is no more first children from parent elem
     */
    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
    }
}

/**
 * DOM tree must be ready before using
 * any javascript code
 */
document.addEventListener('DOMContentLoaded', function () {
    // console.log("DOM is ready");

    /**
     * @type {HTMLFormElement} form
     */
    const form = document.getElementById("search");

    /**
     * @type {HTMLDivElement} result
     */
    const result = document.getElementById('result');

    // console.log(result);

    // this event occurs when submitting the form
    form.addEventListener('submit', (e) => {
        e.preventDefault();                             // preventing the default behavior of the browser

        /**
         * @type {HTMLInputElement} search
         */
        const search = form['search'];

        // Get the unique value
        // "f f f f call or call about" -> "f call or"
        let value = search.value.trim();                // trimming the search value
        value = Array.from(new Set(value.split(' ')));  // getting the unique search result
        value = value.join(' ');                        // join it again from array to string

        // console.log(value);

        // if the value is empty string then no need to send the request
        if (value.length === 0) {
            // clear the previous results
            clearSearchResults(result);
            return;
        }

        // A simple loading affect
        result.textContent = "Loading...";

        let data = getSearchData(`${SearchURL}?queryParam=${encodeURIComponent(value)}`);

        data.then(responseData => {
            // clear the previous results
            clearSearchResults(result);

            let _val = value.split(' ');

            // console.log("value: ", _val);

            /**
             * response data is array of string
             * so, if there is search value found
             * a new "P" element created and appended
             * to the search search
             */
            responseData.map((v, i) => {
                if (v !== 'nothing') {
                    let p = document.createElement('p');

                    p.textContent = `Search "${_val[i]}" is "found"`;
                    result.append(p);
                }
            });

            // console.log("responseData: ", responseData);
        });
    });

    // console.dir(search);
});
