import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flagUrl',
  standalone: true,
})
export class FlagUrlPipe implements PipeTransform {
  transform(code: string | undefined | null): string | null {
    if (!code) return null;

    const clean = code.trim();
    if (!/^[a-z]{2}$/i.test(clean)) return null;

    return `https://flagcdn.com/w80/${clean.toLowerCase()}.png`;
  }
}
