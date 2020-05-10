function main() {
    if (hasListResults()) {
        showPricesInListResults();
        observeListResultsChanges();
    }
}

function hasListResults() {
    return document.querySelector("#divAdverts") != null;
}

function showPricesInListResults() {
    const results = document.querySelectorAll("#divAdverts .advert, #divAdverts .AD_OV");
    for (const result of results) {
        try {
            let pricePerSquareMeterElement = result.querySelector("div.x-price-per-square-meter");
            if (pricePerSquareMeterElement) {
                pricePerSquareMeterElement.remove();
            }
            const priceNode = result.querySelector(".price");
            const price = findFirstNumber(priceNode.textContent);
            const area = findFirstNumber(result.querySelector(".surface").textContent)
            const pricePerSquareMeter = (price / area).toLocaleString("es-CO", { "style": "currency", "currency": "COP", "minimumFractionDigits": 0, "maximumFractionDigits": 0 }) + "/m\u00B2";
            pricePerSquareMeterElement = document.createElement("div");
            pricePerSquareMeterElement.className = "x-price-per-square-meter";
            pricePerSquareMeterElement.style.position = "absolute";
            pricePerSquareMeterElement.style.fontSize = "smaller";
            pricePerSquareMeterElement.style.fontWeight = "normal";
            pricePerSquareMeterElement.appendChild(document.createTextNode(pricePerSquareMeter));
            priceNode.insertBefore(pricePerSquareMeterElement, priceNode.querySelector(".compare_div"));
        } catch (e) {
            // Do nothing
        }
    }
}

function findFirstNumber(value) {
    return parseFloat(value.match(/[\d.,]+/)[0].replace(/\./g, "").replace(/,/g, "."));
}

function observeListResultsChanges() {
    new MutationObserver(showPricesInListResults).observe(document.querySelector("#divAdverts"), { "childList": true })
}

main();