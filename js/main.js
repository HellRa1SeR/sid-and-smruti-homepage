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
    closeLightbox();
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
      hidePanel(this.closest(".panel"));
    });
  }

  /* ─── Gallery carousel ─── */
  var track = document.getElementById("carousel-track");
  var viewport = document.getElementById("carousel-viewport");
  var prevBtn = document.getElementById("carousel-prev");
  var nextBtn = document.getElementById("carousel-next");
  var captionEl = document.getElementById("carousel-caption");
  var counterEl = document.getElementById("carousel-counter");
  var dotsEl = document.getElementById("carousel-dots");

  var slides = [];
  var currentIndex = 0;
  var touchStartX = 0;
  var touchDeltaX = 0;
  var isDragging = false;

  if (track) {
    slides = track.querySelectorAll(".carousel-slide");
    buildDots();
    goTo(0, false);

    if (prevBtn) {
      prevBtn.addEventListener("click", function () { goTo(currentIndex - 1); });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () { goTo(currentIndex + 1); });
    }

    if (viewport) {
      viewport.addEventListener("touchstart", onTouchStart, { passive: true });
      viewport.addEventListener("touchmove", onTouchMove, { passive: false });
      viewport.addEventListener("touchend", onTouchEnd, { passive: true });

      viewport.addEventListener("click", function (e) {
        if (Math.abs(touchDeltaX) > 10) return;
        var img = slides[currentIndex] && slides[currentIndex].querySelector("img");
        if (img && e.target === img) openLightbox(currentIndex);
      });
    }

    var slideImages = track.querySelectorAll(".carousel-slide img");
    for (var s = 0; s < slideImages.length; s++) {
      slideImages[s].style.cursor = "zoom-in";
    }
  }

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = "";
    for (var d = 0; d < slides.length; d++) {
      (function (index) {
        var slide = slides[index];
        var slideImg = slide.querySelector("img");
        var thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "carousel-thumb";
        thumb.setAttribute("role", "tab");
        thumb.setAttribute("aria-label", "Photo " + (index + 1));
        if (slideImg) {
          var img = document.createElement("img");
          img.src = slideImg.src;
          img.alt = "";
          img.width = 56;
          img.height = 56;
          img.loading = "lazy";
          thumb.appendChild(img);
        }
        thumb.addEventListener("click", function () { goTo(index); });
        dotsEl.appendChild(thumb);
      })(d);
    }
  }

  function wrapIndex(index) {
    var len = slides.length;
    if (len === 0) return 0;
    return ((index % len) + len) % len;
  }

  function goTo(index, animate) {
    if (!slides.length) return;
    currentIndex = wrapIndex(index);
    var offset = -currentIndex * 100;
    if (animate === false) {
      track.classList.add("no-transition");
      track.style.transform = "translateX(" + offset + "%)";
      requestAnimationFrame(function () {
        track.classList.remove("no-transition");
      });
    } else {
      track.style.transform = "translateX(" + offset + "%)";
    }
    updateMeta();
  }

  function updateMeta() {
    var slide = slides[currentIndex];
    if (!slide) return;
    var caption = slide.getAttribute("data-caption") || "";
    if (captionEl) captionEl.textContent = caption;
    if (counterEl) counterEl.textContent = (currentIndex + 1) + " / " + slides.length;
    if (dotsEl) {
      var dots = dotsEl.querySelectorAll(".carousel-thumb");
      for (var i = 0; i < dots.length; i++) {
        var active = i === currentIndex;
        dots[i].classList.toggle("is-active", active);
        dots[i].setAttribute("aria-selected", active ? "true" : "false");
      }
    }
  }

  function onTouchStart(e) {
    if (!e.touches || e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchDeltaX = 0;
    isDragging = true;
    track.classList.add("no-transition");
    viewport.classList.add("is-dragging");
  }

  function onTouchMove(e) {
    if (!isDragging || !e.touches || e.touches.length !== 1) return;
    touchDeltaX = e.touches[0].clientX - touchStartX;
    if (Math.abs(touchDeltaX) > 8) e.preventDefault();
    var width = viewport.offsetWidth || 1;
    var base = -currentIndex * 100;
    var dragPercent = (touchDeltaX / width) * 100;
    track.style.transform = "translateX(" + (base + dragPercent) + "%)";
  }

  function onTouchEnd() {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove("is-dragging");
    track.classList.remove("no-transition");
    var threshold = 50;
    if (touchDeltaX < -threshold) {
      goTo(currentIndex + 1);
    } else if (touchDeltaX > threshold) {
      goTo(currentIndex - 1);
    } else {
      goTo(currentIndex);
    }
    touchDeltaX = 0;
  }

  /* ─── Lightbox (tap photo for fullscreen, swipe + arrows) ─── */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxClose = document.getElementById("lightbox-close");
  var lightboxPrev = document.getElementById("lightbox-prev");
  var lightboxNext = document.getElementById("lightbox-next");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var lightboxIndex = 0;
  var lbTouchStartX = 0;

  function lightboxOpen() {
    return lightbox && lightbox.classList.contains("is-open");
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxImg || !slides.length) return;
    lightboxIndex = wrapIndex(index);
    var slide = slides[lightboxIndex];
    var img = slide.querySelector("img");
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCaption) {
      lightboxCaption.textContent = slide.getAttribute("data-caption") || "";
    }
    lightbox.hidden = false;
    lightbox.classList.add("is-open");
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.hidden = true;
    if (lightboxImg) lightboxImg.src = "";
  }

  function lightboxGo(delta) {
    openLightbox(lightboxIndex + delta);
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", function () { lightboxGo(-1); });
  if (lightboxNext) lightboxNext.addEventListener("click", function () { lightboxGo(1); });

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    lightbox.addEventListener("touchstart", function (e) {
      if (e.touches && e.touches.length === 1) lbTouchStartX = e.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener("touchend", function (e) {
      if (!e.changedTouches || e.changedTouches.length !== 1) return;
      var delta = e.changedTouches[0].clientX - lbTouchStartX;
      if (delta < -50) lightboxGo(1);
      else if (delta > 50) lightboxGo(-1);
    }, { passive: true });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (lightboxOpen()) closeLightbox();
      else if (openPanel) hidePanel(openPanel);
      return;
    }
    if (e.key === "ArrowLeft") {
      if (lightboxOpen()) lightboxGo(-1);
      else if (openPanel === panels.gallery) goTo(currentIndex - 1);
    }
    if (e.key === "ArrowRight") {
      if (lightboxOpen()) lightboxGo(1);
      else if (openPanel === panels.gallery) goTo(currentIndex + 1);
    }
  });
})();
