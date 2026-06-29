(function () {
  "use strict";

  var panels = {
    gallery: document.getElementById("panel-gallery"),
    connect: document.getElementById("panel-connect"),
    instagram: document.getElementById("panel-instagram")
  };

  var openPanel = null;

  function showPanel(name) {
    var panel = panels[name];
    if (!panel) return;

    if (openPanel && openPanel !== panel) {
      openPanel.classList.remove("is-open");
      openPanel.hidden = true;
    }

    panel.hidden = false;
    requestAnimationFrame(function () {
      panel.classList.add("is-open");
    });

    openPanel = panel;
    document.body.classList.add("panel-open");
  }

  function hidePanel(panel) {
    if (!panel) return;
    panel.classList.remove("is-open");
    panel.hidden = true;
    if (openPanel === panel) openPanel = null;
    if (!openPanel) document.body.classList.remove("panel-open");
  }

  function hideAllPanels() {
    var keys = Object.keys(panels);
    for (var i = 0; i < keys.length; i++) {
      var p = panels[keys[i]];
      if (p) hidePanel(p);
    }
  }

  var portalButtons = document.querySelectorAll(".portal[data-panel]");
  for (var i = 0; i < portalButtons.length; i++) {
    portalButtons[i].addEventListener("click", function () {
      showPanel(this.getAttribute("data-panel"));
    });
  }

  var closeButtons = document.querySelectorAll("[data-close]");
  for (var j = 0; j < closeButtons.length; j++) {
    closeButtons[j].addEventListener("click", function () {
      var panel = this.closest(".panel");
      hidePanel(panel);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (lightboxOpen()) {
        closeLightbox();
      } else if (openPanel) {
        hidePanel(openPanel);
      }
    }
  });

  /* Lightbox */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxClose = document.getElementById("lightbox-close");

  function lightboxOpen() {
    return lightbox && lightbox.classList.contains("is-open");
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.hidden = true;
    if (lightboxImg) lightboxImg.src = "";
  }

  if (lightbox && lightboxImg) {
    var galleryItems = document.querySelectorAll(".gallery-item");

    for (var k = 0; k < galleryItems.length; k++) {
      galleryItems[k].addEventListener("click", function () {
        var img = this.querySelector("img");
        if (!img) return;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.hidden = false;
        lightbox.classList.add("is-open");
      });
    }

    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
})();
