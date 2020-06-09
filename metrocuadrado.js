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
    if (hasMapResults() && !isObservingMapResults()) {
        observeMapResults();
    }
    if (hasNewProjectResults() && !isObservingNewProjectResults()) {
        observeNewProjectResults();
    }
}

function hasListResults() {
    return getListResultsNode() !== null;
}

function getListResultsNode() {
    return document.querySelector("#resultListHtmlContainer");
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
    showPricesInRegularListResults("#resultListHtmlContainer [itemtype='http://schema.org/Offer']");
    showPricesInHighlightedListResults("#resultListHtmlContainer [itemstype='http://schema.org/Offer']");
}

function showPricesInRegularListResults(selector) {
    const results = document.querySelectorAll(selector);
    for (const result of results) {
        try {
            let pricePerSquareMeterElement = result.querySelector("span.x-price-per-square-meter");
            if (pricePerSquareMeterElement !== null) {
                continue;
            }
            const priceNode = result.querySelector("[itemprop='price']");
            const price = findPrice(priceNode.textContent);
            const area = findArea(result.querySelector(".m2>p>span:nth-child(2)").textContent);
            const pricePerSquareMeter = formatPricePerSquareMeter(price / area);
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

function formatPricePerSquareMeter(pricePerSquareMeter) {
    return pricePerSquareMeter.toLocaleString("es-CO", {
        "style": "currency",
        "currency": "COP",
        "minimumFractionDigits": 0,
        "maximumFractionDigits": 0
    }) + "/m\u00B2";
}

function showPricesInHighlightedListResults(selector) {
    const results = document.querySelectorAll(selector);
    for (const result of results) {
        try {
            let pricePerSquareMeterElement = result.querySelector("div.x-price-per-square-meter");
            if (pricePerSquareMeterElement !== null) {
                continue;
            }
            const priceNode = result.querySelector("[itemprop='price']");
            const price = findPrice(priceNode.textContent);
            const area = findArea(result.querySelector(".area").previousElementSibling.textContent);
            const pricePerSquareMeter = formatPricePerSquareMeter(price / area);
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

function hasMapResults() {
    return getMapResultsNode() !== null;
}

function getMapResultsNode() {
    return document.querySelector("#resultMapHtmlContainer");
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
    showPricesInRegularListResults("#resultMapHtmlContainer [itemtype='http://schema.org/Offer']");
    showPricesInHighlightedListResults("#resultMapHtmlContainer #highlighted-properties-map .m_property_thumb");
    showPricesInMapInfoWindows();
}

function showPricesInMapInfoWindows() {
    const infoWindows = getMapResultsNode().querySelectorAll(".gm-style-iw");
    for (const infoWindow of infoWindows) {
        const results = infoWindow.querySelectorAll(".data-details-id");
        let increaseMaxHeight = true;
        for (const result of results) {
            try {
                let pricePerSquareMeterElement = result.querySelector("div.x-price-per-square-meter");
                if (pricePerSquareMeterElement !== null) {
                    continue;
                }
                const priceNode = result.querySelector("ul li div > b");
                const price = findPrice(priceNode.textContent);
                const area = findAreaInInfoWindow(result.querySelector("ul li div > p").textContent);
                const pricePerSquareMeter = formatPricePerSquareMeter(price / area);
                pricePerSquareMeterElement = document.createElement("div");
                pricePerSquareMeterElement.className = "x-price-per-square-meter";
                pricePerSquareMeterElement.style.fontSize = "smaller";
                pricePerSquareMeterElement.style.fontWeight = "normal";
                pricePerSquareMeterElement.appendChild(document.createTextNode(pricePerSquareMeter));
                priceNode.appendChild(pricePerSquareMeterElement);
                if (increaseMaxHeight) {
                    let ancestor = pricePerSquareMeterElement.parentNode;
                    while (ancestor !== infoWindow) {
                        if (ancestor.style.maxHeight !== "") {
                            ancestor.style.maxHeight = ancestor.offsetHeight + pricePerSquareMeterElement.offsetHeight + "px";
                        }
                        ancestor = ancestor.parentNode;
                    }
                    increaseMaxHeight = false;
                }
            } catch (e) {
                // Do nothing
            }
        }
    }
}

function findAreaInInfoWindow(value) {
    return parseFloat(value.match(/([\d.]+)m2/)[1]);
}

function hasNewProjectResults() {
    return getNewProjectResultsNode() !== null;
}

function getNewProjectResultsNode() {
    return document.querySelector("#tipos_de_apartamentos");
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
    const cards = getNewProjectResultsNode().querySelectorAll(".swiper-slide");
    if (cards.length == 0) {
        return;
    }

    const sortedCards = [];
    let sort = true;
    for (const card of cards) {
        try {
            let pricePerSquareMeterElement = card.querySelector("div.x-price-per-square-meter");
            if (pricePerSquareMeterElement !== null) {
                sort = false;
                continue;
            }
            const priceNode = card.querySelector("[data-item='price']");
            const price = findPrice(priceNode.textContent);
            const area = findArea(card.querySelector("[data-item='builtArea']").textContent);
            const pricePerSquareMeter = price / area;
            const formattedPricePerSquareMeter = formatPricePerSquareMeter(pricePerSquareMeter);
            pricePerSquareMeterElement = document.createElement("div");
            pricePerSquareMeterElement.className = "x-price-per-square-meter";
            pricePerSquareMeterElement.style.fontSize = "smaller";
            pricePerSquareMeterElement.style.fontWeight = "normal";
            pricePerSquareMeterElement.appendChild(document.createTextNode(formattedPricePerSquareMeter));
            priceNode.appendChild(pricePerSquareMeterElement);
            sortedCards.push({
                "card": card,
                "pricePerSquareMeter": pricePerSquareMeter
            })
        } catch (e) {
            sort = false;
        }
    }
    if (sort) {
        sortedCards.sort((a, b) => a.pricePerSquareMeter - b.pricePerSquareMeter);
        const wrapper = getNewProjectResultsNode().querySelector(".swiper-wrapper");
        for (const card of sortedCards) {
            wrapper.appendChild(card.card);
        }
    }
}

main();