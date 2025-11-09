// script.js
document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------------
   * 1) Auto-highlight active nav link
   * ------------------------------ */
  const current = location.pathname.split("/").pop() || "index.html";
  document
    .querySelectorAll("nav a")
    .forEach((a) => a.classList.toggle("active", a.getAttribute("href") === current));

  /* ------------------------------
   * 2) Safe external links (new tab + security)
   * ------------------------------ */
  document.querySelectorAll('a[target="_blank"]').forEach((a) => {
    a.setAttribute("rel", "noopener noreferrer");
  });

  /* ------------------------------
   * 3) Smooth reveal on scroll (IntersectionObserver)
   * ------------------------------ */
  // Add a small style snippet for reveal animations if not present
  if (!document.getElementById("reveal-style")) {
    const style = document.createElement("style");
    style.id = "reveal-style";
    style.textContent = `
      .reveal {
        opacity: 0;
        transform: translateY(14px);
        transition: opacity .6s ease, transform .6s ease;
      }
      .reveal.reveal-show {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }

  // Mark common blocks as revealable
  document
    .querySelectorAll(".container, .hero, .bio-section, .project-card, .timeline-item, .contact-item, .resume-section")
    .forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-show");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ------------------------------
   * 4) Back-to-top button (auto-injected)
   * ------------------------------ */
  const backToTop = document.createElement("button");
  backToTop.textContent = "↑";
  backToTop.setAttribute("aria-label", "Back to top");
  Object.assign(backToTop.style, {
    position: "fixed",
    right: "18px",
    bottom: "18px",
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "16px",
    boxShadow: "0 6px 16px rgba(0,0,0,.25)",
    background: "linear-gradient(135deg,#ff4081,#ff9100)",
    color: "#fff",
    display: "none",
    zIndex: "999"
  });
  document.body.appendChild(backToTop);

  window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 200 ? "grid" : "none";
  });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ------------------------------
   * 5) Contact form handler
   *    - Basic validation
   *    - Shows a toast
   *    - Logs payload (simulate send)
   * ------------------------------ */
  const form = document.querySelector("form.contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const subject = (data.get("subject") || "").toString().trim();
      const message = (data.get("message") || "").toString().trim();

      // basic checks
      if (!name || !email || !subject || !message) {
        toast("Please fill in all fields.", "error");
        return;
      }
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        toast("Please enter a valid email address.", "error");
        return;
      }

      // Simulate a "send"
      console.log("Contact form payload:", { name, email, subject, message });

      // Optionally store to localStorage so user doesn't lose it
      try {
        localStorage.setItem(
          "contactDraft",
          JSON.stringify({ name, email, subject, message, ts: Date.now() })
        );
      } catch {}

      toast("Thanks! Your message has been recorded.", "success");
      form.reset();
    });
  }

  /* ------------------------------
   * 6) Footer "Last updated" helper
   * ------------------------------ */
  const footer = document.querySelector("footer");
  if (footer && !footer.querySelector(".last-updated")) {
    const small = document.createElement("small");
    small.className = "last-updated";
    const dt = new Date();
    small.textContent = `Last updated: ${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}`;
    footer.appendChild(document.createElement("br"));
    footer.appendChild(small);
  }

  /* ------------------------------
   * 7) Tiny toast system
   * ------------------------------ */
  function toast(msg, type = "info") {
    let tray = document.getElementById("toast-tray");
    if (!tray) {
      tray = document.createElement("div");
      tray.id = "toast-tray";
      Object.assign(tray.style, {
        position: "fixed",
        left: "50%",
        bottom: "24px",
        transform: "translateX(-50%)",
        display: "grid",
        gap: "10px",
        zIndex: "1000"
      });
      document.body.appendChild(tray);
    }
    const note = document.createElement("div");
    note.textContent = msg;
    Object.assign(note.style, {
      padding: "12px 16px",
      borderRadius: "14px",
      color: "#fff",
      background:
        type === "success"
          ? "linear-gradient(135deg,#00c853,#64dd17)"
          : type === "error"
          ? "linear-gradient(135deg,#ff1744,#ff9100)"
          : "rgba(0,0,0,.7)",
      boxShadow: "0 8px 20px rgba(0,0,0,.25)",
      maxWidth: "80vw",
      textAlign: "center",
      fontWeight: "600",
      letterSpacing: ".2px"
    });
    tray.appendChild(note);
    setTimeout(() => {
      note.style.opacity = "0";
      note.style.transition = "opacity .4s ease";
      setTimeout(() => note.remove(), 400);
    }, 2200);
  }
});
