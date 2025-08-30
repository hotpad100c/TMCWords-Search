const params = new URLSearchParams(window.location.search);

window.langDict = i18n["en"];
const lang = params.get("lang") || "en";
window.langDict = i18n[lang];

const short = params.get("short") || "";
const full = params.get("full") || "";
const local = params.get("local") || "";
const desc = params.get("desc") || "";
const localDesc = params.get("localDesc") || "";

document.getElementById("wordTitle").textContent = short || full || "Details";
document.getElementById("full").textContent = full;
document.getElementById("local").textContent = local;
document.getElementById("desc").textContent = desc;
document.getElementById("localDesc").textContent = localDesc;

document.getElementById("localDescName").textContent = window.langDict.desc + ":";

document.getElementById("backLink").href = `index.html?lang=${lang}`;