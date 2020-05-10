function main() {
    if (hasListResults()) {
        showPricesInListResults();
        observeListResultsChanges();
    }
    waitUntilMapIsLoaded()
        .then(observeMapPopUpChanges)
        .catch(() => { });
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

function waitUntilMapIsLoaded() {
    return new Promise((resolve, reject) => {
        const startDate = new Date();
        const maxWaitTimeInMillis = 10000;
        const checkTimeoutInMillis = 500;

        function checkIfMapIsLoaded() {
            const mapPopUpPane = document.querySelector(".leaflet-popup-pane");
            if (mapPopUpPane !== null) {
                resolve(mapPopUpPane);
            } else {
                const currentDate = new Date();
                if (currentDate.getTime() - startDate.getTime() < maxWaitTimeInMillis) {
                    setTimeout(checkIfMapIsLoaded, checkTimeoutInMillis);
                } else {
                    reject();
                }
            }
        }

        checkIfMapIsLoaded();
    });
}

function observeMapPopUpChanges(mapPopUpPane) {
    new MutationObserver(showPricesMapPopUp).observe(mapPopUpPane, { "childList": true, "subtree": true });
}

function showPricesMapPopUp() {
    const popUpContent = document.querySelector(".leaflet-popup-content");
    const proyectMap = document.querySelector('li.proyect_Map');
    if (popUpContent !== null && proyectMap !== null) {
        try {
            if (proyectMap.querySelector(".x-price-per-square-meter") !== null) {
                return;
            }
            const priceNode = proyectMap.querySelector(".texto_precio");
            const price = findFirstNumber(priceNode.textContent);
            const area = findFirstNumber(proyectMap.querySelector(".texto_area").textContent);
            const pricePerSquareMeter = (price / area).toLocaleString("es-CO", { "style": "currency", "currency": "COP", "minimumFractionDigits": 0, "maximumFractionDigits": 0 }) + "/m\u00B2";
            const pricePerSquareMeterElement = document.createElement("div");
            pricePerSquareMeterElement.className = "texto_precio x-price-per-square-meter";
            pricePerSquareMeterElement.style.fontSize = "x-small";
            pricePerSquareMeterElement.style.fontWeight = "normal";
            pricePerSquareMeterElement.appendChild(document.createTextNode(pricePerSquareMeter));
            proyectMap.insertBefore(pricePerSquareMeterElement, priceNode.nextSibling);
            let ancestor = pricePerSquareMeterElement.parentNode;
            while (ancestor !== popUpContent) {
                if (ancestor.style.height !== "") {
                    ancestor.style.height = ancestor.offsetHeight + pricePerSquareMeterElement.offsetHeight + "px";
                }
                ancestor = ancestor.parentNode;
            }
        } catch (e) {
            // Do nothing
        }
    }
}

main();