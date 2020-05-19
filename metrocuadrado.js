function main() {
    if (hasListResults()) {
        showPricesInListResults();
        observeListResultsChanges();
    }
}

function hasListResults() {
    return document.querySelector("#resultListHtmlContainer") !== null;
}

function showPricesInListResults() {
    showPricesInRegularListResults();
    showPricesInHighlightedListResults();
}

function showPricesInRegularListResults() {
    const results = document.querySelectorAll("[itemtype='http://schema.org/Offer']");
    for (const result of results) {
        try {
            let pricePerSquareMeterElement = result.querySelector("span.x-price-per-square-meter");
            if (pricePerSquareMeterElement !== null) {
                continue;
            }
            const priceNode = result.querySelector("[itemprop='price']");
            const price = findPrice(priceNode.textContent);
            const area = findArea(result.querySelector(".m2>p>span:nth-child(2)").textContent);
            const pricePerSquareMeter = (price / area).toLocaleString("es-CO", { "style": "currency", "currency": "COP", "minimumFractionDigits": 0, "maximumFractionDigits": 0 }) + "/m\u00B2";
            pricePerSquareMeterElement = document.createElement("span");
            pricePerSquareMeterElement.className = "x-price-per-square-meter";
            pricePerSquareMeterElement.style.fontSize = "small";
            pricePerSquareMeterElement.style.fontWeight = "normal";
            pricePerSquareMeterElement.appendChild(document.createTextNode(pricePerSquareMeter));
            priceNode.parentElement.appendChild(pricePerSquareMeterElement);
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

function showPricesInHighlightedListResults() {
    const results = document.querySelectorAll("[itemstype='http://schema.org/Offer']");
    for (const result of results) {
        try {
            let pricePerSquareMeterElement = result.querySelector("div.x-price-per-square-meter");
            if (pricePerSquareMeterElement) {
                continue;
            }
            const priceNode = result.querySelector("[itemprop='price']");
            const price = findPrice(priceNode.textContent);
            const area = findArea(result.querySelector(".area").previousElementSibling.textContent);
            const pricePerSquareMeter = (price / area).toLocaleString("es-CO", { "style": "currency", "currency": "COP", "minimumFractionDigits": 0, "maximumFractionDigits": 0 }) + "/m\u00B2";
            pricePerSquareMeterElement = document.createElement("div");
            pricePerSquareMeterElement.className = "x-price-per-square-meter";
            pricePerSquareMeterElement.style.fontSize = "small";
            pricePerSquareMeterElement.style.fontWeight = "normal";
            pricePerSquareMeterElement.appendChild(document.createTextNode(pricePerSquareMeter));
            priceNode.appendChild(pricePerSquareMeterElement);
        } catch (e) {
            // Do nothing
        }
    }
}

function observeListResultsChanges() {
    new MutationObserver(showPricesInListResults).observe(document.querySelector("#resultListHtmlContainer"), { "childList": true, "subtree": true })
}

main();