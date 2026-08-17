import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Animates a number counting up to its real, already-fetched value
 * over ~1s whenever that value changes — it never invents a number,
 * it only animates the transition to the one the backend returned.
 * Respects prefers-reduced-motion by jumping straight to the target.
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements OnChanges {
  @Input('appCountUp') target: number | null | undefined = 0;
  @Input() countUpSuffix = '';

  private current = 0;
  private raf?: number;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!('target' in changes)) return;
    const to = typeof this.target === 'number' && !isNaN(this.target) ? this.target : 0;
    const from = changes['target'].isFirstChange() ? 0 : this.current;
    this.animate(from, to);
  }

  private animate(from: number, to: number) {
    if (this.raf) cancelAnimationFrame(this.raf);

    const reduceMotion = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || from === to) {
      this.set(to);
      return;
    }

    const duration = 1000;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // ease-out cubic

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const value = Math.round(from + (to - from) * ease(t));
      this.set(value);
      if (t < 1) {
        this.raf = requestAnimationFrame(step);
      } else {
        this.current = to;
      }
    };
    this.raf = requestAnimationFrame(step);
  }

  private set(value: number) {
    this.current = value;
    this.el.nativeElement.textContent = value.toLocaleString() + this.countUpSuffix;
  }
}
