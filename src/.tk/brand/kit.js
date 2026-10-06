/* Brand kit — export the TK mark at any size, format, background, margin.
 *
 * Single source of truth: every colour on this page is resolved at runtime
 * from the custom properties in ../../brand.css (core palette) and parsed
 * out of ../../styles.css (per-case accents). Nothing is hardcoded except
 * the glyph geometry and a fallback accent list, so the kit cannot drift
 * away from the live site the way it did before. */
(function () {
  "use strict";

  var PATHS = [
    "M165.586 458.605C146.232 458.605 131.256 453.31 120.658 442.721C110.52 432.131 " +
      "105.451 417.628 105.451 399.213V168.551H3.84479V120.899H105.451V0.733643H160.056" +
      "V120.899H270.648V168.551H160.056V390.925C160.056 404.737 166.737 411.643 180.101 " +
      "411.643H255.442V458.605H165.586Z",
    "M192.438 314.7C172.902 291.917 174.015 283.575 192.438 262.905L347.266 124.093H423.298" +
      "L235.983 288.457L428.828 461.799H353.487L192.438 314.7Z"
  ];

  /* Tight ink bounding box of the paths above — margins are measured from
     the glyph itself, not from stray padding in the source artboard. */
  var BOX = { x: 3.845, y: 0.734, w: 424.983, h: 461.065 };

  var SVG_NS = "http://www.w3.org/2000/svg";
  var ROOT = getComputedStyle(document.documentElement);

  function token(name) {
    return ROOT.getPropertyValue(name).trim();
  }

  /* ---------- colour helpers ---------- */

  function parseColor(value) {
    if (!value) { return null; }
    var text = String(value).trim().toLowerCase();
    var m = text.match(/^#([0-9a-f]{3,8})$/);
    if (m) {
      var h = m[1];
      if (h.length === 3 || h.length === 4) {
        h = h.split("").map(function (c) { return c + c; }).join("");
      }
      if (h.length !== 6 && h.length !== 8) { return null; }
      return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
        a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1
      };
    }
    m = text.match(/^rgba?\(([^)]+)\)$/);
    if (m) {
      var parts = m[1].split(/[,/\s]+/).filter(Boolean).map(parseFloat);
      if (parts.length < 3) { return null; }
      return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
    }
    return null;
  }

  function isOpaqueHex(value) {
    var c = parseColor(value);
    return !!c && c.a === 1 && /^#/.test(String(value).trim());
  }

  /* Composite over the page ground, then pick whichever of ink/paper reads
     better on top — so swatch labels stay legible without being hand-tuned. */
  function readableInk(value) {
    var c = parseColor(value);
    var ground = parseColor(token("--brand-color-paper")) || { r: 12, g: 16, b: 27, a: 1 };
    if (!c) { return token("--brand-color-ink"); }
    var a = c.a;
    var r = c.r * a + ground.r * (1 - a);
    var g = c.g * a + ground.g * (1 - a);
    var b = c.b * a + ground.b * (1 - a);
    function lin(v) {
      v = v / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    }
    var luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);

    /* Pick whichever ink actually contrasts better rather than guessing at a
       lightness threshold — mid-tones like ink-subtle sit either side of one. */
    function ratio(other) {
      var c2 = parseColor(other);
      if (!c2) { return 0; }
      var l2 = 0.2126 * lin(c2.r) + 0.7152 * lin(c2.g) + 0.0722 * lin(c2.b);
      var hi = Math.max(luminance, l2);
      var lo = Math.min(luminance, l2);
      return (hi + 0.05) / (lo + 0.05);
    }
    var light = token("--brand-color-ink");
    var dark = token("--brand-color-paper");
    return ratio(light) >= ratio(dark) ? light : dark;
  }

  function slug(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  /* ---------- palette, resolved from brand.css ---------- */

  var CORE = [
    { name: "Paper", varName: "--brand-color-paper" },
    { name: "Paper bright", varName: "--brand-color-paper-bright" },
    { name: "Surface", varName: "--brand-color-surface" },
    { name: "Surface strong", varName: "--brand-color-surface-strong" },
    { name: "Ink", varName: "--brand-color-ink" },
    { name: "Ink muted", varName: "--brand-color-ink-muted" },
    { name: "Ink subtle", varName: "--brand-color-ink-subtle" },
    { name: "Primary", varName: "--brand-color-primary" },
    { name: "Primary dark", varName: "--brand-color-primary-dark" },
    { name: "Primary deep", varName: "--brand-color-primary-deep" },
    { name: "Accent", varName: "--brand-color-accent" },
    { name: "Focus", varName: "--brand-color-focus" },
    { name: "Line", varName: "--brand-color-line" },
    { name: "Line strong", varName: "--brand-color-line-strong" }
  ];

  /* Layout-layer colour tokens live in styles.css, which this page does not
     load — they get parsed out of it instead. */
  var STYLES_TOKEN_LABELS = {
    "--card-border": "Card border",
    "--card-bg": "Card background"
  };

  /* Colourways for the mark. Fills are token-driven; white and black are
     deliberate literals for print and third-party placements. */
  var VARIANTS = [
    { key: "ink", name: "Mark — ink", varName: "--brand-color-ink", ground: "dark" },
    { key: "paper", name: "Mark — paper", varName: "--brand-color-paper", ground: "light" },
    { key: "primary", name: "Mark — primary", varName: "--brand-color-primary", ground: "dark" },
    { key: "accent", name: "Mark — accent", varName: "--brand-color-accent", ground: "dark" },
    { key: "white", name: "Mark — white", fill: "#ffffff", ground: "dark", note: "literal" },
    { key: "black", name: "Mark — black", fill: "#000000", ground: "light", note: "literal" }
  ];

  VARIANTS.forEach(function (v) {
    if (v.varName) { v.fill = token(v.varName); }
  });

  /* Backgrounds offered for export — the opaque brand tokens, plus the two
     literals, plus transparent (the default) and a custom picker. */
  var BG_TOKENS = [
    { label: "Paper", varName: "--brand-color-paper" },
    { label: "Paper bright", varName: "--brand-color-paper-bright" },
    { label: "Surface", varName: "--brand-color-surface" },
    { label: "Primary deep", varName: "--brand-color-primary-deep" },
    { label: "Primary dark", varName: "--brand-color-primary-dark" },
    { label: "Primary", varName: "--brand-color-primary" },
    { label: "Accent", varName: "--brand-color-accent" },
    { label: "Ink", varName: "--brand-color-ink" }
  ];

  /* Per-case accents. Parsed from styles.css at load; this list is the
     fallback used when the fetch is unavailable (e.g. file:// origins). */
  var ACCENT_FALLBACK = [
    { name: "Default", selector: ".case-body", accent: token("--brand-color-accent"),
      soft: "rgba(152, 137, 255, 0.16)" },
    { name: "Terminal (v1)", selector: ".case-body--terminal", accent: "#42f5b9",
      soft: "rgba(66, 245, 185, 0.1)" },
    { name: "Wedding", selector: ".case-body--wedding", accent: "#ff8e72",
      soft: "rgba(255, 142, 114, 0.15)" },
    { name: "JCVB", selector: ".case-body--jcvb", accent: "#c4b781",
      soft: "rgba(196, 183, 129, 0.14)" },
    { name: "Sports", selector: ".case-body--sports", accent: "#9fb8e8",
      soft: "rgba(159, 184, 232, 0.14)" },
    { name: "Reading", selector: ".case-body--reading", accent: "#aebf92",
      soft: "rgba(174, 191, 146, 0.12)" }
  ];

  var CASE_LABELS = {
    ".case-body": "Default",
    ".case-body--terminal": "Terminal (v1)",
    ".case-body--wedding": "Wedding",
    ".case-body--jcvb": "JCVB",
    ".case-body--sports": "Sports",
    ".case-body--reading": "Reading"
  };

  var els = {
    bg: document.getElementById("ctl-bg"),
    bgCustom: document.getElementById("ctl-bg-custom"),
    size: document.getElementById("ctl-size"),
    sizeCustom: document.getElementById("ctl-size-custom"),
    margin: document.getElementById("ctl-margin"),
    marginCustom: document.getElementById("ctl-margin-custom"),
    shape: document.getElementById("ctl-shape"),
    format: document.getElementById("ctl-format"),
    note: document.getElementById("ctl-note"),
    grid: document.getElementById("asset-grid"),
    swatches: document.getElementById("swatch-grid"),
    accents: document.getElementById("accent-grid"),
    source: document.getElementById("kit-source"),
    callout: document.getElementById("kit-callout")
  };

  /* ---------- settings ---------- */

  function settings() {
    var option = els.bg.options[els.bg.selectedIndex];
    var bg = els.bg.value;
    var bgLabel;
    if (bg === "custom") {
      bg = els.bgCustom.value;
      bgLabel = bg.replace("#", "");
    } else if (bg === "transparent") {
      bgLabel = "transparent";
    } else {
      bgLabel = slug(option.text);
    }

    var size = els.size.value === "custom"
      ? parseInt(els.sizeCustom.value, 10)
      : parseInt(els.size.value, 10);
    if (!isFinite(size) || size < 8) { size = 8; }
    if (size > 8192) { size = 8192; }

    var margin = els.margin.value === "custom"
      ? parseFloat(els.marginCustom.value) / 100
      : parseFloat(els.margin.value);
    if (!isFinite(margin) || margin < 0) { margin = 0; }
    if (margin > 0.45) { margin = 0.45; }

    var format = els.format.value;
    /* JPEG has no alpha — a transparent request would flatten to black,
       so flatten it to paper deliberately and say so. */
    var flattened = format === "jpeg" && bg === "transparent";
    if (flattened) { bg = token("--brand-color-paper"); bgLabel = "paper"; }

    return {
      bg: bg,
      bgLabel: bgLabel,
      transparent: bg === "transparent",
      size: size,
      margin: margin,
      square: els.shape.value === "square",
      format: format,
      flattened: flattened
    };
  }

  /* ---------- geometry ---------- */

  function layout(cfg) {
    var inv = 1 - 2 * cfg.margin;
    var cw, ch;
    if (cfg.square) {
      cw = ch = Math.max(BOX.w, BOX.h) / inv;
    } else {
      cw = BOX.w / inv;
      ch = BOX.h / inv;
    }
    var scale = Math.min((cw * inv) / BOX.w, (ch * inv) / BOX.h);
    var dw = BOX.w * scale;
    var dh = BOX.h * scale;
    return {
      cw: cw, ch: ch, scale: scale,
      tx: (cw - dw) / 2,
      ty: (ch - dh) / 2,
      outW: cfg.size,
      outH: Math.max(1, Math.round(cfg.size * (ch / cw)))
    };
  }

  function round(n) {
    return Math.round(n * 1000) / 1000;
  }

  function buildSvg(variant, cfg, sized) {
    var geo = layout(cfg);
    var attrs =
      'xmlns="' + SVG_NS + '" viewBox="0 0 ' + round(geo.cw) + " " + round(geo.ch) + '"';
    if (sized) {
      attrs += ' width="' + geo.outW + '" height="' + geo.outH + '"';
    }
    attrs += ' role="img" aria-label="Tim Kutcher mark"';

    var body = "";
    if (!cfg.transparent) {
      body += '<rect x="0" y="0" width="' + round(geo.cw) + '" height="' +
        round(geo.ch) + '" fill="' + cfg.bg + '"/>';
    }
    body += '<g transform="translate(' + round(geo.tx) + " " + round(geo.ty) +
      ") scale(" + round(geo.scale) + ") translate(" + -BOX.x + " " + -BOX.y + ')">';
    PATHS.forEach(function (d) {
      body += '<path d="' + d + '" fill="' + variant.fill + '"/>';
    });
    body += "</g>";

    return "<svg " + attrs + ">" + body + "</svg>";
  }

  function filename(variant, cfg) {
    var name = "tk-mark-" + variant.key;
    name += "-" + cfg.size + (cfg.square ? "sq" : "w");
    if (cfg.margin > 0) { name += "-m" + Math.round(cfg.margin * 100); }
    name += "-" + cfg.bgLabel;
    return name + "." + (cfg.format === "jpeg" ? "jpg" : cfg.format);
  }

  /* ---------- output ---------- */

  function saveBlob(name, blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.download = name;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
  }

  function rasterize(svgText, cfg, geo, done, fail) {
    var img = new Image();
    var url = URL.createObjectURL(new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }));
    img.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = geo.outW;
      canvas.height = geo.outH;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(function (blob) {
        if (blob) { done(blob); } else { fail("This browser can't encode " + cfg.format + "."); }
      }, "image/" + cfg.format, 0.95);
    };
    img.onerror = function () {
      URL.revokeObjectURL(url);
      fail("Could not render the mark for export.");
    };
    img.src = url;
  }

  function flash(button, label) {
    var original = button.getAttribute("data-label");
    button.textContent = label;
    button.setAttribute("data-state", "done");
    setTimeout(function () {
      button.textContent = original;
      button.removeAttribute("data-state");
    }, 1400);
  }

  function note(message) {
    els.note.textContent = message || "";
  }

  function copyText(text, onDone) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onDone, function () { legacyCopy(text, onDone); });
    } else {
      legacyCopy(text, onDone);
    }
  }

  function legacyCopy(text, onDone) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); onDone(); }
    catch (err) { note("Copy failed — select the SVG manually."); }
    ta.remove();
  }

  /* ---------- controls ---------- */

  function buildBackgroundOptions() {
    function add(value, label, selected) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      if (selected) { option.selected = true; }
      els.bg.appendChild(option);
    }
    add("transparent", "Transparent", true);
    BG_TOKENS.forEach(function (entry) {
      var value = token(entry.varName);
      if (isOpaqueHex(value)) { add(value, entry.label); }
    });
    add("#ffffff", "White");
    add("#000000", "Black");
    add("custom", "Custom…");
  }

  /* ---------- cards ---------- */

  var cards = [];

  function buildCards() {
    VARIANTS.forEach(function (variant) {
      var card = document.createElement("div");
      card.className = "asset-card";

      var preview = document.createElement("div");
      preview.className = "asset-preview";

      var meta = document.createElement("div");
      meta.className = "asset-meta";
      meta.innerHTML =
        '<p class="asset-name"></p><p class="asset-token"></p><p class="asset-filename"></p>';
      meta.querySelector(".asset-name").textContent = variant.name;

      var tokenLine = meta.querySelector(".asset-token");
      if (variant.varName) {
        tokenLine.innerHTML = "<b></b> · ";
        tokenLine.querySelector("b").textContent = variant.varName;
        tokenLine.appendChild(
          document.createTextNode(variant.fill + " · for " + variant.ground + " grounds"));
      } else {
        tokenLine.textContent = variant.fill + " · literal · for " + variant.ground + " grounds";
      }

      var actions = document.createElement("div");
      actions.className = "asset-actions";

      var dl = document.createElement("button");
      dl.type = "button";
      dl.className = "btn btn-primary";
      dl.setAttribute("data-label", "Download");
      dl.textContent = "Download";

      var copy = document.createElement("button");
      copy.type = "button";
      copy.className = "btn btn-ghost";
      copy.setAttribute("data-label", "Copy SVG");
      copy.textContent = "Copy SVG";

      actions.appendChild(dl);
      actions.appendChild(copy);
      card.appendChild(preview);
      card.appendChild(meta);
      card.appendChild(actions);
      els.grid.appendChild(card);

      cards.push({
        variant: variant,
        preview: preview,
        filenameEl: meta.querySelector(".asset-filename")
      });

      dl.addEventListener("click", function () {
        var cfg = settings();
        var name = filename(variant, cfg);
        var svgText = buildSvg(variant, cfg, true);
        if (cfg.format === "svg") {
          saveBlob(name, new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }));
          flash(dl, "Saved");
          return;
        }
        rasterize(svgText, cfg, layout(cfg), function (blob) {
          saveBlob(name, blob);
          flash(dl, "Saved");
        }, note);
      });

      copy.addEventListener("click", function () {
        var cfg = settings();
        copyText(buildSvg(variant, cfg, true), function () { flash(copy, "Copied"); });
      });
    });
  }

  function render() {
    var cfg = settings();
    cards.forEach(function (entry) {
      entry.preview.classList.toggle("is-transparent", cfg.transparent);
      entry.preview.innerHTML = buildSvg(entry.variant, cfg, false);
      entry.filenameEl.textContent = filename(entry.variant, cfg);
    });

    var geo = layout(cfg);
    var messages = [];
    messages.push(cfg.format === "svg"
      ? "SVG is vector — size just sets its nominal width."
      : geo.outW + " × " + geo.outH + " px.");
    if (cfg.flattened) {
      messages.push("JPEG has no transparency, so this exports on paper.");
    }
    note(messages.join(" "));
  }

  /* ---------- swatches ---------- */

  function swatch(container, name, value, sub, copyValue) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "swatch";
    button.style.background = value;
    button.style.color = readableInk(value);
    button.title = "Copy " + copyValue;
    button.innerHTML =
      '<span class="swatch-name"></span><span class="swatch-hex"></span><span class="swatch-var"></span>';
    button.querySelector(".swatch-name").textContent = name;
    button.querySelector(".swatch-hex").textContent = value;
    button.querySelector(".swatch-var").textContent = sub;
    button.addEventListener("click", function () {
      copyText(copyValue, function () { note("Copied " + copyValue + "."); });
    });
    container.appendChild(button);
    return button;
  }

  function buildCore() {
    CORE.forEach(function (item) {
      var value = token(item.varName);
      if (!value) { return; }
      swatch(els.swatches, item.name, value, "var(" + item.varName + ")", value);
    });
  }

  function describeSource(accentCount, parsed) {
    /* Count what actually rendered, not what was asked for. */
    var coreCount = els.swatches.querySelectorAll(".swatch").length;
    els.source.innerHTML =
      "colours resolved at runtime · <b>" + coreCount + "</b> palette tokens from " +
      "brand.css + styles.css · <b>" + accentCount + "</b> case accents " +
      (parsed ? "parsed from styles.css" : "from the built-in fallback list");
  }

  function buildAccents(list, parsed) {
    accentSnapshot = list;
    els.accents.innerHTML = "";
    list.forEach(function (item) {
      swatch(els.accents, item.name, item.accent,
        item.selector + "\n" + item.soft, item.accent);
    });
    describeSource(list.length, parsed);
  }

  /* Resolve a declaration value, following a single var() indirection so
     `--case-accent: var(--color-accent)` lands on a real colour. */
  function resolveValue(value) {
    var text = String(value).trim();
    if (/^var\(/.test(text)) {
      var ref = /var\(\s*(--[a-z0-9-]+)/i.exec(text);
      if (ref) {
        var resolved = token(ref[1]);
        if (resolved) { return resolved; }
      }
    }
    return text;
  }

  /* Pull --case-accent / --case-accent-soft and the :root layout colours
     straight out of the live stylesheet, so these sections track the site
     rather than mirroring it. */
  function loadAccents() {
    if (typeof fetch !== "function") {
      buildAccents(ACCENT_FALLBACK, false);
      return;
    }
    fetch("../../styles.css").then(function (response) {
      if (!response.ok) { throw new Error("styles.css " + response.status); }
      return response.text();
    }).then(function (css) {
      /* Strip CSS comments first. They contain no braces, so a comment
         sitting above a rule would otherwise be swallowed into its
         selector text and end up as the swatch label. */
      var clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
      var found = [];
      var re = /([^{}]+)\{([^{}]*)\}/g;
      var match;
      while ((match = re.exec(clean)) !== null) {
        var selectorText = match[1];
        var block = match[2];

        if (/^\s*:root\s*$/.test(selectorText)) {
          Object.keys(STYLES_TOKEN_LABELS).forEach(function (name) {
            var decl = new RegExp(
              name.replace(/[-]/g, "\\-") + ":\\s*([^;]+);").exec(block);
            if (!decl) { return; }
            var value = resolveValue(decl[1]);
            if (!parseColor(value)) { return; }
            swatch(els.swatches, STYLES_TOKEN_LABELS[name], value,
              "var(" + name + ") · styles.css", value);
          });
          continue;
        }

        if (selectorText.indexOf(".case-body") === -1) { continue; }
        var accent = /--case-accent:\s*([^;]+);/.exec(block);
        if (!accent) { continue; }
        var soft = /--case-accent-soft:\s*([^;]+);/.exec(block);
        var selector = selectorText.split(",").map(function (s) {
          return s.trim();
        }).filter(function (s) {
          return s.indexOf(".case-body") === 0;
        })[0];
        if (!selector) { continue; }
        var value = resolveValue(accent[1]);
        if (!parseColor(value)) { continue; }
        found.push({
          name: CASE_LABELS[selector] || selector.replace(".case-body--", ""),
          selector: selector,
          accent: value,
          soft: soft ? resolveValue(soft[1]) : "—"
        });
      }
      buildAccents(found.length ? found : ACCENT_FALLBACK, found.length > 0);
    }).catch(function () {
      buildAccents(ACCENT_FALLBACK, false);
    });
  }

  /* ---------- token export ---------- */

  /* Snapshot of exactly what this page resolved, so the Figma variable
     collection can be synced from the site's values instead of by eye. */
  var accentSnapshot = [];

  function tokensPayload() {
    var core = {};
    CORE.forEach(function (item) {
      var value = token(item.varName);
      if (value) { core[item.varName] = value; }
    });
    Object.keys(STYLES_TOKEN_LABELS).forEach(function (name) {
      var found = Array.prototype.filter.call(
        els.swatches.querySelectorAll(".swatch"), function (el) {
          return el.querySelector(".swatch-var").textContent.indexOf("var(" + name + ")") === 0;
        })[0];
      if (found) { core[name] = found.querySelector(".swatch-hex").textContent; }
    });
    var accents = {};
    accentSnapshot.forEach(function (item) {
      accents[item.selector] = { name: item.name, accent: item.accent, soft: item.soft };
    });
    var marks = {};
    VARIANTS.forEach(function (v) {
      marks[v.key] = { fill: v.fill, token: v.varName || null, ground: v.ground };
    });
    return {
      source: "tkutcher.com — brand.css + styles.css",
      generated: new Date().toISOString(),
      core: core,
      caseAccents: accents,
      markColorways: marks
    };
  }

  function wireTokenExport() {
    var copyBtn = document.getElementById("copy-tokens");
    var dlBtn = document.getElementById("download-tokens");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        copyText(JSON.stringify(tokensPayload(), null, 2), function () {
          flash(copyBtn, "Copied");
        });
      });
    }
    if (dlBtn) {
      dlBtn.addEventListener("click", function () {
        saveBlob("tkutcher-tokens.json", new Blob(
          [JSON.stringify(tokensPayload(), null, 2)], { type: "application/json" }));
        flash(dlBtn, "Saved");
      });
    }
  }

  /* ---------- wiring ---------- */

  function pairCustom(select, custom) {
    select.addEventListener("change", function () {
      custom.hidden = select.value !== "custom";
      if (!custom.hidden) { custom.focus(); }
      render();
    });
    custom.addEventListener("input", render);
  }

  buildBackgroundOptions();
  pairCustom(els.bg, els.bgCustom);
  pairCustom(els.size, els.sizeCustom);
  pairCustom(els.margin, els.marginCustom);
  els.shape.addEventListener("change", render);
  els.format.addEventListener("change", render);
  document.getElementById("kit-controls").addEventListener("submit", function (event) {
    event.preventDefault();
  });

  buildCards();
  buildCore();
  wireTokenExport();
  render();
  loadAccents();

  els.callout.innerHTML =
    "<b>Known gap:</b> the site has no true light mark — " +
    "<code>.brand-mark img</code> and <code>.icon-hero__logo</code> both render " +
    "<code>tk-logo--black.png</code> through <code>filter: invert(1)</code>. " +
    "Exporting <b>Mark — ink</b> and pointing those at it drops the filter hack " +
    "and gives the header a real transparent asset at the right colour.";
})();
