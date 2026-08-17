import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';

/**
 * Fades + slides a section up as it enters the viewport, once.
 * Pure IntersectionObserver — no scroll listeners, no layout thrash.
 * Falls back to immediately-visible if IntersectionObserver isn't
 * available, and does nothing extra under prefers-reduced-motion
 * (styles.css already neutralizes the transition in that case).
 */
@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    const node = this.el.nativeElement;
    node.classList.add('reveal');

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('in-view');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add('in-view');
            this.observer?.unobserve(node);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    this.observer.observe(node);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
