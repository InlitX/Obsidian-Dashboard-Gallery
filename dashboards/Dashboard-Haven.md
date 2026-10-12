---
cssclasses:
  - dashboard-layout
---

```dataviewjs
// Haven — a cosy, all-in-one home page in the spirit of the aesthetic
// workspace dashboards people love to share. Cover, icon, callouts,
// databases with board / table / calendar views, a gallery and toggles.
// More dashboards → https://github.com/InlitX/Obsidian-Dashboard-Gallery

const { setIcon } = require("obsidian");
const LS = {
    cover: "hv-cover", coverY: "hv-cover-y", icon: "hv-icon", title: "hv-title", quote: "hv-quote",
    view: "hv-view", lib: "hv-lib", toggles: "hv-toggles", mood: "hv-mood", water: "hv-water"
};
const DEFAULT_COVER = "images/haven-cover.jpg";

const root = dv.container.createDiv({ cls: "hv" });
let selfPath = "";
try { selfPath = dv.current().file.path; } catch (e) {}

const icon = (parent, name, cls = "hv-icon") => {
    const el = parent.createSpan({ cls });
    try { setIcon(el, name); } catch (e) {}
    return el;
};
const press = (el, fn) => {
    el.onclick = fn;
    el.onkeydown = (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        fn(e);
    };
};
const store = {
    get: (k, fallback) => { try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
const openNote = (path) => app.workspace.openLinkText(path, "", false);
const wait = (ms) => new Promise(r => setTimeout(r, ms));

const DAY = 86400000;
const startOfDay = (ms) => { const d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); };
const TODAY = startOfDay(Date.now());
const iso = (ms) => {
    const d = new Date(ms);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};
const relTime = (ms) => {
    const min = Math.floor((Date.now() - ms) / 60000);
    if (min < 1) return "Just now";
    if (min < 60) return min + " min ago";
    const h = Math.floor(min / 60);
    if (h < 24) return h + (h === 1 ? " hour ago" : " hours ago");
    const d = Math.floor(h / 24);
    if (d === 1) return "Yesterday";
    if (d < 7) return d + " days ago";
    return new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};
const shortDate = (ms) => new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const hash = (s) => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };

// The nine select colours every workspace tool shares.
const TAGS = ["gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red"];
const tagColor = (name) => TAGS[1 + (hash(name) % (TAGS.length - 1))];
const pill = (parent, text, color) => parent.createSpan({ cls: "hv-pill hv-c-" + (color || tagColor(text)), text });

const files = app.vault.getMarkdownFiles().filter(f => f.path !== selfPath);
const byEdit = [...files].sort((a, b) => b.stat.mtime - a.stat.mtime);
const folderOf = (file) => { const p = file.path.split("/"); return p.length > 1 ? p[p.length - 2] : "Vault"; };

// A friendly emoji for a folder, guessed from its name.
const EMOJI = [
    [/journal|diary|daily|log/i, "📓"], [/work|job|office|meeting/i, "💼"], [/travel|trip/i, "✈️"],
    [/read|book|library|lit/i, "📚"], [/kitchen|recipe|food|cook/i, "🍳"], [/garden|plant/i, "🌱"],
    [/project/i, "🚀"], [/idea|brain|think/i, "💡"], [/archive|old/i, "🗄️"], [/image|attach|asset|media/i, "🖼️"],
    [/music|song/i, "🎧"], [/film|movie|cinema/i, "🎬"], [/health|gym|fit|sport/i, "🏃"], [/money|finance|budget/i, "💰"],
    [/school|study|class|uni|course/i, "🎓"], [/home|house/i, "🏡"], [/people|contact|friend/i, "👥"], [/dashboard/i, "🧭"],
    [/doc/i, "📄"], [/template/i, "🧩"]
];
const emojiFor = (name) => (EMOJI.find(([re]) => re.test(name)) || [null, "📁"])[1];

const IMAGE_EXT = ["png", "jpg", "jpeg", "gif", "webp", "avif"];
const resourceOf = (file) => { try { return app.vault.getResourcePath(file); } catch (e) { return ""; } };
function firstImage(file) {
    try {
        const cache = app.metadataCache.getFileCache(file);
        for (const embed of (cache && cache.embeds) || []) {
            const target = app.metadataCache.getFirstLinkpathDest(embed.link.split("|")[0], file.path);
            if (target && IMAGE_EXT.includes(String(target.extension).toLowerCase())) return target;
        }
    } catch (e) {}
    return null;
}


// ── Cover — any vault image, drag to reposition ───────────────────
const coverWrap = root.createDiv({ cls: "hv-cover" });
const coverImg = coverWrap.createEl("img", { cls: "hv-cover-img", attr: { alt: "", draggable: "false" } });
const coverTools = coverWrap.createDiv({ cls: "hv-cover-tools" });
const changeBtn = coverTools.createDiv({ cls: "hv-chip-btn", attr: { role: "button", tabindex: "0" }, text: "Change cover" });
const moveBtn = coverTools.createDiv({ cls: "hv-chip-btn", attr: { role: "button", tabindex: "0" }, text: "Reposition" });
const coverHint = coverWrap.createDiv({ cls: "hv-cover-hint", text: "Drag image to reposition" });

const coverFile = () => {
    const path = store.get(LS.cover, DEFAULT_COVER);
    return path ? app.vault.getAbstractFileByPath(path) : null;
};
function paintCover() {
    const file = coverFile();
    coverWrap.toggleClass("empty", !file);
    coverImg.src = file ? resourceOf(file) : "";
    coverImg.style.objectPosition = "center " + store.get(LS.coverY, 42) + "%";
}
paintCover();

let repositioning = false;
press(moveBtn, () => {
    repositioning = !repositioning;
    coverWrap.toggleClass("repositioning", repositioning);
    moveBtn.textContent = repositioning ? "Save position" : "Reposition";
});
coverImg.onmousedown = (e) => {
    if (!repositioning) return;
    e.preventDefault();
    const startY = e.clientY, start = store.get(LS.coverY, 42), h = coverWrap.clientHeight * 2;
    const move = (ev) => {
        const y = Math.min(100, Math.max(0, start - ((ev.clientY - startY) / h) * 100));
        coverImg.style.objectPosition = "center " + y + "%";
        store.set(LS.coverY, Math.round(y));
    };
    const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
};

// Cover gallery — a popover of every image in the vault.
const coverPop = root.createDiv({ cls: "hv-pop hv-cover-pop" });
const popHead = coverPop.createDiv({ cls: "hv-pop-head" });
popHead.createSpan({ cls: "hv-pop-title", text: "Gallery" });
const removeCover = popHead.createSpan({ cls: "hv-pop-link", attr: { role: "button", tabindex: "0" }, text: "Remove" });
const popSearch = coverPop.createEl("input", { cls: "hv-pop-search", attr: { type: "text", placeholder: "Search your images…", spellcheck: "false" } });
const popGrid = coverPop.createDiv({ cls: "hv-pop-grid" });

function renderCoverGrid() {
    popGrid.innerHTML = "";
    const q = popSearch.value.trim().toLowerCase();
    const images = app.vault.getFiles()
        .filter(f => IMAGE_EXT.includes(String(f.extension).toLowerCase()) && (!q || f.path.toLowerCase().includes(q)))
        .sort((a, b) => b.stat.mtime - a.stat.mtime)
        .slice(0, 40);
    if (!images.length) { popGrid.createDiv({ cls: "hv-muted hv-pop-empty", text: "No images found in your vault." }); return; }
    images.forEach(f => {
        const t = popGrid.createDiv({ cls: "hv-pop-thumb", attr: { role: "button", tabindex: "0", title: f.path } });
        t.createEl("img", { attr: { src: resourceOf(f), alt: f.basename, loading: "lazy" } });
        press(t, () => { store.set(LS.cover, f.path); store.set(LS.coverY, 42); paintCover(); togglePop(coverPop, false); });
    });
}
press(changeBtn, (e) => { e.stopPropagation(); popSearch.value = ""; renderCoverGrid(); togglePop(coverPop); setTimeout(() => popSearch.focus(), 60); });
press(removeCover, () => { store.set(LS.cover, ""); paintCover(); togglePop(coverPop, false); });
popSearch.oninput = renderCoverGrid;


// ── Popovers — one open at a time, closed by clicking elsewhere ───
let openPop = null;
function togglePop(pop, force) {
    const open = force === undefined ? !pop.hasClass("open") : force;
    if (openPop && openPop !== pop) openPop.removeClass("open");
    pop.toggleClass("open", open);
    openPop = open ? pop : null;
}
const closeAll = (e) => { if (openPop && !openPop.contains(e.target)) togglePop(openPop, false); };
document.addEventListener("mousedown", closeAll);
try { dv.component.register(() => document.removeEventListener("mousedown", closeAll)); } catch (e) {}


// ── Page head — icon, title, properties, callout ──────────────────
const page = root.createDiv({ cls: "hv-page" });
const head = page.createDiv({ cls: "hv-head" });
const pageIcon = head.createDiv({ cls: "hv-page-icon", attr: { role: "button", tabindex: "0", title: "Change icon" }, text: store.get(LS.icon, "🌸") });

const iconPop = root.createDiv({ cls: "hv-pop hv-icon-pop" });
iconPop.createDiv({ cls: "hv-pop-head" }).createSpan({ cls: "hv-pop-title", text: "Pick an icon" });
const iconGrid = iconPop.createDiv({ cls: "hv-emoji-grid" });
"🌸 🌿 🍵 ☕ 🌙 ⭐ ☁️ 🌈 🍓 🍑 🍋 🫧 🎧 📚 📓 ✏️ 🖋️ 🎨 🧸 🕯️ 🪴 🌻 🌷 🍄 🦋 🐚 🐈 🐾 🏡 🗝️ 💌 🎀 🧭 🚀 💡 🔮 🧩 🎞️ 🌊 🏔️".split(" ").forEach(em => {
    const b = iconGrid.createDiv({ cls: "hv-emoji", attr: { role: "button", tabindex: "0" }, text: em });
    press(b, () => { store.set(LS.icon, em); pageIcon.textContent = em; togglePop(iconPop, false); });
});
press(pageIcon, (e) => { e.stopPropagation(); togglePop(iconPop); });

const title = head.createDiv({ cls: "hv-title", attr: { contenteditable: "true", spellcheck: "false", "data-placeholder": "Untitled" } });
title.textContent = store.get(LS.title, "My Haven");
title.onblur = () => store.set(LS.title, title.textContent.trim() || "My Haven");
title.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); title.blur(); } };

// Properties, the way a database page lists them.
const props = head.createDiv({ cls: "hv-props" });
const prop = (glyph, label, value) => {
    const row = props.createDiv({ cls: "hv-prop" });
    const k = row.createDiv({ cls: "hv-prop-key" });
    icon(k, glyph);
    k.createSpan({ text: label });
    const v = row.createDiv({ cls: "hv-prop-val" });
    if (typeof value === "function") value(v); else v.textContent = value;
    return row;
};
const hour = new Date().getHours();
prop("calendar", "Today", new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
prop("sun", "Mood", (v) => pill(v, hour < 12 ? "Fresh start" : hour < 18 ? "In the flow" : "Winding down", hour < 12 ? "yellow" : hour < 18 ? "blue" : "purple"));
prop("files", "Notes", files.length.toLocaleString("en-GB") + " pages");

const quote = page.createDiv({ cls: "hv-callout hv-callout-quote" });
quote.createSpan({ cls: "hv-callout-icon", text: "💭" });
const quoteText = quote.createDiv({ cls: "hv-callout-text", attr: { contenteditable: "true", spellcheck: "false" } });
quoteText.textContent = store.get(LS.quote, "Small steps every day. Tend the garden, not the to-do list.");
quoteText.onblur = () => store.set(LS.quote, quoteText.textContent.trim());


// ── Columns ───────────────────────────────────────────────────────
const cols = page.createDiv({ cls: "hv-cols" });
const side = cols.createDiv({ cls: "hv-side" });
const main = cols.createDiv({ cls: "hv-main" });


// The gallery leads the main column; the task database sits below it.
const libSlot = main.createDiv({ cls: "hv-db" });
const taskSlot = main.createDiv({ cls: "hv-db" });


// Clock widget
const clock = side.createDiv({ cls: "hv-clock" });
const clockTime = clock.createDiv({ cls: "hv-clock-time" });
const clockDate = clock.createDiv({ cls: "hv-clock-date" });
const clockHello = clock.createDiv({ cls: "hv-clock-hello" });
function tick() {
    const now = new Date();
    clockTime.textContent = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    clockDate.textContent = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
    const h = now.getHours();
    clockHello.textContent = h < 5 ? "Rest well ☾" : h < 12 ? "Good morning ☀︎" : h < 18 ? "Good afternoon ✿" : "Good evening ☾";
}
tick();
const clockTimer = setInterval(tick, 15000);
try { dv.component.register(() => clearInterval(clockTimer)); } catch (e) {}


// Navigation callout — top-level folders
const nav = side.createDiv({ cls: "hv-callout hv-nav" });
nav.createDiv({ cls: "hv-callout-head", text: "✦ Navigation" });
const countIn = (folder) => {
    let n = 0;
    const walk = (f) => (f.children || []).forEach(c => { if (c.children) walk(c); else if (c.extension === "md") n++; });
    walk(folder);
    return n;
};
let folders = [];
try { folders = app.vault.getRoot().children.filter(c => c.children && !c.name.startsWith(".")); } catch (e) {}
folders = folders.map(f => ({ f, n: countIn(f) })).filter(x => x.n).sort((a, b) => b.n - a.n).slice(0, 8);
if (!folders.length) nav.createDiv({ cls: "hv-muted", text: "Folders you create will show up here." });
folders.forEach(({ f, n }) => {
    const row = nav.createDiv({ cls: "hv-nav-row", attr: { role: "link", tabindex: "0" } });
    row.createSpan({ cls: "hv-nav-emoji", text: emojiFor(f.name) });
    row.createSpan({ cls: "hv-nav-name", text: f.name });
    row.createSpan({ cls: "hv-nav-count", text: String(n) });
    press(row, () => {
        try { app.internalPlugins.getPluginById("file-explorer").instance.revealInFolder(f); } catch (e) {}
    });
});


// Toggles — remembered open or closed
const toggleState = store.get(LS.toggles, { checkin: true, created: false });
function toggle(parent, key, label) {
    const wrap = parent.createDiv({ cls: "hv-toggle" + (toggleState[key] ? " open" : "") });
    const headRow = wrap.createDiv({ cls: "hv-toggle-head", attr: { role: "button", tabindex: "0", "aria-expanded": String(!!toggleState[key]) } });
    icon(headRow, "chevron-right", "hv-icon hv-toggle-arrow");
    headRow.createSpan({ text: label });
    const body = wrap.createDiv({ cls: "hv-toggle-body" });
    const inner = body.createDiv({ cls: "hv-toggle-inner" });
    press(headRow, () => {
        toggleState[key] = !toggleState[key];
        store.set(LS.toggles, toggleState);
        wrap.toggleClass("open", toggleState[key]);
        headRow.setAttr("aria-expanded", String(toggleState[key]));
    });
    return inner;
}

// Daily check-in — mood for the week, water for today
const checkin = toggle(side, "checkin", "Daily check-in");
const MOODS = ["😞", "😕", "😐", "🙂", "😄"];
const moods = store.get(LS.mood, {});
const moodRow = checkin.createDiv({ cls: "hv-mood-week" });
function renderMoods() {
    moodRow.innerHTML = "";
    for (let i = 6; i >= 0; i--) {
        const day = TODAY - i * DAY;
        const cell = moodRow.createDiv({ cls: "hv-mood-day" + (i === 0 ? " today" : "") });
        cell.createDiv({ cls: "hv-mood-face", text: moods[iso(day)] !== undefined ? MOODS[moods[iso(day)]] : "·" });
        cell.createDiv({ cls: "hv-mood-label", text: new Date(day).toLocaleDateString("en-GB", { weekday: "narrow" }) });
    }
}
renderMoods();
checkin.createDiv({ cls: "hv-mini-label", text: "How are you today?" });
const moodPick = checkin.createDiv({ cls: "hv-mood-pick" });
MOODS.forEach((face, i) => {
    const b = moodPick.createDiv({ cls: "hv-mood-btn" + (moods[iso(TODAY)] === i ? " picked" : ""), attr: { role: "button", tabindex: "0" }, text: face });
    press(b, () => {
        moods[iso(TODAY)] = i;
        store.set(LS.mood, moods);
        moodPick.querySelectorAll(".picked").forEach(el => el.removeClass("picked"));
        b.addClass("picked");
        renderMoods();
    });
});
checkin.createDiv({ cls: "hv-mini-label", text: "Water" });
const water = store.get(LS.water, {});
const glasses = checkin.createDiv({ cls: "hv-water" });
function renderWater() {
    glasses.innerHTML = "";
    const n = water[iso(TODAY)] || 0;
    for (let i = 1; i <= 8; i++) {
        const g = glasses.createDiv({ cls: "hv-glass" + (i <= n ? " full" : ""), attr: { role: "button", tabindex: "0", "aria-label": i + " glasses" } });
        icon(g, "glass-water");
        press(g, () => { water[iso(TODAY)] = n === i ? i - 1 : i; store.set(LS.water, water); renderWater(); });
    }
    glasses.createSpan({ cls: "hv-water-count", text: n + " / 8" });
}
renderWater();

// Recently created
const created = toggle(side, "created", "Recently created");
[...files].sort((a, b) => (b.stat.ctime || 0) - (a.stat.ctime || 0)).slice(0, 6).forEach(f => {
    const row = created.createDiv({ cls: "hv-link-row", attr: { role: "link", tabindex: "0" } });
    row.createSpan({ cls: "hv-link-emoji", text: "📄" });
    row.createSpan({ cls: "hv-link-name", text: f.basename });
    row.createSpan({ cls: "hv-link-meta", text: shortDate(f.stat.ctime || f.stat.mtime) });
    press(row, () => openNote(f.path));
});


// ── Tasks database — board, table and calendar views ──────────────
const DUE = /(?:📅|⏳|🗓️|\[due::|\(due::)\s*(\d{4}-\d{2}-\d{2})/;
function dueOf(task) {
    if (task.due && task.due.toMillis) return startOfDay(task.due.toMillis());
    const found = DUE.exec(String(task.text));
    if (!found) return null;
    const parsed = Date.parse(found[1] + "T00:00:00");
    return isNaN(parsed) ? null : startOfDay(parsed);
}
const cleanTask = (text) => String(text)
    .replace(DUE, "").replace(/\s*(?:➕|✅)\s*\d{4}-\d{2}-\d{2}/g, "").replace(/[✅❌🔺⏫🔼🔽⏬]/g, "")
    .replace(/\[\[|\]\]/g, "").replace(/#[\w/-]+/g, "").replace(/\s{2,}/g, " ").trim();

const tasks = [];
try { for (const task of dv.pages().file.tasks) tasks.push({ task, due: dueOf(task) }); } catch (e) {}

const STATUS = {
    late: { label: "Overdue", color: "red" },
    today: { label: "Today", color: "orange" },
    soon: { label: "Upcoming", color: "blue" },
    later: { label: "No date", color: "gray" },
    done: { label: "Done", color: "green" }
};
const statusOf = (t) => t.task.completed ? "done"
    : t.due === null ? "later" : t.due < TODAY ? "late" : t.due === TODAY ? "today" : "soon";

function findTaskLine(lines, entry) {
    const want = String(entry.task.text).trim();
    const holds = (line) => line !== undefined && /\[[ xX]\]/.test(line) && (!want || line.includes(want));
    if (entry.task.line >= 0 && holds(lines[entry.task.line])) return entry.task.line;
    return want ? lines.findIndex(holds) : -1;
}
async function writeTask(entry, finished) {
    const file = app.vault.getAbstractFileByPath(entry.task.path);
    if (!file) return false;
    let found = true;
    const rewrite = (data) => {
        const lines = data.split("\n");
        const at = findTaskLine(lines, entry);
        if (at < 0) { found = false; return data; }
        lines[at] = finished ? lines[at].replace(/\[ \]/, "[x]") : lines[at].replace(/\[[xX]\]/, "[ ]");
        entry.task.line = at;
        return lines.join("\n");
    };
    try {
        if (app.vault.process) await app.vault.process(file, rewrite);
        else await app.vault.modify(file, rewrite(await app.vault.read(file)));
        if (!found) new Notice("That task has moved — refresh the dashboard.");
        return found;
    } catch (e) {
        new Notice("Could not update that task.");
        console.error(e);
        return false;
    }
}
async function toggleTask(entry) {
    const finished = !entry.task.completed;
    entry.task.completed = finished;
    renderTaskView();
    if (!(await writeTask(entry, finished))) { entry.task.completed = !finished; renderTaskView(); }
}

const taskDb = taskSlot;
const dbHead = taskDb.createDiv({ cls: "hv-db-head" });
const dbTitle = dbHead.createDiv({ cls: "hv-db-title" });
dbTitle.createSpan({ text: "✅" });
dbTitle.createSpan({ text: "Tasks" });
const tabs = dbHead.createDiv({ cls: "hv-tabs" });
const newBtn = dbHead.createDiv({ cls: "hv-new", attr: { role: "button", tabindex: "0" } });
icon(newBtn, "plus");
newBtn.createSpan({ text: "New" });
const newRow = taskDb.createDiv({ cls: "hv-new-row" });
const newInput = newRow.createEl("input", { cls: "hv-input", attr: { type: "text", placeholder: "Type a task and press Enter — it is due today", spellcheck: "false" } });
const view = taskDb.createDiv({ cls: "hv-view" });

const VIEWS = [["board", "Board", "columns-3"], ["table", "Table", "table-2"], ["calendar", "Calendar", "calendar-days"]];
let viewId = store.get(LS.view, "board");
if (!VIEWS.some(v => v[0] === viewId)) viewId = "board";
VIEWS.forEach(([id, label, glyph]) => {
    const t = tabs.createDiv({ cls: "hv-tab" + (id === viewId ? " active" : ""), attr: { role: "tab", tabindex: "0", "data-id": id } });
    icon(t, glyph);
    t.createSpan({ text: label });
    press(t, () => {
        viewId = id;
        store.set(LS.view, id);
        tabs.querySelectorAll(".hv-tab").forEach(el => el.toggleClass("active", el.dataset.id === id));
        renderTaskView();
    });
});

press(newBtn, () => { newRow.toggleClass("open"); if (newRow.hasClass("open")) setTimeout(() => newInput.focus(), 60); });
newInput.onkeydown = async (e) => {
    if (e.key === "Escape") { newRow.removeClass("open"); return; }
    if (e.key !== "Enter") return;
    e.preventDefault();
    const value = newInput.value.trim();
    const file = app.vault.getAbstractFileByPath(selfPath);
    if (!value || !file) return;
    const line = "- [ ] " + value + "  📅 " + iso(TODAY);
    const rewrite = (data) => {
        const at = data.indexOf("\n## Tasks");
        if (at === -1) return data.replace(/\s*$/, "") + "\n\n## Tasks\n" + line + "\n";
        const after = data.indexOf("\n", at + 1);
        return data.slice(0, after + 1) + line + "\n" + data.slice(after + 1);
    };
    try {
        if (app.vault.process) await app.vault.process(file, rewrite);
        else await app.vault.modify(file, rewrite(await app.vault.read(file)));
        tasks.unshift({ task: { text: value + "  📅 " + iso(TODAY), path: selfPath, line: -1, completed: false }, due: TODAY });
        newInput.value = "";
        renderTaskView();
    } catch (err) {
        new Notice("Could not add that task.");
        console.error(err);
    }
};

const checkbox = (parent, entry) => {
    const box = parent.createDiv({
        cls: "hv-check" + (entry.task.completed ? " on" : ""),
        attr: { role: "checkbox", tabindex: "0", "aria-checked": String(!!entry.task.completed), "aria-label": cleanTask(entry.task.text) || "Task" }
    });
    box.innerHTML = '<svg viewBox="0 0 16 16"><path d="M3.5 8.5 6.5 11.5 12.5 4.5"/></svg>';
    press(box, (e) => { e.stopPropagation(); toggleTask(entry); });
    return box;
};
const noteLink = (parent, path) => {
    const a = parent.createSpan({ cls: "hv-note-link" });
    a.createSpan({ text: "📄" });
    a.createSpan({ cls: "hv-note-name", text: path.split("/").pop().replace(/\.md$/, "") });
    a.onclick = (e) => { e.stopPropagation(); openNote(path); };
    return a;
};

function renderTaskView() {
    view.innerHTML = "";
    view.className = "hv-view hv-view-" + viewId;
    const visible = tasks.filter(t => !t.task.completed || (t.due !== null && t.due >= TODAY - 7 * DAY));
    if (viewId === "board") renderBoard(visible);
    else if (viewId === "table") renderTable(visible);
    else renderCalendar(visible);
}

function renderBoard(list) {
    const board = view.createDiv({ cls: "hv-board" });
    ["late", "today", "soon", "done"].forEach(key => {
        const items = list.filter(t => statusOf(t) === key).sort((a, b) => (a.due || 0) - (b.due || 0));
        const col = board.createDiv({ cls: "hv-col" });
        const ch = col.createDiv({ cls: "hv-col-head" });
        pill(ch, STATUS[key].label, STATUS[key].color);
        ch.createSpan({ cls: "hv-col-count", text: String(items.length) });
        items.slice(0, 6).forEach((entry, i) => {
            const card = col.createDiv({ cls: "hv-card" + (entry.task.completed ? " done" : "") });
            card.style.setProperty("--hv-i", i);
            const top = card.createDiv({ cls: "hv-card-top" });
            checkbox(top, entry);
            top.createDiv({ cls: "hv-card-title", text: cleanTask(entry.task.text) || "Untitled" });
            const meta = card.createDiv({ cls: "hv-card-props" });
            noteLink(meta, entry.task.path);
            if (entry.due !== null) meta.createSpan({ cls: "hv-date" + (key === "late" ? " late" : ""), text: shortDate(entry.due) });
            card.onclick = () => openNote(entry.task.path);
        });
        if (items.length > 6) col.createDiv({ cls: "hv-col-more", text: "+ " + (items.length - 6) + " more" });
        if (!items.length) col.createDiv({ cls: "hv-col-empty", text: key === "done" ? "Nothing ticked off yet" : "Nothing here" });
    });
}

function renderTable(list) {
    const table = view.createDiv({ cls: "hv-table" });
    const headRow = table.createDiv({ cls: "hv-tr hv-th" });
    [["", ""], ["type", "Name"], ["calendar", "Due"], ["file-text", "Note"], ["circle-dot", "Status"]].forEach(([glyph, label]) => {
        const c = headRow.createDiv({ cls: "hv-td" });
        if (glyph) icon(c, glyph);
        c.createSpan({ text: label });
    });
    const order = { late: 0, today: 1, soon: 2, later: 3, done: 4 };
    const rows = [...list].sort((a, b) => order[statusOf(a)] - order[statusOf(b)] || (a.due || Infinity) - (b.due || Infinity)).slice(0, 12);
    if (!rows.length) table.createDiv({ cls: "hv-tr hv-empty-row", text: "No tasks yet — press New to add one." });
    rows.forEach(entry => {
        const key = statusOf(entry);
        const tr = table.createDiv({ cls: "hv-tr" + (entry.task.completed ? " done" : "") });
        checkbox(tr.createDiv({ cls: "hv-td" }), entry);
        tr.createDiv({ cls: "hv-td hv-td-name", text: cleanTask(entry.task.text) || "Untitled" });
        tr.createDiv({ cls: "hv-td hv-td-muted", text: entry.due !== null ? new Date(entry.due).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—" });
        noteLink(tr.createDiv({ cls: "hv-td" }), entry.task.path);
        pill(tr.createDiv({ cls: "hv-td" }), STATUS[key].label, STATUS[key].color);
    });
}

let calMonth = new Date(TODAY); calMonth.setDate(1);
function renderCalendar(list) {
    const bar = view.createDiv({ cls: "hv-cal-bar" });
    bar.createDiv({ cls: "hv-cal-month", text: calMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" }) });
    const nav2 = bar.createDiv({ cls: "hv-cal-nav" });
    const prev = nav2.createDiv({ cls: "hv-icon-btn", attr: { role: "button", tabindex: "0", "aria-label": "Previous month" } });
    icon(prev, "chevron-left");
    const todayBtn = nav2.createDiv({ cls: "hv-chip-btn hv-chip-flat", attr: { role: "button", tabindex: "0" }, text: "Today" });
    const next = nav2.createDiv({ cls: "hv-icon-btn", attr: { role: "button", tabindex: "0", "aria-label": "Next month" } });
    icon(next, "chevron-right");
    press(prev, () => { calMonth.setMonth(calMonth.getMonth() - 1); renderTaskView(); });
    press(next, () => { calMonth.setMonth(calMonth.getMonth() + 1); renderTaskView(); });
    press(todayBtn, () => { calMonth = new Date(TODAY); calMonth.setDate(1); renderTaskView(); });

    const grid = view.createDiv({ cls: "hv-cal" });
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach(d => grid.createDiv({ cls: "hv-cal-dow", text: d }));
    const first = new Date(calMonth);
    const offset = (first.getDay() + 6) % 7;
    const start = startOfDay(first.getTime()) - offset * DAY;
    for (let i = 0; i < 42; i++) {
        const day = startOfDay(start + i * DAY + 3600e3);
        const d = new Date(day);
        if (i >= 35 && d.getMonth() !== calMonth.getMonth()) break;
        const cell = grid.createDiv({ cls: "hv-cal-cell" + (d.getMonth() !== calMonth.getMonth() ? " out" : "") + (day === TODAY ? " today" : "") });
        cell.createDiv({ cls: "hv-cal-num", text: d.getDate() === 1 ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : String(d.getDate()) });
        list.filter(t => t.due === day).slice(0, 3).forEach(entry => {
            const chip = cell.createDiv({ cls: "hv-cal-task hv-c-" + STATUS[statusOf(entry)].color + (entry.task.completed ? " done" : ""), text: cleanTask(entry.task.text) });
            chip.onclick = () => openNote(entry.task.path);
        });
    }
}
renderTaskView();


// ── Library — a gallery of your notes ────────────────────────────
const lib = libSlot;
const libHead = lib.createDiv({ cls: "hv-db-head" });
const libTitle = libHead.createDiv({ cls: "hv-db-title" });
libTitle.createSpan({ text: "📚" });
libTitle.createSpan({ text: "Library" });
const libTabs = libHead.createDiv({ cls: "hv-tabs" });
const gallery = lib.createDiv({ cls: "hv-gallery" });

function bookmarks() {
    try {
        const plugin = app.internalPlugins.getPluginById("bookmarks");
        if (!plugin || !plugin.enabled) return [];
        const out = [];
        const walk = (items) => (items || []).forEach(item => {
            if (item.type === "file") { const f = app.vault.getAbstractFileByPath(item.path); if (f && f.extension === "md") out.push(f); }
            else if (item.type === "group") walk(item.items);
        });
        walk(plugin.instance.items);
        return out;
    } catch (e) { return []; }
}
const LIBS = [["recent", "Recently edited", "clock"], ["pinned", "Bookmarked", "bookmark"]];
let libId = store.get(LS.lib, "recent");
LIBS.forEach(([id, label, glyph]) => {
    const t = libTabs.createDiv({ cls: "hv-tab" + (id === libId ? " active" : ""), attr: { role: "tab", tabindex: "0", "data-id": id } });
    icon(t, glyph);
    t.createSpan({ text: label });
    press(t, () => {
        libId = id;
        store.set(LS.lib, id);
        libTabs.querySelectorAll(".hv-tab").forEach(el => el.toggleClass("active", el.dataset.id === id));
        renderGallery();
    });
});

const PASTELS = ["#f6e3d6", "#e3ecdb", "#dbe7f0", "#ece0f3", "#f5e6ea", "#f3ecd4", "#e0eeec"];
function renderGallery() {
    gallery.innerHTML = "";
    const list = (libId === "pinned" ? bookmarks() : byEdit).slice(0, 6);
    if (!list.length) {
        gallery.createDiv({ cls: "hv-muted hv-gallery-empty", text: libId === "pinned" ? "Bookmark notes in Obsidian and they will be shelved here." : "Your notes will be shelved here." });
        return;
    }
    list.forEach((f, i) => {
        const card = gallery.createDiv({ cls: "hv-gcard", attr: { role: "link", tabindex: "0" } });
        card.style.setProperty("--hv-i", i);
        const cover = card.createDiv({ cls: "hv-gcover" });
        const img = firstImage(f);
        if (img) cover.createEl("img", { attr: { src: resourceOf(img), alt: "", loading: "lazy" } });
        else {
            cover.addClass("blank");
            cover.style.setProperty("--hv-tint", PASTELS[hash(f.path) % PASTELS.length]);
            cover.createSpan({ cls: "hv-gcover-emoji", text: emojiFor(folderOf(f)) });
        }
        const body = card.createDiv({ cls: "hv-gbody" });
        const t = body.createDiv({ cls: "hv-gtitle" });
        t.createSpan({ text: img ? "📄" : emojiFor(folderOf(f)) });
        t.createSpan({ cls: "hv-gname", text: f.basename });
        const meta = body.createDiv({ cls: "hv-gprops" });
        pill(meta, folderOf(f));
        meta.createSpan({ cls: "hv-gtime", text: relTime(f.stat.mtime) });
        press(card, () => openNote(f.path));
    });
}
renderGallery();
```
