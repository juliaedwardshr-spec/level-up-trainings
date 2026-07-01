const form = document.getElementById("questForm");
const xpNumber = document.getElementById("xpNumber");
const meterFill = document.getElementById("meterFill");
const discountLine = document.getElementById("discountLine");
const nextReward = document.getElementById("nextReward");
const levelNumber = document.getElementById("levelNumber");
const mascot = document.getElementById("mascot");
const coachMessage = document.getElementById("coachMessage");
const coachSubtext = document.getElementById("coachSubtext");
const xpBurst = document.getElementById("xpBurst");
const summaryBox = document.getElementById("summaryBox");
const xpHidden = document.getElementById("xpHidden");
const discountHidden = document.getElementById("discountHidden");
const summaryHidden = document.getElementById("summaryHidden");
const sideReaction = document.getElementById("sideReaction");
const sideReactionSub = document.getElementById("sideReactionSub");

const hasQuestForm = Boolean(form);

const MAX_XP = 500;
let currentXP = 0;
let shownXP = 0;
let currentTier = "bronze";

function calculateXP() {
  let total = 0;
  if (!form) return 0;
  form.querySelectorAll("[data-xp]").forEach((el) => {
    const points = Number(el.dataset.xp);
    const filled = el.type === "checkbox" ? el.checked : el.value.trim().length > 0;
    if (filled) total += points;
  });
  return Math.min(total, MAX_XP);
}

function tierFor(xp) {
  if (xp >= 450) return "platinum";
  if (xp >= 350) return "gold";
  if (xp >= 200) return "silver";
  return "bronze";
}

function tierText(xp) {
  const tier = tierFor(xp);
  if (tier === "platinum") return "Platinum Reward: VIP Support + Fast-Track Delivery";
  if (tier === "gold") return "Gold Reward: One Complimentary Revision";
  if (tier === "silver") return "Silver Reward: Priority Scheduling";
  return "Bronze Reward: Custom Project Roadmap";
}

function levelFor(xp) {
  if (xp >= 450) return 4;
  if (xp >= 350) return 3;
  if (xp >= 200) return 2;
  return 1;
}

function nextRewardFor(xp) {
  if (xp >= 450) return "Max reward unlocked";
  if (xp >= 350) return "Next: Platinum Reward";
  if (xp >= 200) return "Next: Gold Reward";
  return "Next: Priority Scheduling";
}

function coachFor(xp) {
  if (xp >= 450) return ["PLATINUM UNLOCKED!", "You completed an elite-level intake. 💎"];
  if (xp >= 350) return ["GOLD UNLOCKED!", "Your training quest is looking strong. 🏆"];
  if (xp >= 200) return ["SILVER UNLOCKED!", "More details. Better results. ✨"];
  if (xp > 0) return ["Nice move!", "Keep going to unlock rewards. ⭐"];
  return ["Hi! I’m your quest guide.", "Let’s level up together! ✨"];
}

function checkedValues(name) {
  return form ? [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(x => x.value) : [];
}

function value(name) {
  return form ? (new FormData(form).get(name) || "") : "";
}

function buildSummary(xp) {
  return `Level Up Trainings Quest Summary

Company: ${value("company_name")}
Contact: ${value("contact_name")}
Email: ${value("email")}
Desired Launch Date: ${value("launch_date")}

Training Readiness Score: ${xp} / ${MAX_XP}
Reward Level: ${tierText(xp)}

Services Requested:
${checkedValues("services").map(v => "- " + v).join("\n") || "- Not selected"}

Existing Resources Shared:
${checkedValues("materials").map(v => "- " + v).join("\n") || "- Not selected"}

Audience:
${value("audience")}

Learning Goals:
${value("learning_goals")}

Subject Matter Expert / Final Approver:
${value("sme_contact")}

Compliance, Safety, Policy, or Legal Requirements:
${value("requirements")}`;
}

function animateNumber(to) {
  const from = shownXP;
  const start = performance.now();
  const duration = 650;

  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    shownXP = Math.round(from + (to - from) * eased);
    xpNumber.textContent = shownXP;
    meterFill.style.width = `${(shownXP / MAX_XP) * 100}%`;

    if (p < 1) requestAnimationFrame(frame);
    else {
      shownXP = to;
      xpNumber.textContent = shownXP;
      meterFill.style.width = `${(shownXP / MAX_XP) * 100}%`;
    }
  }
  requestAnimationFrame(frame);
}

function mascotJump() {
  mascot.classList.remove("jump");
  void mascot.offsetWidth;
  mascot.classList.add("jump");
}

function showBurst(points) {
  if (points <= 0) return;
  xpBurst.textContent = `+${points} XP`;
  xpBurst.classList.remove("show");
  void xpBurst.offsetWidth;
  xpBurst.classList.add("show");
}

function confetti() {
  const holder = document.getElementById("confetti");
  const colors = ["#7e35ff", "#ffd84b", "#34d8ff", "#79ff6b"];
  for (let i = 0; i < 38; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * .25 + "s";
    holder.appendChild(piece);
    setTimeout(() => piece.remove(), 1700);
  }
}

function updateJourney(tier) {
  const steps = document.querySelectorAll(".step");
  let activeCount = 1;
  if (tier === "silver") activeCount = 3;
  if (tier === "gold") activeCount = 5;
  if (tier === "platinum") activeCount = 6;

  steps.forEach((step, index) => {
    step.classList.toggle("active", index < activeCount);
    const icon = step.querySelector("span");
    if (index < activeCount && index !== 5) icon.textContent = "⚔️";
  });
}

function update() {
  const nextXP = calculateXP();
  const gained = nextXP - currentXP;
  const nextTier = tierFor(nextXP);

  if (nextXP !== currentXP) {
    animateNumber(nextXP);
    if (gained > 0) {
      mascotJump();
      showBurst(gained);
    }
  }

  if (nextTier !== currentTier && nextXP > currentXP) confetti();

  currentXP = nextXP;
  currentTier = nextTier;

  const [msg, sub] = coachFor(nextXP);
  const discount = tierText(nextXP);
  coachMessage.textContent = msg;
  coachSubtext.textContent = sub;
  if (sideReaction) sideReaction.textContent = msg;
  if (sideReactionSub) sideReactionSub.textContent = sub;
  discountLine.textContent = discount;
  nextReward.textContent = nextRewardFor(nextXP);
  levelNumber.textContent = levelFor(nextXP);
  updateJourney(nextTier);

  const summary = buildSummary(nextXP);
  summaryBox.value = summary;
  xpHidden.value = `${nextXP} / ${MAX_XP}`;
  discountHidden.value = discount;
  summaryHidden.value = summary;
}

if (form) form.addEventListener("input", update);
if (form) form.addEventListener("change", update);

const copyBtn = document.getElementById("copyBtn");
if (copyBtn) copyBtn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(summaryBox.value);
  coachMessage.textContent = "Summary copied!";
  coachSubtext.textContent = "Ready to submit your quest. ✅";
  mascotJump();
});

if (form) update();


// Accessibility read-aloud controls
const speakerBtn = document.getElementById("speakerBtn");
const stopSpeakerBtn = document.getElementById("stopSpeakerBtn");

function getReadablePageText() {
  const sections = [
    document.querySelector(".hero-copy"),
    document.querySelector("#about"),
    document.querySelector("#accessibility"),
    document.querySelector("#quest"),
    document.querySelector("#contact")
  ].filter(Boolean);

  return sections
    .map(section => section.innerText)
    .join(". ")
    .replace(/\s+/g, " ")
    .trim();
}

if (speakerBtn && "speechSynthesis" in window) {
  speakerBtn.addEventListener("click", () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(getReadablePageText());
    utterance.rate = 0.92;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
    if (mascot) mascotJump();
  });
}

if (stopSpeakerBtn && "speechSynthesis" in window) {
  stopSpeakerBtn.addEventListener("click", () => {
    window.speechSynthesis.cancel();
  });
}


// V11 hover/click popups for About and Toolbox
const popupTriggers = document.querySelectorAll(".popup-trigger");
const popups = document.querySelectorAll(".hover-popup");

function closePopups() {
  popups.forEach(popup => popup.classList.remove("show"));
}

popupTriggers.forEach(trigger => {
  const popup = document.getElementById(trigger.dataset.popup);
  if (!popup) return;

  trigger.addEventListener("mouseenter", () => {
    closePopups();
    popup.classList.add("show");
  });

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    closePopups();
    popup.classList.add("show");
  });
});

popups.forEach(popup => {
  popup.addEventListener("mouseleave", () => {
    if (window.matchMedia("(hover: hover)").matches) popup.classList.remove("show");
  });
  const close = popup.querySelector(".popup-close");
  if (close) close.addEventListener("click", closePopups);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePopups();
});


// PWA install button
let deferredPrompt;
const installAppBtn = document.getElementById("installAppBtn");

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  if (installAppBtn) installAppBtn.classList.add("show");
});

if (installAppBtn) {
  installAppBtn.addEventListener("click", async () => {
    if (!deferredPrompt) {
      alert("To install: open your browser menu and choose Add to Home Screen or Install App.");
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installAppBtn.classList.remove("show");
  });
}


// V13 day/night teeter-totter theme toggle
const sunModeBtn = document.getElementById("sunModeBtn");
const moonModeBtn = document.getElementById("moonModeBtn");

function setThemeMode(mode) {
  const isLight = mode === "light";
  document.body.classList.toggle("light-mode", isLight);
  localStorage.setItem("levelUpThemeMode", mode);

  if (coachMessage && coachSubtext) {
    if (isLight) {
      coachMessage.textContent = "Day mode activated!";
      coachSubtext.textContent = "Rise and shine! ☀️";
    } else {
      coachMessage.textContent = "Night quest activated!";
      coachSubtext.textContent = "Let’s level up together! 🌙";
    }
  }

  if (typeof mascotJump === "function" && mascot) mascotJump();
}

const savedThemeMode = localStorage.getItem("levelUpThemeMode");
if (savedThemeMode === "light") {
  document.body.classList.add("light-mode");
}

if (sunModeBtn) {
  sunModeBtn.addEventListener("click", () => setThemeMode("light"));
}

if (moonModeBtn) {
  moonModeBtn.addEventListener("click", () => setThemeMode("night"));
}
