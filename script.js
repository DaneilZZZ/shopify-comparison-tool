const comparisonColumns = document.querySelector("#comparison-columns");
const comparisonRows = document.querySelector("#comparison-rows");
const comparisonSettings = document.querySelector("#comparison-settings");
const comparisonPreview = document.querySelector("#comparison-preview");
const comparisonOutput = document.querySelector("#comparison-output");
const comparisonStatus = document.querySelector("#comparison-status");
const comparisonAddRow = document.querySelector("#comparison-add-row");
const comparisonReset = document.querySelector("#comparison-reset");
const comparisonCopy = document.querySelector("#comparison-copy");
const comparisonExportJpg = document.querySelector("#comparison-export-jpg");

const createDefaults = () => ({
  appearance: {
    featuredStyle: "raised",
  },
  columns: [
    { name: "Havnby FlatCore", tone: "normal", imageUrl: "", imageData: "" },
    { name: "Outdoor Car Mattress", tone: "normal", imageUrl: "", imageData: "" },
    { name: "Brand-Made Mattress", tone: "normal", imageUrl: "", imageData: "" },
    { name: "Other Camp Pads", tone: "muted", imageUrl: "", imageData: "" },
  ],
  rows: [
    {
      label: "Vehicle Fit",
      values: [
        { type: "yes", text: "" },
        { type: "yes", text: "" },
        { type: "yes", text: "" },
        { type: "no", text: "" },
      ],
    },
    {
      label: "Sleep Flat",
      values: [
        { type: "yes", text: "" },
        { type: "no", text: "" },
        { type: "no", text: "" },
        { type: "no", text: "" },
      ],
    },
    {
      label: "Thickness",
      values: [
        { type: "text", text: '7.5"' },
        { type: "text", text: '~4"' },
        { type: "text", text: '~3"' },
        { type: "muted", text: '2"-4"' },
      ],
    },
    {
      label: "Material",
      values: [
        { type: "text", text: "Odor-free TPU" },
        { type: "text", text: "Oxford+TPU base" },
        { type: "text", text: "Polyester exterior" },
        { type: "no", text: "" },
      ],
    },
    {
      label: "Side Sleeper Friendly",
      values: [
        { type: "yes", text: "" },
        { type: "text", text: "Adjustable firmness only" },
        { type: "no", text: "" },
        { type: "no", text: "" },
      ],
    },
    {
      label: "Setup Time",
      values: [
        { type: "text", text: "80 sec, built-in pump" },
        { type: "text", text: "External pump" },
        { type: "text", text: "External pump" },
        { type: "muted", text: "Self-Inflates & AirRollBag" },
      ],
    },
    {
      label: "Packed Size",
      values: [
        { type: "text", text: "Gym bag" },
        { type: "text", text: "Big carry bag" },
        { type: "text", text: "Fits sub-trunk" },
        { type: "muted", text: "Bulky" },
      ],
    },
    {
      label: "Leak & Puncture Resistant",
      values: [
        { type: "yes", text: "" },
        { type: "yes", text: "" },
        { type: "yes", text: "" },
        { type: "no", text: "" },
      ],
    },
  ],
});

const clone = (value) => JSON.parse(JSON.stringify(value));
const needsText = (type) => type === "text" || type === "muted";
const getColumnImage = (column) => (column.imageUrl || "").trim() || column.imageData || "";
const getFeaturedClassName = () =>
  `hb-compare__featured hb-compare__featured--${state.appearance.featuredStyle}`;

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const snippetStyle = `<style>
  .hb-compare,.hb-compare *{box-sizing:border-box}
  .hb-compare{--card:#ffffff;--line:#ddd2c2;--text:#25211c;--muted:#80786e;--featured:#efe7d9;--yes:#648b2b;--no:#b53030;color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
  .hb-compare__card{padding:18px;border-radius:22px;background:var(--card);box-shadow:0 10px 24px rgba(82,64,36,.1)}
  .hb-compare__scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
  .hb-compare__table{width:100%;min-width:760px;border-collapse:separate;border-spacing:0}
  .hb-compare__table th,.hb-compare__table td{padding:14px 16px;text-align:center;vertical-align:middle;font-size:14px}
  .hb-compare__table thead th{border-bottom:1px solid var(--line)}
  .hb-compare__table tbody td{border-bottom:1px solid var(--line)}
  .hb-compare__table tbody tr:last-child td{border-bottom:none}
  .hb-compare__table th:first-child,.hb-compare__table td:first-child{width:220px;text-align:left;color:var(--muted);font-size:13px;font-weight:600}
  .hb-compare__head{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:66px;gap:10px}
  .hb-compare__media{width:52px;height:52px;overflow:hidden;border:1px solid var(--line);border-radius:14px;background:#faf7f2}
  .hb-compare__media img{display:block;width:100%;height:100%;object-fit:contain}
  .hb-compare__name{color:var(--text);font-size:14px;font-weight:700;line-height:1.3}
  .hb-compare__name--muted{color:var(--muted);font-weight:600}
  .hb-compare__featured{background:var(--featured)}
  .hb-compare__featured--warm{background:var(--featured)}
  .hb-compare__featured--raised{position:relative;z-index:1;background:rgba(255,255,255,.96);border-left:1px solid rgba(196,178,148,.42);border-right:1px solid rgba(196,178,148,.42);box-shadow:0 12px 24px rgba(98,75,42,.12)}
  .hb-compare__featured--glass{position:relative;z-index:1;background:rgba(255,255,255,.46);border-left:1px solid rgba(255,255,255,.62);border-right:1px solid rgba(255,255,255,.62);box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 10px 24px rgba(84,64,36,.08);backdrop-filter:blur(14px)}
  .hb-compare__featured--clean{background:rgba(255,255,255,.82);border-left:1px solid rgba(221,210,194,.95);border-right:1px solid rgba(221,210,194,.95)}
  .hb-compare__table thead .hb-compare__featured--raised,.hb-compare__table thead .hb-compare__featured--glass,.hb-compare__table thead .hb-compare__featured--clean{border-top-left-radius:18px;border-top-right-radius:18px}
  .hb-compare__table tbody tr:last-child .hb-compare__featured--raised,.hb-compare__table tbody tr:last-child .hb-compare__featured--glass,.hb-compare__table tbody tr:last-child .hb-compare__featured--clean{border-bottom-left-radius:18px;border-bottom-right-radius:18px}
  .hb-compare__icon{width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;color:#fff;font-size:13px;font-weight:700;line-height:1}
  .hb-compare__icon--yes{background:var(--yes)}
  .hb-compare__icon--no{background:var(--no)}
  .hb-compare__value{color:var(--text);font-weight:600}
  .hb-compare__muted{color:var(--muted)}
  @media (max-width:767px){
    .hb-compare__card{padding:14px}
    .hb-compare__table th,.hb-compare__table td{padding:12px 10px}
    .hb-compare__table th:first-child,.hb-compare__table td:first-child{width:170px}
  }
</style>`;

let state = clone(createDefaults());

const renderValue = (value) => {
  if (value.type === "yes") {
    return '<span class="hb-compare__icon hb-compare__icon--yes" aria-label="Yes">✓</span>';
  }

  if (value.type === "no") {
    return '<span class="hb-compare__icon hb-compare__icon--no" aria-label="No">×</span>';
  }

  if (value.type === "muted") {
    return `<span class="hb-compare__muted">${escapeHtml(value.text)}</span>`;
  }

  return `<span class="hb-compare__value">${escapeHtml(value.text)}</span>`;
};

const renderMarkup = () => `
  <div class="hb-compare">
    <div class="hb-compare__card">
      <div class="hb-compare__scroll">
        <table class="hb-compare__table" aria-label="Camp mattress comparison table">
          <thead>
            <tr>
              <th scope="col"></th>
              ${state.columns
                .map(
                  (column, index) => `
                    <th scope="col" class="${index === 0 ? getFeaturedClassName() : ""}">
                      <div class="hb-compare__head">
                        ${
                          getColumnImage(column)
                            ? `<div class="hb-compare__media"><img src="${escapeHtml(getColumnImage(column))}" alt="${escapeHtml(column.name)}" /></div>`
                            : ""
                        }
                        <div class="hb-compare__name ${column.tone === "muted" ? "hb-compare__name--muted" : ""}">
                          ${escapeHtml(column.name)}
                        </div>
                      </div>
                    </th>
                  `
                )
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${state.rows
              .map(
                (row) => `
                  <tr>
                    <td>${escapeHtml(row.label)}</td>
                    ${row.values
                      .map(
                        (value, index) => `
                          <td class="${index === 0 ? getFeaturedClassName() : ""}">
                            ${renderValue(value)}
                          </td>
                        `
                      )
                      .join("")}
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
  </div>
`;

const renderSnippet = () => `${snippetStyle}

${renderMarkup()}`;

const renderSettings = () => {
  comparisonSettings.innerHTML = `
    <strong>Featured column style</strong>
    <div class="comparison-field">
      <label for="featured-style">Highlight look</label>
      <select id="featured-style" data-action="featured-style">
        <option value="raised" ${state.appearance.featuredStyle === "raised" ? "selected" : ""}>Elevated shadow</option>
        <option value="glass" ${state.appearance.featuredStyle === "glass" ? "selected" : ""}>Glass</option>
        <option value="clean" ${state.appearance.featuredStyle === "clean" ? "selected" : ""}>Clean white</option>
        <option value="warm" ${state.appearance.featuredStyle === "warm" ? "selected" : ""}>Warm tint</option>
      </select>
      <small>Pick a quieter look for the key column without removing emphasis.</small>
    </div>
  `;
};

const setStatus = (text) => {
  comparisonStatus.textContent = text;
};

const renderColumns = () => {
  comparisonColumns.innerHTML = state.columns
    .map(
      (column, index) => `
        <article class="comparison-column-card ${index === 0 ? "is-featured" : ""}">
          <strong>Column ${index + 1}${index === 0 ? " · Featured" : ""}</strong>
          <div class="comparison-column-media">
            <div class="comparison-image-row">
              ${
                getColumnImage(column)
                  ? `<div class="comparison-image-thumb"><img src="${escapeHtml(getColumnImage(column))}" alt="${escapeHtml(column.name)}" /></div>`
                  : ""
              }
              ${
                getColumnImage(column)
                  ? `<button class="comparison-image-clear" type="button" data-action="column-image-clear" data-index="${index}">Clear image</button>`
                  : ""
              }
            </div>
            <div class="comparison-field">
              <label for="column-image-url-${index}">Image URL</label>
              <input
                id="column-image-url-${index}"
                type="text"
                value="${escapeHtml(column.imageUrl || "")}"
                placeholder="https://cdn.shopify.com/..."
                data-action="column-image-url"
                data-index="${index}"
              />
              <small>Best for Shopify. Use a hosted URL if possible.</small>
            </div>
            <div class="comparison-field">
              <label for="column-image-file-${index}">Upload image</label>
              <input
                id="column-image-file-${index}"
                type="file"
                accept="image/*"
                data-action="column-image-file"
                data-index="${index}"
              />
              <small>Auto-compress to small WebP before inserting into the snippet.</small>
            </div>
          </div>
          <div class="comparison-column-grid">
            <div class="comparison-field">
              <label for="column-name-${index}">Product name</label>
              <input
                id="column-name-${index}"
                type="text"
                value="${escapeHtml(column.name)}"
                data-action="column-name"
                data-index="${index}"
              />
            </div>
            <div class="comparison-field">
              <label for="column-tone-${index}">Name tone</label>
              <select id="column-tone-${index}" data-action="column-tone" data-index="${index}">
                <option value="normal" ${column.tone === "normal" ? "selected" : ""}>Normal</option>
                <option value="muted" ${column.tone === "muted" ? "selected" : ""}>Muted</option>
              </select>
            </div>
          </div>
        </article>
      `
    )
    .join("");
};

const renderRows = () => {
  comparisonRows.innerHTML = state.rows
    .map(
      (row, rowIndex) => `
        <article class="comparison-row-card ${rowIndex === 0 ? "is-featured" : ""}">
          <div class="comparison-row-top">
            <div class="comparison-field">
              <label for="row-label-${rowIndex}">Row label</label>
              <input
                id="row-label-${rowIndex}"
                type="text"
                value="${escapeHtml(row.label)}"
                data-action="row-label"
                data-row-index="${rowIndex}"
              />
            </div>
            <button class="comparison-row-remove" type="button" data-action="row-remove" data-row-index="${rowIndex}">
              Remove row
            </button>
          </div>
          <div class="comparison-row-grid">
            ${row.values
              .map(
                (value, valueIndex) => `
                  <div class="comparison-field">
                    <label for="row-${rowIndex}-value-${valueIndex}">Column ${valueIndex + 1}</label>
                    <select
                      id="row-${rowIndex}-value-${valueIndex}"
                      data-action="row-value-type"
                      data-row-index="${rowIndex}"
                      data-value-index="${valueIndex}"
                    >
                      <option value="yes" ${value.type === "yes" ? "selected" : ""}>Yes</option>
                      <option value="no" ${value.type === "no" ? "selected" : ""}>No</option>
                      <option value="text" ${value.type === "text" ? "selected" : ""}>Text</option>
                      <option value="muted" ${value.type === "muted" ? "selected" : ""}>Muted text</option>
                    </select>
                    <input
                      class="comparison-value-input"
                      type="text"
                      placeholder="Custom text"
                      value="${escapeHtml(value.text)}"
                      ${needsText(value.type) ? "" : "hidden"}
                      data-action="row-value-text"
                      data-row-index="${rowIndex}"
                      data-value-index="${valueIndex}"
                    />
                  </div>
                `
              )
              .join("")}
          </div>
        </article>
      `
    )
    .join("");
};

const refreshOutput = () => {
  comparisonPreview.innerHTML = renderMarkup();
  comparisonOutput.value = renderSnippet();
};

const renderAll = () => {
  renderSettings();
  renderColumns();
  renderRows();
  refreshOutput();
};

const resetTool = () => {
  state = clone(createDefaults());
  renderAll();
  setStatus("Reset");
};

const addRow = () => {
  state.rows.push({
    label: "New feature",
    values: [
      { type: "text", text: "Value" },
      { type: "text", text: "Value" },
      { type: "text", text: "Value" },
      { type: "muted", text: "Value" },
    ],
  });
  renderAll();
  setStatus("Row added");
};

const copySnippet = async () => {
  try {
    await navigator.clipboard.writeText(comparisonOutput.value);
    comparisonCopy.textContent = "Copied";
    setStatus("Snippet copied");
    window.setTimeout(() => {
      comparisonCopy.textContent = "Copy snippet";
    }, 1400);
  } catch {
    comparisonOutput.focus();
    comparisonOutput.select();
    setStatus("Copy manually");
  }
};

const loadCanvasImage = (src) =>
  new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });

const wrapText = (context, text, maxWidth) => {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";

  if (!words.length) {
    return [""];
  }

  words.forEach((word) => {
    const nextLine = line ? `${line} ${word}` : word;

    if (context.measureText(nextLine).width <= maxWidth || !line) {
      line = nextLine;
      return;
    }

    lines.push(line);
    line = word;
  });

  if (line) {
    lines.push(line);
  }

  return lines;
};

const drawRoundRect = (context, x, y, width, height, radius) => {
  const safeRadius = clamp(radius, 0, Math.min(width, height) / 2);

  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
};

const drawWrappedText = (context, text, x, y, maxWidth, lineHeight, align = "center") => {
  const lines = wrapText(context, text, maxWidth);
  context.textAlign = align;

  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });

  return lines.length * lineHeight;
};

const drawCellBackground = (context, x, y, width, height, isFeatured) => {
  if (!isFeatured) {
    return;
  }

  const style = state.appearance.featuredStyle;

  if (style === "warm") {
    context.fillStyle = "#efe7d9";
    context.fillRect(x, y, width, height);
    return;
  }

  if (style === "glass") {
    const gradient = context.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, "rgba(255,255,255,0.78)");
    gradient.addColorStop(1, "rgba(239,231,217,0.46)");
    context.fillStyle = gradient;
    context.fillRect(x, y, width, height);
    context.strokeStyle = "rgba(255,255,255,0.85)";
    context.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);
    return;
  }

  if (style === "clean") {
    context.fillStyle = "#fbfaf7";
    context.fillRect(x, y, width, height);
    context.strokeStyle = "#e0d6c7";
    context.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);
    return;
  }

  context.save();
  context.shadowColor = "rgba(98,75,42,0.16)";
  context.shadowBlur = 18;
  context.shadowOffsetY = 8;
  context.fillStyle = "#fffefd";
  context.fillRect(x + 2, y, width - 4, height);
  context.restore();
  context.strokeStyle = "rgba(196,178,148,0.52)";
  context.strokeRect(x + 2.5, y + 0.5, width - 5, height - 1);
};

const drawStatusIcon = (context, x, y, type) => {
  const radius = 12;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fillStyle = type === "yes" ? "#648b2b" : "#b53030";
  context.fill();

  context.fillStyle = "#ffffff";
  context.font = "700 15px Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(type === "yes" ? "✓" : "×", x, y + (type === "yes" ? -1 : 0));
};

const renderJpgToCanvas = async () => {
  const scale = 2;
  const labelWidth = 220;
  const columnWidth = 150;
  const padding = 28;
  const headerHeight = 126;
  const rowHeight = 64;
  const tableWidth = labelWidth + state.columns.length * columnWidth;
  const tableHeight = headerHeight + state.rows.length * rowHeight;
  const canvasWidth = tableWidth + padding * 2;
  const canvasHeight = tableHeight + padding * 2;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const images = await Promise.all(state.columns.map((column) => loadCanvasImage(getColumnImage(column))));

  canvas.width = canvasWidth * scale;
  canvas.height = canvasHeight * scale;
  context.scale(scale, scale);
  context.fillStyle = "#f6f1e8";
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  context.save();
  context.shadowColor = "rgba(82,64,36,0.10)";
  context.shadowBlur = 22;
  context.shadowOffsetY = 10;
  drawRoundRect(context, padding, padding, tableWidth, tableHeight, 22);
  context.fillStyle = "#ffffff";
  context.fill();
  context.restore();

  context.save();
  drawRoundRect(context, padding, padding, tableWidth, tableHeight, 22);
  context.clip();

  state.columns.forEach((column, index) => {
    const x = padding + labelWidth + index * columnWidth;
    const isFeatured = index === 0;
    drawCellBackground(context, x, padding, columnWidth, tableHeight, isFeatured);
  });

  context.strokeStyle = "#ddd2c2";
  context.lineWidth = 1;

  for (let rowIndex = 0; rowIndex <= state.rows.length; rowIndex += 1) {
    const y = padding + headerHeight + rowIndex * rowHeight;
    context.beginPath();
    context.moveTo(padding + 18, y);
    context.lineTo(padding + tableWidth - 18, y);
    context.stroke();
  }

  state.columns.forEach((column, index) => {
    const x = padding + labelWidth + index * columnWidth;
    const centerX = x + columnWidth / 2;
    const image = images[index];

    if (image) {
      const imgSize = 52;
      const imgX = centerX - imgSize / 2;
      const imgY = padding + 22;
      drawRoundRect(context, imgX, imgY, imgSize, imgSize, 14);
      context.fillStyle = "#faf7f2";
      context.fill();
      const ratio = Math.min(imgSize / image.width, imgSize / image.height);
      const drawWidth = image.width * ratio;
      const drawHeight = image.height * ratio;
      context.drawImage(
        image,
        centerX - drawWidth / 2,
        imgY + imgSize / 2 - drawHeight / 2,
        drawWidth,
        drawHeight
      );
    }

    context.fillStyle = column.tone === "muted" ? "#80786e" : "#25211c";
    context.font = "700 14px Arial, sans-serif";
    context.textBaseline = "top";
    drawWrappedText(context, column.name, centerX, padding + (image ? 82 : 48), columnWidth - 26, 18);
  });

  state.rows.forEach((row, rowIndex) => {
    const y = padding + headerHeight + rowIndex * rowHeight;
    const centerY = y + rowHeight / 2;

    context.fillStyle = "#80786e";
    context.font = "700 13px Arial, sans-serif";
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.fillText(row.label, padding + 18, centerY);

    row.values.forEach((value, valueIndex) => {
      const x = padding + labelWidth + valueIndex * columnWidth;
      const centerX = x + columnWidth / 2;

      if (value.type === "yes" || value.type === "no") {
        drawStatusIcon(context, centerX, centerY, value.type);
        return;
      }

      context.fillStyle = value.type === "muted" ? "#80786e" : "#25211c";
      context.font = "700 14px Arial, sans-serif";
      context.textBaseline = "middle";
      const lines = wrapText(context, value.text, columnWidth - 30);
      const startY = centerY - ((lines.length - 1) * 18) / 2;
      context.textAlign = "center";
      lines.forEach((line, index) => {
        context.fillText(line, centerX, startY + index * 18);
      });
    });
  });

  context.restore();
  return canvas;
};

const exportJpg = async () => {
  setStatus("Exporting");

  try {
    const canvas = await renderJpgToCanvas();
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setStatus("Export failed");
          return;
        }

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "comparison-table.jpg";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);
        setStatus("JPG exported");
      },
      "image/jpeg",
      0.92
    );
  } catch {
    setStatus("Export failed");
  }
};

const compressImageFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("read-failed"));
    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error("image-load-failed"));
      image.onload = () => {
        const maxSize = 72;
        const ratio = Math.min(maxSize / image.width, maxSize / image.height, 1);
        const width = Math.max(1, Math.round(image.width * ratio));
        const height = Math.max(1, Math.round(image.height * ratio));
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("canvas-failed"));
          return;
        }

        canvas.width = width;
        canvas.height = height;
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/webp", 0.78));
      };

      image.src = typeof reader.result === "string" ? reader.result : "";
    };

    reader.readAsDataURL(file);
  });

const handleInput = (event) => {
  const { action, index, rowIndex, valueIndex } = event.target.dataset;
  if (!action) return;
  if (action === "column-image-file") return;

  if (action === "column-image-url") {
    state.columns[Number(index)].imageUrl = event.target.value;
  }

  if (action === "featured-style") {
    state.appearance.featuredStyle = event.target.value;
  }

  if (action === "column-name") {
    state.columns[Number(index)].name = event.target.value;
  }

  if (action === "column-tone") {
    state.columns[Number(index)].tone = event.target.value;
  }

  if (action === "row-label") {
    state.rows[Number(rowIndex)].label = event.target.value;
  }

  if (action === "row-value-type") {
    state.rows[Number(rowIndex)].values[Number(valueIndex)].type = event.target.value;
    renderAll();
  } else if (action === "row-value-text") {
    state.rows[Number(rowIndex)].values[Number(valueIndex)].text = event.target.value;
    refreshOutput();
  } else {
    refreshOutput();
  }

  setStatus("Updated");
};

const handleClick = (event) => {
  const removeButton = event.target.closest("[data-action='row-remove']");
  const clearImageButton = event.target.closest("[data-action='column-image-clear']");

  if (clearImageButton) {
    const columnIndex = Number(clearImageButton.dataset.index);
    state.columns[columnIndex].imageUrl = "";
    state.columns[columnIndex].imageData = "";
    renderAll();
    setStatus("Image cleared");
    return;
  }

  if (!removeButton) return;

  state.rows.splice(Number(removeButton.dataset.rowIndex), 1);
  renderAll();
  setStatus("Row removed");
};

const handleFileChange = async (event) => {
  const { action, index } = event.target.dataset;
  if (action !== "column-image-file") return;

  const file = event.target.files && event.target.files[0];
  if (!file) return;

  try {
    const compressed = await compressImageFile(file);
    state.columns[Number(index)].imageData = compressed;
    renderAll();
    setStatus("Image compressed");
  } catch {
    setStatus("Image failed");
  }
};

comparisonColumns.addEventListener("input", handleInput);
comparisonColumns.addEventListener("change", handleInput);
comparisonColumns.addEventListener("change", handleFileChange);
comparisonColumns.addEventListener("click", handleClick);
comparisonSettings.addEventListener("input", handleInput);
comparisonSettings.addEventListener("change", handleInput);
comparisonRows.addEventListener("input", handleInput);
comparisonRows.addEventListener("change", handleInput);
comparisonRows.addEventListener("click", handleClick);
comparisonAddRow.addEventListener("click", addRow);
comparisonReset.addEventListener("click", resetTool);
comparisonCopy.addEventListener("click", copySnippet);
comparisonExportJpg.addEventListener("click", exportJpg);

renderAll();
