let data = [];

window.langDict = i18n["en"];
const loadingBar = document.getElementById("loadingBar");
if (!loadingBar) {
    console.error("Loading bar element not found");
} else {
    loadingBar.style.display = "block";

    Papa.parse("https://raw.githubusercontent.com/DuskScorpio/TechMC-Glossary/main/TechMC%20Glossary.csv", {
        download: true,
        header: true,
        complete: function(results) {
            loadingBar.style.display = "none";
            if (results.errors.length > 0) {
                console.error("Papa Parse errors:", results.errors);
                return;
            }
            data = results.data;
            console.log("Parsed CSV data:", data[0]);
            applyLang(window.langDict);
        },
        error: function(error) { 
            loadingBar.style.display = "none";
            console.error("Papa Parse failed:", error);
        }
    });
}
document.getElementById("searchBox").addEventListener("input", function() {
    const keyword = this.value.toLowerCase();
    renderWithKeyword(keyword);
});

document.getElementById("langSelector").addEventListener("change", function() {
    window.langDict = i18n[this.value];
    applyLang(window.langDict);
});

function renderWithKeyword(keyword) {
    if (!keyword) {
        renderTable(data, "");
    } else {
        const filtered = data.filter(row =>
            Object.values(row).some(v => v && v.toLowerCase().includes(keyword))
        );
        renderTable(filtered, keyword);
    }
}

function renderColumnSelectors() {
    const container = document.getElementById("columnSelectors");
    container.innerHTML = "";
    const columns = window.langDict.columns;
    for (let key in columns) {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true;
        checkbox.dataset.col = key;
        checkbox.addEventListener("change", () => {
            renderWithKeyword(document.getElementById("searchBox").value.toLowerCase());
        });
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + columns[key]));
        container.appendChild(label);
        container.appendChild(document.createTextNode(" "));
    }
}

function highlight(text, keyword) {
    if (!text) return "";
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
}

function makeCell(text, fallbackKey, keyword) {
    if (!text) {
        return `<td style="background-color:#ff333333;">${window.langDict[fallbackKey]}</td>`;
    }
    if (text.includes("*")) {
        return `<td style="background-color:#ffa50033;">${highlight(text, keyword)}</td>`;
    }
    return `<td>${highlight(text, keyword)}</td>`;
}

function renderTable(rows, keyword) {
    updateTableHeader(); 
    const tbody = document.querySelector("#resultTable tbody");
    tbody.innerHTML = "";

    const columnsVisible = {};
    document.querySelectorAll("#columnSelectors input[type=checkbox]").forEach(cb => {
        columnsVisible[cb.dataset.col] = cb.checked;
    });

    if (rows.length === 0) {
        const visibleCount = Object.values(columnsVisible).filter(v => v).length;
        tbody.innerHTML = `<tr><td colspan="${visibleCount}" class="no-result">${window.langDict.noResult}</td></tr>`;
        return;
    }

    rows.forEach(row => {
        const tr = document.createElement("tr");
        let html = "";

        if (columnsVisible.short) {
            html += makeCell(row["Short Form"], "noShort", keyword);
        }
        if (columnsVisible.fullEnglish) {
            html += makeCell(row["Full Form (English)"], "noFullEnglish", keyword);
        }
        if (columnsVisible.full && window.langDict.full.trim() !== "") {
            html += makeCell(row[window.langDict.lang], "noFull", keyword);
        }

        if (columnsVisible.desc) {
            let descriptionName = "";
            if (window.langDict.lang !== "English") {
                descriptionName = " (" + window.langDict.lang + ")";
            }
            const localDesc = row["Description" + descriptionName] || row["Description"];
            html += makeCell(localDesc, "noDesc", keyword);
        }

        tr.innerHTML = html;
        tbody.appendChild(tr);
    });
}
function updateTableHeader() {
    const theadRow = document.querySelector("#resultTable thead tr");
    const columnsVisible = {};
    document.querySelectorAll("#columnSelectors input[type=checkbox]").forEach(cb => {
        columnsVisible[cb.dataset.col] = cb.checked;
    });

    const dict = window.langDict;
    let html = '';

    if (columnsVisible.short) html += `<th data-col="short">${dict.short}</th>`;
    if (columnsVisible.fullEnglish) html += `<th data-col="fullEnglish">${dict.fullEnglish}</th>`;
    if (columnsVisible.full && dict.full.trim() !== '' && columnsVisible.full) html += `<th data-col="full">${dict.full}</th>`;
    if (columnsVisible.desc) html += `<th data-col="desc">${dict.desc}</th>`;

    theadRow.innerHTML = html;
}
function applyLang(dict) {
    window.langDict = dict;
    renderColumnSelectors();
    renderTable(data, document.getElementById("searchBox").value.toLowerCase());
}
