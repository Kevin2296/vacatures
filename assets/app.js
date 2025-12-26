// v6: fixeert finale-knoppen + langere love-bom + gift easter egg
const CONFIG = {
  video1: { id: "c53lhh", lengthSeconds: 8.0 },
  video2: { id: "uwkejn", lengthSeconds: 15.04 },
};

// Elements
const start = document.getElementById("start");
const loader = document.getElementById("loader");
const player = document.getElementById("player");
const frame = document.getElementById("frame");
const which = document.getElementById("which");

const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const end = document.getElementById("end");
const finale = document.getElementById("finale");
const closed = document.getElementById("closed");
const particles = document.getElementById("particles");

const giftIcon = document.getElementById("giftIcon");
const openBtn = document.getElementById("openGift");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let timers = [];

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

function showAfterPart1Modal() {
  overlay.classList.add("show");
  modal.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
  modal.setAttribute("aria-hidden", "false");
  burstEmojis({ emojiList: ["✨","💛","✨"], count: 26, spread: 180, origin: "center", durationMs: 1400 });
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
  burstEmojis({ emojiList: ["✨","💛","🎄"], count: 28, spread: 200, origin: "center", durationMs: 1500 });
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

function playPart2() {
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
  }, CONFIG.video2.lengthSeconds * 1000));
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
  giftIcon.classList.remove("opening");
}

// Particles
function burstEmojis({ emojiList, count = 30, spread = 240, origin = "center", durationMs = 1600 }) {
  const rect = document.body.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  let x0 = centerX, y0 = centerY;
  if (origin === "bottom") y0 = rect.height * 0.78;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "particle";
    el.textContent = emojiList[i % emojiList.length];

    const angle = Math.random() * Math.PI * 2;
    const radius = (Math.random() * 0.6 + 0.4) * spread;
    const dx = Math.cos(angle) * radius;
    const dy = Math.sin(angle) * radius - (Math.random() * 100);

    const rot = (Math.random() * 240 - 120).toFixed(0) + "deg";
    const size = (Math.random() * 12 + 18).toFixed(0) + "px";

    el.style.setProperty("--x", x0 + "px");
    el.style.setProperty("--y", y0 + "px");
    el.style.setProperty("--dx", dx.toFixed(1) + "px");
    el.style.setProperty("--dy", dy.toFixed(1) + "px");
    el.style.setProperty("--rot", rot);
    el.style.fontSize = size;

    const delay = Math.random() * 110;
    el.style.animation = `burst ${durationMs}ms ease-out ${delay}ms forwards`;

    particles.appendChild(el);
    setTimeout(() => el.remove(), durationMs + delay + 250);
  }
}

function loveExplosionBig() {
  // 3 waves => you WILL see it
  burstEmojis({ emojiList: ["💛","💖","💞","✨","💥"], count: 70, spread: 340, origin: "bottom", durationMs: 2400 });
  setTimeout(() => burstEmojis({ emojiList: ["💛","✨","💖","💞"], count: 54, spread: 300, origin: "bottom", durationMs: 2200 }), 240);
  setTimeout(() => burstEmojis({ emojiList: ["✨","💛","💥"], count: 44, spread: 260, origin: "bottom", durationMs: 2000 }), 520);
}

// Gift easter egg: pop + confetti from the gift itself
function giftEasterEgg() {
  // pop animation
  giftIcon.classList.add("pop");
  setTimeout(() => giftIcon.classList.remove("pop"), 600);

  // burst near gift position
  const r = giftIcon.getBoundingClientRect();
  const x0 = r.left + r.width / 2;
  const y0 = r.top + r.height / 2;

  // Custom burst with fixed origin (copy of burstEmojis but origin coords)
  for (let i = 0; i < 34; i++) {
    const el = document.createElement("div");
    el.className = "particle";
    const list = ["🎁","✨","💛","🎄"];
    el.textContent = list[i % list.length];

    const angle = Math.random() * Math.PI * 2;
    const radius = (Math.random() * 0.6 + 0.4) * 220;
    const dx = Math.cos(angle) * radius;
    const dy = Math.sin(angle) * radius - (Math.random() * 120);

    const rot = (Math.random() * 240 - 120).toFixed(0) + "deg";
    const size = (Math.random() * 10 + 18).toFixed(0) + "px";

    el.style.setProperty("--x", x0 + "px");
    el.style.setProperty("--y", y0 + "px");
    el.style.setProperty("--dx", dx.toFixed(1) + "px");
    el.style.setProperty("--dy", dy.toFixed(1) + "px");
    el.style.setProperty("--rot", rot);
    el.style.fontSize = size;

    const delay = Math.random() * 90;
    el.style.animation = `burst 1700ms ease-out ${delay}ms forwards`;

    particles.appendChild(el);
    setTimeout(() => el.remove(), 2000 + delay);
  }
}

// Events
openBtn.addEventListener("click", async () => {
  giftEasterEgg();
  giftIcon.classList.add("opening");
  loader.classList.add("show");
  loader.setAttribute("aria-hidden", "false");
  await sleep(1050);
  loader.classList.remove("show");
  loader.setAttribute("aria-hidden", "true");

  playPart1();
  requestFs();
});

document.getElementById("replay1").addEventListener("click", playPart1);
document.getElementById("play2").addEventListener("click", playPart2);

document.getElementById("again").addEventListener("click", () => {
  burstEmojis({ emojiList: ["✨","💛","🎁"], count: 30, spread: 220, origin: "center", durationMs: 1500 });
  setTimeout(returnToStart, 750);
});

document.getElementById("closeEnd").addEventListener("click", () => {
  // Strong love-bomb and keep it long enough
  loveExplosionBig();

  end.style.transition = "opacity 260ms ease";
  end.style.opacity = "0.15";

  // WAIT longer so it feels like a real finale
  setTimeout(() => {
    end.style.opacity = "";
    end.style.transition = "";
    end.classList.remove("show");
    end.setAttribute("aria-hidden", "true");
    showFinale();
  }, 1400);
});

// FIX: these buttons were "dead" because overlay ::before blocked clicks.
// (CSS fixed with pointer-events:none + z-index)
document.getElementById("finalRestart").addEventListener("click", () => {
  burstEmojis({ emojiList: ["🎁","✨","💛"], count: 36, spread: 240, origin: "center", durationMs: 1700 });
  setTimeout(returnToStart, 900);
});

document.getElementById("finalClose").addEventListener("click", () => {
  loveExplosionBig();
  setTimeout(() => {
    hideFinale();
    showClosed();
  }, 900);
});

document.getElementById("closedBack").addEventListener("click", () => {
  burstEmojis({ emojiList: ["✨","💛"], count: 22, spread: 200, origin: "center", durationMs: 1300 });
  setTimeout(returnToStart, 700);
});

document.getElementById("closedTryClose").addEventListener("click", () => {
  // Try to close (will only work if window opened by script).
  burstEmojis({ emojiList: ["💛","✨","💥"], count: 30, spread: 220, origin: "center", durationMs: 1700 });
  setTimeout(() => {
    try { window.close(); } catch (e) {}
  }, 250);
});

document.getElementById("fsBtn").addEventListener("click", requestFs);
