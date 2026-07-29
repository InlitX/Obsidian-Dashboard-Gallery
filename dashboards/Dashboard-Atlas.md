---
cssclasses:
  - dashboard-layout
---

```dataviewjs
// Atlas — a calm home dashboard for your vault.
// More dashboards → https://github.com/InlitX/Obsidian-Dashboard-Gallery

// ── Setup & saved state ───────────────────────────────────────────
const { setIcon } = require("obsidian");
const LS = { name: "atl-name", tag: "atl-active-tag", inbox: "atl-inbox", accent: "atl-accent" };

let userName  = localStorage.getItem(LS.name) || "there";
let activeTag = localStorage.getItem(LS.tag) || "__all__";
const inboxPath = localStorage.getItem(LS.inbox) || "Inbox.md";

const root = dv.container.createDiv({ cls: "atl atl-in" });

// Accent colour — blank means "follow Obsidian's own accent".
const ACCENTS = [
    { name: "Default", value: null },
    { name: "Blue",    value: "#3b82f6" },
    { name: "Violet",  value: "#8b5cf6" },
    { name: "Green",   value: "#10b981" },
    { name: "Amber",   value: "#f59e0b" },
    { name: "Rose",    value: "#f43f5e" }
];
let accent = localStorage.getItem(LS.accent) || "";
const applyAccent = (v) => v ? root.style.setProperty("--atl-accent", v) : root.style.removeProperty("--atl-accent");
applyAccent(accent);

const greeting = () => {
    const h = new Date().getHours();
    if (h < 5)  return "Good night";
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
};

const relTime = (d) => {
    if (!d) return "";
    const m = Math.floor((Date.now() - d.toMillis()) / 60000);
    if (m < 1)  return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const day = Math.floor(h / 24);
    if (day < 7) return `${day}d ago`;
    return d.toFormat("dd LLL");
};

const icon = (parent, name, fallback = "•") => {
    const el = parent.createDiv();
    try { setIcon(el, name); } catch (e) { el.textContent = fallback; }
    return el;
};


// ── Data helpers — small queries that feed each widget ────────────
function getTopTags(limit = 12) {
    const counts = {};
    for (const p of dv.pages()) {
        if (!p.file.tags) continue;
        for (const t of p.file.tags) counts[t] = (counts[t] || 0) + 1;
    }
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([tag, count]) => ({ tag, count }));
}

function getNotes(limit = 7) {
    let pages = dv.pages();
    if (activeTag !== "__all__") {
        pages = pages.where(p => p.file.tags && p.file.tags.includes(activeTag));
    }
    return pages.sort(p => p.file.mtime, "desc").slice(0, limit);
}

function getBookmarks(limit = 6) {
    try {
        const bm = app.internalPlugins.getPluginById("bookmarks");
        if (!bm || !bm.enabled) return [];
        const out = [];
        const walk = (arr) => (arr || []).forEach(it => {
            if (it.type === "file") out.push(it);
            else if (it.type === "group") walk(it.items);
        });
        walk(bm.instance.items);
        return out.slice(0, limit);
    } catch (e) { return []; }
}

function getOnThisDay(limit = 4) {
    const t = new Date();
    const mm = t.getMonth() + 1, dd = t.getDate(), yy = t.getFullYear();
    return dv.pages()
        .where(p => p.file.ctime && p.file.ctime.month === mm && p.file.ctime.day === dd && p.file.ctime.year !== yy)
        .sort(p => p.file.ctime, "desc")
        .slice(0, limit);
}

function getRecentlyOpened(limit = 6) {
    try {
        return (app.workspace.getLastOpenFiles() || [])
            .filter(p => p.endsWith(".md"))
            .slice(0, limit);
    } catch (e) { return []; }
}


// ── Header — today's date + an editable greeting ──────────────────
const head = root.createDiv({ cls: "atl-head" });
const now = new Date();
head.createDiv({
    cls: "atl-eyebrow",
    text: now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
});

const greet = head.createEl("h1", { cls: "atl-greet" });
greet.createSpan({ text: `${greeting()}, ` });
const nameEl = greet.createSpan({
    cls: "atl-name",
    text: userName,
    attr: { contenteditable: "true", spellcheck: "false" }
});
greet.createSpan({ text: "." });
nameEl.onblur = () => {
    const v = nameEl.textContent.trim();
    if (v) { userName = v; localStorage.setItem(LS.name, v); }
    else nameEl.textContent = userName;
};
nameEl.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); nameEl.blur(); } };

const picker = head.createDiv({ cls: "atl-accent-picker" });
const accentBtn = picker.createDiv({ cls: "atl-accent-btn", attr: { title: "Accent colour" } });
const currentDot = accentBtn.createDiv({ cls: "atl-accent-current" });
const paintCurrent = () => currentDot.style.background = accent || "var(--interactive-accent)";
paintCurrent();
try { setIcon(accentBtn.createDiv({ cls: "atl-accent-chev" }), "chevron-down"); } catch (e) {}

let accentMenu = null;
function closeAccentMenu() {
    if (!accentMenu) return;
    accentMenu.remove();
    accentMenu = null;
    document.removeEventListener("click", onAccentDoc, true);
}
function onAccentDoc(e) {
    if (!picker.contains(e.target)) closeAccentMenu();
}
accentBtn.onclick = (e) => {
    e.stopPropagation();
    if (accentMenu) { closeAccentMenu(); return; }
    accentMenu = picker.createDiv({ cls: "atl-accent-menu" });
    ACCENTS.forEach(a => {
        const dot = accentMenu.createDiv({ cls: "atl-swatch" + ((a.value || "") === accent ? " active" : ""), attr: { title: a.name } });
        dot.style.background = a.value || "var(--interactive-accent)";
        dot.onclick = () => {
            accent = a.value || "";
            localStorage.setItem(LS.accent, accent);
            applyAccent(accent);
            paintCurrent();
            closeAccentMenu();
        };
    });
    setTimeout(() => document.addEventListener("click", onAccentDoc, true), 0);
};


// ── Search + quick capture ────────────────────────────────────────
const topRow = root.createDiv({ cls: "atl-toprow" });
const search = topRow.createDiv({ cls: "atl-search" });
icon(search, "search");
search.createSpan({ text: "Search your vault…" });
search.createSpan({ cls: "atl-kbd", text: "⌘K" });
search.onclick = () => {
    try { app.commands.executeCommandById("global-search:open"); }
    catch (e) { app.commands.executeCommandById("switcher:open"); }
};

const capture = topRow.createDiv({ cls: "atl-capture" });
icon(capture, "pencil-line");
const capInput = capture.createEl("input", {
    cls: "atl-capture-input",
    attr: { type: "text", placeholder: "Capture a thought…" }
});
const capHint = capture.createSpan({ cls: "atl-capture-hint", text: "↵ to save" });

// Save the line to the inbox note (creating it the first time).
async function doCapture() {
    const text = capInput.value.trim();
    if (!text) return;
    try {
        let file = app.vault.getAbstractFileByPath(inboxPath);
        if (!file) file = await app.vault.create(inboxPath, "# Inbox\n");
        const ts = window.moment ? window.moment().format("YYYY-MM-DD HH:mm") : new Date().toLocaleString();
        await app.vault.append(file, `\n- ${text}  *(${ts})*`);
        capInput.value = "";
        capHint.textContent = "✓ saved";
        capHint.classList.add("ok");
        setTimeout(() => { capHint.textContent = "↵ to save"; capHint.classList.remove("ok"); }, 1600);
    } catch (e) {
        new Notice("Couldn't capture note.");
        console.error(e);
    }
}
capInput.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); doCapture(); } };


// ── Layout — left column for content, right for side widgets ──────
const main = root.createDiv({ cls: "atl-main" });
const colL = main.createDiv({ cls: "atl-col" });
const colR = main.createDiv({ cls: "atl-col" });


// ── Overview — quick counts for the vault ─────────────────────────
const tags = getTopTags();
const allTasks = dv.pages().file.tasks;
const openTasks = allTasks ? allTasks.where(t => !t.completed).length : 0;

const overview = colR.createDiv({ cls: "atl-section" });
overview.createDiv({ cls: "atl-section-head" })
    .createDiv({ cls: "atl-section-title", text: "Overview" });
const stats = overview.createDiv({ cls: "atl-stats atl-stats-card" });
[
    { num: dv.pages().length, lab: "Notes" },
    { num: tags.length,       lab: "Topics" },
    { num: openTasks,         lab: "Open tasks" }
].forEach(s => {
    const col = stats.createDiv();
    col.createDiv({ cls: "atl-stat-num", text: String(s.num) });
    col.createDiv({ cls: "atl-stat-lab", text: s.lab });
});


// ── Jump back in — the files you opened most recently ─────────────
const recentOpened = getRecentlyOpened();
if (recentOpened.length) {
    const sec = colR.createDiv({ cls: "atl-section" });
    sec.createDiv({ cls: "atl-section-head" })
        .createDiv({ cls: "atl-section-title", text: "Jump back in" });
    const strip = sec.createDiv({ cls: "atl-strip" });
    recentOpened.forEach(path => {
        const card = strip.createDiv({ cls: "atl-card" });
        try { setIcon(card.createDiv({ cls: "atl-card-icon" }), "corner-up-left"); } catch (e) {}
        card.createDiv({ cls: "atl-card-title", text: path.split("/").pop().replace(/\.md$/, "") });
        card.onclick = () => app.workspace.openLinkText(path, "", false);
    });
}


// ── Pinned — your Obsidian bookmarks ──────────────────────────────
const bookmarks = getBookmarks();
if (bookmarks.length) {
    const sec = colR.createDiv({ cls: "atl-section" });
    sec.createDiv({ cls: "atl-section-head" })
        .createDiv({ cls: "atl-section-title", text: "Pinned" });
    const cards = sec.createDiv({ cls: "atl-cards" });
    bookmarks.forEach(b => {
        const card = cards.createDiv({ cls: "atl-card" });
        try { setIcon(card.createDiv({ cls: "atl-card-icon" }), "bookmark"); } catch (e) {}
        const name = b.title || (b.path ? b.path.split("/").pop().replace(/\.md$/, "") : "Untitled");
        card.createDiv({ cls: "atl-card-title", text: name });
        card.onclick = () => app.workspace.openLinkText(b.path, "", false);
    });
}


// ── Topics — click a tag to filter the note list below ────────────
const tagSection = colL.createDiv({ cls: "atl-section" });
tagSection.createDiv({ cls: "atl-section-head" })
    .createDiv({ cls: "atl-section-title", text: "Browse by topic" });
const tagWrap = tagSection.createDiv({ cls: "atl-tags" });

function renderTags() {
    tagWrap.innerHTML = "";
    const allPill = tagWrap.createDiv({ cls: "atl-tag" + (activeTag === "__all__" ? " active" : "") });
    allPill.createSpan({ text: "All notes" });
    allPill.onclick = () => setTag("__all__");

    if (!tags.length) {
        tagWrap.createSpan({ cls: "atl-empty", attr: { style: "padding:6px 0;" }, text: "No tags yet — add #tags to your notes to browse them here." });
        return;
    }
    tags.forEach(({ tag, count }) => {
        const pill = tagWrap.createDiv({ cls: "atl-tag" + (activeTag === tag ? " active" : "") });
        pill.createSpan({ text: tag });
        pill.createSpan({ cls: "atl-count", text: String(count) });
        pill.onclick = () => setTag(tag);
    });
}

function setTag(tag) {
    activeTag = tag;
    localStorage.setItem(LS.tag, tag);
    renderTags();
    renderNotes();
}
renderTags();


// ── Note list — follows whichever topic is selected ───────────────
const noteSection = colL.createDiv({ cls: "atl-section" });
const noteHead = noteSection.createDiv({ cls: "atl-section-head" });
const noteTitle = noteHead.createDiv({ cls: "atl-section-title", text: "Recently edited" });
const moreBtn = noteHead.createDiv({ cls: "atl-section-action", text: "Open file explorer" });
moreBtn.onclick = () => { try { app.commands.executeCommandById("file-explorer:open"); } catch (e) {} };

const list = noteSection.createDiv({ cls: "atl-list" });

function renderNotes() {
    list.innerHTML = "";
    noteTitle.textContent = activeTag === "__all__" ? "Recently edited" : `Notes in ${activeTag}`;
    const notes = getNotes();
    if (!notes.length) {
        list.createDiv({ cls: "atl-empty", text: "Nothing here yet." });
        return;
    }
    notes.forEach(p => {
        const row = list.createDiv({ cls: "atl-row" });
        try { setIcon(row.createDiv({ cls: "atl-row-icon" }), "file-text"); } catch (e) {}
        const body = row.createDiv({ cls: "atl-row-body" });
        body.createDiv({ cls: "atl-row-title", text: p.file.name });
        body.createDiv({ cls: "atl-row-meta", text: p.file.folder || "Vault root" });
        row.createDiv({ cls: "atl-row-time", text: relTime(p.file.mtime) });
        try { setIcon(row.createDiv({ cls: "atl-row-arrow" }), "arrow-up-right"); } catch (e) {}
        row.onclick = () => app.workspace.openLinkText(p.file.path, "", false);
    });
}
renderNotes();


// ── On this day — notes from past years, hidden when empty ────────
const flashback = getOnThisDay();
if (flashback.length) {
    const sec = colR.createDiv({ cls: "atl-section" });
    sec.createDiv({ cls: "atl-section-head" })
        .createDiv({ cls: "atl-section-title", text: "On this day" });
    const fbList = sec.createDiv({ cls: "atl-list" });
    flashback.forEach(p => {
        const row = fbList.createDiv({ cls: "atl-row" });
        try { setIcon(row.createDiv({ cls: "atl-row-icon" }), "history"); } catch (e) {}
        const body = row.createDiv({ cls: "atl-row-body" });
        body.createDiv({ cls: "atl-row-title", text: p.file.name });
        const yrsAgo = new Date().getFullYear() - p.file.ctime.year;
        body.createDiv({ cls: "atl-row-meta", text: yrsAgo === 1 ? "1 year ago" : `${yrsAgo} years ago` });
        row.createDiv({ cls: "atl-row-time", text: p.file.ctime.toFormat("yyyy") });
        try { setIcon(row.createDiv({ cls: "atl-row-arrow" }), "arrow-up-right"); } catch (e) {}
        row.onclick = () => app.workspace.openLinkText(p.file.path, "", false);
    });
}


// ── Activity heatmap — one cell per day, shaded by edit count ─────
if (window.moment) {
    const weeks = 18;
    const today = window.moment().endOf("day");
    const start = window.moment().startOf("day").subtract(weeks * 7 - 1, "days").startOf("week");

    const counts = {};
    for (const p of dv.pages()) {
        if (!p.file.mtime) continue;
        const key = window.moment(p.file.mtime.toMillis()).format("YYYY-MM-DD");
        counts[key] = (counts[key] || 0) + 1;
    }

    const section = colL.createDiv({ cls: "atl-section" });
    const sh = section.createDiv({ cls: "atl-section-head" });
    sh.createDiv({ cls: "atl-section-title", text: "Activity" });
    const summary = sh.createDiv({ cls: "atl-section-action" });

    const heat = section.createDiv({ cls: "atl-heat-wrap" }).createDiv({ cls: "atl-heat" });

    let total = 0;
    const cur = start.clone();
    while (cur.isSameOrBefore(today, "day")) {
        const col = heat.createDiv({ cls: "atl-heat-col" });
        for (let d = 0; d < 7; d++) {
            if (cur.isAfter(today, "day")) {
                col.createDiv({ cls: "atl-heat-cell", attr: { style: "visibility:hidden" } });
                cur.add(1, "day");
                continue;
            }
            const c = counts[cur.format("YYYY-MM-DD")] || 0;
            total += c;
            const lvl = c === 0 ? 0 : c < 2 ? 1 : c < 4 ? 2 : c < 7 ? 3 : 4;
            col.createDiv({
                cls: "atl-heat-cell" + (lvl ? " atl-heat-l" + lvl : ""),
                attr: { title: `${c} edit${c !== 1 ? "s" : ""} · ${cur.format("MMM D, YYYY")}` }
            });
            cur.add(1, "day");
        }
    }
    summary.textContent = `${total} edits in ~4 months`;

    const legend = section.createDiv({ cls: "atl-heat-legend" });
    legend.createSpan({ text: "Less" });
    [0, 1, 2, 3, 4].forEach(l => legend.createDiv({ cls: "atl-heat-cell" + (l ? " atl-heat-l" + l : "") }));
    legend.createSpan({ text: "More" });
}


// ── Scratchpad — free text, auto-saved as you type ────────────────
const scratchSection = colR.createDiv({ cls: "atl-section" });
const scratchHead = scratchSection.createDiv({ cls: "atl-section-head" });
scratchHead.createDiv({ cls: "atl-section-title", text: "Scratchpad" });
const scratchStatus = scratchHead.createDiv({ cls: "atl-section-action", text: "Auto-saved" });
const scratch = scratchSection.createEl("textarea", {
    cls: "atl-scratch",
    attr: { placeholder: "A space for loose thoughts, drafts, anything…", spellcheck: "false" }
});
scratch.value = localStorage.getItem("atl-scratch") || "";
let scratchTimer;
scratch.oninput = () => {
    scratchStatus.textContent = "Saving…";
    clearTimeout(scratchTimer);
    scratchTimer = setTimeout(() => {
        localStorage.setItem("atl-scratch", scratch.value);
        scratchStatus.textContent = "Auto-saved";
    }, 400);
};


// ── Focus timer — a simple 25 / 15 / 5 minute pomodoro ────────────
const timerSection = colR.createDiv({ cls: "atl-section" });
timerSection.createDiv({ cls: "atl-section-head" })
    .createDiv({ cls: "atl-section-title", text: "Focus" });
const timer = timerSection.createDiv({ cls: "atl-timer" });

const timeEl = timer.createDiv({ cls: "atl-timer-time" });
const presetsWrap = timer.createDiv({ cls: "atl-timer-presets" });
const btns = timer.createDiv({ cls: "atl-timer-btns" });

let tMinutes = 25, tRemaining = 25 * 60, tInterval = null, tRunning = false;

function renderTime() {
    const m = Math.floor(tRemaining / 60), s = tRemaining % 60;
    timeEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    timeEl.classList.toggle("running", tRunning);
}

function stopTimer() {
    clearInterval(tInterval);
    tInterval = null;
    tRunning = false;
}

function tickTimer() {
    if (tRemaining <= 0) {
        stopTimer();
        renderTime();
        startBtn.textContent = "Start";
        new Notice("⏱️ Focus session complete — take a break.");
        return;
    }
    tRemaining--;
    renderTime();
}

[25, 15, 5].forEach(min => {
    const p = presetsWrap.createDiv({ cls: "atl-timer-preset" + (min === tMinutes ? " active" : ""), text: `${min}m` });
    p.onclick = () => {
        stopTimer();
        tMinutes = min;
        tRemaining = min * 60;
        startBtn.textContent = "Start";
        presetsWrap.querySelectorAll(".atl-timer-preset").forEach(el => el.classList.remove("active"));
        p.classList.add("active");
        renderTime();
    };
});

const startBtn = btns.createEl("button", { cls: "atl-btn primary", text: "Start" });
const resetBtn = btns.createEl("button", { cls: "atl-btn", text: "Reset" });

startBtn.onclick = () => {
    if (tRunning) {
        stopTimer();
        startBtn.textContent = "Resume";
        renderTime();
    } else {
        tRunning = true;
        startBtn.textContent = "Pause";
        renderTime();
        tInterval = setInterval(tickTimer, 1000);
    }
};
resetBtn.onclick = () => {
    stopTimer();
    tRemaining = tMinutes * 60;
    startBtn.textContent = "Start";
    renderTime();
};
renderTime();


// ── Mini calendar — browse months; a dot marks days with a daily note
if (window.moment) {
    const today = window.moment();
    let calMonth = today.clone().startOf("month");

    const dailyByDate = {};
    for (const f of app.vault.getMarkdownFiles()) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(f.basename)) (dailyByDate[f.basename] = dailyByDate[f.basename] || []).push(f);
    }

    let openPop = null, popCleanup = null;
    function closePop() {
        if (popCleanup) { popCleanup(); popCleanup = null; }
        if (openPop) { openPop.remove(); openPop = null; }
    }

    function showDayNotes(cell, dateStr, files) {
        closePop();
        const pop = document.body.createDiv({ cls: "atl-pop" });
        pop.createDiv({ cls: "atl-pop-head", text: window.moment(dateStr, "YYYY-MM-DD").format("dddd, MMM D") });
        files.forEach(f => {
            const row = pop.createDiv({ cls: "atl-pop-row" });
            try { setIcon(row, "calendar"); } catch (e) {}
            row.createSpan({ cls: "atl-pop-name", text: f.basename });
            row.onclick = () => { app.workspace.openLinkText(f.path, "", false); closePop(); };
        });
        const r = cell.getBoundingClientRect();
        pop.style.left = Math.max(12, Math.min(r.left, window.innerWidth - 244 - 12)) + "px";
        pop.style.top = (r.bottom + 6) + "px";
        openPop = pop;

        // dismiss when you click away or scroll the pane
        const onDoc = (ev) => { if (!pop.contains(ev.target)) closePop(); };
        const onScroll = () => closePop();
        popCleanup = () => {
            document.removeEventListener("click", onDoc, true);
            document.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onScroll);
        };
        setTimeout(() => {
            document.addEventListener("click", onDoc, true);
            document.addEventListener("scroll", onScroll, true);
            window.addEventListener("resize", onScroll);
        }, 0);
    }

    const calSection = colR.createDiv({ cls: "atl-section" });
    const calHead = calSection.createDiv({ cls: "atl-section-head" });
    calHead.createDiv({ cls: "atl-section-title", text: "Calendar" });

    const nav = calHead.createDiv({ cls: "atl-cal-nav" });
    const prevBtn = nav.createDiv({ cls: "atl-cal-nav-btn" });
    try { setIcon(prevBtn, "chevron-left"); } catch (e) { prevBtn.textContent = "‹"; }
    const navLabel = nav.createSpan({ cls: "atl-cal-nav-label" });
    const nextBtn = nav.createDiv({ cls: "atl-cal-nav-btn" });
    try { setIcon(nextBtn, "chevron-right"); } catch (e) { nextBtn.textContent = "›"; }

    const calBody = calSection.createDiv({ cls: "atl-cal" });

    function renderCalendar() {
        closePop();
        calBody.innerHTML = "";
        navLabel.textContent = calMonth.format("MMMM YYYY");

        const grid = calBody.createDiv({ cls: "atl-cal-grid" });
        ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].forEach(w => grid.createDiv({ cls: "atl-cal-wd", text: w }));
        for (let i = 0; i < calMonth.day(); i++) grid.createDiv({ cls: "atl-cal-day empty" });

        const isThisMonth = calMonth.isSame(today, "month");
        for (let d = 1; d <= calMonth.daysInMonth(); d++) {
            const cell = grid.createDiv({ cls: "atl-cal-day" });
            cell.createSpan({ cls: "atl-cal-num", text: String(d) });
            if (isThisMonth && d === today.date()) cell.classList.add("today");

            const dateStr = calMonth.clone().date(d).format("YYYY-MM-DD");
            const files = dailyByDate[dateStr];
            if (files && files.length) {
                cell.createDiv({ cls: "atl-cal-dot" });
                cell.classList.add("clickable");
                cell.setAttribute("title", "Daily note");
                cell.onclick = (e) => { e.stopPropagation(); showDayNotes(cell, dateStr, files); };
            }
        }
    }

    prevBtn.onclick = () => { calMonth = calMonth.clone().subtract(1, "month"); renderCalendar(); };
    nextBtn.onclick = () => { calMonth = calMonth.clone().add(1, "month"); renderCalendar(); };
    renderCalendar();
}
```
