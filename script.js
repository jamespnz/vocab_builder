fetch('./vocab.csv')
    .then(response => response.text())
    .then(csvData => {
        const parsedData = Papa.parse(csvData, { header: false }).data;

        // Ensure valid words formatted as [Kanji, Reading, Meaning]
        const words = parsedData.filter(row => row.length === 3);

        const wordsPerDay = 5;
        const buttonContainer = document.getElementById("button-container");

        for (let i = 0; i < Math.ceil(words.length / wordsPerDay); i++) {
            let button = document.createElement("button");
            button.innerText = `Day ${i + 1}`;
            button.onclick = () => {
                displayWords(words.slice(i * wordsPerDay, (i + 1) * wordsPerDay));
            };
            buttonContainer.appendChild(button);
        }
    })
    .catch(error => console.error("Error loading CSV:", error));

function displayWords(wordList) {
    let wordDisplay = document.getElementById("word-display");
    wordDisplay.innerHTML = ""; // Clear previous content

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