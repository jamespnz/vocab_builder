document.addEventListener("DOMContentLoaded", function () {
    const wordDisplay = document.getElementById("word-display");
    const buttonContainer = document.getElementById("button-container");

    if (wordDisplay) {
        wordDisplay.style.display = "none"; // Hide vocab table initially
    } else {
        console.error("Error: 'word-display' not found.");
    }

    if (!buttonContainer) {
        console.error("Error: 'button-container' not found.");
        return;
    }

    fetch('./vocab.csv')
    .then(response => response.text())
    .then(csvData => {
        const parsedData = Papa.parse(csvData, { header: false }).data;
        const words = parsedData.filter(row => row.length === 3 && row.every(cell => cell.trim() !== "")); // Filters out empty rows
        const wordsPerDay = 5;

        let totalDays = Math.ceil(words.length / wordsPerDay); // Dynamically calculate button count

        let activeDay = null; // Track currently open table

        for (let i = 0; i < totalDays; i++) {
            // Ensure we are only creating buttons for days that actually have words
            if (words.slice(i * wordsPerDay, (i + 1) * wordsPerDay).length === 0) {
                continue; // Skip empty days
            }

            let button = document.createElement("button");
            button.innerText = `Day ${i + 1}`;
            button.onclick = () => {
                if (activeDay === i) {
                    wordDisplay.style.display = "none";
                    wordDisplay.innerHTML = "";
                    activeDay = null;
                } else {
                    wordDisplay.innerHTML = "";
                    wordDisplay.style.display = "block";
                    displayWords(words.slice(i * wordsPerDay, (i + 1) * wordsPerDay));
                    activeDay = i;
                }
            };
            buttonContainer.appendChild(button);
        }
    })
    .catch(error => console.error("Error loading CSV:", error));
});

// Function to display words in a table format
function displayWords(wordList) {
    let wordDisplay = document.getElementById("word-display");

    let table = document.createElement("table");
    let headerRow = document.createElement("tr");

    ["Kanji", "Reading (Romaji)", "Meaning"].forEach(header => {
        let th = document.createElement("th");
        th.innerText = header;
        headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    wordList.forEach(row => {
        let tableRow = document.createElement("tr");
        row.forEach(word => {
            let cell = document.createElement("td");
            cell.innerText = word;
            tableRow.appendChild(cell);
        });
        table.appendChild(tableRow);
    });

    wordDisplay.appendChild(table);
}