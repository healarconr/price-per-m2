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
    return document.querySelector("#listingContainer");
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
    if (listResultsNode === null) {
        return;
    }
    const results = listResultsNode.querySelectorAll("a[href^='/inmueble/']");
    for (const result of results) {
        try {
            let pricePerSquareMeterElement = result.querySelector("div.x-price-per-square-meter");
            if (pricePerSquareMeterElement !== null) {
                continue;
            }
            const priceNode = result.querySelector(".MuiCardContent-root .MuiGrid-container .MuiGrid-item");
            const price = findFirstNumber(priceNode.textContent);
            const areaNode = result.querySelector(".MuiCardContent-root .MuiGrid-container .MuiGrid-item:nth-child(2) span");
            const area = findFirstNumber(areaNode.textContent);
            const unit = findUnit(areaNode.textContent);
            const pricePerSquareMeter = formatPricePerSquareMeter(price / area, unit);
            pricePerSquareMeterElement = document.createElement("div");
            pricePerSquareMeterElement.className = "x-price-per-square-meter";
            pricePerSquareMeterElement.style.float = "right";
            pricePerSquareMeterElement.style.lineHeight = "24px";
            pricePerSquareMeterElement.appendChild(document.createTextNode(pricePerSquareMeter));
            priceNode.appendChild(pricePerSquareMeterElement);
        } catch (e) {
            // Do nothing
        }
    }
}

function findFirstNumber(value) {
    return parseFloat(value.match(/[\d.,]+/)[0].replace(/\./g, "").replace(/,/g, "."));
}

function findUnit(value) {
    return value.includes("m\u00B2") ? "m\u00B2" : "ha";
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
    mapResult = document.querySelector(".MuiPopover-root .MuiPopover-paper a[href^='/inmueble/']");
    if (mapResult === null) {
        return null;
    }
    return mapResult.closest(".MuiPopover-root");
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
    if (mapResultsNode === null) {
        return;
    }
    const result = mapResultsNode.querySelector("a[href^='/inmueble/']");
    if (result === null) {
        return;
    }
    try {
        if (result.querySelector(".x-price-per-square-meter") !== null) {
            return;
        }
        const priceNode = result.querySelector(".MuiCardContent-root .MuiGrid-container .MuiGrid-item");
        const price = findFirstNumber(priceNode.textContent);
        const areaNode = result.querySelector(".MuiCardContent-root .MuiGrid-container .MuiGrid-item:nth-child(2) span");
        const area = findFirstNumber(areaNode.textContent);
        const unit = findUnit(areaNode.textContent);
        const pricePerSquareMeter = formatPricePerSquareMeter(price / area, unit);
        pricePerSquareMeterElement = document.createElement("div");
        pricePerSquareMeterElement.className = "x-price-per-square-meter";
        pricePerSquareMeterElement.style.float = "right";
        pricePerSquareMeterElement.style.lineHeight = "24px";
        pricePerSquareMeterElement.appendChild(document.createTextNode(pricePerSquareMeter));
        priceNode.appendChild(pricePerSquareMeterElement);
    } catch (e) {
        // Do nothing
    }
}

function showPricesInNewProject() {
    const rows = document.querySelectorAll("#typologies tbody tr");
    if (rows.length == 0) {
        return;
    }

    const sortedRows = [];
    let error = false;
    for (const row of rows) {
        try {
            const priceNode = row.querySelector("td:nth-child(5) p");
            const price = findFirstNumber(priceNode.textContent);
            const areaNode = row.querySelector("td:nth-child(1)");
            const area = findFirstNumber(areaNode.textContent);
            const unit = findUnit(areaNode.textContent);
            const pricePerSquareMeter = price / area;
            const formattedPricePerSquareMeter = formatPricePerSquareMeter(pricePerSquareMeter, unit);
            const pricePerSquareMeterElement = document.createElement("div");
            pricePerSquareMeterElement.className = "x-price-per-square-meter";
            pricePerSquareMeterElement.style.fontSize = "smaller";
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
        const tbody = document.querySelector("#typologies tbody");
        for (const row of sortedRows) {
            tbody.appendChild(row.row);
        }
    }
}

main();