import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Angular's default [innerHTML] sanitizer strips SVG child elements
 * (path, circle, rect...), so icon markup renders as an empty <svg>.
 * Every value passed through here is a static, developer-authored
 * string from icons.ts — never user input — so bypassing sanitization
 * is safe.
 */
@Pipe({ name: 'safeHtml', standalone: true })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
