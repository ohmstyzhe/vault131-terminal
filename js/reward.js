// js/reward.js
// Reward Quiz module for the Vault 131 terminal

const QUESTIONS = [
  {
    q: "Q1: Pick a vibe for tonight:\nA) Cozy + cute\nB) Fancy + flirty\nC) Chaotic + fun",
    answers: ["A", "B", "C"],
  },
  {
    q: "Q2: Choose a “mission type”:\nA) Movie night\nB) Go out\nC) Surprise activity",
    answers: ["A", "B", "C"],
  },
  {
    q: "Q3: Choose a reward style:\nA) Sweet (romantic)\nB) Playful (silly)\nC) Bold (confident)",
    answers: ["A", "B", "C"],
  },
];

const REWARDS = {
  A: [
    "Reward: Blanket Fort + favorite snacks + 3 kisses (officially certified).",
    "Reward: Pick the movie + I do the snacks + forehead kisses on demand.",
    "Reward: 10 minute cuddle boost + “no phones” mini date.",
  ],
  B: [
    "Reward: Dress up a little + photos together + dessert stop (your choice).",
    "Reward: You choose the place, I handle the plan. (Vault-Tec funded.)",
    "Reward: A slow dance in the kitchen + one surprise compliment each.",
  ],
  C: [
    "Reward: Mystery mission: you get 3 clues, winner gets a prize.",
    "Reward: Arcade rules at home: loser does a cute dare.",
    "Reward: Random adventure drive + soundtrack picked by you.",
  ],
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalize(input) {
  return (input || "").trim().toUpperCase();
}

/**
 * Starts the reward quiz flow.
 * @param {UI} ui
 * @param {object} opts
 * @param {Function} opts.onReturn  called when quiz finishes / user exits
 */
export async function startRewardQuiz(ui, { onReturn } = {}) {
  ui.setStatus("REWARD QUIZ");
  ui.clear();
  ui.hideInput();
  ui.clearHints();

  await ui.type([
    "REWARD QUIZ MODULE LOADED",
    "",
    "Answer A / B / C for each question.",
    "Type EXIT at any time to return.",
    "",
  ]);

  let idx = 0;
  const choices = [];

  const askNext = async () => {
    if (idx >= QUESTIONS.length) return finish();
    await ui.type(["", QUESTIONS[idx].q, ""]);
    ui.showInput("TYPE A, B, or C");
  };

  const finish = async () => {
    ui.hideInput();
    ui.clearHints();

    // Determine “dominant” reward bucket by most common A/B/C
    const tally = { A: 0, B: 0, C: 0 };
    choices.forEach((c) => (tally[c] = (tally[c] || 0) + 1));
    const bucket =
      tally.A >= tally.B && tally.A >= tally.C ? "A" : tally.B >= tally.C ? "B" : "C";

    const reward = pick(REWARDS[bucket]);

    await ui.type([
      "",
      "EVALUATING RESPONSES…",
      "CALIBRATING ROMANCE PROTOCOLS…",
      "",
      "✅ QUIZ COMPLETE",
      "",
      reward,
      "",
      "Press ENTER to return to the Valentine hub.",
    ]);

    // One-shot: pressing enter returns
    ui.showInput("PRESS ENTER");
    ui.onSubmit = () => {
      ui.onSubmit = null;
      ui.hideInput();
      if (onReturn) onReturn();
    };
  };

  ui.onSubmit = async (raw) => {
    const v = normalize(raw);

    if (v === "EXIT") {
      ui.onSubmit = null;
      ui.hideInput();
      if (onReturn) onReturn();
      return;
    }

    const q = QUESTIONS[idx];
    if (!q.answers.includes(v)) {
      await ui.type(["INVALID INPUT. USE A / B / C."]);
      ui.showInput("TYPE A, B, or C");
      return;
    }

    choices.push(v);
    idx += 1;
    await askNext();
  };

  await askNext();
}