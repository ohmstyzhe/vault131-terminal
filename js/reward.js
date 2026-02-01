// js/reward.js (ES MODULE)

const QUESTIONS = [
  {
    q: "Which mission sounds most like us?",
    a: ["Late-night drive + snacks", "Movie night + cozy blanket", "Random adventure date", "All of the above"],
  },
  {
    q: "Pick a Vault-Tec approved snack:",
    a: ["Nuka-Cola", "Popcorn", "Sour candy", "Anything you hand me"],
  },
  {
    q: "Choose your perk:",
    a: ["+1 Cuddle", "+1 Kiss", "+1 Compliment", "+1 Surprise"],
  },
  {
    q: "What do I want you to say right now?",
    a: ["I’m proud of you", "Thank you", "I love you", "All of it"],
  }
];

const REWARDS = [
  "Reward Unlocked: 1 fancy date planned by Shaun.",
  "Reward Unlocked: Choose the movie + I get snacks.",
  "Reward Unlocked: 30 minute massage voucher (redeem anytime).",
  "Reward Unlocked: One 'yes day' request (within reason).",
  "Reward Unlocked: Surprise treat drop-off."
];

function $(id){ return document.getElementById(id); }

function clearTerminal(){
  const t = $("terminal");
  if (!t) return;
  t.innerHTML = "";
  t.scrollTop = 0;
}

function printLine(text){
  const t = $("terminal");
  if (!t) return;
  const div = document.createElement("div");
  div.textContent = text;
  t.appendChild(div);
  t.scrollTop = t.scrollHeight;
}

function spacer(){ printLine(""); }

function setStatus(text){
  const s = $("uiStatus");
  if (s) s.textContent = text;
}

function showEnterPrompt(placeholder, onEnter){
  const input = $("inputBox");
  if (!input) return;

  input.style.display = "block";
  input.value = "";
  input.placeholder = placeholder || "PRESS ENTER";
  input.focus();

  const handler = (e) => {
    if (e.key === "Enter") {
      input.removeEventListener("keydown", handler);
      onEnter && onEnter();
    }
  };

  input.addEventListener("keydown", handler);
}

function showChoices(choices, onPick){
  const t = $("terminal");
  if (!t) return;

  const wrap = document.createElement("div");
  wrap.className = "rewardChoices";

  choices.forEach((c, i) => {
    const btn = document.createElement("button");
    btn.className = "rewardBtn";
    btn.type = "button";
    btn.textContent = `${i + 1}) ${c}`;
    btn.addEventListener("click", () => onPick(i));
    wrap.appendChild(btn);
  });

  t.appendChild(wrap);
  t.scrollTop = t.scrollHeight;
}

function removeChoices(){
  document.querySelectorAll(".rewardChoices").forEach(n => n.remove());
}

function pickReward(score){
  const base = Math.min(REWARDS.length - 1, Math.floor(score / 2));
  const jitter = Math.floor(Math.random() * 2);
  return REWARDS[Math.min(REWARDS.length - 1, base + jitter)];
}

/**
 * Call this from app.js
 * @param {Function} returnToMenu - function that redraws your main menu screen
 */
export function startRewardQuiz(returnToMenu){
  let idx = 0;
  let score = 0;

  clearTerminal();
  setStatus("REWARD QUIZ MODULE: ONLINE");

  printLine("REWARD QUIZ MODULE LOADED");
  printLine("Answer honestly. Vault-Tec is watching. 🙂");
  spacer();

  const ask = () => {
    removeChoices();
    clearTerminal();
    setStatus(`REWARD QUIZ: QUESTION ${idx + 1} / ${QUESTIONS.length}`);

    const item = QUESTIONS[idx];
    printLine(item.q);
    spacer();

    showChoices(item.a, (picked) => {
      score += 1;               // every answer gives points
      if (picked === item.a.length - 1) score += 1; // bonus for last option (cute “All of it” style)

      idx++;
      if (idx >= QUESTIONS.length) finish();
      else ask();
    });
  };

  const finish = () => {
    removeChoices();
    clearTerminal();
    setStatus("REWARD QUIZ: COMPLETE");

    const reward = pickReward(score);

    printLine(">>> PROCESSING RESULTS...");
    printLine(`Score: ${score}/${QUESTIONS.length * 2}`);
    spacer();
    printLine("=== REWARD DISPENSED ===");
    printLine(reward);
    spacer();
    printLine("Press ENTER to return.");

    showEnterPrompt("PRESS ENTER", () => {
      const input = $("inputBox");
      if (input) input.style.display = "none";
      if (typeof returnToMenu === "function") returnToMenu();
    });
  };

  ask();
}