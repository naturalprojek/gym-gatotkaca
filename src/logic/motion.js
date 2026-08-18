import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Animasi UI — mengikuti preset GSAP dari skill ui-ux-pro-max:
 * - Scroll Reveal: opacity 0 → 1, y 8-16px, ease power2.out, trigger 'top 88%'
 * - Stagger: delay kecil antar elemen
 * - prefers-reduced-motion dihormati (semua animasi dilewati)
 */

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Terima React ref atau DOM element langsung
const toElement = (scope) => (scope && scope.current ? scope.current : scope);

/**
 * Scroll reveal untuk elemen ber-class "reveal".
 * Mendukung data-delay (detik) untuk stagger manual.
 * Mengembalikan fungsi cleanup untuk dipanggil saat unmount.
 */
export function initScrollReveals(scope) {
  if (prefersReducedMotion()) return () => {};
  const scopeEl = toElement(scope);
  if (!scopeEl) return () => {};
  const els = gsap.utils.toArray(".reveal", scopeEl);
  if (!els.length) return () => {};

  const ctx = gsap.context(() => {
    els.forEach((el) => {
      const delay = parseFloat(el.dataset.delay || 0);
      gsap.fromTo(
        el,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power2.out",
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });
  }, scopeEl);

  return () => ctx.revert();
}

/**
 * Animasi entrance hero (fade-up bertahap) + efek melayang pada gambar.
 * Elemen hero memakai class "hero-anim" (initial opacity 0 via CSS)
 * dan "hero-float" untuk efek melayang berulang.
 */
export function initHeroAnimations(scope) {
  if (prefersReducedMotion()) return () => {};
  const scopeEl = toElement(scope);
  if (!scopeEl) return () => {};

  const ctx = gsap.context(() => {
    gsap.fromTo(
      ".hero-anim",
      { opacity: 0, y: 44 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.16,
        ease: "power3.out",
        delay: 0.15,
      },
    );

    gsap.to(".hero-float", {
      y: -16,
      duration: 2.6,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  }, scopeEl);

  return () => ctx.revert();
}

/**
 * Animated counter untuk elemen ber-atribut data-count (angka statistik).
 * Angka berjalan dari 0 ke target saat elemen terlihat di viewport.
 */
export function initCounters(scope) {
  if (prefersReducedMotion()) return () => {};
  const scopeEl = toElement(scope);
  if (!scopeEl) return () => {};
  const nums = gsap.utils.toArray("[data-count]", scopeEl);
  if (!nums.length) return () => {};

  const ctx = gsap.context(() => {
    nums.forEach((el) => {
      const target = parseFloat(el.dataset.count || 0);
      const state = { val: 0 };
      gsap.to(state, {
        val: target,
        duration: 1.2,
        ease: "power1.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
        onUpdate: () => {
          el.textContent = String(Math.round(state.val));
        },
      });
    });
  }, scopeEl);

  return () => ctx.revert();
}
