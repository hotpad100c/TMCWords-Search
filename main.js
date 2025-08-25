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
    scheduleRender();
});

document.getElementById("langSelector").addEventListener("change", function() {
    window.langDict = i18n[this.value]; // 更新语言字典
    applyLang(window.langDict);
    renderTable(data, document.getElementById("searchBox").value.toLowerCase());
});
function renderColumnSelectors() {
    const container = document.getElementById("columnSelectors");
    container.innerHTML = ""; // 清空旧内容
    const columns = window.langDict.columns;
    for (let key in columns) {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true; // 默认显示
        checkbox.dataset.col = key; // 保存对应列
        checkbox.addEventListener("change", () => renderTable(data, document.getElementById("searchBox").value.toLowerCase()));
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + columns[key]));
        container.appendChild(label);
        container.appendChild(document.createTextNode(" ")); // 间隔
    }
}

function scheduleRender(){
    const keyword = this.value.toLowerCase();
    if (!keyword) {
        renderTable(data, "");
    } else {
        const filtered = data.filter(row =>
            Object.values(row).some(v => v && v.toLowerCase().includes(keyword))
        );
        renderTable(filtered, keyword);
    }
}
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
            html += makeCell(row["Short Form"], "noShort", "#33333333", keyword);
        }
        if (columnsVisible.fullEnglish) {
            html += makeCell(row["Full Form (English)"], "noFullEnglish", "#33333333", keyword);
        }
        if (columnsVisible.full && window.langDict.full.trim() !== "") {
            html += makeCell(row[window.langDict.lang], "noFull", "#33333333", keyword);
        }

        if (columnsVisible.desc) {
            let descriptionName = "";
            if (window.langDict.lang !== "English") {
                descriptionName = " (" + window.langDict.lang + ")";
            }
            const localDesc = row["Description" + descriptionName] || row["Description"];
            html += makeCell(localDesc, "noDesc", "#33333333", keyword);
        }

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
    scheduleRender();
    renderColumnSelectors();
}

