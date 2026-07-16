(() => {
  "use strict";

  const FAST_START = "2026-06-28";
  const STATUS_DATE = "2026-07-16T03:13:57Z";

  function utcDayNumber(dateLike) {
    const date = new Date(dateLike);
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  }

  function inclusiveDay(startDate, statusDate) {
    const millisecondsPerDay = 86_400_000;
    return Math.floor((utcDayNumber(statusDate) - utcDayNumber(startDate)) / millisecondsPerDay) + 1;
  }

  const verifiedFastDay = inclusiveDay(FAST_START, STATUS_DATE);
  document.querySelectorAll("[data-fast-day]").forEach((node) => {
    node.textContent = String(verifiedFastDay);
  });

  const quips = [
    "Current build: water-cooled, medically supervised, politically unsupported.",
    "Day 19 patch notes: body mass down; public concern up; ministerial callback still pending.",
    "Engineer discovers that converting stored energy into headlines is terribly inefficient.",
    "The protest has entered its ‘somebody please answer the phone’ era.",
    "Calories: reportedly zero. Camera batteries: somehow immortal.",
    "The accountability feature remains stuck in closed beta.",
    "Breaking: a giant red ‘NO’ continues to outperform several official communication channels."
  ];

  const quipButton = document.querySelector("#quip-button");
  const quipOutput = document.querySelector("#quip-output");
  let currentQuip = 0;

  if (quipButton && quipOutput) {
    quipButton.addEventListener("click", () => {
      let nextQuip = currentQuip;
      while (nextQuip === currentQuip && quips.length > 1) {
        nextQuip = Math.floor(Math.random() * quips.length);
      }
      currentQuip = nextQuip;
      quipOutput.textContent = `“${quips[currentQuip]}”`;
      quipOutput.parentElement.classList.remove("is-spinning");
      void quipOutput.parentElement.offsetWidth;
      quipOutput.parentElement.classList.add("is-spinning");
    });
  }

  const shareButton = document.querySelector("#share-button");
  const shareFeedback = document.querySelector("#share-feedback");
  const shareText = "Is Sonam Wangchuk dead yet? No. (A clearly labeled satire tracker with sources.)";

  async function sharePage() {
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, text: shareText, url: window.location.href });
        shareFeedback.textContent = "Shared. Civilization continues for now.";
        return;
      }
      await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      shareFeedback.textContent = "Link copied. Use this power irresponsibly, but accurately.";
    } catch (error) {
      if (error && error.name === "AbortError") return;
      shareFeedback.textContent = "Sharing failed. The old-fashioned URL bar remains operational.";
    }
  }

  if (shareButton) shareButton.addEventListener("click", sharePage);

  window.DeadYetStatus = Object.freeze({
    fastStart: FAST_START,
    statusDate: STATUS_DATE,
    verifiedFastDay,
    inclusiveDay
  });
})();
