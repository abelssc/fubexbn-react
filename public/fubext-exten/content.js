console.log('content-script cargado');

function loadScript(src) {
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = chrome.runtime.getURL(src);
    s.type = "module";
    s.onload = resolve;
    document.head.appendChild(s);
  });
}

function loadCSS(href) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL(href);
  document.head.appendChild(link);
}

function injectReact(aside) {
  const button = document.createElement("button");
  const img = document.createElement("img");
  img.src = chrome.runtime.getURL("public/img/icon.png");
  img.alt = "Clic para iniciar el sistema";
  img.style.width = "40px";
  img.style.height = "40px";

  button.style.padding = "0";
  button.style.margin = "0 auto";
  button.style.display = "block";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.appendChild(img);

  button.onclick = async () => {
    const main = document.querySelector(".main-panel .content");
    if (!main) return;

    main.innerHTML = "";

    const root = document.createElement("div");
    root.id = "react-extension-root";
    main.appendChild(root);

    loadCSS("assets/index.css");
    await loadScript("assets/index.js");
  };

  aside.appendChild(button);
}

function waitForAside(callback) {
  const aside = document.querySelector(".sidebar-content");
  if (aside) return callback(aside);

  const observer = new MutationObserver(() => {
    console.log('mutation');
    
    const aside = document.querySelector(".sidebar-content");
    if (aside) {
      observer.disconnect();
      callback(aside);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

waitForAside(injectReact);
