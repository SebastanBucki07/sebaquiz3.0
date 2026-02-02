interface InputItem {
  Id?: number;
  id?: number;
  Answer?: string;
  Tip1?: string;
  Tip2?: string;
  Tip3?: string;
  title?: string;
  author?: string;
  fragment1?: string;
  fragment2?: string;
  fragment3?: string;
}

interface Hint {
  id: string;
  label: string;
  content: string;
  penaltyPercent: number;
}

interface OutputItem {
  id: number;
  answers: { label: string; value: string }[];
  question: string;
  hints: Hint[];
  revealedAnswers: any[];
}

function transformQuizWithHints(data: InputItem[]): OutputItem[] {
  const tmp= data.map(item => {
    const id = item.id ?? item.Id ?? 0;

    // Answers
    const answers: { label: string; value: string }[] = [];
    if (item.title && item.title !== "-") {
      answers.push({ label: "tytul", value: item.title });
    }
    if (item.author) {
      answers.push({ label: "autor", value: item.author });
    }
    if (item.Answer) {
      answers.push({ label: "tytul", value: item.Answer });
    }

    // Question
    const question = item.Answer ?? item.fragment1 ?? "Brak opisu";

    // Hints: zamiana fragmentów i tipów w Hint[]
    const hintKeys = ["fragment1", "fragment2", "fragment3", "Tip1", "Tip2", "Tip3"];
    const hints: Hint[] = [];

    hintKeys.forEach(key => {
      const value = (item as any)[key];
      if (value) {
        const hintIndex = hints.length; // 👈 tylko realne hinty
        hints.push({
          id: `${hintIndex}`,
          label: `Postać ${hintIndex + 1}`,
          content: value,
          penaltyPercent: hintIndex * 20
        });
      }
    });


    return {
      id,
      answers,
      question,
      hints,
      revealedAnswers: []
    };
  });
  console.log(JSON.stringify(tmp, null, 2));
  return tmp
}

// === PRZYKŁAD UŻYCIA ===

const inputData: InputItem[] = [
  {
    "Id": 1,
    "Answer": "Christopher Nolan",
    "Tip1": "PRESTIŻ",
    "Tip2": "MROCZNY RYCERZ",
    "Tip3": "-"
  },
  {
    "Id": 2,
    "Answer": "Justin Lin",
    "Tip1": "SZYBCY I WŚCIEKLI 5",
    "Tip2": "SZYBCY I WŚCIEKLI 6",
    "Tip3": "SZYBCY I WŚCIEKLI 9"
  },
  {
    "Id": 3,
    "Answer": "Andrew Adamson",
    "Tip1": "Shrek",
    "Tip2": "Shrek 2",
    "Tip3": "-"
  },
  {
    "Id": 4,
    "Answer": "Anthony Russo / Joe Russo",
    "Tip1": "AVENGERS: WOJNA BEZ GRANIC",
    "Tip2": "AVENGERS: KONIEC GRY",
    "Tip3": "KAPITAN AMERYKA: WOJNA BOHATERÓW"
  },
  {
    "Id": 5,
    "Answer": "Bryan Singer",
    "Tip1": "X-MEN 2",
    "Tip2": "BOHEMIAN RHAPSODY",
    "Tip3": "X-MEN: PRZESZŁOŚĆ, KTÓRA NADEJDZIE"
  },
  {
    "Id": 6,
    "Answer": "Chris Columbus",
    "Tip1": "HARRY POTTER I KAMIEŃ FILOZOFICZNY",
    "Tip2": "HARRY POTTER I KOMNATA TAJEMNIC",
    "Tip3": "-"
  },
  {
    "Id": 7,
    "Answer": "Christopher Nolan",
    "Tip1": "PRESTIŻ",
    "Tip2": "INCEPCJA",
    "Tip3": "INTERSTELLAR"
  },
  {
    "Id": 8,
    "Answer": "Darren Lynn Bousman",
    "Tip1": "PIŁA II",
    "Tip2": "PIŁA III",
    "Tip3": "PIŁA IV"
  },
  {
    "Id": 9,
    "Answer": "David Fincher",
    "Tip1": "Siedem",
    "Tip2": "Podziemny Krąg",
    "Tip3": "-"
  },
  {
    "Id": 10,
    "Answer": "David Leitch",
    "Tip1": "DEADPOOL 2",
    "Tip2": "Tip2",
    "Tip3": "-"
  },
  {
    "Id": 11,
    "Answer": "David R. Ellis",
    "Tip1": "OSZUKAĆ PRZEZNACZENIE 2",
    "Tip2": "OSZUKAĆ PRZEZNACZENIE 4",
    "Tip3": "-"
  },
  {
    "Id": 12,
    "Answer": "David Shore",
    "Tip1": "DR HOUSE",
    "Tip2": "THE GOOD DOCTOR",
    "Tip3": "-"
  },
  {
    "Id": 13,
    "Answer": "David Yates",
    "Tip1": "HARRY POTTER I KSIĄŻĘ PÓŁKRWI",
    "Tip2": "FANTASTYCZNE ZWIERZĘTA: ZBRODNIE GRINDELWALDA",
    "Tip3": "HARRY POTTER I INSYGNIA ŚMIERCI: CZĘŚĆ I"
  },
  {
    "Id": 14,
    "Answer": "Filip Zylber",
    "Tip1": "SERCE NIE SŁUGA",
    "Tip2": "SERCE NIE SŁUGA",
    "Tip3": "-"
  },
  {
    "Id": 15,
    "Answer": "Francis Ford Coppola",
    "Tip1": "OJCIEC CHRZESTNY",
    "Tip2": "OJCIEC CHRZESTNY II",
    "Tip3": "CZAS APOKALIPSY"
  },
  {
    "Id": 16,
    "Answer": "Frank Darabont",
    "Tip1": "SKAZANI NA SHAWSHANK",
    "Tip2": "ZIELONA MILA",
    "Tip3": "THE WALKING DEAD"
  },
  {
    "Id": 17,
    "Answer": "Gabriele Muccino",
    "Tip1": "W POGONI ZA SZCZĘŚCIEM",
    "Tip2": "SIEDEM DUSZ",
    "Tip3": "-"
  },
  {
    "Id": 18,
    "Answer": "George Lucas",
    "Tip1": "GWIEZDNE WOJNY: CZĘŚĆ I - MROCZNE WIDM",
    "Tip2": "GWIEZDNE WOJNY: CZĘŚĆ II - ATAK KLONÓW",
    "Tip3": "GWIEZDNE WOJNY: CZĘŚĆ III - ZEMSTA SITHÓW"
  },
  {
    "Id": 19,
    "Answer": "Giuseppe Tornatore",
    "Tip1": "CINEMA PARADISO",
    "Tip2": "KONESER",
    "Tip3": "-"
  },
  {
    "Id": 20,
    "Answer": "Gore Verbinski",
    "Tip1": "PIRACI Z KARAIBÓW: KLĄTWA CZARNEJ PERŁY",
    "Tip2": "PIRACI Z KARAIBÓW: NA KRAŃCU ŚWIATA",
    "Tip3": "PIRACI Z KARAIBÓW: SKRZYNIA UMARLAKA"
  },
  {
    "Id": 21,
    "Answer": "Guy Hamilton",
    "Tip1": "CZŁOWIEK ZE ZŁOTYM PISTOLETEM",
    "Tip2": "GOLDFINGER",
    "Tip3": "ŻYJ I POZWÓL UMRZEĆ"
  },
  {
    "Id": 22,
    "Answer": "Guy Ritchie",
    "Tip1": "PRZEKRĘT",
    "Tip2": "SHERLOCK HOLMES",
    "Tip3": "-"
  },
  {
    "Id": 23,
    "Answer": "J.J. Abrams",
    "Tip1": "GWIEZDNE WOJNY: PRZEBUDZENIE MOCY",
    "Tip2": "GWIEZDNE WOJNY: SKYWALKER. ODRODZENIE",
    "Tip3": "-"
  },
  {
    "Id": 24,
    "Answer": "James Gunn",
    "Tip1": "STRAŻNICY GALAKTYKI VOL. 2",
    "Tip2": "STRAŻNICY GALAKTYKI",
    "Tip3": "-"
  },
  {
    "Id": 25,
    "Answer": "James Mangold",
    "Tip1": "LOGAN: WOLVERINE",
    "Tip2": "WOLVERINE",
    "Tip3": "PRZERWANA LEKCJA MUZYKI"
  },
  {
    "Id": 26,
    "Answer": "James Wan",
    "Tip1": "PIŁA",
    "Tip2": "SZYBCY I WŚCIEKLI 7",
    "Tip3": "-"
  },
  {
    "Id": 27,
    "Answer": "James Wong",
    "Tip1": "OSZUKAĆ PRZEZNACZENIE",
    "Tip2": "OSZUKAĆ PRZEZNACZENIE 3",
    "Tip3": "-"
  },
  {
    "Id": 28,
    "Answer": "John Glen",
    "Tip1": "LICENCJA NA ZABIJANIE",
    "Tip2": "W OBLICZU ŚMIERCI",
    "Tip3": "-"
  },
  {
    "Id": 29,
    "Answer": "Jon Favreau",
    "Tip1": "IRON MAN 2",
    "Tip2": "IRON MAN",
    "Tip3": "-"
  },
  {
    "Id": 30,
    "Answer": "Jon Watts",
    "Tip1": "SPIDER-MAN: DALEKO OD DOMU",
    "Tip2": "SPIDER-MAN: BEZ DROGI DO DOMU",
    "Tip3": "-"
  },
  {
    "Id": 31,
    "Answer": "Jonathan Demme",
    "Tip1": "FILADELFIA",
    "Tip2": "MILCZENIE OWIEC",
    "Tip3": "-"
  },
  {
    "Id": 32,
    "Answer": "Joss Whedon",
    "Tip1": "AVENGERS",
    "Tip2": "AVENGERS: CZAS ULTRONA",
    "Tip3": "-"
  },
  {
    "Id": 33,
    "Answer": "Julie Plec",
    "Tip1": "WAMPIRY: DZIEDZICTWO",
    "Tip2": "THE ORIGINALS",
    "Tip3": "-"
  },
  {
    "Id": 34,
    "Answer": "Juliusz Machulski",
    "Tip1": "SEKSMISJA",
    "Tip2": "KILER",
    "Tip3": "KILER-ÓW 2-ÓCH"
  },
  {
    "Id": 35,
    "Answer": "Kevin Greutert",
    "Tip1": "PIŁA VI",
    "Tip2": "PIŁA 3D",
    "Tip3": "-"
  },
  {
    "Id": 36,
    "Answer": "Lexi Alexander",
    "Tip1": "PUNISHER: STREFA WOJNY",
    "Tip2": "HOOLIGANS",
    "Tip3": "-"
  },
  {
    "Id": 37,
    "Answer": "Lilly Wachowski / Lana Wachowski",
    "Tip1": "Matrix",
    "Tip2": "Matrik Rekatywacja",
    "Tip3": "Matrix rewolucje"
  },
  {
    "Id": 38,
    "Answer": "Łukasz Jaworski",
    "Tip1": "PAJĘCZYNA",
    "Tip2": "BOGOWIE",
    "Tip3": "NAJLEPSZY"
  },
  {
    "Id": 39,
    "Answer": "M. Night Shyamalan",
    "Tip1": "SZÓSTY ZMYSŁ",
    "Tip2": "ZNAKI",
    "Tip3": "-"
  },
  {
    "Id": 40,
    "Answer": "Maciej Migas",
    "Tip1": "SINGIELKA",
    "Tip2": "PRAWO AGATY",
    "Tip3": "-"
  },
  {
    "Id": 41,
    "Answer": "Marc Webb",
    "Tip1": "NIESAMOWITY SPIDER-MAN 2",
    "Tip2": "NIESAMOWITY SPIDER-MAN",
    "Tip3": "-"
  },
  {
    "Id": 42,
    "Answer": "Marek Koterski",
    "Tip1": "DZIEŃ ŚWIRA",
    "Tip2": "7 UCZUĆ",
    "Tip3": "-"
  },
  {
    "Id": 43,
    "Answer": "Martin Campbell",
    "Tip1": "GOLDENEYE",
    "Tip2": "CASINO ROYALE",
    "Tip3": "-"
  },
  {
    "Id": 44,
    "Answer": "Martin Scorsese",
    "Tip1": "WYSPA TAJEMNIC",
    "Tip2": "CHŁOPCY Z FERAJNY",
    "Tip3": "WILK Z WALL STREET"
  },
  {
    "Id": 45,
    "Answer": "Mel Gibson",
    "Tip1": "BRAVEHEART - WALECZNE SERCE",
    "Tip2": "PRZEŁĘCZ OCALONYCH",
    "Tip3": "-"
  },
  {
    "Id": 46,
    "Answer": "Michał Kwieciński",
    "Tip1": "MIŁOŚĆ JEST WSZYSTKIM",
    "Tip2": "JUTRO IDZIEMY DO KINA",
    "Tip3": "-"
  },
  {
    "Id": 47,
    "Answer": "Miloš Forman",
    "Tip1": "LOT NAD KUKUŁCZYM GNIAZDEM",
    "Tip2": "AMADEUSZ",
    "Tip3": "-"
  },
  {
    "Id": 48,
    "Answer": "Patryk Vega",
    "Tip1": "KOBIETY MAFII 2",
    "Tip2": "PITBULL",
    "Tip3": "SMALL WORLD"
  },
  {
    "Id": 49,
    "Answer": "Paul W.S. Anderson",
    "Tip1": "MORTAL KOMBAT",
    "Tip2": "RESIDENT EVIL",
    "Tip3": "RESIDENT EVIL: AFTERLIFE"
  },
  {
    "Id": 50,
    "Answer": "Peter Jackson",
    "Tip1": "WŁADCA PIERŚCIENI: POWRÓT KRÓLA",
    "Tip2": "WŁADCA PIERŚCIENI: DWIE WIEŻE",
    "Tip3": "WŁADCA PIERŚCIENI: DRUŻYNA PIERŚCIENIA"
  },
  {
    "Id": 51,
    "Answer": "Piotr Wereśniak",
    "Tip1": "WKRĘCENI",
    "Tip2": "WKRĘCENI 2",
    "Tip3": "NIE KŁAM, KOCHANIE"
  },
  {
    "Id": 52,
    "Answer": "Quentin Tarantino",
    "Tip1": "PULP FICTION",
    "Tip2": "DJANGO",
    "Tip3": "BĘKARTY WOJNY"
  },
  {
    "Id": 53,
    "Answer": "Richard Donner",
    "Tip1": "ZABÓJCZA BROŃ",
    "Tip2": "ZABÓJCZA BROŃ 2",
    "Tip3": "ZABÓJCZA BROŃ 3"
  },
  {
    "Id": 54,
    "Answer": "Ridley Scott",
    "Tip1": "OBCY - 8. PASAŻER NOSTROMO",
    "Tip2": "GLADIATOR",
    "Tip3": "HELIKOPTER W OGNIU"
  },
  {
    "Id": 55,
    "Answer": "Rob Cohen",
    "Tip1": "SZYBCY I WŚCIEKLI",
    "Tip2": "MUMIA: GROBOWIEC CESARZA SMOKA",
    "Tip3": "-"
  },
  {
    "Id": 56,
    "Answer": "Sam Akina",
    "Tip1": "MAYDAY",
    "Tip2": "PLANETA SINGLI 2",
    "Tip3": "-"
  },
  {
    "Id": 57,
    "Answer": "Sam Mendes",
    "Tip1": "SPECTRE",
    "Tip2": "SKYFALL",
    "Tip3": "-"
  },
  {
    "Id": 58,
    "Answer": "Sam Raimi",
    "Tip1": "SPIDER-MAN 3",
    "Tip2": "SPIDER-MAN 2",
    "Tip3": "DOKTOR STRANGE W MULTIWERSUM OBŁĘDU"
  },
  {
    "Id": 59,
    "Answer": "Steven Spielberg",
    "Tip1": "LISTA SCHINDLERA",
    "Tip2": "SZEREGOWIEC RYAN",
    "Tip3": "ZŁAP MNIE, JEŚLI POTRAFISZ"
  },
  {
    "Id": 60,
    "Answer": "Władysław Pasikowski",
    "Tip1": "PITBULL. OSTATNI PIES",
    "Tip2": "PSY",
    "Tip3": "PSY II: OSTATNIA KREW"
  }
]

export const quizData = transformQuizWithHints(inputData);
