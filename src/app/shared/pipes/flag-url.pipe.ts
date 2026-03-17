import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flagUrl',
  standalone: true,
})
export class FlagUrlPipe implements PipeTransform {
  transform(value: string | undefined | null): string | null {
    if (!value) return null;
    const clean = value.trim().toLowerCase();

    if (clean.startsWith('http')) return clean;

    // Specyficzny fix dla Bośni, jeśli przychodzi jako BIH
    const countryCode = clean === 'bih' ? 'ba' : clean;

    if (!/^[a-z0-9-]{2,10}$/i.test(countryCode)) return null;

    return `https://flagcdn.com/w320/${countryCode}.png`;
  }
}
