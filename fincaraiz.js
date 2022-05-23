function main() {
    new MutationObserver(checkResults).observe(document, {
        "childList": true,
        "subtree": true
    });
    checkResults();
    showPricesInNewProject();
}

function checkResults() {
    if (hasListResults() && !isObservingListResults()) {
        observeListResults();
    }
    if (hasMapResults() && !isObservingMapResults()) {
        observeMapResults();
    }
}

function hasListResults() {
    return getListResultsNode() !== null;
}

function getListResultsNode() {
    return document.querySelector("#divAdverts");
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
    const listResultsNode = getListResultsNode();
    const results = listResultsNode.querySelectorAll(".advert, .AD_OV");
    for (const result of results) {
        try {
            let pricePerSquareMeterElement = result.querySelector("div.x-price-per-square-meter");
            if (pricePerSquareMeterElement !== null) {
                continue;
            }
            const priceNode = result.querySelector(".price");
            const price = findFirstNumber(priceNode.textContent);
            const areaNode = result.querySelector(".surface");
            const area = findFirstNumber(areaNode.textContent);
            const unit = findUnit(areaNode.textContent);
            const pricePerSquareMeter = formatPricePerSquareMeter(price / area, unit);
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

function findUnit(value) {
    return value.includes("m2") ? "m\u00B2" : "ha";
}

function formatPricePerSquareMeter(pricePerSquareMeter, unit) {
    return pricePerSquareMeter.toLocaleString("es-CO", {
        "style": "currency",
        "currency": "COP",
        "minimumFractionDigits": 0,
        "maximumFractionDigits": 0
    }) + "/" + unit;
}

function hasMapResults() {
    return getMapResultsNode() !== null;
}

function getMapResultsNode() {
    return document.querySelector(".leaflet-popup-pane");
}

function isObservingMapResults() {
    return getMapResultsNode().__pricePerSquareElementMutationObserver !== undefined;
}

function observeMapResults() {
    const observer = new MutationObserver(showPricesInMapResults);
    const node = getMapResultsNode();
    node.__pricePerSquareElementMutationObserver = observer;
    observer.observe(node, {
        "childList": true,
        "subtree": true
    });
    showPricesInMapResults();
}

function showPricesInMapResults() {
    const mapResultsNode = getMapResultsNode();
    const proyectMap = mapResultsNode.querySelector('li.proyect_Map');
    if (proyectMap !== null) {
        try {
            if (proyectMap.querySelector(".x-price-per-square-meter") !== null) {
                return;
            }
            const priceNode = proyectMap.querySelector(".texto_precio");
            const price = findFirstNumber(priceNode.textContent);
            const areaNode = proyectMap.querySelector(".texto_area");
            const area = findFirstNumber(areaNode.textContent);
            const unit = findUnit(areaNode.textContent);
            const pricePerSquareMeter = formatPricePerSquareMeter(price / area, unit);
            const pricePerSquareMeterElement = document.createElement("div");
            pricePerSquareMeterElement.className = "texto_precio x-price-per-square-meter";
            pricePerSquareMeterElement.style.fontSize = "x-small";
            pricePerSquareMeterElement.style.fontWeight = "normal";
            pricePerSquareMeterElement.appendChild(document.createTextNode(pricePerSquareMeter));
            proyectMap.insertBefore(pricePerSquareMeterElement, priceNode.nextSibling);
            let ancestor = pricePerSquareMeterElement.parentNode;
            while (ancestor !== mapResultsNode) {
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

function showPricesInNewProject() {
    const rows = document.querySelectorAll("#typology tbody tr");
    if (rows.length == 0) {
        return;
    }

    const sortedRows = [];
    let error = false;
    for (const row of rows) {
        try {
            const priceNode = row.querySelector("td:nth-child(7)");
            const price = findFirstNumber(priceNode.textContent);
            const areaNode = row.querySelector("td:nth-child(3)");
            const area = findFirstNumber(areaNode.textContent);
            const unit = findUnit(areaNode.textContent);
            const pricePerSquareMeter = price / area;
            const formattedPricePerSquareMeter = formatPricePerSquareMeter(pricePerSquareMeter, unit);
            const pricePerSquareMeterElement = document.createElement("div");
            pricePerSquareMeterElement.className = "x-price-per-square-meter";
            pricePerSquareMeterElement.style.fontSize = "smaller";
            pricePerSquareMeterElement.style.fontWeight = "normal";
            pricePerSquareMeterElement.appendChild(document.createTextNode(formattedPricePerSquareMeter));
            priceNode.appendChild(pricePerSquareMeterElement);
            sortedRows.push({
                "row": row,
                "pricePerSquareMeter": pricePerSquareMeter
            })
        } catch (e) {
            error = true;
        }
    }
    if (!error) {
        sortedRows.sort((a, b) => a.pricePerSquareMeter - b.pricePerSquareMeter);
        const tbody = document.querySelector("#typology tbody");
        for (const row of sortedRows) {
            tbody.appendChild(row.row);
        }
    }
}

main();