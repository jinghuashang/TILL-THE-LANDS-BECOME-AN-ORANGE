/* ============================================================
 * 直到大地变成一颗酸橙 · 夏日图片工坊
 * 纯前端图片编辑：上传照片 + 预设贴纸（可拖动 / 缩放 / 旋转）
 * UI 严格复刻官方《信使的工作》网页（见 DESIGN.md）
 * 缩放体系：html 字号 = min(视口宽/120, 视口高/67.5)px，全站 rem
 * ============================================================ */
'use strict';

(() => {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  /* ---------------- 预设贴纸清单 ---------------- */
  // 贴纸素材位于 assets/bc/，新增方法：把 PNG 放进去，在 PRESETS 里加一行
  const PRESETS = [
    { src: 'assets/bc/tilte.webp',              name: '活动标题 · 直到大地变成一颗酸橙', scale: 62 },
    { src: 'assets/bc/anjielilaxiaor.webp',     name: '安洁莉娜 · 夏日装扮', scale: 62 },
    { src: 'assets/bc/anjielilafeix.webp',      name: '安洁莉娜 · 飞行', scale: 60 },
    { src: 'assets/bc/anjielilahenaicha.webp',  name: '安洁莉娜 · 喝奶茶', scale: 60 },
    { src: 'assets/bc/anjielilatantou.webp',    name: '安洁莉娜 · 探头', scale: 60 },
  ];

  /* ---------------- 状态 ---------------- */
  const state = {
    photo: null,          // { img, aspect }
    showPhoto: true,
    bg: 'photo',          // 'photo' | hex 颜色
    items: [],            // { id, src, name, x, y, scale, rot }
    selId: null,
    nextId: 1,
    presets: [],          // { src, name, img }
    soundOn: true,
  };

  const BASE_W_RATIO = 0.42;      // 贴纸 scale=100% 时宽度 = 画布宽度的 42%
  const EXPORT_MAX = 1600;        // 导出最长边

  /* ---------------- DOM 引用 ---------------- */
  const screens = { home: $('#screen-home'), editor: $('#screen-editor') };
  const wrap = $('#canvasWrap');
  const photoLayer = $('#photoLayer');
  const stickersLayer = $('#stickersLayer');
  const hintEl = $('#canvasHint');
  const trayEl = $('#tray');
  const fileInput = $('#fileInput');
  const dropZone = $('#dropZone');
  const propEmpty = $('#propEmpty');
  const propBox = $('#propBox');
  const propName = $('#propName');
  const propScale = $('#propScale');
  const propRot = $('#propRot');
  const toastEl = $('#toast');

  /* ---------------- 舞台缩放：官方字体缩放体系（背景铺满视口，内容 rem 缩放） ---------------- */
  // 手机竖屏（窄且高）时自动旋转 90° 横屏显示，长边不再空占用：
  // 页面宽 = 视口高、页面高 = 视口宽，字号按旋转后的尺寸计算
  function isPhonePortrait() {
    return innerWidth < 768 && innerHeight > innerWidth;
  }
  function fitStage() {
    const rot = isPhonePortrait();
    document.body.classList.toggle('rotated', rot);
    const w = rot ? innerHeight : innerWidth;
    const h = rot ? innerWidth : innerHeight;
    document.documentElement.style.fontSize = Math.min(w / 120, h / 67.5) + 'px';
    document.body.classList.toggle('narrow-portrait', !rot && innerWidth < 720 && innerHeight > innerWidth);
    fitWrap();
    render();
  }
  addEventListener('resize', fitStage);

  // 画布 wrap 尺寸：按画布区可用空间与照片比例计算
  function fitWrap() {
    const frame = $('#dropZone .canvas-frame');
    if (!frame) return;
    const pad = 26;
    const fw = Math.max(60, frame.clientWidth - pad);
    const fh = Math.max(80, frame.clientHeight - pad);
    const aspect = state.photo ? state.photo.aspect : 3 / 4;
    let w, h;
    if (fw / fh > aspect) { h = fh; w = Math.round(fh * aspect); }
    else { w = fw; h = Math.round(fw / aspect); }
    wrap.style.width = w + 'px';
    wrap.style.height = h + 'px';
  }

  /* ---------------- 音效（WebAudio 轻音，官方头部的声音开关） ---------------- */
  let audioCtx = null;
  function blip(freq, dur, type = 'sine', gain = 0.06) {
    if (!state.soundOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(gain, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + dur);
    } catch (_) { /* 无声环境忽略 */ }
  }
  const sfx = { click: () => blip(660, 0.08), add: () => blip(880, 0.12, 'triangle'), del: () => blip(330, 0.12, 'triangle'), done: () => { blip(660, 0.1); setTimeout(() => blip(880, 0.14), 90); } };

  /* ---------------- 预加载预设资源 ---------------- */
  function loadPresets() {
    return Promise.all(PRESETS.map((p) => new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve({ src: p.src, name: p.name, img, scale: p.scale || 100 });
      img.onerror = () => { console.warn('预设贴纸加载失败:', p.src); resolve(null); };
      img.src = p.src;
    }))).then((list) => { state.presets = list.filter(Boolean); });
  }

  function presetBySrc(src) {
    const p = state.presets.find((p) => p.src === src);
    if (p) return p;
    const img = customImgs.get(src);
    if (img) return { src, name: '自定义贴纸', img };
    return null;
  }

  // 自定义贴纸：用户上传的 PNG/图片（src = objectURL）
  const customImgs = new Map();

  /* ---------------- 界面切换（官方淡入） ---------------- */
  function showScreen(name) {
    Object.entries(screens).forEach(([k, el]) => {
      if (k === name) { el.classList.remove('hidden'); requestAnimationFrame(() => el.classList.add('mGGvyM')); }
      else { el.classList.remove('mGGvyM'); el.classList.add('hidden'); }
    });
    if (name === 'editor') {
      fitWrap();
    }
  }

  /* ---------------- 贴纸渲染 ---------------- */
  function render() {
    const cw = wrap.clientWidth || 400;
    const showPhoto = state.photo && state.showPhoto && state.bg === 'photo';
    wrap.style.background = state.bg === 'photo' ? '#fff' : state.bg;
    photoLayer.style.display = showPhoto ? '' : 'none';
    hintEl.style.display = (state.photo || state.items.length) ? 'none' : '';

    stickersLayer.innerHTML = '';
    state.items.forEach((it) => {
      const p = presetBySrc(it.src);
      if (!p) return;
      const el = document.createElement('div');
      el.className = 'sticker' + (it.id === state.selId ? ' selected' : '');
      el.dataset.id = it.id;
      el.style.left = it.x + '%';
      el.style.top = it.y + '%';
      el.style.width = (cw * BASE_W_RATIO * it.scale / 100) + 'px';
      el.style.transform = `translate(-50%, -50%) rotate(${it.rot}deg)`;
      el.innerHTML =
        '<img draggable="false" alt="">' +
        '<div class="sel-ring"></div>' +
        '<div class="h h-rot" title="旋转"></div>' +
        '<div class="h h-scale" title="缩放"></div>' +
        '<div class="h h-del" title="删除"></div>';
      el.querySelector('img').src = p.img.src;
      stickersLayer.appendChild(el);
    });
    updatePropPanel();
    updateSwatches();
  }

  /* ---------------- 照片上传 ---------------- */
  function setPhoto(img) {
    state.photo = { img, aspect: img.naturalWidth / img.naturalHeight };
    wrap.style.aspectRatio = state.photo.aspect;
    photoLayer.src = img.src;
    photoLayer.style.display = state.showPhoto && state.bg === 'photo' ? '' : 'none';
    fitWrap();
  }

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      toast('请选择图片文件');
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setPhoto(img);
      toast('照片已上传，可以开始贴贴纸啦');
      render();
    };
    img.onerror = () => toast('图片读取失败，请换一张试试');
    img.src = url;
  }

  /* ---------------- 添加贴纸 ---------------- */
  function addSticker(preset) {
    const it = {
      id: state.nextId++,
      src: preset.src,
      name: preset.name,
      x: 50,
      y: 50,
      scale: preset.scale || 100,
      rot: 0,
    };
    const dupes = state.items.filter((i) => i.src === preset.src).length;
    if (dupes > 0) { it.x += dupes * 6; it.y += dupes * 6; }
    state.items.push(it);
    state.selId = it.id;
    sfx.add();
    render();
  }

  function removeSticker(id) {
    state.items = state.items.filter((i) => i.id !== id);
    if (state.selId === id) state.selId = null;
    sfx.del();
    render();
  }

  function duplicateSticker(id) {
    const src = state.items.find((i) => i.id === id);
    if (!src) return;
    state.items.push({ ...src, id: state.nextId++, x: src.x + 4, y: src.y + 4 });
    state.selId = state.items[state.items.length - 1].id;
    render();
  }

  function moveZ(id, dir) {
    const idx = state.items.findIndex((i) => i.id === id);
    if (idx < 0) return;
    const [it] = state.items.splice(idx, 1);
    let to = idx + dir;
    to = Math.max(0, Math.min(state.items.length, to));
    state.items.splice(to, 0, it);
    render();
  }

  /* ---------------- 指针交互（拖动 / 旋转 / 缩放） ---------------- */
  let drag = null;

  function startDrag(e, mode, id) {
    if (drag) return;
    e.preventDefault();
    const item = state.items.find((i) => i.id === id);
    if (!item) return;
    // 只切换选中态，不整体重绘——render() 会摘除手势目标元素，导致 pointer capture 失效
    stickersLayer.querySelectorAll('.sticker.selected').forEach((el) => el.classList.remove('selected'));
    const selEl = stickersLayer.querySelector(`[data-id="${id}"]`);
    if (selEl) selEl.classList.add('selected');
    state.selId = id;
    updatePropPanel();
    const rect = wrap.getBoundingClientRect();
    drag = {
      mode, id,
      sx: e.clientX, sy: e.clientY,
      startX: item.x, startY: item.y,
      startScale: item.scale, startRot: item.rot,
      cx: rect.left + rect.width / 2,
      cy: rect.top + rect.height / 2,
      startDist: Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2)),
      startAngle: Math.atan2(e.clientY - (rect.top + rect.height / 2), e.clientX - (rect.left + rect.width / 2)),
    };
    const tgt = e.target.closest('.sticker') || wrap;
    tgt.classList.add('dragging');
    if (e.target.setPointerCapture) { try { e.target.setPointerCapture(e.pointerId); } catch (_) {} }
    e.target.addEventListener('pointermove', onDragMove);
    e.target.addEventListener('pointerup', endDrag, { once: true });
    e.target.addEventListener('pointercancel', endDrag, { once: true });
  }

  function onDragMove(e) {
    if (!drag) return;
    const item = state.items.find((i) => i.id === drag.id);
    if (!item) return;
    const rect = wrap.getBoundingClientRect();
    const wPx = rect.width, hPx = rect.height;
    const dxPx = e.clientX - drag.sx;
    const dyPx = e.clientY - drag.sy;

    if (drag.mode === 'move') {
      item.x = Math.min(120, Math.max(-20, drag.startX + dxPx / wPx * 100));
      item.y = Math.min(120, Math.max(-20, drag.startY + dyPx / hPx * 100));
    } else if (drag.mode === 'rotate') {
      const ang = Math.atan2(e.clientY - drag.cy, e.clientX - drag.cx);
      item.rot = Math.round(drag.startRot + (ang - drag.startAngle) * 180 / Math.PI);
      item.rot = Math.round(item.rot / 5) * 5; // 5° 吸附
    } else if (drag.mode === 'scale') {
      const dist = Math.hypot(e.clientX - drag.cx, e.clientY - drag.cy);
      const s = drag.startDist > 0 ? drag.startScale * dist / drag.startDist : drag.startScale;
      item.scale = Math.round(Math.min(300, Math.max(10, s)));
    }
    applyItemTransform(item);
    updatePropPanel();
  }

  function endDrag(e) {
    if (!drag) return;
    const el = e.target.closest('.sticker');
    if (el) el.classList.remove('dragging');
    if (e.target.releasePointerCapture) e.target.releasePointerCapture(e.pointerId);
    drag = null;
  }

  function applyItemTransform(item) {
    const el = stickersLayer.querySelector(`[data-id="${item.id}"]`);
    if (!el) return;
    const cw = wrap.clientWidth || 400;
    el.style.left = item.x + '%';
    el.style.top = item.y + '%';
    el.style.width = (cw * BASE_W_RATIO * item.scale / 100) + 'px';
    el.style.transform = `translate(-50%, -50%) rotate(${item.rot}deg)`;
  }

  /* ---------------- 画布事件 ---------------- */
  stickersLayer.addEventListener('pointerdown', (e) => {
    const stickerEl = e.target.closest('.sticker');
    if (!stickerEl) return;
    const id = Number(stickerEl.dataset.id);
    if (e.target.closest('.h-del')) {
      removeSticker(id);
      return;
    }
    const mode = e.target.closest('.h-rot') ? 'rotate' :
                 e.target.closest('.h-scale') ? 'scale' : 'move';
    startDrag(e, mode, id);
  });

  wrap.addEventListener('pointerdown', (e) => {
    if (e.target === wrap || e.target === stickersLayer) {
      state.selId = null;
      render();
    }
  });

  wrap.addEventListener('wheel', (e) => {
    if (!state.selId) return;
    const item = state.items.find((i) => i.id === state.selId);
    if (!item) return;
    e.preventDefault();
    item.scale = Math.round(Math.min(300, Math.max(10, item.scale + (e.deltaY < 0 ? 5 : -5))));
    applyItemTransform(item);
    updatePropPanel();
  }, { passive: false });

  /* ---------------- 属性面板 ---------------- */
  function selected() {
    return state.items.find((i) => i.id === state.selId) || null;
  }

  function updatePropPanel() {
    const it = selected();
    if (!it) {
      propBox.classList.add('hidden');
      propEmpty.classList.remove('hidden');
      return;
    }
    propEmpty.classList.add('hidden');
    propBox.classList.remove('hidden');
    propName.textContent = it.name;
    propScale.value = it.scale;
    $('#propScaleVal').textContent = it.scale + '%';
    propRot.value = it.rot;
    $('#propRotVal').textContent = it.rot + '°';
  }

  propScale.addEventListener('input', () => {
    const it = selected();
    if (!it) return;
    it.scale = Number(propScale.value);
    applyItemTransform(it);
    $('#propScaleVal').textContent = it.scale + '%';
  });

  propRot.addEventListener('input', () => {
    const it = selected();
    if (!it) return;
    it.rot = Number(propRot.value);
    applyItemTransform(it);
    $('#propRotVal').textContent = it.rot + '°';
  });

  $('#btnTop').addEventListener('click', () => state.selId && moveZ(state.selId, 1000));
  $('#btnUp').addEventListener('click', () => state.selId && moveZ(state.selId, 1));
  $('#btnDown').addEventListener('click', () => state.selId && moveZ(state.selId, -1));
  $('#btnBottom').addEventListener('click', () => state.selId && moveZ(state.selId, -1000));
  $('#btnDup').addEventListener('click', () => state.selId && duplicateSticker(state.selId));
  $('#btnDel').addEventListener('click', () => state.selId && removeSticker(state.selId));

  /* ---------------- 背景选项 ---------------- */
  function updateSwatches() {
    $$('.swatch').forEach((b) => b.classList.toggle('active', b.dataset.bg === state.bg));
  }
  $$('.swatch').forEach((b) => b.addEventListener('click', () => {
    state.bg = b.dataset.bg;
    render();
  }));
  $('#chkPhoto').addEventListener('change', (e) => {
    state.showPhoto = e.target.checked;
    render();
  });

  /* ---------------- 键盘快捷键 ---------------- */
  addEventListener('keydown', (e) => {
    if (!state.selId || screens.editor.classList.contains('hidden')) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    const it = selected();
    if (!it) return;
    const step = e.shiftKey ? 1 : 0.5;
    if (e.key === 'Delete' || e.key === 'Backspace') { removeSticker(it.id); return; }
    if (e.key === 'ArrowLeft')  { it.x -= step; }
    if (e.key === 'ArrowRight') { it.x += step; }
    if (e.key === 'ArrowUp')    { it.y -= step; }
    if (e.key === 'ArrowDown')  { it.y += step; }
    applyItemTransform(it);
    updatePropPanel();
  });

  /* ---------------- 导出 ---------------- */
  function exportCanvas() {
    const aspect = state.photo ? state.photo.aspect : 3 / 4;
    let cw, ch;
    if (aspect >= 1) { cw = EXPORT_MAX; ch = Math.round(EXPORT_MAX / aspect); }
    else { ch = EXPORT_MAX; cw = Math.round(EXPORT_MAX * aspect); }
    const canvas = document.createElement('canvas');
    canvas.width = cw; canvas.height = ch;
    const ctx = canvas.getContext('2d');

    const bg = state.bg === 'photo' ? '#fff' : state.bg;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, cw, ch);

    if (state.photo && state.showPhoto && state.bg === 'photo') {
      ctx.drawImage(state.photo.img, 0, 0, cw, ch);
    }

    state.items.forEach((it) => {
      const p = presetBySrc(it.src);
      if (!p) return;
      const w = cw * BASE_W_RATIO * it.scale / 100;
      const h = w * p.img.naturalHeight / p.img.naturalWidth;
      const cx = cw * it.x / 100;
      const cy = ch * it.y / 100;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(it.rot * Math.PI / 180);
      ctx.drawImage(p.img, -w / 2, -h / 2, w, h);
      ctx.restore();
    });
    return canvas;
  }

  function downloadCanvas(canvas) {
    canvas.toBlob((blob) => {
      if (!blob) { toast('导出失败，请重试'); return; }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `酸橙明信片_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }, 'image/png');
  }

  /* ---------------- 完成层（官方分享屏） ---------------- */
  function openDone() {
    const canvas = exportCanvas();
    $('#doneImg').src = canvas.toDataURL('image/png');
    $('#doneLayer').classList.remove('hidden');
    sfx.done();
  }
  function closeDone() {
    $('#doneLayer').classList.add('hidden');
  }

  $('#btnDownload').addEventListener('click', () => { sfx.click(); openDone(); });
  $('#btnSave').addEventListener('click', () => {
    const img = $('#doneImg');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    downloadCanvas(canvas);
  });
  $('#btnDoneClose').addEventListener('click', () => { sfx.click(); closeDone(); });
  $('#btnEdit').addEventListener('click', () => { sfx.click(); closeDone(); });
  $('#btnHomeFromDone').addEventListener('click', () => { sfx.click(); closeDone(); showScreen('home'); });

  // 分享平台
  $$('.sp-btn').forEach((b) => b.addEventListener('click', () => {
    const kind = b.dataset.share;
    const url = encodeURIComponent(location.href);
    const text = encodeURIComponent('我做了张《直到大地变成一颗酸橙》夏日明信片！');
    if (kind === 'weibo') window.open(`https://service.weibo.com/share/share.php?url=${url}&title=${text}`, '_blank');
    else if (kind === 'qq') window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${text}`, '_blank');
    else if (kind === 'qzone') window.open(`https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${url}&title=${text}`, '_blank');
    else if (kind === 'download') {
      $('#btnSave').click();
    }
  }));

  /* ---------------- 弹窗 / Toast ---------------- */
  $('#btnHelp').addEventListener('click', () => $('#helpLayer').classList.remove('hidden'));
  $('#btnHelp3').addEventListener('click', () => $('#helpLayer').classList.remove('hidden'));
  $('#btnHelpClose').addEventListener('click', () => $('#helpLayer').classList.add('hidden'));
  $('#helpLayer').addEventListener('click', (e) => { if (e.target === $('#helpLayer')) $('#helpLayer').classList.add('hidden'); });

  let toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.add('hidden'), 2400);
  }

  /* ---------------- 上传入口 ---------------- */
  $('#btnUpload').addEventListener('click', () => { sfx.click(); fileInput.click(); });
  $('#btnStickerUpload').addEventListener('click', () => { sfx.click(); $('#stickerInput').click(); });

  $('#stickerInput').addEventListener('change', () => {
    const f = $('#stickerInput').files[0];
    $('#stickerInput').value = '';
    if (!f || !f.type.startsWith('image/')) { toast('请选择图片文件'); return; }
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      customImgs.set(url, img);
      state.items.push({ id: state.nextId++, src: url, name: '自定义贴纸', x: 50, y: 50, scale: 80, rot: 0 });
      state.selId = state.items[state.items.length - 1].id;
      sfx.add();
      toast('自定义贴纸已添加');
      render();
    };
    img.onerror = () => { toast('图片读取失败'); URL.revokeObjectURL(url); };
    img.src = url;
  });
  $('#btnStart').addEventListener('click', () => { sfx.click(); showScreen('editor'); });
  $('#btnBack').addEventListener('click', () => showScreen('home'));

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFile(fileInput.files[0]);
    fileInput.value = '';
  });

  // 拖拽上传
  ['dragenter', 'dragover'].forEach((ev) => dropZone.addEventListener(ev, (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  }));
  ['dragleave', 'drop'].forEach((ev) => dropZone.addEventListener(ev, (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
  }));
  dropZone.addEventListener('drop', (e) => {
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  // 粘贴上传
  addEventListener('paste', (e) => {
    const items = (e.clipboardData && e.clipboardData.items) || [];
    for (const it of items) {
      if (it.type.startsWith('image/')) {
        handleFile(it.getAsFile());
        break;
      }
    }
  });

  /* ---------------- 首页加载进度（官方进度条样式） ---------------- */
  function runLoading() {
    const fill = $('#loadFill');
    const pct = $('#loadPct');
    const bar = $('#loadProgress');
    let v = 0;
    const timer = setInterval(() => {
      v = Math.min(100, v + Math.random() * 14 + 6);
      fill.style.width = v + '%';
      pct.textContent = Math.floor(v) + '%';
      if (v >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          bar.classList.add('yRP2Z6');
          pct.textContent = '100%';
        }, 350);
      }
    }, 90);
  }

  /* ---------------- 初始化 ---------------- */
  (async function init() {
    await loadPresets();

    // 贴纸托盘
    state.presets.forEach((p) => {
      const el = document.createElement('div');
      el.className = 'tray-item';
      el.innerHTML =
        `<span class="tray-bracket"></span>` +
        `<img class="tray-thumb" alt="" src="${p.img.src}">` +
        `<span class="tray-name">${p.name}</span>` +
        `<span class="tray-bracket flip"></span>`;
      el.addEventListener('click', () => addSticker(p));
      trayEl.appendChild(el);
    });

    fitStage();
    render();
    runLoading();
  })();
})();
