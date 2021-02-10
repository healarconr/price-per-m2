function main() {
    new MutationObserver(checkResults).observe(document, {
        "childList": true,
        "subtree": true
    });
    checkResults();
}

function checkResults() {
    if (hasListResults() && !isObservingListResults()) {
        observeListResults();
    }
    if (hasNewProjectResults() && !isObservingNewProjectResults()) {
        observeNewProjectResults();
    }
}

function hasListResults() {
    return getListResultsNode() !== null;
}

function getListResultsNode() {
    const listResultsNode = document.querySelector(".browse-results-list");
    return listResultsNode ? listResultsNode.parentNode : null;
}

function isObservingListResults() {
    return getListResultsNode().__pricePerSquareElementMutationObserver !== undefined;
}

function observeListResults() {
    const observer = new MutationObserver(showPricesInListResults);
    const node = getListResultsNode();
    node.__pricePerSquareElementMutationObserver = observer;
    observer.observe(node, {
        "childList": true,
        "subtree": true
    });
    showPricesInListResults();
}

function showPricesInListResults() {
    const listResultsNode = getListResultsNode()
    const results = listResultsNode.querySelectorAll(".card");
    for (const result of results) {
        try {
            let pricePerSquareMeterElement = result.querySelector("span.x-price-per-square-meter");
            if (pricePerSquareMeterElement !== null) {
                continue;
            }
            const cardSubItems = result.querySelectorAll(".card-block .card-subitem");
            const priceNode = cardSubItems[0];
            const price = findPrice(priceNode.textContent);
            const area = findArea(cardSubItems[1].textContent);
            const pricePerSquareMeter = formatPricePerSquareMeter(price / area);
            pricePerSquareMeterElement = document.createElement("span");
            pricePerSquareMeterElement.className = "x-price-per-square-meter";
            if (result.classList.contains("card-project")) {
                pricePerSquareMeterElement.style.position = "absolute";
            }
            pricePerSquareMeterElement.style.fontSize = "small";
            pricePerSquareMeterElement.style.fontWeight = "normal";
            pricePerSquareMeterElement.appendChild(document.createTextNode(pricePerSquareMeter));
            priceNode.parentNode.appendChild(pricePerSquareMeterElement);
        } catch (e) {
            // Do nothing
        }
    }
}

function findPrice(value) {
    return parseFloat(value.match(/[\d.]+/)[0].replace(/\./g, ""));
}

function findArea(value) {
    return parseFloat(value.match(/[\d.]+/)[0]);
}

function formatPricePerSquareMeter(pricePerSquareMeter) {
    return pricePerSquareMeter.toLocaleString("es-CO", {
        "style": "currency",
        "currency": "COP",
        "minimumFractionDigits": 0,
        "maximumFractionDigits": 0
    }) + "/m\u00B2";
}

function hasNewProjectResults() {
    return getNewProjectResultsNode() !== null;
}

function getNewProjectResultsNode() {
    const newProjectResultsTitle = document.evaluate("//h2[text()=\"Tipo de inmueble\"]", document).iterateNext();
    return newProjectResultsTitle ? newProjectResultsTitle.parentNode : null;
}

function isObservingNewProjectResults() {
    return getNewProjectResultsNode().__pricePerSquareElementMutationObserver !== undefined;
}

function observeNewProjectResults() {
    const observer = new MutationObserver(showPricesInNewProject);
    const node = getNewProjectResultsNode();
    node.__pricePerSquareElementMutationObserver = observer;
    observer.observe(node, {
        "childList": true,
        "subtree": true
    });
    showPricesInNewProject();
}

function showPricesInNewProject() {
    const results = getNewProjectResultsNode().querySelectorAll(".card");
    for (const result of results) {
        try {
            let pricePerSquareMeterElement = result.querySelector("span.x-price-per-square-meter");
            if (pricePerSquareMeterElement !== null) {
                continue;
            }
            const priceNode = result.querySelector(".card-header li:nth-child(2)")
            const price = findPrice(priceNode.textContent);
            const area = findArea(result.querySelectorAll(".card-block .card-subitem")[1].textContent);
            const pricePerSquareMeter = formatPricePerSquareMeter(price / area);
            pricePerSquareMeterElement = document.createElement("span");
            pricePerSquareMeterElement.className = "x-price-per-square-meter";
            pricePerSquareMeterElement.style.fontSize = "small";
            pricePerSquareMeterElement.style.fontWeight = "normal";
            pricePerSquareMeterElement.appendChild(document.createTextNode(pricePerSquareMeter));
            priceNode.parentNode.appendChild(pricePerSquareMeterElement);
        } catch (e) {
            // Do nothing
        }
    }
}

main();