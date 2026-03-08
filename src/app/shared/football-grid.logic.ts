export class FootballGridLogic {
  static normalize(str: string): string {
    return str
      ? str
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\u0142/g, 'l')
          .toLowerCase()
          .trim()
      : '';
  }

  static generatePool(allFootballers: any[], count: number = 1): any[] {
    const questions: any[] = [];
    const clubMap: Record<string, any[]> = {};

    allFootballers.forEach((f) => {
      f.clubs.forEach((c: string) => {
        if (!clubMap[c]) clubMap[c] = [];
        clubMap[c].push(f);
      });
    });

    const popularClubs = Object.keys(clubMap)
      .filter((c) => clubMap[c].length >= 3)
      .sort((a, b) => clubMap[b].length - clubMap[a].length)
      .slice(0, 60);

    let attempts = 0;
    while (questions.length < count && attempts < 200) {
      attempts++;
      const rows = this.getRandomItems(popularClubs, 3);
      const potentialCols = popularClubs.filter(
        (col) =>
          !rows.includes(col) &&
          rows.every((row) =>
            allFootballers.some((f) => f.clubs.includes(row) && f.clubs.includes(col))
          )
      );

      if (potentialCols.length >= 3) {
        const cols = this.getRandomItems(potentialCols, 3);
        const gridData = rows.map((r) =>
          cols.map((c) => allFootballers.filter((f) => f.clubs.includes(r) && f.clubs.includes(c)))
        );
        questions.push({ id: Date.now() + questions.length, rows, cols, grid: gridData });
      }
    }
    return questions;
  }

  private static getRandomItems(arr: any[], n: number) {
    return [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
  }
}
