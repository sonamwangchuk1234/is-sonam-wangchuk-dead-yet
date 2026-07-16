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


  const samosaButton = document.querySelector("#samosa-button");
  const samosaFeedback = document.querySelector("#samosa-feedback");
  const samosaCounters = document.querySelectorAll("[data-samosa-count]");
  const initialSamosaCount = 404;
  let samosaCount = initialSamosaCount;
  let samosasDelivered = 0;

  const renderSamosas = () => {
    samosaCounters.forEach((node) => {
      node.textContent = String(samosaCount);
    });
    if (samosaFeedback) {
      samosaFeedback.textContent = `Imaginary samosas delivered this visit: ${samosasDelivered}. Counter: ${samosaCount}.`;
    }
  };

  if (samosaButton) {
    samosaButton.addEventListener("click", () => {
      samosaCount += 1;
      samosasDelivered += 1;
      renderSamosas();
      samosaButton.classList.remove("is-feeding");
      void samosaButton.offsetWidth;
      samosaButton.classList.add("is-feeding");
      samosaButton.textContent = samosasDelivered === 1 ? "Feed Dipke another samosa +1" : `Feed another samosa +1`;
    });
  }

  renderSamosas();

  window.DeadYetStatus = Object.freeze({
    fastStart: FAST_START,
    statusDate: STATUS_DATE,
    verifiedFastDay,
    inclusiveDay,
    initialSamosaCount,
    get samosaCount() {
      return samosaCount;
    },
    get samosasDelivered() {
      return samosasDelivered;
    },
    samosaCountIsFictional: true
  });
})();
