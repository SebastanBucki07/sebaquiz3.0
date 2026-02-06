type RestCountry = {
  name: { common: string };
  translations?: { pol?: { common: string } };
  capital?: string[];
  region?: string;
  subregion?: string;
  area?: number;
  population?: number;
  cca2?: string;
  cca3?: string;
  borders?: string[];
};

type Hint = {
  id: string;
  label: string;
  content: string;
  penaltyPercent: number;
};

type QuizCountry = {
  id: number;
  answers: { value: string }[];
  question: string; // URL flagi
  hints: Hint[];
  revealedAnswers: any[];
};

// 🔹 Kontynenty po polsku, uwzględniając subregion dla Ameryk
function getPolishRegion(region?: string, subregion?: string): string {
  if (!region) return "Nieznany";

  if (region === "Americas") {
    if (subregion?.includes("North")) return "Ameryka Północna";
    if (subregion?.includes("Central")) return "Ameryka Środkowa";
    if (subregion?.includes("South")) return "Ameryka Południowa";
    return "Ameryka";
  }

  const map: Record<string, string> = {
    Africa: "Afryka",
    Europe: "Europa",
    Asia: "Azja",
    Oceania: "Oceania",
    Antarctic: "Antarktyda",
  };

  return map[region] ?? region;
}

export function transformCountriesToQuiz(data: RestCountry[]): QuizCountry[] {
  // 🔹 1️⃣ pełna mapa ISO3 → polska nazwa kraju
  const cca3ToPolishName: Record<string, string> = {};
  data.forEach(c => {
    if (c.cca3) {
      cca3ToPolishName[c.cca3] = c.translations?.pol?.common ?? c.name.common;
    }
  });

  // 🔹 2️⃣ transformacja do quiz
  return data.map((c, index) => {
    const bordersNames = (c.borders ?? [])
      .map(code => cca3ToPolishName[code])
      .filter(Boolean);

    const bordersHint = bordersNames.length
      ? bordersNames.join(", ")
      : "Brak graniczących państw";

    const hints: Hint[] = [
      {id: "0", label: "Kontynent", content: getPolishRegion(c.region, c.subregion), penaltyPercent: 20},
      {id: "1", label: "Stolica", content: c.capital?.[0] ?? "Brak stolicy", penaltyPercent: 30},
      {id: "2", label: "Granice", content: bordersHint, penaltyPercent: 40},
    ];

    return {
      id: index + 1,
      answers: [{value: c.translations?.pol?.common ?? c.name.common ?? "Brak nazwy"}],
      question: `https://flagcdn.com/w320/${(c.cca2 ?? "").toLowerCase()}.png`,
      hints,
      revealedAnswers: []
    };
  });
}


const countries = [{
  "name": {
    "common": "Andorra",
    "official": "Principality of Andorra",
    "nativeName": {
      "cat": {
        "official": "Principat d'Andorra",
        "common": "Andorra"
      }
    }
  },
  "cca2": "AD",
  "cca3": "AND",
  "capital": [
    "Andorra la Vella"
  ],
  "region": "Europe",
  "subregion": "Southern Europe",
  "translations": {
    "ara": {
      "official": "إمارة أندورا",
      "common": "أندورا"
    },
    "bre": {
      "official": "Priñselezh Andorra",
      "common": "Andorra"
    },
    "ces": {
      "official": "Andorrské knížectví",
      "common": "Andorra"
    },
    "cym": {
      "official": "Tywysogaeth Andorra",
      "common": "Andorra"
    },
    "deu": {
      "official": "Fürstentum Andorra",
      "common": "Andorra"
    },
    "est": {
      "official": "Andorra Vürstiriik",
      "common": "Andorra"
    },
    "fin": {
      "official": "Andorran ruhtinaskunta",
      "common": "Andorra"
    },
    "fra": {
      "official": "Principauté d'Andorre",
      "common": "Andorre"
    },
    "hrv": {
      "official": "Kneževina Andora",
      "common": "Andora"
    },
    "hun": {
      "official": "Andorra",
      "common": "Andorra"
    },
    "ind": {
      "official": "Kepangeranan Andora",
      "common": "Andora"
    },
    "ita": {
      "official": "Principato di Andorra",
      "common": "Andorra"
    },
    "jpn": {
      "official": "アンドラ公国",
      "common": "アンドラ"
    },
    "kor": {
      "official": "안도라 공국",
      "common": "안도라"
    },
    "nld": {
      "official": "Prinsdom Andorra",
      "common": "Andorra"
    },
    "per": {
      "official": "شاهزاده‌نشین آندورا",
      "common": "آندورا"
    },
    "pol": {
      "official": "Księstwo Andory",
      "common": "Andora"
    },
    "por": {
      "official": "Principado de Andorra",
      "common": "Andorra"
    },
    "rus": {
      "official": "Княжество Андорра",
      "common": "Андорра"
    },
    "slk": {
      "official": "Andorrské kniežatstvo",
      "common": "Andorra"
    },
    "spa": {
      "official": "Principado de Andorra",
      "common": "Andorra"
    },
    "srp": {
      "official": "Кнежевина Андора",
      "common": "Андора"
    },
    "swe": {
      "official": "Furstendömet Andorra",
      "common": "Andorra"
    },
    "tur": {
      "official": "Andorra Prensliği",
      "common": "Andorra"
    },
    "urd": {
      "official": "اماراتِ انڈورا",
      "common": "انڈورا"
    },
    "zho": {
      "official": "安道尔公国",
      "common": "安道尔"
    }
  },
  "borders": [
    "FRA",
    "ESP"
  ],
  "area": 468.0,
  "population": 88406
},
  {
    "name": {
      "common": "Trinidad and Tobago",
      "official": "Republic of Trinidad and Tobago",
      "nativeName": {
        "eng": {
          "official": "Republic of Trinidad and Tobago",
          "common": "Trinidad and Tobago"
        }
      }
    },
    "cca2": "TT",
    "cca3": "TTO",
    "capital": [
      "Port of Spain"
    ],
    "region": "Americas",
    "subregion": "Caribbean",
    "translations": {
      "ara": {
        "official": "جمهورية ترينيداد وتوباغو",
        "common": "ترينيداد وتوباغو"
      },
      "bre": {
        "official": "Republik Trinidad ha Tobago",
        "common": "Trinidad ha Tobago"
      },
      "ces": {
        "official": "Republika Trinidad a Tobago",
        "common": "Trinidad a Tobago"
      },
      "cym": {
        "official": "Republic of Trinidad and Tobago",
        "common": "Trinidad and Tobago"
      },
      "deu": {
        "official": "Republik Trinidad und Tobago",
        "common": "Trinidad und Tobago"
      },
      "est": {
        "official": "Trinidadi ja Tobago Vabariik",
        "common": "Trinidad ja Tobago"
      },
      "fin": {
        "official": "Trinidadin ja Tobagon tasavalta",
        "common": "Trinidad ja Tobago"
      },
      "fra": {
        "official": "République de Trinité-et-Tobago",
        "common": "Trinité-et-Tobago"
      },
      "hrv": {
        "official": "Republika Trinidad i Tobago",
        "common": "Trinidad i Tobago"
      },
      "hun": {
        "official": "Trinidad és Tobago Köztársaság",
        "common": "Trinidad és Tobago"
      },
      "ind": {
        "official": "Republik Trinidad dan Tobago",
        "common": "Trinidad dan Tobago"
      },
      "ita": {
        "official": "Repubblica di Trinidad e Tobago",
        "common": "Trinidad e Tobago"
      },
      "jpn": {
        "official": "トリニダード·トバゴ共和国",
        "common": "トリニダード・トバゴ"
      },
      "kor": {
        "official": "트리니다드 토바고 공화국",
        "common": "트리니다드 토바고"
      },
      "nld": {
        "official": "Republiek Trinidad en Tobago",
        "common": "Trinidad en Tobago"
      },
      "per": {
        "official": "جمهوری ترینیداد و توباگو",
        "common": "ترینیداد و توباگو"
      },
      "pol": {
        "official": "Trynidad i Tobago",
        "common": "Trynidad i Tobago"
      },
      "por": {
        "official": "República de Trinidad e Tobago",
        "common": "Trinidade e Tobago"
      },
      "rus": {
        "official": "Республика Тринидад и Тобаго",
        "common": "Тринидад и Тобаго"
      },
      "slk": {
        "official": "Republika Trinidad a Tobaga",
        "common": "Trinidad a Tobago"
      },
      "spa": {
        "official": "República de Trinidad y Tobago",
        "common": "Trinidad y Tobago"
      },
      "srp": {
        "official": "Република Тринидад и Тобаго",
        "common": "Тринидад и Тобаго"
      },
      "swe": {
        "official": "Republiken Trinidad och Tobago",
        "common": "Trinidad och Tobago"
      },
      "tur": {
        "official": "Trinidad ve Tobago",
        "common": "Trinidad ve Tobago"
      },
      "urd": {
        "official": "جمہوریہ ٹرینیڈاڈ و ٹوباگو",
        "common": "ٹرینیڈاڈ و ٹوباگو"
      },
      "zho": {
        "official": "特立尼达和多巴哥共和国",
        "common": "特立尼达和多巴哥"
      }
    },
    "borders": [],
    "area": 5130.0,
    "population": 1367764
  },]

export const transformed = transformCountriesToQuiz(countries);

console.log(JSON.stringify(transformed, null, 2));
