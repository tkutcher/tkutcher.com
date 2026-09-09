/* Brand kit — export the TK mark at any size, format, background, margin.
   The mark is described once, here, and every export (SVG and raster) is
   built from that same description so previews and downloads never drift. */
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

  var VARIANTS = [
    { key: "mark-ink", name: "Mark — ink", fill: "#111111", ground: "light" },
    { key: "mark-primary", name: "Mark — primary", fill: "#5e81ac", ground: "light" },
    { key: "mark-primary-deep", name: "Mark — primary deep", fill: "#334152", ground: "light" },
    { key: "mark-white", name: "Mark — white", fill: "#ffffff", ground: "dark" },
    { key: "mark-paper", name: "Mark — paper", fill: "#f5f3ee", ground: "dark" }
  ];

  var PALETTE = [
    { name: "Paper", varName: "--color-paper", ink: "#111111" },
    { name: "Paper bright", varName: "--color-paper-bright", ink: "#111111" },
    { name: "Ink", varName: "--color-ink", ink: "#ffffff" },
    { name: "Ink muted", varName: "--color-ink-muted", ink: "#ffffff" },
    { name: "Ink subtle", varName: "--color-ink-subtle", ink: "#ffffff" },
    { name: "Primary", varName: "--color-primary", ink: "#ffffff" },
    { name: "Primary dark", varName: "--color-primary-dark", ink: "#ffffff" },
    { name: "Primary deep", varName: "--color-primary-deep", ink: "#ffffff" },
    { name: "Focus", varName: "--color-focus", ink: "#ffffff" }
  ];

  var SVG_NS = "http://www.w3.org/2000/svg";

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
    swatches: document.getElementById("swatch-grid")
  };

  /* ---------- settings ---------- */

  function slug(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function settings() {
    var bg = els.bg.value;
    var bgLabel;
    if (bg === "custom") {
      bg = els.bgCustom.value;
      bgLabel = bg.replace("#", "");
    } else if (bg === "transparent") {
      bgLabel = "transparent";
    } else {
      bgLabel = slug(els.bg.options[els.bg.selectedIndex].text);
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
       so flatten it to white deliberately and say so. */
    var flattened = format === "jpeg" && bg === "transparent";
    if (flattened) { bg = "#ffffff"; bgLabel = "white"; }

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
      cw: cw,
      ch: ch,
      scale: scale,
      tx: (cw - dw) / 2,
      ty: (ch - dh) / 2,
      outW: cfg.size,
      outH: Math.max(1, Math.round(cfg.size * (ch / cw)))
    };
  }

  function round(n) {
    return Math.round(n * 1000) / 1000;
  }

  /* ---------- svg construction ---------- */

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
      body +=
        '<rect x="0" y="0" width="' + round(geo.cw) + '" height="' + round(geo.ch) +
        '" fill="' + cfg.bg + '"/>';
    }
    var transform =
      "translate(" + round(geo.tx) + " " + round(geo.ty) + ") " +
      "scale(" + round(geo.scale) + ") " +
      "translate(" + -BOX.x + " " + -BOX.y + ")";
    body += '<g transform="' + transform + '">';
    PATHS.forEach(function (d) {
      body += '<path d="' + d + '" fill="' + variant.fill + '"/>';
    });
    body += "</g>";

    return "<svg " + attrs + ">" + body + "</svg>";
  }

  function filename(variant, cfg) {
    var name = "tk-" + variant.key;
    name += "-" + cfg.size + (cfg.square ? "sq" : "w");
    if (cfg.margin > 0) {
      name += "-m" + Math.round(cfg.margin * 100);
    }
    name += "-" + cfg.bgLabel;
    return name + "." + (cfg.format === "jpeg" ? "jpg" : cfg.format);
  }

  /* ---------- download ---------- */

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
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      var mime = "image/" + cfg.format;
      canvas.toBlob(function (blob) {
        if (blob) { done(blob); } else { fail("This browser can't encode " + cfg.format + "."); }
      }, mime, 0.95);
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
    try { document.execCommand("copy"); onDone(); } catch (err) { note("Copy failed — select the SVG manually."); }
    ta.remove();
  }

  function note(message) {
    els.note.textContent = message || "";
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
        '<p class="type-title-medium asset-name"></p>' +
        '<p class="asset-hex"></p>' +
        '<p class="asset-filename"></p>';
      meta.querySelector(".asset-name").textContent = variant.name;
      meta.querySelector(".asset-hex").textContent =
        variant.fill + " · for " + variant.ground + " grounds";

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

      var entry = {
        variant: variant,
        preview: preview,
        filenameEl: meta.querySelector(".asset-filename")
      };
      cards.push(entry);

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
    if (cfg.format === "svg") {
      messages.push("SVG is vector — size just sets its nominal width.");
    } else {
      messages.push(geo.outW + " × " + geo.outH + " px.");
    }
    if (cfg.flattened) {
      messages.push("JPEG has no transparency, so this exports on white.");
    }
    note(messages.join(" "));
  }

  /* ---------- palette ---------- */

  function buildSwatches() {
    var root = getComputedStyle(document.documentElement);
    PALETTE.forEach(function (item) {
      var value = root.getPropertyValue(item.varName).trim();
      if (!value) { return; }
      var button = document.createElement("button");
      button.type = "button";
      button.className = "swatch";
      button.style.background = value;
      button.style.color = item.ink;
      button.title = "Copy " + value;
      button.innerHTML =
        '<span class="swatch-name"></span>' +
        '<span class="swatch-hex"></span>' +
        '<span class="swatch-var"></span>';
      button.querySelector(".swatch-name").textContent = item.name;
      button.querySelector(".swatch-hex").textContent = value;
      button.querySelector(".swatch-var").textContent = "var(" + item.varName + ")";
      button.addEventListener("click", function () {
        copyText(value, function () { note("Copied " + value + "."); });
      });
      els.swatches.appendChild(button);
    });
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

  pairCustom(els.bg, els.bgCustom);
  pairCustom(els.size, els.sizeCustom);
  pairCustom(els.margin, els.marginCustom);
  els.shape.addEventListener("change", render);
  els.format.addEventListener("change", render);
  document.getElementById("kit-controls").addEventListener("submit", function (event) {
    event.preventDefault();
  });

  buildCards();
  buildSwatches();
  render();
})();
