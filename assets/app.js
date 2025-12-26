// v9 hotfix: prevent GitHub Pages/service-worker caching issues + handle bfcache on iOS/Chrome
(function(){
  try{
    // If this domain previously had a service worker (e.g., from another project),
    // it can cache stale files and break buttons. Unregister any SW to avoid that.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then(function(regs){ regs.forEach(function(r){ try{ r.unregister(); }catch(e){} }); })
        .catch(function(){});
    }
    // If page is restored from back-forward cache, force a clean reload.
    window.addEventListener('pageshow', function(e){
      if (e && e.persisted) { try{ location.reload(); }catch(_){} }
    });
  }catch(e){}
})();


// v8: smoother transitions (delay video swap so bursts can render) + fixed mobile 'open' after restart + better gift easter egg
const CONFIG = {
  video1: { id: "c53lhh", lengthSeconds: 8.0 },
  video2: { id: "uwkejn", lengthSeconds: 15.04 },
};

// Elements
const start = document.getElementById("start");
const loader = document.getElementById("loader");
const loadTitle = document.getElementById("loadTitle");
const loadSub = document.getElementById("loadSub");

const player = document.getElementById("player");
const frame = document.getElementById("frame");
const which = document.getElementById("which");

const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const end = document.getElementById("end");
const finale = document.getElementById("finale");
const closed = document.getElementById("closed");

const particles = document.getElementById("particles");
const flash = document.getElementById("flash");

const giftIcon = document.getElementById("giftIcon");
const openBtn = document.getElementById("openGift");

const btnReplay1 = document.getElementById("replay1");
const btnPlay2 = document.getElementById("play2");
const btnAgain = document.getElementById("again");
const btnCloseEnd = document.getElementById("closeEnd");
const btnFinalRestart = document.getElementById("finalRestart");
const btnFinalClose = document.getElementById("finalClose");
const btnClosedBack = document.getElementById("closedBack");
const btnClosedTryClose = document.getElementById("closedTryClose");
const btnFs = document.getElementById("fsBtn");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let timers = [];
let busy = false;

function clearTimers() { timers.forEach((t) => clearTimeout(t)); timers = []; }

function setVideo(id) { frame.src = `https://streamable.com/e/${id}?autoplay=1&hd=1`; }
function stopVideo() { frame.src = ""; }

function requestFs() {
  const rfs = player.requestFullscreen || player.webkitRequestFullscreen || player.msRequestFullscreen;
  if (rfs) { try { rfs.call(player); } catch (e) {} }
}

function showPlayer() {
  start.style.display = "none";
  player.classList.add("show");
  player.setAttribute("aria-hidden", "false");
}

function showLoader(title, sub) {
  loadTitle.textContent = title;
  loadSub.textContent = sub;
  loader.classList.add("show");
  loader.setAttribute("aria-hidden", "false");
}
function hideLoader() {
  loader.classList.remove("show");
  loader.setAttribute("aria-hidden", "true");
}

function showAfterPart1Modal() {
  overlay.classList.add("show");
  modal.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
  modal.setAttribute("aria-hidden", "false");

  doFlash();
  burstAtViewportCenter(["✨","💛","✨"], 52, 240, 1800);
}

function hideAfterPart1Modal() {
  overlay.classList.remove("show");
  modal.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
  modal.setAttribute("aria-hidden", "true");
}

function showFinale() {
  finale.classList.add("show");
  finale.setAttribute("aria-hidden", "false");
  doFlash();
  burstAtViewportCenter(["🎄","✨","💛"], 56, 280, 1900);
}
function hideFinale() {
  finale.classList.remove("show");
  finale.setAttribute("aria-hidden", "true");
}

function showClosed() {
  closed.classList.add("show");
  closed.setAttribute("aria-hidden", "false");
}
function hideClosed() {
  closed.classList.remove("show");
  closed.setAttribute("aria-hidden", "true");
}

function playPart1() {
  clearTimers();
  hideAfterPart1Modal();
  hideFinale();
  hideClosed();
  end.classList.remove("show");
  end.setAttribute("aria-hidden", "true");

  which.textContent = "Deel 1";
  setVideo(CONFIG.video1.id);
  showPlayer();
  timers.push(setTimeout(showAfterPart1Modal, CONFIG.video1.lengthSeconds * 1000));
}

function playPart2_startVideoNow() {
  clearTimers();
  hideAfterPart1Modal();
  hideFinale();
  hideClosed();
  end.classList.remove("show");
  end.setAttribute("aria-hidden", "true");

  which.textContent = "Deel 2";
  setVideo(CONFIG.video2.id);

  timers.push(setTimeout(() => {
    end.classList.add("show");
    end.setAttribute("aria-hidden", "false");
    doFlash();
    burstAtViewportCenter(["💛","✨","💖"], 52, 280, 1900);
  }, CONFIG.video2.lengthSeconds * 1000));
}

// IMPORTANT: let bursts render BEFORE heavy iframe swap
async function playPart2_smooth() {
  showLoader("✨ Deel 2 openen…", "Nog heel even…");
  await sleep(520);
  hideLoader();
  playPart2_startVideoNow();
}

function returnToStart() {
  clearTimers();
  hideAfterPart1Modal();
  hideFinale();
  hideClosed();

  end.classList.remove("show");
  end.setAttribute("aria-hidden", "true");

  player.classList.remove("show");
  player.setAttribute("aria-hidden", "true");
  stopVideo();

  start.style.display = "grid";

  // Reset gift state
  giftIcon.classList.remove("open");

  // Re-enable button + allow new run
  openBtn.disabled = false;
  busy = false;
}

// FX helpers
function doFlash() {
  flash.classList.remove("show");
  void flash.offsetWidth;
  flash.classList.add("show");
  setTimeout(() => flash.classList.remove("show"), 900);
}

function burstAt(x0, y0, emojiList, count = 40, spread = 240, durationMs = 1700) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "particle";
    el.textContent = emojiList[i % emojiList.length];

    const angle = Math.random() * Math.PI * 2;
    const radius = (Math.random() * 0.65 + 0.35) * spread;
    const dx = Math.cos(angle) * radius;
    const dy = Math.sin(angle) * radius - (Math.random() * 130);

    const rot = (Math.random() * 260 - 130).toFixed(0) + "deg";
    const size = (Math.random() * 14 + 18).toFixed(0) + "px";

    el.style.setProperty("--x", x0 + "px");
    el.style.setProperty("--y", y0 + "px");
    el.style.setProperty("--dx", dx.toFixed(1) + "px");
    el.style.setProperty("--dy", dy.toFixed(1) + "px");
    el.style.setProperty("--rot", rot);
    el.style.fontSize = size;

    const delay = Math.random() * 120;
    el.style.animation = `burst ${durationMs}ms ease-out ${delay}ms forwards`;

    particles.appendChild(el);
    setTimeout(() => el.remove(), durationMs + delay + 260);
  }
}

function burstAtViewportCenter(emojiList, count, spread, durationMs) {
  burstAt(window.innerWidth / 2, window.innerHeight / 2, emojiList, count, spread, durationMs);
}

function burstFromButton(btn, emojiList, count = 36, spread = 210, durationMs = 1700) {
  if (!btn) return;
  const r = btn.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  burstAt(x, y, emojiList, count, spread, durationMs);
  doFlash();
}

function loveExplosionBig() {
  doFlash();
  const x = window.innerWidth/2;
  const y = window.innerHeight*0.74;
  burstAt(x, y, ["💛","💖","💞","✨","💥"], 105, 420, 2800);
  setTimeout(() => burstAt(x, y, ["💛","✨","💖","💞"], 90, 380, 2600), 250);
  setTimeout(() => burstAt(x, y, ["✨","💛","💥"], 80, 340, 2400), 560);
}

// Gift easter egg: lid opens + burst from gift
function giftEasterEgg() {
  giftIcon.classList.add("open");
  setTimeout(() => giftIcon.classList.remove("open"), 980);

  const r = giftIcon.getBoundingClientRect();
  const x0 = r.left + r.width / 2;
  const y0 = r.top + r.height / 2;
  burstAt(x0, y0, ["🎁","✨","💛","🎄"], 62, 280, 2000);
  doFlash();
}

// Button FX: do it on CLICK (mobile-safe, always fires)
function attachClickBurst(button, emojiList) {
  if (!button) return;
  button.addEventListener("click", () => burstFromButton(button, emojiList));
}

// Attach bursts to all key buttons
attachClickBurst(openBtn, ["🎁","✨","💛"]);
attachClickBurst(btnReplay1, ["✨","💛","✨"]);
attachClickBurst(btnPlay2, ["🎁","💛","✨"]);
attachClickBurst(btnAgain, ["✨","💛","🎁"]);
attachClickBurst(btnCloseEnd, ["💥","💛","💖","✨"]);
attachClickBurst(btnFinalRestart, ["🎁","✨","💛"]);
attachClickBurst(btnFinalClose, ["💥","💛","✨"]);
attachClickBurst(btnClosedBack, ["✨","💛"]);
attachClickBurst(btnClosedTryClose, ["✨","💛","💥"]);
attachClickBurst(btnFs, ["✨","💛"]);

// Events
openBtn.addEventListener("click", async () => {
  if (busy) return;
  busy = true;
  openBtn.disabled = true;

  giftEasterEgg();
  showLoader("✨ Even magie laden…", "Dit duurt heel kort.");
  await sleep(1050);
  hideLoader();

  playPart1();
  requestFs();
});

btnReplay1.addEventListener("click", async () => {
  if (busy) return;
  busy = true;
  btnReplay1.disabled = true;
  showLoader("✨ Terugspoelen…", "Nog heel even…");
  await sleep(420);
  hideLoader();
  btnReplay1.disabled = false;
  busy = false;
  playPart1();
});

btnPlay2.addEventListener("click", async () => {
  if (busy) return;

  // make it feel smooth: hide modal, show a micro-loader, THEN swap iframe
  busy = true;
  btnPlay2.disabled = true;
  hideAfterPart1Modal();

  await playPart2_smooth();

  btnPlay2.disabled = false;
  busy = false;
});

btnAgain.addEventListener("click", async () => {
  if (busy) return;
  busy = true;
  btnAgain.disabled = true;

  showLoader("✨ Nog een keer…", "Even resetten…");
  await sleep(520);
  hideLoader();

  // Now safe reset (fixes the 'open does nothing' iPhone issue)
  btnAgain.disabled = false;
  returnToStart();
});

btnCloseEnd.addEventListener("click", async () => {
  if (busy) return;
  busy = true;
  btnCloseEnd.disabled = true;

  loveExplosionBig();

  end.style.transition = "opacity 260ms ease";
  end.style.opacity = "0.10";

  // Give the bomb TIME
  await sleep(2350);

  end.style.opacity = "";
  end.style.transition = "";
  end.classList.remove("show");
  end.setAttribute("aria-hidden", "true");

  btnCloseEnd.disabled = false;
  busy = false;
  showFinale();
});

btnFinalRestart.addEventListener("click", async () => {
  if (busy) return;
  busy = true;
  btnFinalRestart.disabled = true;

  showLoader("🎁 Opnieuw…", "Even terug…");
  await sleep(520);
  hideLoader();

  btnFinalRestart.disabled = false;
  returnToStart();
});

btnFinalClose.addEventListener("click", async () => {
  if (busy) return;
  busy = true;
  btnFinalClose.disabled = true;

  loveExplosionBig();
  await sleep(1500);

  hideFinale();
  showClosed();

  btnFinalClose.disabled = false;
  busy = false;
});

btnClosedBack.addEventListener("click", async () => {
  if (busy) return;
  busy = true;
  btnClosedBack.disabled = true;

  showLoader("✨ Terug…", "Heel even…");
  await sleep(420);
  hideLoader();

  btnClosedBack.disabled = false;
  returnToStart();
});

btnClosedTryClose.addEventListener("click", async () => {
  loveExplosionBig();
  await sleep(250);
  try { window.close(); } catch (e) {}
});

btnFs.addEventListener("click", requestFs);
