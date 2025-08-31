document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    document.querySelector('[name="short"]').value = params.get("short") || "";
    document.querySelector('[name="fullEnglish"]').value = params.get("fullEnglish") || "";
    document.querySelector('[name="local"]').value = params.get("local") || "";
    document.querySelector('[name="desc"]').value = params.get("desc") || "";
    document.querySelector('[name="localDesc"]').value = params.get("localDesc") || "";

    const lang = params.get("lang") || "en";
    window.langDict = i18n[lang];

    document.getElementById("edit").textContent = langDict.edit +"\"" + (params.get("local") || params.get("fullEnglish") || params.get("short") || "") + "\"";
    document.getElementById("short").textContent = langDict.short;
    document.getElementById("desc").textContent = langDict.desc;
    document.getElementById("english").textContent = langDict.fullEnglish;
    document.getElementById("local").textContent = langDict.full;
    document.getElementById("localDesc").textContent = langDict.short;
    document.getElementById("save").textContent = langDict.save;
    document.getElementById("backLink").href = `index.html?lang=${lang}`;

    document.getElementById("save").addEventListener("click", () => {
        window.location.href = `index.html?lang=${lang}`;
    });
});