---
cssclasses:
  - dashboard-layout
---

```dataviewjs
// Pixel — an agenda-first home built on Material 3 Expressive.
// More dashboards → https://github.com/InlitX/Obsidian-Dashboard-Gallery

const { setIcon } = require("obsidian");
const LS = {
    inbox: "px-inbox", filter: "px-filter", target: "px-target",
    done: "px-done", source: "px-source", media: "px-media", tone: "px-tone"
};

const root = dv.container.createDiv({ cls: "px px-in" });
const calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const icon = (parent, name, cls = "px-icon") => {
    const el = parent.createDiv({ cls });
    try { setIcon(el, name); } catch (e) {}
    return el;
};

// Click, Enter and Space all do the same thing on our fake buttons.
const press = (el, fn) => {
    el.onclick = fn;
    el.onkeydown = (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        e.stopPropagation();
        fn(e);
    };
};

// A scrolling list fades at its foot until you reach the end.
const watchOverflow = (el) => {
    const update = () => requestAnimationFrame(() => {
        el.toggleClass("px-overflow", el.scrollHeight > el.clientHeight + 1);
        el.toggleClass("px-at-end", el.scrollTop + el.clientHeight >= el.scrollHeight - 2);
    });
    el.addEventListener("scroll", update, { passive: true });
    return update;
};

// ── Shape library — M3 Expressive shapes as morphable polygons ────
// Every shape has the same number of points, so clip-path can
// interpolate between any two of them.
const SHAPES = {
    circle: () => 1,
    cookie12: (a) => 0.92 + 0.08 * Math.cos(12 * a),
    sunny: (a) => 0.86 + 0.14 * Math.cos(8 * a),
    burst: (a) => 0.88 + 0.12 * Math.cos(10 * a),
    cookie9: (a) => 0.9 + 0.1 * Math.cos(9 * a),
    cookie4: (a) => 0.86 + 0.14 * Math.cos(4 * a),
    pentagon: (a) => 0.93 + 0.07 * Math.cos(5 * a),
    clover: (a) => 0.7 + 0.3 * Math.abs(Math.cos(2 * a)),
    oval: (a) => 0.72 / Math.hypot(0.72 * Math.cos(a + Math.PI / 4), Math.sin(a + Math.PI / 4)),
    pill: (a) => Math.pow(Math.pow(Math.abs(Math.cos(a - Math.PI / 4)), 4) + Math.pow(Math.abs(Math.sin(a - Math.PI / 4)) / 0.62, 4), -0.25)
};
for (const name in SHAPES) {
    const points = [];
    for (let i = 0; i < 72; i++) {
        const a = -Math.PI / 2 + (i / 72) * Math.PI * 2;
        const r = 50 * SHAPES[name](a);
        points.push((50 + r * Math.cos(a)).toFixed(2) + "% " + (50 + r * Math.sin(a)).toFixed(2) + "%");
    }
    root.style.setProperty("--px-s-" + name, "polygon(" + points.join(", ") + ")");
}


// ── Dynamic colour — a tonal palette from one seed, Material You style
// Each role is a tone (oklch lightness) plus a chroma; chroma is pulled
// in until the colour fits sRGB, so hues never clip or shift.
const ROLES = {
    dark: {
        "primary": [.82, .115], "on-primary": [.33, .075], "primary-container": [.42, .09], "on-primary-container": [.92, .06],
        "secondary-container": [.39, .035], "on-secondary-container": [.91, .035],
        "tertiary-container": [.40, .08, 1], "on-tertiary-container": [.92, .04, 1],
        "surface": [.19, .012], "on-surface": [.92, .01], "on-surface-variant": [.82, .025],
        "container-low": [.22, .012], "container": [.24, .013], "container-high": [.28, .014], "container-highest": [.32, .015],
        "outline": [.65, .025], "outline-variant": [.40, .025]
    },
    light: {
        "primary": [.50, .13], "on-primary": [.99, .01], "primary-container": [.91, .07], "on-primary-container": [.32, .08],
        "secondary-container": [.92, .035], "on-secondary-container": [.31, .035],
        "tertiary-container": [.91, .05, 1], "on-tertiary-container": [.32, .07, 1],
        "surface": [.985, .006], "on-surface": [.21, .012], "on-surface-variant": [.42, .025],
        "container-low": [.965, .009], "container": [.95, .011], "container-high": [.93, .013], "container-highest": [.91, .015],
        "outline": [.55, .025], "outline-variant": [.82, .02]
    }
};

function oklchToLinear(L, C, h) {
    const a = C * Math.cos(h * Math.PI / 180), b = C * Math.sin(h * Math.PI / 180);
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3;
    return [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    ];
}

function tone(L, C, h) {
    let rgb = oklchToLinear(L, C, h);
    while (C > 0 && rgb.some(v => v < 0 || v > 1)) { C -= 0.002; rgb = oklchToLinear(L, Math.max(0, C), h); }
    return "#" + rgb.map(v => {
        const c = Math.min(1, Math.max(0, v));
        const s = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
        return Math.round(s * 255).toString(16).padStart(2, "0");
    }).join("");
}

// Read Obsidian's accent and turn it into a hue and a chroma scale.
function accentSeed() {
    let rgb = null;
    try {
        const probe = document.body.createDiv();
        probe.style.color = "var(--interactive-accent)";
        let value = getComputedStyle(probe).color;
        probe.remove();
        if (!/^rgb/.test(value)) {
            const ctx = document.createElement("canvas").getContext("2d");
            ctx.fillStyle = value;
            value = ctx.fillStyle;
        }
        if (value[0] === "#") rgb = [1, 3, 5].map(i => parseInt(value.slice(i, i + 2), 16));
        else rgb = (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    } catch (e) {}
    if (!rgb || rgb.length < 3) return { hue: 70, chroma: 1 };

    const [r, g, b] = rgb.map(v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    const A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
    const B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
    return {
        hue: (Math.atan2(B, A) * 180 / Math.PI + 360) % 360,
        chroma: Math.min(1.15, Math.hypot(A, B) / 0.13)
    };
}

const TONES = [
    { id: "accent", label: "Obsidian accent" },
    { id: "amber", label: "Amber", hue: 70 },
    { id: "rose", label: "Rose", hue: 12 },
    { id: "violet", label: "Violet", hue: 300 },
    { id: "ocean", label: "Ocean", hue: 245 },
    { id: "moss", label: "Moss", hue: 140 }
];
let toneId = localStorage.getItem(LS.tone) || "amber";
if (!TONES.some(t => t.id === toneId)) toneId = "amber";

const seedOf = (id) => {
    const found = TONES.find(t => t.id === id);
    return found.hue === undefined ? accentSeed() : { hue: found.hue, chroma: 1 };
};
const isLight = () => document.body.classList.contains("theme-light");

function applyTone() {
    const { hue, chroma } = seedOf(toneId);
    const roles = ROLES[isLight() ? "light" : "dark"];
    for (const key in roles) {
        const [L, C, tertiary] = roles[key];
        root.style.setProperty("--px-" + key, tone(L, C * chroma, tertiary ? hue - 60 : hue));
    }
}
applyTone();

const startOfDay = (ms) => { const d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); };
const TODAY = startOfDay(Date.now());
const DAY = 86400000;
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const iso = (ms) => {
    const d = new Date(ms);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};

const dateLabel = (ms) => {
    const diff = Math.round((startOfDay(ms) - TODAY) / DAY);
    if (diff === 0) return "today";
    if (diff === -1) return "yesterday";
    if (diff === 1) return "tomorrow";
    if (diff < 0) return Math.abs(diff) + " days late";
    if (diff < 7) return "in " + diff + " days";
    return new Date(ms).toLocaleDateString([], { day: "numeric", month: "short" });
};

const relTime = (ms) => {
    const min = Math.floor((Date.now() - ms) / 60000);
    if (min < 60) return Math.max(1, min) + " min ago";
    const h = Math.floor(min / 60);
    if (h < 24) return h + (h === 1 ? " hour ago" : " hours ago");
    const d = Math.floor(h / 24);
    return d === 1 ? "yesterday" : d + " days ago";
};

const openNote = (path) => app.workspace.openLinkText(path, "", false);
const run = (...ids) => { for (const id of ids) if (app.commands.executeCommandById(id)) return; };

let selfPath = "";
try { selfPath = dv.current().file.path; } catch (e) {}


// ── Tasks — read the due date the way people actually write it ────
const DUE = /(?:📅|⏳|🗓️|\[due::|\(due::)\s*(\d{4}-\d{2}-\d{2})/;

function dueOf(task) {
    if (task.due && task.due.toMillis) return startOfDay(task.due.toMillis());
    const found = DUE.exec(String(task.text));
    if (!found) return null;
    const parsed = Date.parse(found[1] + "T00:00:00");
    return isNaN(parsed) ? null : startOfDay(parsed);
}

const clean = (text) => String(text)
    .replace(DUE, "")
    .replace(/\s*(?:➕|✅)\s*\d{4}-\d{2}-\d{2}/g, "")
    .replace(/[✅❌🔺⏫🔼🔽⏬]/g, "")
    .replace(/\[\[|\]\]/g, "")
    .replace(/#[\w/-]+/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

const everyTask = [];
for (const task of dv.pages().file.tasks) {
    everyTask.push({ task, due: dueOf(task) });
}

const SOURCES = {
    here: (entry) => entry.task.path === selfPath,
    vault: (entry) => entry.task.path !== selfPath,
    both: () => true
};
const SOURCE_LABELS = { here: "This note", vault: "Rest of the vault", both: "Everything" };
let source = localStorage.getItem(LS.source) || "both";
if (!SOURCES[source]) source = "both";

const visible = () => everyTask.filter(SOURCES[source]);

const BUCKETS = {
    today: (t) => t.due === TODAY,
    overdue: (t) => t.due !== null && t.due < TODAY,
    upcoming: (t) => t.due !== null && t.due > TODAY,
    anytime: (t) => t.due === null
};
const ORDER = ["today", "overdue", "upcoming", "anytime"];
const LABELS = { today: "Today", overdue: "Overdue", upcoming: "Upcoming", anytime: "Anytime" };

const openIn = (key) => visible().filter(t => BUCKETS[key](t) && !t.task.completed).length;

let filter = localStorage.getItem(LS.filter);
if (!filter || !BUCKETS[filter]) filter = ORDER.find(k => openIn(k)) || "today";
let showDone = localStorage.getItem(LS.done) !== "off";

const leftToday = () => openIn("today") + openIn("overdue");


// ── Header ────────────────────────────────────────────────────────
const header = root.createDiv({ cls: "px-header" });
const headLead = header.createDiv({ cls: "px-header-lead" });

const badge = headLead.createDiv({ cls: "px-date-badge", attr: { "aria-hidden": "true" } });
badge.createDiv({ cls: "px-date-day", text: String(new Date().getDate()) });
badge.createDiv({ cls: "px-date-month", text: new Date().toLocaleDateString([], { month: "short" }).replace(".", "") });

const headText = headLead.createDiv({ cls: "px-header-text" });
const hour = new Date().getHours();
const greeting = hour < 5 ? "Up late" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
headText.createDiv({
    cls: "px-eyebrow",
    text: greeting + " · " + new Date().toLocaleDateString([], { weekday: "long" })
});

const headline = headText.createDiv({ cls: "px-headline" });
const countEl = headline.createSpan({ cls: "px-count" });
const wordEl = headline.createSpan();

let shownCount = leftToday();
function paintHeadline(value) {
    if (value > 0) {
        countEl.style.display = "";
        countEl.textContent = String(value);
        wordEl.textContent = value === 1 ? " thing left today" : " things left today";
        return;
    }
    countEl.style.display = "none";
    const scheduled = visible().some(BUCKETS.today);
    wordEl.textContent = scheduled ? "Today is clear" : "Your day is open";
}
paintHeadline(shownCount);

function countTo(value) {
    if (value === shownCount) return;
    const from = shownCount, delta = value - from, started = performance.now();
    shownCount = value;
    countEl.removeClass("bump");
    void countEl.offsetWidth;
    countEl.addClass("bump");
    const step = (now) => {
        const t = Math.min(1, (now - started) / 420);
        const eased = 1 - Math.pow(1 - t, 3);
        paintHeadline(Math.round(from + delta * eased));
        if (t < 1) requestAnimationFrame(step);
        else paintHeadline(value);
    };
    requestAnimationFrame(step);
}

const fab = header.createDiv({ cls: "px-fab", attr: { role: "button", tabindex: "0" } });
const fabIcon = icon(fab, "plus", "px-icon px-fab-icon");
const fabLabel = fab.createSpan({ cls: "px-fab-label", text: "Capture" });


// ── Composer — opens out of the button, with somewhere to put it ──
const composer = root.createDiv({ cls: "px-sheet" });
const composerInner = composer.createDiv({ cls: "px-sheet-inner" });

const field = composerInner.createDiv({ cls: "px-field" });
const input = field.createEl("input", {
    cls: "px-input",
    attr: { type: "text", placeholder: "What is on your mind?", spellcheck: "false" }
});

const options = composerInner.createDiv({ cls: "px-options" });
const segmented = options.createDiv({ cls: "px-segmented" });

const TARGETS = [
    { id: "task", label: "As a task" },
    { id: "note", label: "As a line" },
    { id: "daily", label: "Daily note" }
];
let target = localStorage.getItem(LS.target) || "task";

function renderSegmented() {
    segmented.innerHTML = "";
    TARGETS.forEach(option => {
        const seg = segmented.createDiv({ cls: "px-segment" + (option.id === target ? " selected" : "") });
        if (option.id === target) icon(seg, "check", "px-icon px-segment-check");
        seg.createSpan({ cls: "px-segment-label", text: option.label });
        seg.setAttr("role", "radio");
        seg.setAttr("tabindex", "0");
        seg.setAttr("aria-checked", String(option.id === target));
        press(seg, () => {
            target = option.id;
            localStorage.setItem(LS.target, option.id);
            renderSegmented();
            paintDestination();
        });
    });
}

const save = options.createDiv({ cls: "px-filled", attr: { role: "button", tabindex: "0" } });
const saveLabel = save.createSpan({ cls: "px-filled-label", text: "Save" });
save.createDiv({ cls: "px-loader" });

const destination = composerInner.createDiv({ cls: "px-destination" });
const destinationNote = destination.createSpan();
const inboxPath = () => localStorage.getItem(LS.inbox) || "Inbox.md";
const pathEl = destination.createSpan({
    cls: "px-path",
    attr: { contenteditable: "true", spellcheck: "false" },
    text: inboxPath()
});

function paintDestination() {
    const daily = target === "daily";
    pathEl.style.display = daily ? "none" : "";
    destinationNote.textContent = daily ? "Appends to today's daily note" : "Appends to";
}
pathEl.onblur = () => {
    const value = pathEl.textContent.trim();
    if (value) localStorage.setItem(LS.inbox, value.endsWith(".md") ? value : value + ".md");
    pathEl.textContent = inboxPath();
};
pathEl.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); pathEl.blur(); } };

let composerOpen = false;
function toggleComposer(force) {
    composerOpen = force === undefined ? !composerOpen : force;
    composer.toggleClass("open", composerOpen);
    fab.toggleClass("active", composerOpen);
    fabLabel.textContent = composerOpen ? "Close" : "Capture";
    try { setIcon(fabIcon, composerOpen ? "x" : "plus"); } catch (e) {}
    if (composerOpen) setTimeout(() => input.focus(), 160);
}
press(fab, () => toggleComposer());

// Honour the Daily notes plugin: its folder and its date format.
async function dailyNoteFile() {
    let folder = "", format = "YYYY-MM-DD";
    try {
        const plugin = app.internalPlugins.getPluginById("daily-notes");
        const opts = plugin && plugin.enabled && plugin.instance && plugin.instance.options;
        if (opts) { folder = (opts.folder || "").replace(/^\/+|\/+$/g, ""); format = opts.format || format; }
    } catch (e) {}

    const name = window.moment ? window.moment().format(format) : iso(Date.now());
    const path = (folder ? folder + "/" : "") + name + ".md";
    const existing = app.vault.getAbstractFileByPath(path);
    if (existing) return existing;

    const dir = path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "";
    if (dir && !app.vault.getAbstractFileByPath(dir)) {
        try { await app.vault.createFolder(dir); } catch (e) {}
    }
    return app.vault.create(path, "# " + name.split("/").pop() + "\n");
}

async function commitCapture() {
    const value = input.value.trim();
    if (!value || save.hasClass("busy")) return;
    save.addClass("busy");
    try {
        const file = target === "daily"
            ? await dailyNoteFile()
            : (app.vault.getAbstractFileByPath(inboxPath()) || await app.vault.create(inboxPath(), "# Inbox\n"));
        const stamp = window.moment ? window.moment().format("YYYY-MM-DD HH:mm") : new Date().toLocaleString();
        const line = target === "note" ? "\n- " + value : "\n- [ ] " + value;
        await app.vault.append(file, line + "  *(" + stamp + ")*");
        await wait(400);
        input.value = "";
        saveLabel.textContent = "Saved";
        await wait(900);
        saveLabel.textContent = "Save";
        toggleComposer(false);
    } catch (e) {
        new Notice("Could not write that down.");
        console.error(e);
    }
    save.removeClass("busy");
}

press(save, commitCapture);
input.onkeydown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); commitCapture(); }
    else if (e.key === "Escape") toggleComposer(false);
};

renderSegmented();
paintDestination();


// ── Progress — the bar fills, it does not slither ─────────────────
const meter = root.createDiv({ cls: "px-meter", attr: { role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100" } });
const wave = meter.createDiv({ cls: "px-wave" });
const meterNote = meter.createDiv({ cls: "px-meter-note" });

const svgNS = "http://www.w3.org/2000/svg";
const svg = document.createElementNS(svgNS, "svg");
svg.setAttribute("height", "36");
svg.setAttribute("width", "100%");
const activePath = document.createElementNS(svgNS, "path");
activePath.setAttribute("class", "px-wave-active");
const trackLine = document.createElementNS(svgNS, "line");
trackLine.setAttribute("class", "px-wave-track");
const stopDot = document.createElementNS(svgNS, "circle");
stopDot.setAttribute("class", "px-wave-stop");
stopDot.setAttribute("r", "3.5");
svg.append(activePath, trackLine, stopDot);
wave.appendChild(svg);

let ratioTarget = 0, ratioNow = 0, phase = 0, flat = 0, waveWidth = 600, frameId = null, onScreen = true;

function measure() {
    waveWidth = Math.max(140, wave.clientWidth || 600);
    svg.setAttribute("viewBox", "0 0 " + waveWidth + " 36");
    drawWave();
}

function drawWave() {
    const mid = 18;
    const end = Math.max(0, waveWidth * ratioNow - 5);
    // Wave grows in from the start and irons itself flat once all is done.
    const amplitude = 7 * Math.min(1, end / 46) * (1 - flat);
    let d = "";
    if (end > 2) {
        d = "M 5 " + mid;
        for (let x = 5; x <= end; x += 2) {
            d += " L " + x.toFixed(1) + " " + (mid + amplitude * Math.sin(x / 8.5 + phase)).toFixed(2);
        }
    }
    activePath.setAttribute("d", d);
    activePath.style.opacity = end > 2 ? "1" : "0";

    const from = Math.min(waveWidth - 5, end + 14);
    trackLine.setAttribute("x1", from);
    trackLine.setAttribute("x2", waveWidth - 5);
    trackLine.setAttribute("y1", mid);
    trackLine.setAttribute("y2", mid);
    trackLine.style.opacity = from < waveWidth - 8 ? "1" : "0";

    stopDot.setAttribute("cx", waveWidth - 5);
    stopDot.setAttribute("cy", mid);
}

function loop() {
    frameId = null;
    if (!onScreen) return;
    if (!calm) phase -= 0.055;
    ratioNow += (ratioTarget - ratioNow) * (calm ? 1 : 0.11);
    flat += ((ratioTarget >= 1 ? 1 : 0) - flat) * (calm ? 1 : 0.06);
    drawWave();
    // With reduced motion the wave holds still, so stop once it has settled.
    if (!calm || Math.abs(ratioTarget - ratioNow) > 0.001) frameId = requestAnimationFrame(loop);
}
const wake = () => { if (frameId === null && onScreen) frameId = requestAnimationFrame(loop); };

function refreshMeter() {
    const set = visible().filter(BUCKETS[filter]);
    const done = set.filter(t => t.task.completed).length;
    ratioTarget = set.length ? done / set.length : 0;
    meterNote.textContent = set.length
        ? (done === set.length ? "all " + set.length + " done" : done + " of " + set.length + " done")
        : "nothing here yet";
    meter.setAttr("aria-valuenow", String(Math.round(ratioTarget * 100)));
    wake();
}

if (window.ResizeObserver) {
    const observer = new ResizeObserver(() => measure());
    observer.observe(wave);
    try { dv.component.register(() => observer.disconnect()); } catch (e) {}
}
// Only animate while the meter is actually on screen.
if (window.IntersectionObserver) {
    const seen = new IntersectionObserver((entries) => {
        onScreen = entries.some(entry => entry.isIntersecting);
        wake();
    });
    seen.observe(wave);
    try { dv.component.register(() => seen.disconnect()); } catch (e) {}
}
wake();
try { dv.component.register(() => { onScreen = false; if (frameId !== null) cancelAnimationFrame(frameId); }); } catch (e) {}


// ── Filters, and a switch for finished work ───────────────────────
const controls = root.createDiv({ cls: "px-controls" });
const chips = controls.createDiv({ cls: "px-chips", attr: { role: "radiogroup", "aria-label": "Show tasks" } });

const toggle = controls.createDiv({
    cls: "px-switch" + (showDone ? " on" : ""),
    attr: { role: "switch", tabindex: "0", "aria-checked": String(showDone) }
});
const track = toggle.createDiv({ cls: "px-switch-track" });
const thumb = track.createDiv({ cls: "px-switch-thumb" });
icon(thumb, "check", "px-icon px-switch-check");
toggle.createSpan({ cls: "px-switch-label", text: "Show done" });
press(toggle, () => {
    showDone = !showDone;
    localStorage.setItem(LS.done, showDone ? "on" : "off");
    toggle.toggleClass("on", showDone);
    toggle.setAttr("aria-checked", String(showDone));
    renderTasks();
});

function renderChips() {
    const hadFocus = chips.contains(document.activeElement);
    chips.innerHTML = "";
    ORDER.forEach(key => {
        const count = openIn(key);
        const chip = chips.createDiv({
            cls: "px-chip" + (key === filter ? " selected" : ""),
            attr: { role: "radio", tabindex: "0", "aria-checked": String(key === filter) }
        });
        if (key === filter) icon(chip, "check", "px-icon px-chip-check");
        chip.createSpan({ cls: "px-chip-label", text: LABELS[key] });
        if (count) chip.createSpan({ cls: "px-chip-count", text: String(count) });
        press(chip, () => {
            filter = key;
            localStorage.setItem(LS.filter, key);
            renderChips();
            renderTasks();
            refreshMeter();
        });
    });
    if (hadFocus) { const picked = chips.querySelector(".selected"); if (picked) picked.focus(); }
}


// ── Body ──────────────────────────────────────────────────────────
const body = root.createDiv({ cls: "px-body" });
const left = body.createDiv({ cls: "px-main" });
const side = body.createDiv({ cls: "px-side" });

const agenda = left.createDiv({ cls: "px-card px-agenda" });

const agendaHead = agenda.createDiv({ cls: "px-agenda-head" });
const agendaTitle = agendaHead.createDiv({ cls: "px-agenda-title" });
const tools = agendaHead.createDiv({ cls: "px-tools" });
const addBtn = tools.createDiv({ cls: "px-icon-btn px-add-btn", attr: { role: "button", tabindex: "0", "aria-label": "New task" } });
icon(addBtn, "plus");
const tuneBtn = tools.createDiv({ cls: "px-icon-btn", attr: { role: "button", tabindex: "0", "aria-label": "Settings" } });
icon(tuneBtn, "sliders-horizontal");


// ── New task — written straight into this note ────────────────────
const maker = agenda.createDiv({ cls: "px-sheet px-inner-sheet" });
const makerInner = maker.createDiv({ cls: "px-sheet-inner" });

const makerField = makerInner.createDiv({ cls: "px-field px-field-sm" });
const makerInput = makerField.createEl("input", {
    cls: "px-input",
    attr: { type: "text", placeholder: "Add a task…", spellcheck: "false" }
});

const WHEN = [
    { id: "today", label: "Today", offset: 0 },
    { id: "tomorrow", label: "Tomorrow", offset: 1 },
    { id: "week", label: "Next week", offset: 7 },
    { id: "pick", label: "Pick a date", offset: undefined },
    { id: "someday", label: "Someday", offset: null }
];
let when = "today";

const makerRow = makerInner.createDiv({ cls: "px-options" });
const whenChips = makerRow.createDiv({ cls: "px-chips px-chips-sm" });

const picker = makerInner.createDiv({ cls: "px-picker" });
const dateInput = picker.createEl("input", { cls: "px-date", attr: { type: "date", value: iso(TODAY) } });

function renderWhen() {
    const hadFocus = whenChips.contains(document.activeElement);
    whenChips.innerHTML = "";
    WHEN.forEach(option => {
        const chip = whenChips.createDiv({
            cls: "px-chip px-chip-sm" + (option.id === when ? " selected" : ""),
            attr: { role: "radio", tabindex: "0", "aria-checked": String(option.id === when) }
        });
        chip.createSpan({ cls: "px-chip-label", text: option.label });
        press(chip, () => {
            when = option.id;
            renderWhen();
            picker.toggleClass("open", when === "pick");
            if (when === "pick") setTimeout(() => dateInput.focus(), 120);
        });
    });
    picker.toggleClass("open", when === "pick");
    if (hadFocus && when !== "pick") { const picked = whenChips.querySelector(".selected"); if (picked) picked.focus(); }
}

const addAction = makerRow.createDiv({ cls: "px-filled px-filled-sm", attr: { role: "button", tabindex: "0" } });
const addLabel = addAction.createSpan({ cls: "px-filled-label", text: "Add" });
addAction.createDiv({ cls: "px-loader" });

function chosenDue() {
    const option = WHEN.find(w => w.id === when);
    if (option.offset === null) return null;
    if (option.offset === undefined) {
        const parsed = Date.parse(dateInput.value + "T00:00:00");
        return isNaN(parsed) ? null : startOfDay(parsed);
    }
    return TODAY + option.offset * DAY;
}

async function addTask() {
    const value = makerInput.value.trim();
    if (!value || addAction.hasClass("busy")) return;
    const file = app.vault.getAbstractFileByPath(selfPath);
    if (!file) { new Notice("Cannot find this note to write into."); return; }

    addAction.addClass("busy");
    const due = chosenDue();
    const stamp = due === null ? "" : "  📅 " + iso(due);
    const line = "- [ ] " + value + stamp;

    const rewrite = (data) => {
        const heading = data.indexOf("\n## Tasks");
        if (heading === -1) return data.replace(/\s*$/, "") + "\n\n## Tasks\n" + line + "\n";
        const after = data.indexOf("\n", heading + 1);
        return data.slice(0, after + 1) + line + "\n" + data.slice(after + 1);
    };

    try {
        if (app.vault.process) await app.vault.process(file, rewrite);
        else await app.vault.modify(file, rewrite(await app.vault.read(file)));

        everyTask.unshift({
            task: { text: value + stamp, path: selfPath, line: -1, completed: false },
            due
        });
        makerInput.value = "";
        addLabel.textContent = "Added";
        await wait(700);
        addLabel.textContent = "Add";
        toggleMaker(false);
        renderChips();
        renderTasks();
        refreshMeter();
        countTo(leftToday());
        renderHeat();
    } catch (e) {
        new Notice("Could not add that task.");
        console.error(e);
    }
    addAction.removeClass("busy");
}

press(addAction, addTask);
makerInput.onkeydown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); addTask(); }
    else if (e.key === "Escape") toggleMaker(false);
};


// ── Settings — where the list should look, and what colour it wears
const tuner = agenda.createDiv({ cls: "px-sheet px-inner-sheet" });
const tunerInner = tuner.createDiv({ cls: "px-sheet-inner" });
tunerInner.createDiv({ cls: "px-sheet-label", text: "Where to look for tasks" });
const sourceSeg = tunerInner.createDiv({ cls: "px-segmented", attr: { role: "radiogroup" } });

function renderSource() {
    const hadFocus = sourceSeg.contains(document.activeElement);
    sourceSeg.innerHTML = "";
    ["here", "vault", "both"].forEach(id => {
        const seg = sourceSeg.createDiv({
            cls: "px-segment" + (id === source ? " selected" : ""),
            attr: { role: "radio", tabindex: "0", "aria-checked": String(id === source) }
        });
        if (id === source) icon(seg, "check", "px-icon px-segment-check");
        seg.createSpan({ cls: "px-segment-label", text: SOURCE_LABELS[id] });
        press(seg, () => {
            source = id;
            localStorage.setItem(LS.source, id);
            renderSource();
            if (!openIn(filter)) filter = ORDER.find(k => openIn(k)) || filter;
            renderChips();
            renderTasks();
            refreshMeter();
            countTo(leftToday());
        });
    });
    if (hadFocus) { const picked = sourceSeg.querySelector(".selected"); if (picked) picked.focus(); }
}
renderSource();

tunerInner.createDiv({ cls: "px-sheet-label px-sheet-label-gap", text: "Colour" });
const swatches = tunerInner.createDiv({ cls: "px-swatches", attr: { role: "radiogroup", "aria-label": "Colour" } });

// Each swatch shows its seed's primary, secondary and tertiary — the
// same three-part circle Android uses for wallpaper colours.
function renderSwatches() {
    const hadFocus = swatches.contains(document.activeElement);
    swatches.innerHTML = "";
    TONES.forEach(option => {
        const { hue, chroma } = seedOf(option.id);
        const p = tone(0.7, 0.14 * chroma, hue);
        const s = tone(0.62, 0.05 * chroma, hue);
        const t = tone(0.64, 0.1 * chroma, hue - 60);
        const picked = option.id === toneId;
        const swatch = swatches.createDiv({
            cls: "px-swatch" + (picked ? " selected" : ""),
            attr: { role: "radio", tabindex: "0", "aria-checked": String(picked), "aria-label": option.label, title: option.label }
        });
        const fill = swatch.createDiv({ cls: "px-swatch-fill" });
        fill.style.background =
            "linear-gradient(to bottom, " + p + " 50%, transparent 50%), " +
            "linear-gradient(to right, " + s + " 50%, " + t + " 50%)";
        if (picked) icon(swatch, "check", "px-icon px-swatch-check");
        else if (option.hue === undefined) icon(swatch, "sparkles");
        press(swatch, () => {
            toneId = option.id;
            localStorage.setItem(LS.tone, option.id);
            applyTone();
            renderSwatches();
        });
    });
    if (hadFocus) { const picked = swatches.querySelector(".selected"); if (picked) picked.focus(); }
}
renderSwatches();

// Theme or accent changed in Obsidian — rebuild the palette to match.
try {
    dv.component.registerEvent(app.workspace.on("css-change", () => { applyTone(); renderSwatches(); }));
} catch (e) {}

let makerOpen = false, tunerOpen = false;
function toggleMaker(force) {
    makerOpen = force === undefined ? !makerOpen : force;
    if (makerOpen) toggleTuner(false);
    maker.toggleClass("open", makerOpen);
    addBtn.toggleClass("active", makerOpen);
    if (makerOpen) setTimeout(() => makerInput.focus(), 160);
}
function toggleTuner(force) {
    tunerOpen = force === undefined ? !tunerOpen : force;
    if (tunerOpen) toggleMaker(false);
    tuner.toggleClass("open", tunerOpen);
    tuneBtn.toggleClass("active", tunerOpen);
}
press(addBtn, () => toggleMaker());
press(tuneBtn, () => toggleTuner());


// ── The list itself ───────────────────────────────────────────────
const agendaList = agenda.createDiv({ cls: "px-list" });
const fadeAgenda = watchOverflow(agendaList);

// Line numbers go stale the moment a note is edited (adding a task above
// shifts everything), so trust the number only if the text is still there.
function findTaskLine(lines, entry) {
    const want = String(entry.task.text).trim();
    const holds = (line) => line !== undefined && /\[[ xX]\]/.test(line) && (!want || line.includes(want));
    if (entry.task.line >= 0 && holds(lines[entry.task.line])) return entry.task.line;
    return want ? lines.findIndex(holds) : -1;
}

async function writeTask(entry, finished) {
    const file = app.vault.getAbstractFileByPath(entry.task.path);
    if (!file) return true;
    let found = true;
    const rewrite = (data) => {
        const lines = data.split("\n");
        const at = findTaskLine(lines, entry);
        if (at < 0) { found = false; return data; }
        lines[at] = finished
            ? lines[at].replace(/\[ \]/, "[x]")
            : lines[at].replace(/\[[xX]\]/, "[ ]");
        entry.task.line = at;
        return lines.join("\n");
    };
    try {
        if (app.vault.process) await app.vault.process(file, rewrite);
        else await app.vault.modify(file, rewrite(await app.vault.read(file)));
        if (!found) new Notice("That task has moved or changed — refresh the dashboard.");
        return found;
    } catch (e) {
        new Notice("Could not update that task.");
        console.error(e);
        return false;
    }
}

let settling = false;

async function commitTask(entry, row) {
    if (settling) return;
    settling = true;
    const finished = !entry.task.completed;

    row.addClass("committing");
    if (finished) row.addClass("striking");

    entry.task.completed = finished;
    renderChips();
    refreshMeter();
    countTo(leftToday());

    await wait(560);
    row.addClass("leaving");
    await wait(240);

    const ok = await writeTask(entry, finished);
    if (!ok) {
        entry.task.completed = !finished;
        renderChips();
        refreshMeter();
        countTo(leftToday());
    }
    settling = false;
    renderTasks();
}

function renderTasks() {
    agendaList.innerHTML = "";
    agendaTitle.textContent = LABELS[filter];

    const set = visible().filter(BUCKETS[filter]);
    const pending = set.filter(t => !t.task.completed);
    const done = set.filter(t => t.task.completed);

    if (!pending.length && (!showDone || !done.length)) {
        const empty = agendaList.createDiv({ cls: "px-empty" });
        icon(empty, "coffee", "px-icon px-shape-icon px-empty-icon");
        empty.createDiv({ cls: "px-empty-text", text: set.length ? "Everything here is done." : "No tasks in this list." });
        fadeAgenda();
        return;
    }

    const draw = (entry, muted, index) => {
        const row = agendaList.createDiv({ cls: "px-task" + (muted ? " done" : "") });
        row.style.setProperty("--px-stagger", Math.min(index, 6) * 26 + "ms");

        const box = row.createDiv({ cls: "px-check", attr: { role: "checkbox", tabindex: "0", "aria-checked": String(!!entry.task.completed), "aria-label": clean(entry.task.text) || "Task" } });
        box.innerHTML = '<svg viewBox="0 0 24 24" class="px-check-mark"><path d="M5 12.5 10 17.5 19 7.5"/></svg>';
        press(box, (e) => { e.stopPropagation(); commitTask(entry, row); });

        const text = row.createDiv({ cls: "px-task-text" });
        const title = text.createDiv({ cls: "px-task-title" });
        title.createSpan({ cls: "px-task-label", text: clean(entry.task.text) || "Untitled task" });

        const where = text.createDiv({ cls: "px-task-where" });
        where.createSpan({ cls: "px-task-file", text: entry.task.path.split("/").pop().replace(/\.md$/, "") });
        if (entry.due !== null) {
            where.createSpan({
                cls: "px-due" + (entry.due < TODAY && !entry.task.completed ? " late" : ""),
                text: dateLabel(entry.due)
            });
        }
        row.onclick = () => { if (entry.task.line >= 0) openNote(entry.task.path); };
    };

    let index = 0;
    pending.slice(0, 40).forEach(entry => draw(entry, false, index++));
    if (showDone) done.slice(0, 20).forEach(entry => draw(entry, true, index++));
    fadeAgenda();
}


// ── Activity — one square per day, twenty-six weeks back ────────────
const WEEKS = 26;
const heatCard = left.createDiv({ cls: "px-card" });
const heatHead = heatCard.createDiv({ cls: "px-heat-head" });
heatHead.createDiv({ cls: "px-card-title px-card-title-flat", text: "Activity" });
const heatNote = heatHead.createDiv({ cls: "px-heat-note" });
const heatGrid = heatCard.createDiv({ cls: "px-heat" });
const heatDetail = heatCard.createDiv({ cls: "px-heat-detail" });
const heatBody = heatDetail.createDiv({ cls: "px-heat-detail-inner" });
let dayFiles = {};
let pickedDay = null;

function showDay(stamp, cell) {
    heatGrid.querySelectorAll(".px-picked").forEach(el => el.removeClass("px-picked"));

    if (pickedDay === stamp) {
        pickedDay = null;
        heatDetail.removeClass("open");
        return;
    }
    pickedDay = stamp;
    cell.addClass("px-picked");

    const files = dayFiles[iso(stamp)] || [];
    heatBody.innerHTML = "";
    heatDetail.addClass("open");

    const head = heatBody.createDiv({ cls: "px-detail-head" });
    head.createSpan({
        cls: "px-detail-date",
        text: new Date(stamp).toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })
    });
    head.createSpan({
        cls: "px-detail-count",
        text: files.length ? files.length + (files.length === 1 ? " note touched" : " notes touched") : "a quiet day"
    });

    const list = heatBody.createDiv({ cls: "px-detail-list" });
    files.slice(0, 30).forEach(file => {
        const row = list.createDiv({ cls: "px-detail-row", attr: { role: "link", tabindex: "0" } });
        row.createSpan({ cls: "px-detail-name", text: file.basename });
        row.createSpan({ cls: "px-detail-time", text: relTime(file.stat.mtime) });
        press(row, () => openNote(file.path));
    });
}

const heatLegend = heatCard.createDiv({ cls: "px-heat-legend" });
heatLegend.createSpan({ text: "Less" });
const legendCells = heatLegend.createDiv({ cls: "px-heat-legend-cells" });
[0, 1, 2, 3, 4].forEach(level => legendCells.createDiv({ cls: "px-cell px-l" + level }));
heatLegend.createSpan({ text: "More" });

function renderHeat() {
    heatGrid.innerHTML = "";
    const counts = {};
    dayFiles = {};
    for (const file of app.vault.getMarkdownFiles()) {
        const key = iso(startOfDay(file.stat.mtime));
        counts[key] = (counts[key] || 0) + 1;
        (dayFiles[key] = dayFiles[key] || []).push(file);
    }

    const weekday = (new Date(TODAY).getDay() + 6) % 7;
    const monday = TODAY - weekday * DAY;
    const start = monday - (WEEKS - 1) * 7 * DAY;

    let total = 0, peak = 1;
    for (let i = 0; i < WEEKS * 7; i++) {
        const stamp = start + i * DAY;
        if (stamp > TODAY) continue;
        const value = counts[iso(stamp)] || 0;
        total += value;
        peak = Math.max(peak, value);
    }

    for (let week = 0; week < WEEKS; week++) {
        for (let day = 0; day < 7; day++) {
            const stamp = start + (week * 7 + day) * DAY;
            if (stamp > TODAY) {
                heatGrid.createDiv({ cls: "px-cell px-void" });
                continue;
            }
            const value = counts[iso(stamp)] || 0;
            const level = value === 0 ? 0 : Math.min(4, Math.ceil(value / peak * 4));
            const cell = heatGrid.createDiv({
                cls: "px-cell px-l" + level + (stamp === TODAY ? " px-now" : ""),
                attr: { title: new Date(stamp).toLocaleDateString() }
            });
            cell.style.setProperty("--px-cell-delay", Math.min(week * 14, 260) + "ms");
            cell.onclick = () => showDay(stamp, cell);
        }
    }
    heatNote.textContent = total + (total === 1 ? " edit" : " edits") + " in " + WEEKS + " weeks";
}


// ── Jump to — a Material button group ─────────────────────────────
const actions = side.createDiv({ cls: "px-card" });
actions.createDiv({ cls: "px-card-title", text: "Jump to" });
const group = actions.createDiv({ cls: "px-group" });
[
    { label: "Daily", glyph: "calendar-days", ids: ["daily-notes", "periodic-notes:open-daily-note"] },
    { label: "Search", glyph: "search", ids: ["global-search:open"] },
    { label: "Graph", glyph: "git-fork", ids: ["graph:open"] },
    { label: "New", glyph: "file-plus", ids: ["file-explorer:new-file"] }
].forEach(action => {
    const button = group.createDiv({ cls: "px-button", attr: { role: "button", tabindex: "0" } });
    icon(button, action.glyph, "px-icon px-button-icon");
    button.createSpan({ cls: "px-button-label", text: action.label });
    press(button, () => run(...action.ids));
});


// ── Where you left off ────────────────────────────────────────────
const recentCard = side.createDiv({ cls: "px-card" });
recentCard.createDiv({ cls: "px-card-title", text: "Where you left off" });
const recentList = recentCard.createDiv({ cls: "px-recent" });

app.vault.getMarkdownFiles()
    .sort((a, b) => b.stat.mtime - a.stat.mtime)
    .slice(0, 12)
    .forEach(file => {
        const row = recentList.createDiv({ cls: "px-recent-row", attr: { role: "link", tabindex: "0" } });
        row.createDiv({ cls: "px-recent-title", text: file.basename });
        row.createDiv({ cls: "px-recent-time", text: relTime(file.stat.mtime) });
        press(row, () => openNote(file.path));
    });
watchOverflow(recentList)();


// ── A picture on the wall — any image from the vault or your device ──
const mediaCard = side.createDiv({ cls: "px-card px-media-card" });
const frame = mediaCard.createDiv({ cls: "px-frame" });
const mediaEdit = frame.createDiv({ cls: "px-frame-edit", attr: { role: "button", tabindex: "0", "aria-label": "Change image" } });
icon(mediaEdit, "image");

// Until you pin something yourself, the Pixel wallpaper hangs here.
const DEFAULT_MEDIA = "images/pixel-wall.jpg";
const IMAGE_EXT = ["png", "jpg", "jpeg", "gif", "webp", "avif", "svg", "bmp"];
const storedMedia = () => { const v = localStorage.getItem(LS.media); return v === null ? DEFAULT_MEDIA : v; };
const resourceOf = (file) => { try { return app.vault.getResourcePath(file); } catch (e) { return ""; } };

function resolveMedia(raw) {
    const text = String(raw || "")
        .trim()
        .replace(/^!?\[\[/, "")
        .replace(/\]\]$/, "")
        .split("|")[0]
        .trim();
    if (!text) return null;
    let file = app.vault.getAbstractFileByPath(text);
    if (!file) {
        try { file = app.metadataCache.getFirstLinkpathDest(text, selfPath); } catch (e) {}
    }
    return file || null;
}

// The picker: search, a grid of every image in the vault, and an
// escape hatch to bring one in from the computer.
const mediaPicker = mediaCard.createDiv({ cls: "px-media-row" });
const pickerInner = mediaPicker.createDiv({ cls: "px-media-picker" });

const searchField = pickerInner.createDiv({ cls: "px-field px-field-sm" });
icon(searchField, "search", "px-icon px-field-icon");
const searchInput = searchField.createEl("input", {
    cls: "px-input",
    attr: { type: "text", placeholder: "Search your images", spellcheck: "false" }
});

const thumbs = pickerInner.createDiv({ cls: "px-thumbs" });
const pickerActions = pickerInner.createDiv({ cls: "px-picker-actions" });
const uploadBtn = pickerActions.createDiv({ cls: "px-tonal px-tonal-icon", attr: { role: "button", tabindex: "0" } });
icon(uploadBtn, "upload");
uploadBtn.createSpan({ text: "From your device" });
const clearBtn = pickerActions.createDiv({ cls: "px-text-btn", attr: { role: "button", tabindex: "0" } });
clearBtn.createSpan({ text: "Remove" });

const fileInput = pickerInner.createEl("input", { attr: { type: "file", accept: "image/*", hidden: "" } });

const vaultImages = () => app.vault.getFiles()
    .filter(f => IMAGE_EXT.includes(String(f.extension).toLowerCase()))
    .sort((a, b) => b.stat.mtime - a.stat.mtime);

function renderThumbs() {
    thumbs.innerHTML = "";
    const query = searchInput.value.trim().toLowerCase();
    const current = resolveMedia(storedMedia());
    const list = vaultImages().filter(f => !query || f.path.toLowerCase().includes(query)).slice(0, 60);

    if (!list.length) {
        thumbs.createDiv({
            cls: "px-thumbs-empty",
            text: query ? "No image matches “" + searchInput.value.trim() + "”." : "No images in your vault yet — bring one in from your device."
        });
        return;
    }
    list.forEach((file, i) => {
        const picked = current && current.path === file.path;
        const thumb = thumbs.createDiv({
            cls: "px-thumb" + (picked ? " selected" : ""),
            attr: { role: "button", tabindex: "0", title: file.path, "aria-label": file.basename }
        });
        thumb.style.setProperty("--px-stagger", Math.min(i, 12) * 18 + "ms");
        thumb.createEl("img", { attr: { src: resourceOf(file), alt: "", loading: "lazy" } });
        if (picked) icon(thumb, "check", "px-icon px-thumb-check");
        press(thumb, () => pickMedia(file.path));
    });
}

function pickMedia(path) {
    localStorage.setItem(LS.media, path);
    renderMedia();
    openPicker(false);
}

// Copy a file from the computer into the vault's attachment folder.
async function importImage(file) {
    if (!file || !/^image\//.test(file.type)) { new Notice("That is not an image."); return; }
    try {
        const data = await file.arrayBuffer();
        let path = "";
        try { path = await app.fileManager.getAvailablePathForAttachment(file.name, selfPath); } catch (e) {}
        if (!path) {
            path = file.name;
            for (let n = 1; app.vault.getAbstractFileByPath(path); n++) path = file.name.replace(/(\.[^.]+)?$/, " " + n + "$1");
        }
        await app.vault.createBinary(path, data);
        pickMedia(path);
        new Notice("Added " + path.split("/").pop() + " to your vault.");
    } catch (e) {
        new Notice("Could not bring that image in.");
        console.error(e);
    }
}

function renderMedia() {
    frame.querySelectorAll(":scope > *:not(.px-frame-edit)").forEach(el => el.remove());
    frame.onclick = null;
    const raw = storedMedia();
    const file = resolveMedia(raw);

    if (!file) {
        frame.removeClass("filled");
        const blank = frame.createDiv({ cls: "px-frame-blank" });
        icon(blank, "image", "px-icon px-shape-icon px-frame-icon");
        blank.createDiv({
            cls: "px-frame-hint",
            text: raw.trim() ? "That image is no longer in your vault" : "Pin a photo or gif — or drop one here"
        });
        const pick = blank.createDiv({ cls: "px-tonal", attr: { role: "button", tabindex: "0" } });
        pick.createSpan({ text: raw.trim() ? "Pick another" : "Choose one" });
        press(pick, (e) => { e.stopPropagation(); openPicker(true); });
        return;
    }

    frame.createEl("img", { cls: "px-media", attr: { src: resourceOf(file), alt: file.basename } });
    const veil = frame.createDiv({ cls: "px-frame-veil" });
    veil.createDiv({ cls: "px-frame-caption", text: file.basename });
    frame.addClass("filled");
    frame.onclick = () => openNote(file.path);
}

function openPicker(force) {
    const open = force === undefined ? !mediaCard.hasClass("editing") : force;
    mediaCard.toggleClass("editing", open);
    mediaEdit.toggleClass("active", open);
    if (open) {
        searchInput.value = "";
        renderThumbs();
        setTimeout(() => searchInput.focus(), 140);
    }
}

searchInput.oninput = renderThumbs;
searchInput.onkeydown = (e) => {
    if (e.key === "Escape") openPicker(false);
    else if (e.key === "Enter") {
        e.preventDefault();
        const first = thumbs.querySelector(".px-thumb");
        if (first) first.click();
    }
};
press(uploadBtn, () => fileInput.click());
fileInput.onchange = () => { if (fileInput.files && fileInput.files[0]) importImage(fileInput.files[0]); fileInput.value = ""; };
press(clearBtn, () => pickMedia(""));
press(mediaEdit, (e) => { e.stopPropagation(); openPicker(); });

// Drop a picture straight onto the frame.
frame.ondragover = (e) => { e.preventDefault(); frame.addClass("dropping"); };
frame.ondragleave = () => frame.removeClass("dropping");
frame.ondrop = (e) => {
    e.preventDefault();
    frame.removeClass("dropping");
    const file = e.dataTransfer && [...e.dataTransfer.files].find(f => /^image\//.test(f.type));
    if (file) importImage(file);
};

renderMedia();


// ── Shelf — bookmarks, or the notes everything points at ──────────
function bookmarked() {
    try {
        const plugin = app.internalPlugins.getPluginById("bookmarks");
        if (!plugin || !plugin.enabled) return [];
        const out = [];
        const walk = (items) => (items || []).forEach(item => {
            if (item.type === "file") out.push({ title: item.title || item.path.split("/").pop().replace(/\.md$/, ""), path: item.path });
            else if (item.type === "group") walk(item.items);
        });
        walk(plugin.instance.items);
        return out;
    } catch (e) { return []; }
}

function hubs() {
    const inbound = {};
    const resolved = app.metadataCache.resolvedLinks || {};
    for (const src in resolved) {
        for (const dst in resolved[src]) {
            if (src !== dst) inbound[dst] = (inbound[dst] || 0) + resolved[src][dst];
        }
    }
    return Object.entries(inbound)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([path, count]) => ({
            title: path.split("/").pop().replace(/\.md$/, ""),
            path,
            note: count + (count === 1 ? " link in" : " links in")
        }));
}

const marks = bookmarked().slice(0, 4);
const shelfItems = marks.length ? marks : hubs();

if (shelfItems.length) {
    const shelf = root.createDiv({ cls: "px-shelf" });
    shelf.createDiv({ cls: "px-card-title", text: marks.length ? "Bookmarked" : "Most linked" });
    const rail = shelf.createDiv({ cls: "px-rail" });
    shelfItems.forEach(item => {
        const tile = rail.createDiv({ cls: "px-tile", attr: { role: "link", tabindex: "0" } });
        tile.createDiv({ cls: "px-tile-wash" });
        icon(tile, marks.length ? "bookmark" : "link", "px-icon px-shape-icon px-badge-icon");
        const meta = tile.createDiv({ cls: "px-tile-meta" });
        meta.createDiv({ cls: "px-tile-title", text: item.title });
        meta.createDiv({ cls: "px-tile-note", text: item.note || item.path.replace(/\.md$/, "") });
        icon(tile, "arrow-up-right", "px-icon px-tile-arrow");
        press(tile, () => openNote(item.path));
    });
}


renderWhen();
renderChips();
renderTasks();
renderHeat();
measure();
refreshMeter();
```
