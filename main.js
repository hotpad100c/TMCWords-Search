let data = [];

window.langDict = i18n["en"];

Papa.parse("https://raw.githubusercontent.com/DuskScorpio/TechMC-Glossary/main/TechMC%20Glossary.csv", {
    download: true,
    header: true,
    complete: function(results) {
        data = results.data;
        applyLang(window.langDict);
        renderTable(data, "");
    }
});

// 搜索监听
document.getElementById("searchBox").addEventListener("input", function() {
    const keyword = this.value.toLowerCase();
    if (!keyword) {
        renderTable(data, "");
    } else {
        const filtered = data.filter(row =>
            Object.values(row).some(v => v && v.toLowerCase().includes(keyword))
        );
        renderTable(filtered, keyword);
    }
});

document.getElementById("langSelector").addEventListener("change", function() {
    window.langDict = i18n[this.value]; // 更新语言字典
    applyLang(window.langDict);
    renderTable(data, document.getElementById("searchBox").value.toLowerCase());
});

function highlight(text, keyword) {
    if (!text) return "";
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
}

function makeCell(text, fallbackKey,keyword) {
    if (!text) {
        return `<td style="background-color:#ff333333;">${window.langDict[fallbackKey]}</td>`;
    }
    if (text.includes("*")) {
        return `<td style="background-color:#ffa50022;">${highlight(text, keyword)}</td>`;
    }
    return `<td>${highlight(text, keyword)}</td>`;
}

// 渲染
function renderTable(rows, keyword) {
    const tbody = document.querySelector("#resultTable tbody");
    tbody.innerHTML = "";

    if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${window.langDict.full ? 4 : 3}" class="no-result">${window.langDict.noResult}</td></tr>`;
        return;
    }

    rows.forEach(row => {
        const tr = document.createElement("tr");
        let html = `
            ${makeCell(row["Short Form"], "noShort", keyword)}
            ${makeCell(row["Full Form (English)"], "noFullEnglish", keyword)}
        `;

        if (window.langDict.full && window.langDict.full.trim() !== "") {
            html += `${makeCell(row[window.langDict.lang], "noFull", keyword)}`;
        }

        // 没有时fallback到英文
        let descriptionName = "";
        if (window.langDict.lang !== "English") {
            descriptionName = " (" + window.langDict.lang + ")";
        }
        const localDesc = row["Description" + descriptionName] || row["Description"];
        html += `${makeCell(localDesc, "noDesc", keyword)}`;

        tr.innerHTML = html;
        tbody.appendChild(tr);
    });
}


function applyLang(dict) {
    const theadRow = document.querySelector("#resultTable thead tr");
    let html = `
        <th>${dict.short}</th>
        <th>${dict.fullEnglish}</th>
    `;
    if (dict.full && dict.full.trim() !== "") {
        html += `<th>${dict.full}</th>`;
    }
    html += `<th>${dict.desc}</th>`;
    theadRow.innerHTML = html;
}

