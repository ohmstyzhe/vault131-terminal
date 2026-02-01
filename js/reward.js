// js/reward.js
// Simple terminal-style Reward Quiz module (mobile-safe)

(function () {
  const QUESTIONS = [
    {
      q: "Which mission sounds most like us?",
      a: [
        "Late-night drive + snacks",
        "Movie night + cozy blanket",
        "Random adventure date",
        "All of the above"
      ],
      correct: 3
    },
    {
      q: "Pick a Vault-Tec approved snack:",
      a: ["Nuka-Cola", "Popcorn", "Sour candy", "Anything you hand me"],
      correct: 3
    },
    {
      q: "Choose your perk:",
      a: ["+1 Cuddle", "+1 Kiss", "+1 Compliment", "+1 Surprise"],
      correct: 0
    },
    {
      q: "What do I want you to say right now?",
      a: ["I’m proud of you", "Thank you", "I love you", "All of it"],
      correct: 3
    }
  ];

  const REWARDS = [
    "Reward Unlocked: 1 fancy date planned by Shaun.",
    "Reward Unlocked: Choose the movie + I get snacks.",
    "Reward Unlocked: 30 minute massage voucher (redeem anytime).",
    "Reward Unlocked: One 'yes day' request (within reason).",
    "Reward Unlocked: Surprise treat drop-off."
  ];

  // Helpers: tries to work with your existing terminal UI
  function $(id) { return document.getElementById(id); }

  function clearTerminal() {
    const t = $("terminal");
    if (!t) return;
    t.innerHTML = "";
    t.scrollTop = 0;
  }

  function printLine(text) {
    const t = $("terminal");
    if (!t) return;
    const div = document.createElement("div");
    div.textContent = text;
    t.appendChild(div);
    t.scrollTop = t.scrollHeight;
  }

  function printSpacer() { printLine(""); }

  function setStatus(text) {
    const s = $("uiStatus");
    if (s) s.textContent = text;
  }

  function showEnterButton(label, onClick) {
    const input = $("inputBox");
    if (!input) return;

    input.style.display = "block";
    input.value = "";
    input.placeholder = label || "PRESS ENTER";

    const handler = (e) => {
      if (e.key === "Enter") {
        input.removeEventListener("keydown", handler);
        onClick && onClick();
      }
    };
    input.addEventListener("keydown", handler);
    input.focus();
  }

  // Choice buttons inside terminal (tap friendly)
  function showChoices(choices, onPick) {
    const t = $("terminal");
    if (!t) return;

    const wrap = document.createElement("div");
    wrap.className = "rewardChoices";

    choices.forEach((c, idx) => {
      const btn = document.createElement("button");
      btn.className = "rewardBtn";
      btn.type = "button";
      btn.textContent = `${idx + 1}) ${c}`;
      btn.addEventListener("click", () => onPick(idx));
      wrap.appendChild(btn);
    });

    t.appendChild(wrap);
    t.scrollTop = t.scrollHeight;
  }

  function removeChoices() {
    document.querySelectorAll(".rewardChoices").forEach(n => n.remove());
  }

  function pickReward(score) {
    // higher score nudges toward the sweeter rewards
    const base = Math.min(REWARDS.length - 1, Math.floor(score / 2));
    const jitter = Math.floor(Math.random() * 2); // 0-1
    return REWARDS[Math.min(REWARDS.length - 1, base + jitter)];
  }

  const RewardQuiz = {
    start(returnToMenuFn) {
      let i = 0;
      let score = 0;

      clearTerminal();
      setStatus("REWARD QUIZ MODULE: ONLINE");

      printLine("REWARD QUIZ MODULE LOADED");
      printLine("Answer honestly. Vault-Tec is watching. 🙂");
      printSpacer();

      const ask = () => {
        removeChoices();
        clearTerminal();
        setStatus(`REWARD QUIZ: QUESTION ${i + 1} / ${QUESTIONS.length}`);

        const item = QUESTIONS[i];
        printLine(item.q);
        printSpacer();
        showChoices(item.a, (picked) => {
          // scoring: “correct” is just the sweet option in this setup
          if (picked === item.correct) score += 2;
          else score += 1;

          i++;
          if (i >= QUESTIONS.length) finish();
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
        printSpacer();
        printLine("=== REWARD DISPENSED ===");
        printLine(reward);
        printSpacer();
        printLine("Press ENTER to return to main menu.");

        showEnterButton("PRESS ENTER", () => {
          // hide input box if your app expects it hidden sometimes
          const input = $("inputBox");
          if (input) input.style.display = "none";
          if (typeof returnToMenuFn === "function") returnToMenuFn();
        });
      };

      ask();
    }
  };

  window.RewardQuiz = RewardQuiz;
})();