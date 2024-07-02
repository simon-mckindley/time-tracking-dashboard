const radioSelectors = document.querySelectorAll("input[type=radio]");

// Function to fetch and parse the JSON file
async function fetchJsonData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Failed to fetch the JSON data:', error);
    }
}

async function assignData() {
    const data = await fetchJsonData();
    if (data) {
        data.forEach(element => {
            const daily = createCard("daily", element.title, element.timeframes.daily);
            const weekly = createCard("weekly", element.title, element.timeframes.weekly);
            const monthly = createCard("monthly", element.title, element.timeframes.monthly);
            let id = element.title.toLowerCase().replace(" ", "-");
            document.getElementById(id).append(
                daily,
                weekly,
                monthly
            );
        });
    }
}


function createCard(period, title, dataItem) {
    const card = createTextDiv("card-inner", "");
    card.setAttribute("data-period", period);
    if (period === "weekly" || period === "monthly") {
        card.setAttribute("data-hidden", "true");
    }

    card.append(
        createCardHeader(title),
        createCardLower(dataItem.current, dataItem.previous, period)
    );

    return card;
}

function createCardHeader(title) {
    const header = createTextDiv("card-header", "");
    header.appendChild(createTextDiv("", title));

    const button = document.createElement("button");
    button.type = "button";
    const image = document.createElement("img");
    image.width = "21";
    image.src = "images/icon-ellipsis.svg";
    image.alt = "ellipsis";
    button.appendChild(image);

    header.appendChild(button);

    return header;
}

function createCardLower(current, previous, period) {
    let preText =
        (period === "monthly") ? "Last Month"
            : (period === "weekly") ? "Last Week"
                : "Yesterday";

    const lower = createTextDiv("card-lower", "");
    const cardData = createTextDiv("card-data", `${current}hrs`);
    const cardFooter = createTextDiv("card-footer", `${preText} - ${previous}hrs`);
    cardFooter.classList.add("small-text");

    lower.append(cardData, cardFooter);

    return lower;
}


function createTextDiv(className, text) {
    const div = document.createElement("div");
    div.className = className;
    div.textContent = text;
    return div;
}


radioSelectors.forEach((input) => {
    input.addEventListener('change', function (event) {
        const value = event.target.value;

        if (value === "monthly") {
            document.querySelectorAll(".card-inner[data-period='monthly']").forEach((element) => {
                element.setAttribute("data-hidden", "false");
            });
        } else if (value === "weekly") {
            document.querySelectorAll(".card-inner[data-period='monthly']").forEach((element) => {
                element.setAttribute("data-hidden", "true");
            });
            document.querySelectorAll(".card-inner[data-period='weekly']").forEach((element) => {
                element.setAttribute("data-hidden", "false");
            });
        } else if (value === "daily") {
            document.querySelectorAll(".card-inner[data-period='monthly']").forEach((element) => {
                element.setAttribute("data-hidden", "true");
            });
            document.querySelectorAll(".card-inner[data-period='weekly']").forEach((element) => {
                element.setAttribute("data-hidden", "true");
            });
        }
    });
});

assignData();