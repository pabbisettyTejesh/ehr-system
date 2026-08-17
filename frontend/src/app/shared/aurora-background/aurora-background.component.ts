import { Component } from '@angular/core';

/**
 * Decorative animated background for hero/auth surfaces only — five
 * drifting blurred blobs plus a handful of floating glass orbs.
 * Purely decorative: absolutely positioned, pointer-events: none,
 * z-index kept below real content. All motion is transform/opacity
 * driven (see styles.css) and muted under prefers-reduced-motion.
 */
@Component({
  selector: 'app-aurora-background',
  standalone: true,
  template: `
    <div class="aurora-bg" aria-hidden="true">
      <div class="aurora-blob b1"></div>
      <div class="aurora-blob b2"></div>
      <div class="aurora-blob b3"></div>
      <div class="aurora-blob b4"></div>
      <div class="aurora-blob b5"></div>
    </div>
    <div class="glass-orbs" aria-hidden="true">
      <div class="glass-orb o1"></div>
      <div class="glass-orb o2"></div>
      <div class="glass-orb o3"></div>
      <div class="glass-orb o4"></div>
    </div>
  `
})
export class AuroraBackgroundComponent {}
