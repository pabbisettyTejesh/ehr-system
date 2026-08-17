import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICONS } from '../shared/icons';
import { AuroraBackgroundComponent } from '../shared/aurora-background/aurora-background.component';
import { ParticleNetworkComponent } from '../shared/particle-network/particle-network.component';
import { RevealDirective } from '../shared/directives/reveal.directive';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, AuroraBackgroundComponent, ParticleNetworkComponent, RevealDirective],
  templateUrl: './landing.component.html'
})
export class LandingComponent {
  icons = ICONS;

  illustrationOffset = { x: 0, y: 0 };
  auroraOffset = { x: 0, y: 0 };

  private reducedMotion = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  private ticking = false;

  onHeroMouseMove(e: MouseEvent, heroEl: HTMLElement) {
    if (this.reducedMotion || this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      const rect = heroEl.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      // illustration: full range, capped at ±12px per the brief
      this.illustrationOffset = { x: relX * 24, y: relY * 24 };
      // aurora layer drifts slower, for depth
      this.auroraOffset = { x: relX * 10, y: relY * 10 };
      this.ticking = false;
    });
  }

  onHeroMouseLeave() {
    this.illustrationOffset = { x: 0, y: 0 };
    this.auroraOffset = { x: 0, y: 0 };
  }
}
