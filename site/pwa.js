(() => {
  if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
    return;
  }

  let deferredPrompt = null;
  const banner = document.getElementById("install-banner");
  const installButton = document.getElementById("install-button");
  const dismissButton = document.getElementById("install-dismiss");

  const showBanner = () => {
    if (banner) {
      banner.hidden = false;
    }
  };

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    showBanner();
  });

  installButton?.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    if (banner) banner.hidden = true;
  });

  dismissButton?.addEventListener("click", () => {
    if (banner) banner.hidden = true;
  });

  window.addEventListener("appinstalled", () => {
    if (banner) banner.hidden = true;
    deferredPrompt = null;
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/governance-app/sw.js").catch(() => {});
    });
  }
})();