import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

interface Particle { x: number; y: number; vx: number; vy: number; }

/**
 * A lightweight canvas particle network — small dots with thin
 * connecting lines, very low opacity, slow drift. Landing/Login/
 * Register pages only, per the brief. Canvas (not DOM nodes) keeps
 * this cheap even with 40+ points; the loop is skipped entirely
 * under prefers-reduced-motion and paused when the tab is hidden.
 */
@Component({
  selector: 'app-particle-network',
  standalone: true,
  template: `<canvas #canvas class="particle-canvas" aria-hidden="true"></canvas>`,
  styles: [`
    .particle-canvas {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 0;
    }
  `]
})
export class ParticleNetworkComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private raf?: number;
  private resizeObserver?: ResizeObserver;
  private readonly count = 42;
  private readonly linkDistance = 130;

  ngAfterViewInit() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;

    this.resize();
    this.seed();
    this.loop();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement ?? canvas);

    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  ngOnDestroy() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.resizeObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  private onVisibilityChange = () => {
    if (document.hidden) {
      if (this.raf) cancelAnimationFrame(this.raf);
    } else {
      this.loop();
    }
  };

  private resize() {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement;
    const rect = (parent ?? canvas).getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, rect.width * dpr);
    canvas.height = Math.max(1, rect.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private seed() {
    const canvas = this.canvasRef.nativeElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.width / dpr, h = canvas.height / dpr;
    this.particles = Array.from({ length: this.count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18
    }));
  }

  private loop = () => {
    const canvas = this.canvasRef.nativeElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.width / dpr, h = canvas.height / dpr;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    for (const p of this.particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }

    ctx.fillStyle = 'rgba(28,27,26,0.28)';
    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i], b = this.particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.linkDistance) {
          ctx.strokeStyle = `rgba(156,122,61,${0.14 * (1 - dist / this.linkDistance)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    this.raf = requestAnimationFrame(this.loop);
  };
}
