(() => {
  "use strict";

  const FAST_START = "2026-06-28";
  const STATUS_DATE = "2026-07-16T03:13:57Z";

  const utcDayNumber = (dateLike) => {
    const date = new Date(dateLike);
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  };

  const inclusiveDay = (startDate, statusDate) =>
    Math.floor((utcDayNumber(statusDate) - utcDayNumber(startDate)) / 86_400_000) + 1;

  const verifiedFastDay = inclusiveDay(FAST_START, STATUS_DATE);
  document.querySelectorAll("[data-fast-day]").forEach((node) => {
    node.textContent = String(verifiedFastDay);
  });

  const quips = [
    "Day 19: the body may be fasting; the publicity machine is not.",
    "One cot. One bottle. Unlimited moral grandstanding.",
    "The protest remains fully charged on camera batteries.",
    "Inventor discovers a renewable resource: public guilt.",
    "Food intake down. Headline intake at an all-time high.",
    "The most crowded part of the hunger strike is the camera angle.",
    "Breaking: self-denial has once again been mistaken for an argument."
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
  const shareText = "Is Sonam Wangchuk dead yet? No. The fast continues; so does the publicity cycle.";

  async function sharePage() {
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, text: shareText, url: window.location.href });
        shareFeedback.textContent = "Shared. The publicity cycle thanks you.";
        return;
      }
      await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      shareFeedback.textContent = "Link copied. Attention successfully redistributed.";
    } catch (error) {
      if (error && error.name === "AbortError") return;
      shareFeedback.textContent = "Sharing failed. Even the publicity machine needs maintenance.";
    }
  }

  if (shareButton) shareButton.addEventListener("click", sharePage);

  window.DeadYetStatus = Object.freeze({
    fastStart: FAST_START,
    statusDate: STATUS_DATE,
    verifiedFastDay,
    inclusiveDay,
    samosaCount: 404,
    samosaCountIsSatire: true
  });
})();
