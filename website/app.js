window.addEventListener("DOMContentLoaded", () => {
    const API_KEY = "8426a61a263ed3bbe8830e6f98d6fd24&units=celsius";
    const errorLabel = document.getElementById("errorMessage");
    const dateLabel = document.getElementById("date");
    const tempLabel = document.getElementById("temp");
    const contentLabel = document.getElementById("content");

    const zipField = document.getElementById("zip");
    const feelingField = document.getElementById("feelings");

    const emptyFields = () => {
        errorLabel.innerHTML = '';
        dateLabel.innerHTML = '';
        tempLabel.innerHTML = '';
        contentLabel.innerHTML = '';
    }

    const generateHandler = async (e) => {
        // Prevent form submit default behavior
        e.preventDefault();

        // Prepare the API URL.
        let url = "https://api.openweathermap.org/data/2.5/weather?zip=ZIP_CODE&appid=API_KEY";

        // Empty labels
        emptyFields();

        // Get zip field value
        let zip = zipField.value;

        // Replace URL with new values.
        url = url.replace("API_KEY", API_KEY).replace("ZIP_CODE", zip);

        // Get feelings field value
        let feeling = feelingField.value;

        // Prepare the date object
        let d = new Date().toLocaleDateString();

        // Make the requist to openweathermaps API.
        let data = await getWeather(url);

        // Make sure the request is ok.
        if (data.cod != 200) {
            // If not ok, display an error message
            errorLabel.innerHTML = `Error ${data.cod} - ${data.message.toUpperCase()}`
            return;
        }

        // Else if ok, post the data to our backend.
        await postData("/add", {
            date: d,
            temp: data.main.temp,
            content: feeling
        });

        // Update the UI with new values.
        await updateUI();
    }
    document.getElementById('generate')
        .addEventListener('click', generateHandler);

    let getWeather = async (baseUrl) => {
        try {
            let response = await fetch(baseUrl);
            return response.json();
        } catch(e) {
            console.error(e);
            return null;
        }
    }

    const updateUI = async () => 
    {
        // Get all records from back-end
        try {
            const response = await fetch('/all');
            const data = await response.json()

            // update new entry values
            dateLabel.innerHTML = data.date;
            tempLabel.innerHTML = data.temp;
            contentLabel.innerHTML = data.content;

            // Clear the form
            zipField.value = "";
            feelingField.value = "";
        }
        catch (error) {
            console.error(error);
        }
    };

    const postData = async (url = '', data = {}) => {
        // Upload data to back-end
        let options = {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify({
                date: data.date,
                temp: data.temp,
                content: data.content
            })
        };
        const response = await fetch(url, options);
        try {
            return response.json();
        }
        catch (error) {
          console.error(error);
        }
    };
});