// interface CountryInput {
//   id: number;
//   name: string;
//   continent: string;
//   capital: string;
//   surface: number;
//   population: number;
//   code: string;
// }

interface CountryInput {
  id: number;
  name: string;
  continent: string;
  capital: string;
  surface: number;
  population: number;
  code: string;
  display?: boolean;
  borders: string[]
}


interface OutputItem {
  id: number;
  answers: { value: string }[];
  question: string;
  hints: {
    id: string;
    label: string;
    content: string | string[];
    penaltyPercent: number;
  }[];
  revealedAnswers: any[];
}


interface Hint {
  id: string;
  label: string;
  content: string;
  penaltyPercent: number;
}

function transformCountriesToPhotoQuiz(data: CountryInput[]): OutputItem[] {
  const result = data.map(item => ({
    id: item.id,

    // answer = nazwa kraju
    answers: [
      {value: item.name.trim()}
    ],

    // question = flaga z flagcdn
    question: `https://flagcdn.com/w80/${item.code.toLowerCase()}.png`,

    // dwa hinty
    hints: [
      {
        id: "0",
        label: "Kontynent",
        content: item.continent,
        penaltyPercent: 0
      },
      {
        id: "1",
        label: "Kod kraju",
        content: item.code,
        penaltyPercent: 20
      },
      {
        id: "2",
        label: "Stolica",
        content: item.capital,
        penaltyPercent: 20
      },
      {
        id: "3",
        label: "Państwa graniczące",
        content: item.borders,
        penaltyPercent: 20
      }
    ],

    revealedAnswers: []
  }));

  console.log(JSON.stringify(result, null, 2));
  return result;
}

const input: CountryInput[] = [{
  "id": 1,
  "name": "Andorra",
  "continent": "Europe",
  "capital": "Andorra la Vella",
  "surface": 468,
  "population": 88406,
  "code": "AD",
  "display": false,
  "borders": ["France", "Spain"]
}, {
  "id": 2,
  "name": "Trinidad and Tobago",
  "continent": "Americas",
  "capital": "Port of Spain",
  "surface": 5130,
  "population": 1367764,
  "code": "TT",
  "display": false,
  "borders": []
}, {
  "id": 3,
  "name": "Serbia",
  "continent": "Europe",
  "capital": "Belgrade",
  "surface": 77589,
  "population": 6567783,
  "code": "RS",
  "display": false,
  "borders": ["Bosnia and Herzegovina", "Bulgaria", "Croatia", "Hungary", "Kosovo", "North Macedonia", "Montenegro", "Romania"]
}, {
  "id": 4,
  "name": "United Kingdom",
  "continent": "Europe",
  "capital": "London",
  "surface": 244376,
  "population": 69281437,
  "code": "GB",
  "display": false,
  "borders": ["Ireland"]
}, {
  "id": 5,
  "name": "Russia",
  "continent": "Europe",
  "capital": "Moscow",
  "surface": 17098246,
  "population": 146028325,
  "code": "RU",
  "display": false,
  "borders": ["Azerbaijan", "Belarus", "China", "Estonia", "Finland", "Georgia", "Kazakhstan", "North Korea", "Latvia", "Lithuania", "Mongolia", "Norway", "Poland", "Ukraine"]
}, {
  "id": 6,
  "name": "Hong Kong",
  "continent": "Asia",
  "capital": "City of Victoria",
  "surface": 1104,
  "population": 7527500,
  "code": "HK",
  "display": false,
  "borders": ["China"]
}, {
  "id": 7,
  "name": "Western Sahara",
  "continent": "Africa",
  "capital": "El Aaiún",
  "surface": 266000,
  "population": 600904,
  "code": "EH",
  "display": false,
  "borders": ["Algeria", "Mauritania", "Morocco"]
}, {
  "id": 8,
  "name": "Uruguay",
  "continent": "Americas",
  "capital": "Montevideo",
  "surface": 181034,
  "population": 3499451,
  "code": "UY",
  "display": false,
  "borders": ["Argentina", "Brazil"]
}, {
  "id": 9,
  "name": "Barbados",
  "continent": "Americas",
  "capital": "Bridgetown",
  "surface": 430,
  "population": 267800,
  "code": "BB",
  "display": false,
  "borders": []
}, {
  "id": 10,
  "name": "Palestine",
  "continent": "Asia",
  "capital": "Ramallah",
  "surface": 6220,
  "population": 5483450,
  "code": "PS",
  "display": false,
  "borders": ["Israel", "Egypt", "Jordan"]
}, {
  "id": 11,
  "name": "Mexico",
  "continent": "Americas",
  "capital": "Mexico City",
  "surface": 1964375,
  "population": 130575786,
  "code": "MX",
  "display": false,
  "borders": ["Belize", "Guatemala", "United States"]
}, {
  "id": 12,
  "name": "Malawi",
  "continent": "Africa",
  "capital": "Lilongwe",
  "surface": 118484,
  "population": 20734262,
  "code": "MW",
  "display": false,
  "borders": ["Mozambique", "Tanzania", "Zambia"]
}, {
  "id": 13,
  "name": "Antarctica",
  "continent": "Antarctic",
  "capital": "",
  "surface": 14000000,
  "population": 1300,
  "code": "AQ",
  "display": false,
  "borders": []
}, {
  "id": 14,
  "name": "New Caledonia",
  "continent": "Oceania",
  "capital": "Nouméa",
  "surface": 18575,
  "population": 264596,
  "code": "NC",
  "display": false,
  "borders": []
}, {
  "id": 15,
  "name": "Svalbard and Jan Mayen",
  "continent": "Europe",
  "capital": "Longyearbyen",
  "surface": 61399,
  "population": 2530,
  "code": "SJ",
  "display": false,
  "borders": []
}, {
  "id": 16,
  "name": "Norfolk Island",
  "continent": "Oceania",
  "capital": "Kingston",
  "surface": 36,
  "population": 2188,
  "code": "NF",
  "display": false,
  "borders": []
}, {
  "id": 17,
  "name": "Christmas Island",
  "continent": "Oceania",
  "capital": "Flying Fish Cove",
  "surface": 135,
  "population": 1692,
  "code": "CX",
  "display": false,
  "borders": []
}, {
  "id": 18,
  "name": "Mongolia",
  "continent": "Asia",
  "capital": "Ulan Bator",
  "surface": 1564110,
  "population": 3544835,
  "code": "MN",
  "display": false,
  "borders": ["China", "Russia"]
}, {
  "id": 19,
  "name": "Latvia",
  "continent": "Europe",
  "capital": "Riga",
  "surface": 64559,
  "population": 1829000,
  "code": "LV",
  "display": false,
  "borders": ["Belarus", "Estonia", "Lithuania", "Russia"]
}, {
  "id": 20,
  "name": "Brunei",
  "continent": "Asia",
  "capital": "Bandar Seri Begawan",
  "surface": 5765,
  "population": 455500,
  "code": "BN",
  "display": false,
  "borders": ["Malaysia"]
}, {
  "id": 21,
  "name": "Ukraine",
  "continent": "Europe",
  "capital": "Kyiv",
  "surface": 603550,
  "population": 32862000,
  "code": "UA",
  "display": false,
  "borders": ["Belarus", "Hungary", "Moldova", "Poland", "Romania", "Russia", "Slovakia"]
}, {
  "id": 22,
  "name": "North Korea",
  "continent": "Asia",
  "capital": "Pyongyang",
  "surface": 120538,
  "population": 25950000,
  "code": "KP",
  "display": false,
  "borders": ["China", "South Korea", "Russia"]
}, {
  "id": 23,
  "name": "Finland",
  "continent": "Europe",
  "capital": "Helsinki",
  "surface": 338455,
  "population": 5650325,
  "code": "FI",
  "display": false,
  "borders": ["Norway", "Sweden", "Russia"]
}, {
  "id": 24,
  "name": "Anguilla",
  "continent": "Americas",
  "capital": "The Valley",
  "surface": 91,
  "population": 16010,
  "code": "AI",
  "display": false,
  "borders": []
}, {
  "id": 25,
  "name": "Azerbaijan",
  "continent": "Asia",
  "capital": "Baku",
  "surface": 86600,
  "population": 10241722,
  "code": "AZ",
  "display": false,
  "borders": ["Armenia", "Georgia", "Iran", "Russia", "Turkey"]
}, {
  "id": 26,
  "name": "Cayman Islands",
  "continent": "Americas",
  "capital": "George Town",
  "surface": 264,
  "population": 84738,
  "code": "KY",
  "display": false,
  "borders": []
}, {
  "id": 27,
  "name": "Uzbekistan",
  "continent": "Asia",
  "capital": "Tashkent",
  "surface": 447400,
  "population": 37859698,
  "code": "UZ",
  "display": false,
  "borders": ["Afghanistan", "Kazakhstan", "Kyrgyzstan", "Tajikistan", "Turkmenistan"]
}, {
  "id": 28,
  "name": "Ireland",
  "continent": "Europe",
  "capital": "Dublin",
  "surface": 70273,
  "population": 5458600,
  "code": "IE",
  "display": false,
  "borders": ["United Kingdom"]
}, {
  "id": 29,
  "name": "Jersey",
  "continent": "Europe",
  "capital": "Saint Helier",
  "surface": 116,
  "population": 103267,
  "code": "JE",
  "display": false,
  "borders": []
}, {
  "id": 30,
  "name": "Rwanda",
  "continent": "Africa",
  "capital": "Kigali",
  "surface": 26338,
  "population": 14104969,
  "code": "RW",
  "display": false,
  "borders": ["Burundi", "DR Congo", "Tanzania", "Uganda"]
}, {
  "id": 31,
  "name": "Bosnia and Herzegovina",
  "continent": "Europe",
  "capital": "Sarajevo",
  "surface": 51209,
  "population": 3422000,
  "code": "BA",
  "display": false,
  "borders": ["Croatia", "Montenegro", "Serbia"]
}, {
  "id": 32,
  "name": "Poland",
  "continent": "Europe",
  "capital": "Warsaw",
  "surface": 312679,
  "population": 37392000,
  "code": "PL",
  "display": false,
  "borders": ["Belarus", "Czechia", "Germany", "Lithuania", "Russia", "Slovakia", "Ukraine"]
}, {
  "id": 33,
  "name": "Portugal",
  "continent": "Europe",
  "capital": "Lisbon",
  "surface": 92090,
  "population": 10749635,
  "code": "PT",
  "display": false,
  "borders": ["Spain"]
}, {
  "id": 34,
  "name": "Haiti",
  "continent": "Americas",
  "capital": "Port-au-Prince",
  "surface": 27750,
  "population": 11867032,
  "code": "HT",
  "display": false,
  "borders": ["Dominican Republic"]
}, {
  "id": 35,
  "name": "Iran",
  "continent": "Asia",
  "capital": "Tehran",
  "surface": 1648195,
  "population": 85961000,
  "code": "IR",
  "display": false,
  "borders": ["Afghanistan", "Armenia", "Azerbaijan", "Iraq", "Pakistan", "Turkey", "Turkmenistan"]
}, {
  "id": 36,
  "name": "French Southern and Antarctic Lands",
  "continent": "Antarctic",
  "capital": "Port-aux-Français",
  "surface": 7747,
  "population": 400,
  "code": "TF",
  "display": false,
  "borders": []
}, {
  "id": 37,
  "name": "Ethiopia",
  "continent": "Africa",
  "capital": "Addis Ababa",
  "surface": 1104300,
  "population": 111652998,
  "code": "ET",
  "display": false,
  "borders": ["Djibouti", "Eritrea", "Kenya", "Somalia", "South Sudan", "Sudan"]
}, {
  "id": 38,
  "name": "Kazakhstan",
  "continent": "Asia",
  "capital": "Astana",
  "surface": 2724900,
  "population": 20426568,
  "code": "KZ",
  "display": false,
  "borders": ["China", "Kyrgyzstan", "Russia", "Turkmenistan", "Uzbekistan"]
}, {
  "id": 39,
  "name": "Mali",
  "continent": "Africa",
  "capital": "Bamako",
  "surface": 1240192,
  "population": 22395489,
  "code": "ML",
  "display": false,
  "borders": ["Algeria", "Burkina Faso", "Guinea", "Ivory Coast", "Mauritania", "Niger", "Senegal"]
}, {
  "id": 40,
  "name": "Nicaragua",
  "continent": "Americas",
  "capital": "Managua",
  "surface": 130373,
  "population": 6803886,
  "code": "NI",
  "display": false,
  "borders": ["Costa Rica", "Honduras"]
}, {
  "id": 41,
  "name": "Germany",
  "continent": "Europe",
  "capital": "Berlin",
  "surface": 357114,
  "population": 83491249,
  "code": "DE",
  "display": false,
  "borders": ["Austria", "Belgium", "Czechia", "Denmark", "France", "Luxembourg", "Netherlands", "Poland", "Switzerland"]
}, {
  "id": 42,
  "name": "Estonia",
  "continent": "Europe",
  "capital": "Tallinn",
  "surface": 45227,
  "population": 1369995,
  "code": "EE",
  "display": false,
  "borders": ["Latvia", "Russia"]
}, {
  "id": 43,
  "name": "Tunisia",
  "continent": "Africa",
  "capital": "Tunis",
  "surface": 163610,
  "population": 11972169,
  "code": "TN",
  "display": false,
  "borders": ["Algeria", "Libya"]
}, {
  "id": 44,
  "name": "Saint Martin",
  "continent": "Americas",
  "capital": "Marigot",
  "surface": 53,
  "population": 31496,
  "code": "MF",
  "display": false,
  "borders": ["Sint Maarten"]
}, {
  "id": 45,
  "name": "Cameroon",
  "continent": "Africa",
  "capital": "Yaoundé",
  "surface": 475442,
  "population": 29442327,
  "code": "CM",
  "display": false,
  "borders": ["Central African Republic", "Chad", "Republic of the Congo", "Equatorial Guinea", "Gabon", "Nigeria"]
}, {
  "id": 46,
  "name": "Micronesia",
  "continent": "Oceania",
  "capital": "Palikir",
  "surface": 702,
  "population": 105564,
  "code": "FM",
  "display": false,
  "borders": []
}, {
  "id": 47,
  "name": "Sint Maarten",
  "continent": "Americas",
  "capital": "Philipsburg",
  "surface": 34,
  "population": 41349,
  "code": "SX",
  "display": false,
  "borders": ["Saint Martin"]
}, {
  "id": 48,
  "name": "Cyprus",
  "continent": "Europe",
  "capital": "Nicosia",
  "surface": 9251,
  "population": 1442614,
  "code": "CY",
  "display": false,
  "borders": []
}, {
  "id": 49,
  "name": "Morocco",
  "continent": "Africa",
  "capital": "Rabat",
  "surface": 446550,
  "population": 36828330,
  "code": "MA",
  "display": false,
  "borders": ["Algeria", "Western Sahara", "Spain"]
}, {
  "id": 50,
  "name": "Pitcairn Islands",
  "continent": "Oceania",
  "capital": "Adamstown",
  "surface": 47,
  "population": 35,
  "code": "PN",
  "display": false,
  "borders": []
}, {
  "id": 51,
  "name": "Curaçao",
  "continent": "Americas",
  "capital": "Willemstad",
  "surface": 444,
  "population": 156115,
  "code": "CW",
  "display": false,
  "borders": []
}, {
  "id": 52,
  "name": "Aruba",
  "continent": "Americas",
  "capital": "Oranjestad",
  "surface": 180,
  "population": 107566,
  "code": "AW",
  "display": false,
  "borders": []
}, {
  "id": 53,
  "name": "Spain",
  "continent": "Europe",
  "capital": "Madrid",
  "surface": 505992,
  "population": 49315949,
  "code": "ES",
  "display": false,
  "borders": ["Andorra", "France", "Gibraltar", "Portugal", "Morocco"]
}, {
  "id": 54,
  "name": "Gabon",
  "continent": "Africa",
  "capital": "Libreville",
  "surface": 267668,
  "population": 2469296,
  "code": "GA",
  "display": false,
  "borders": ["Cameroon", "Republic of the Congo", "Equatorial Guinea"]
}, {
  "id": 55,
  "name": "Åland Islands",
  "continent": "Europe",
  "capital": "Mariehamn",
  "surface": 1580,
  "population": 30654,
  "code": "AX",
  "display": false,
  "borders": []
}, {
  "id": 56,
  "name": "Denmark",
  "continent": "Europe",
  "capital": "Copenhagen",
  "surface": 43094,
  "population": 6011488,
  "code": "DK",
  "display": false,
  "borders": ["Germany"]
}, {
  "id": 57,
  "name": "Martinique",
  "continent": "Americas",
  "capital": "Fort-de-France",
  "surface": 1128,
  "population": 349925,
  "code": "MQ",
  "display": false,
  "borders": []
}, {
  "id": 58,
  "name": "Antigua and Barbuda",
  "continent": "Americas",
  "capital": "Saint John's",
  "surface": 442,
  "population": 103603,
  "code": "AG",
  "display": false,
  "borders": []
}, {
  "id": 59,
  "name": "Eswatini",
  "continent": "Africa",
  "capital": "Mbabane",
  "surface": 17364,
  "population": 1235549,
  "code": "SZ",
  "display": false,
  "borders": ["Mozambique", "South Africa"]
}, {
  "id": 60,
  "name": "Taiwan",
  "continent": "Asia",
  "capital": "Taipei",
  "surface": 36197,
  "population": 23317031,
  "code": "TW",
  "display": false,
  "borders": []
}, {
  "id": 61,
  "name": "Vanuatu",
  "continent": "Oceania",
  "capital": "Port Vila",
  "surface": 12189,
  "population": 321409,
  "code": "VU",
  "display": false,
  "borders": []
}, {
  "id": 62,
  "name": "Cook Islands",
  "continent": "Oceania",
  "capital": "Avarua",
  "surface": 236,
  "population": 15040,
  "code": "CK",
  "display": false,
  "borders": []
}, {
  "id": 63,
  "name": "Cocos (Keeling) Islands",
  "continent": "Oceania",
  "capital": "West Island",
  "surface": 14,
  "population": 593,
  "code": "CC",
  "display": false,
  "borders": []
}, {
  "id": 64,
  "name": "Cape Verde",
  "continent": "Africa",
  "capital": "Praia",
  "surface": 4033,
  "population": 491233,
  "code": "CV",
  "display": false,
  "borders": []
}, {
  "id": 65,
  "name": "Belarus",
  "continent": "Europe",
  "capital": "Minsk",
  "surface": 207600,
  "population": 9109280,
  "code": "BY",
  "display": false,
  "borders": ["Latvia", "Lithuania", "Poland", "Russia", "Ukraine"]
}, {
  "id": 66,
  "name": "Czechia",
  "continent": "Europe",
  "capital": "Prague",
  "surface": 78865,
  "population": 10882341,
  "code": "CZ",
  "display": false,
  "borders": ["Austria", "Germany", "Poland", "Slovakia"]
}, {
  "id": 67,
  "name": "Peru",
  "continent": "Americas",
  "capital": "Lima",
  "surface": 1285216,
  "population": 34350244,
  "code": "PE",
  "display": false,
  "borders": ["Bolivia", "Brazil", "Chile", "Colombia", "Ecuador"]
}, {
  "id": 68,
  "name": "Timor-Leste",
  "continent": "Asia",
  "capital": "Dili",
  "surface": 14874,
  "population": 1391221,
  "code": "TL",
  "display": false,
  "borders": ["Indonesia"]
}, {
  "id": 69,
  "name": "Namibia",
  "continent": "Africa",
  "capital": "Windhoek",
  "surface": 825615,
  "population": 3022401,
  "code": "NA",
  "display": false,
  "borders": ["Angola", "Botswana", "South Africa", "Zambia"]
}, {
  "id": 70,
  "name": "Tokelau",
  "continent": "Oceania",
  "capital": "Fakaofo",
  "surface": 12,
  "population": 2608,
  "code": "TK",
  "display": false,
  "borders": []
}, {
  "id": 71,
  "name": "DR Congo",
  "continent": "Africa",
  "capital": "Kinshasa",
  "surface": 2344858,
  "population": 112832000,
  "code": "CD",
  "display": false,
  "borders": ["Angola", "Burundi", "Central African Republic", "Republic of the Congo", "Rwanda", "South Sudan", "Tanzania", "Uganda", "Zambia"]
}, {
  "id": 72,
  "name": "Saint Lucia",
  "continent": "Americas",
  "capital": "Castries",
  "surface": 616,
  "population": 184100,
  "code": "LC",
  "display": false,
  "borders": []
}, {
  "id": 73,
  "name": "Suriname",
  "continent": "Americas",
  "capital": "Paramaribo",
  "surface": 163820,
  "population": 616500,
  "code": "SR",
  "display": false,
  "borders": ["Brazil", "French Guiana", "Guyana"]
}, {
  "id": 74,
  "name": "Burundi",
  "continent": "Africa",
  "capital": "Gitega",
  "surface": 27834,
  "population": 12332788,
  "code": "BI",
  "display": false,
  "borders": ["DR Congo", "Rwanda", "Tanzania"]
}, {
  "id": 75,
  "name": "Georgia",
  "continent": "Asia",
  "capital": "Tbilisi",
  "surface": 69700,
  "population": 4000921,
  "code": "GE",
  "display": false,
  "borders": ["Armenia", "Azerbaijan", "Russia", "Turkey"]
}, {
  "id": 76,
  "name": "Ghana",
  "continent": "Africa",
  "capital": "Accra",
  "surface": 238533,
  "population": 33742380,
  "code": "GH",
  "display": false,
  "borders": ["Burkina Faso", "Ivory Coast", "Togo"]
}, {
  "id": 77,
  "name": "British Indian Ocean Territory",
  "continent": "Africa",
  "capital": "Diego Garcia",
  "surface": 60,
  "population": 0,
  "code": "IO",
  "display": false,
  "borders": []
}, {
  "id": 78,
  "name": "Egypt",
  "continent": "Africa",
  "capital": "Cairo",
  "surface": 1002450,
  "population": 107271260,
  "code": "EG",
  "display": false,
  "borders": ["Israel", "Libya", "Palestine", "Sudan"]
}, {
  "id": 79,
  "name": "French Guiana",
  "continent": "Americas",
  "capital": "Cayenne",
  "surface": 83534,
  "population": 292354,
  "code": "GF",
  "display": false,
  "borders": ["Brazil", "Suriname"]
}, {
  "id": 80,
  "name": "Marshall Islands",
  "continent": "Oceania",
  "capital": "Majuro",
  "surface": 181,
  "population": 42418,
  "code": "MH",
  "display": false,
  "borders": []
}, {
  "id": 81,
  "name": "Guinea-Bissau",
  "continent": "Africa",
  "capital": "Bissau",
  "surface": 36125,
  "population": 1781308,
  "code": "GW",
  "display": false,
  "borders": ["Guinea", "Senegal"]
}, {
  "id": 82,
  "name": "Fiji",
  "continent": "Oceania",
  "capital": "Suva",
  "surface": 18272,
  "population": 900869,
  "code": "FJ",
  "display": false,
  "borders": []
}, {
  "id": 83,
  "name": "Zambia",
  "continent": "Africa",
  "capital": "Lusaka",
  "surface": 752612,
  "population": 19693423,
  "code": "ZM",
  "display": false,
  "borders": ["Angola", "Botswana", "DR Congo", "Malawi", "Mozambique", "Namibia", "Tanzania", "Zimbabwe"]
}, {
  "id": 84,
  "name": "Iceland",
  "continent": "Europe",
  "capital": "Reykjavik",
  "surface": 103000,
  "population": 391810,
  "code": "IS",
  "display": false,
  "borders": []
}, {
  "id": 85,
  "name": "Bermuda",
  "continent": "Americas",
  "capital": "Hamilton",
  "surface": 54,
  "population": 64055,
  "code": "BM",
  "display": false,
  "borders": []
}, {
  "id": 86,
  "name": "Brazil",
  "continent": "Americas",
  "capital": "Brasília",
  "surface": 8515767,
  "population": 213421037,
  "code": "BR",
  "display": false,
  "borders": ["Argentina", "Bolivia", "Colombia", "French Guiana", "Guyana", "Paraguay", "Peru", "Suriname", "Uruguay", "Venezuela"]
}, {
  "id": 87,
  "name": "Palau",
  "continent": "Oceania",
  "capital": "Ngerulmud",
  "surface": 459,
  "population": 16733,
  "code": "PW",
  "display": false,
  "borders": []
}, {
  "id": 88,
  "name": "Sudan",
  "continent": "Africa",
  "capital": "Khartoum",
  "surface": 1886068,
  "population": 51662000,
  "code": "SD",
  "display": false,
  "borders": ["Central African Republic", "Chad", "Egypt", "Eritrea", "Ethiopia", "Libya", "South Sudan"]
}, {
  "id": 89,
  "name": "Australia",
  "continent": "Oceania",
  "capital": "Canberra",
  "surface": 7692024,
  "population": 27536874,
  "code": "AU",
  "display": false,
  "borders": []
}, {
  "id": 90,
  "name": "Cambodia",
  "continent": "Asia",
  "capital": "Phnom Penh",
  "surface": 181035,
  "population": 17577760,
  "code": "KH",
  "display": false,
  "borders": ["Laos", "Thailand", "Vietnam"]
}, {
  "id": 91,
  "name": "New Zealand",
  "continent": "Oceania",
  "capital": "Wellington",
  "surface": 268838,
  "population": 5324700,
  "code": "NZ",
  "display": false,
  "borders": []
}, {
  "id": 92,
  "name": "Philippines",
  "continent": "Asia",
  "capital": "Manila",
  "surface": 342353,
  "population": 114123600,
  "code": "PH",
  "display": false,
  "borders": []
}, {
  "id": 93,
  "name": "Burkina Faso",
  "continent": "Africa",
  "capital": "Ouagadougou",
  "surface": 272967,
  "population": 24070553,
  "code": "BF",
  "display": false,
  "borders": ["Benin", "Ivory Coast", "Ghana", "Mali", "Niger", "Togo"]
}, {
  "id": 94,
  "name": "Faroe Islands",
  "continent": "Europe",
  "capital": "Tórshavn",
  "surface": 1393,
  "population": 54885,
  "code": "FO",
  "display": false,
  "borders": []
}, {
  "id": 95,
  "name": "Sierra Leone",
  "continent": "Africa",
  "capital": "Freetown",
  "surface": 71740,
  "population": 9077691,
  "code": "SL",
  "display": false,
  "borders": ["Guinea", "Liberia"]
}, {
  "id": 96,
  "name": "Grenada",
  "continent": "Americas",
  "capital": "St. George's",
  "surface": 344,
  "population": 109021,
  "code": "GD",
  "display": false,
  "borders": []
}, {
  "id": 97,
  "name": "Bolivia",
  "continent": "Americas",
  "capital": "Sucre",
  "surface": 1098581,
  "population": 11365333,
  "code": "BO",
  "display": false,
  "borders": ["Argentina", "Brazil", "Chile", "Paraguay", "Peru"]
}, {
  "id": 98,
  "name": "Switzerland",
  "continent": "Europe",
  "capital": "Bern",
  "surface": 41284,
  "population": 9082848,
  "code": "CH",
  "display": false,
  "borders": ["Austria", "France", "Italy", "Liechtenstein", "Germany"]
}, {
  "id": 99,
  "name": "Saint Vincent and the Grenadines",
  "continent": "Americas",
  "capital": "Kingstown",
  "surface": 389,
  "population": 110872,
  "code": "VC",
  "display": false,
  "borders": []
}, {
  "id": 100,
  "name": "Ecuador",
  "continent": "Americas",
  "capital": "Quito",
  "surface": 276841,
  "population": 18103660,
  "code": "EC",
  "display": false,
  "borders": ["Colombia", "Peru"]
}, {
  "id": 101,
  "name": "Seychelles",
  "continent": "Africa",
  "capital": "Victoria",
  "surface": 452,
  "population": 122729,
  "code": "SC",
  "display": false,
  "borders": []
}, {
  "id": 102,
  "name": "South Africa",
  "continent": "Africa",
  "capital": "Pretoria",
  "surface": 1221037,
  "population": 63100945,
  "code": "ZA",
  "display": false,
  "borders": ["Botswana", "Lesotho", "Mozambique", "Namibia", "Eswatini", "Zimbabwe"]
}, {
  "id": 103,
  "name": "India",
  "continent": "Asia",
  "capital": "New Delhi",
  "surface": 3287263,
  "population": 1417492000,
  "code": "IN",
  "display": false,
  "borders": ["Bangladesh", "Bhutan", "Myanmar", "China", "Nepal", "Pakistan"]
}, {
  "id": 104,
  "name": "Liberia",
  "continent": "Africa",
  "capital": "Monrovia",
  "surface": 111369,
  "population": 5248621,
  "code": "LR",
  "display": false,
  "borders": ["Guinea", "Ivory Coast", "Sierra Leone"]
}, {
  "id": 105,
  "name": "South Korea",
  "continent": "Asia",
  "capital": "Seoul",
  "surface": 100210,
  "population": 51159889,
  "code": "KR",
  "display": false,
  "borders": ["North Korea"]
}, {
  "id": 106,
  "name": "Lithuania",
  "continent": "Europe",
  "capital": "Vilnius",
  "surface": 65300,
  "population": 2894886,
  "code": "LT",
  "display": false,
  "borders": ["Belarus", "Latvia", "Poland", "Russia"]
}, {
  "id": 107,
  "name": "Singapore",
  "continent": "Asia",
  "capital": "Singapore",
  "surface": 710,
  "population": 6110200,
  "code": "SG",
  "display": false,
  "borders": []
}, {
  "id": 108,
  "name": "Puerto Rico",
  "continent": "Americas",
  "capital": "San Juan",
  "surface": 8870,
  "population": 3203295,
  "code": "PR",
  "display": false,
  "borders": []
}, {
  "id": 109,
  "name": "Belize",
  "continent": "Americas",
  "capital": "Belmopan",
  "surface": 22966,
  "population": 417634,
  "code": "BZ",
  "display": false,
  "borders": ["Guatemala", "Mexico"]
}, {
  "id": 110,
  "name": "Netherlands",
  "continent": "Europe",
  "capital": "Amsterdam",
  "surface": 41865,
  "population": 18100436,
  "code": "NL",
  "display": false,
  "borders": ["Belgium", "Germany"]
}, {
  "id": 111,
  "name": "Eritrea",
  "continent": "Africa",
  "capital": "Asmara",
  "surface": 117600,
  "population": 3607000,
  "code": "ER",
  "display": false,
  "borders": ["Djibouti", "Ethiopia", "Sudan"]
}, {
  "id": 112,
  "name": "Montserrat",
  "continent": "Americas",
  "capital": "Plymouth",
  "surface": 102,
  "population": 4386,
  "code": "MS",
  "display": false,
  "borders": []
}, {
  "id": 113,
  "name": "Réunion",
  "continent": "Africa",
  "capital": "Saint-Denis",
  "surface": 2511,
  "population": 896175,
  "code": "RE",
  "display": false,
  "borders": []
}, {
  "id": 114,
  "name": "South Georgia",
  "continent": "Antarctic",
  "capital": "King Edward Point",
  "surface": 3903,
  "population": 0,
  "code": "GS",
  "display": false,
  "borders": []
}, {
  "id": 115,
  "name": "Bangladesh",
  "continent": "Asia",
  "capital": "Dhaka",
  "surface": 147570,
  "population": 169828911,
  "code": "BD",
  "display": false,
  "borders": ["Myanmar", "India"]
}, {
  "id": 116,
  "name": "Yemen",
  "continent": "Asia",
  "capital": "Sana'a",
  "surface": 527968,
  "population": 32684503,
  "code": "YE",
  "display": false,
  "borders": ["Oman", "Saudi Arabia"]
}, {
  "id": 117,
  "name": "Norway",
  "continent": "Europe",
  "capital": "Oslo",
  "surface": 386224,
  "population": 5606944,
  "code": "NO",
  "display": false,
  "borders": ["Finland", "Sweden", "Russia"]
}, {
  "id": 118,
  "name": "Slovenia",
  "continent": "Europe",
  "capital": "Ljubljana",
  "surface": 20273,
  "population": 2130638,
  "code": "SI",
  "display": false,
  "borders": ["Austria", "Croatia", "Italy", "Hungary"]
}, {
  "id": 119,
  "name": "Oman",
  "continent": "Asia",
  "capital": "Muscat",
  "surface": 309500,
  "population": 5343630,
  "code": "OM",
  "display": false,
  "borders": ["Saudi Arabia", "United Arab Emirates", "Yemen"]
}, {
  "id": 120,
  "name": "Mozambique",
  "continent": "Africa",
  "capital": "Maputo",
  "surface": 801590,
  "population": 34090466,
  "code": "MZ",
  "display": false,
  "borders": ["Malawi", "South Africa", "Eswatini", "Tanzania", "Zambia", "Zimbabwe"]
}, {
  "id": 121,
  "name": "Libya",
  "continent": "Africa",
  "capital": "Tripoli",
  "surface": 1759540,
  "population": 7459000,
  "code": "LY",
  "display": false,
  "borders": ["Algeria", "Chad", "Egypt", "Niger", "Sudan", "Tunisia"]
}, {
  "id": 122,
  "name": "Chad",
  "continent": "Africa",
  "capital": "N'Djamena",
  "surface": 1284000,
  "population": 19340757,
  "code": "TD",
  "display": false,
  "borders": ["Cameroon", "Central African Republic", "Libya", "Niger", "Nigeria", "Sudan"]
}, {
  "id": 123,
  "name": "Guyana",
  "continent": "Americas",
  "capital": "Georgetown",
  "surface": 214969,
  "population": 772975,
  "code": "GY",
  "display": false,
  "borders": ["Brazil", "Suriname", "Venezuela"]
}, {
  "id": 124,
  "name": "Kyrgyzstan",
  "continent": "Asia",
  "capital": "Bishkek",
  "surface": 199951,
  "population": 7281800,
  "code": "KG",
  "display": false,
  "borders": ["China", "Kazakhstan", "Tajikistan", "Uzbekistan"]
}, {
  "id": 125,
  "name": "Djibouti",
  "continent": "Africa",
  "capital": "Djibouti",
  "surface": 23200,
  "population": 1066809,
  "code": "DJ",
  "display": false,
  "borders": ["Eritrea", "Ethiopia", "Somalia"]
}, {
  "id": 126,
  "name": "Northern Mariana Islands",
  "continent": "Oceania",
  "capital": "Saipan",
  "surface": 464,
  "population": 47329,
  "code": "MP",
  "display": false,
  "borders": []
}, {
  "id": 127,
  "name": "United States",
  "continent": "Americas",
  "capital": "Washington, D.C.",
  "surface": 9525067,
  "population": 340110988,
  "code": "US",
  "display": false,
  "borders": ["Canada", "Mexico"]
}, {
  "id": 128,
  "name": "Togo",
  "continent": "Africa",
  "capital": "Lomé",
  "surface": 56785,
  "population": 8095498,
  "code": "TG",
  "display": false,
  "borders": ["Benin", "Burkina Faso", "Ghana"]
}, {
  "id": 129,
  "name": "Sri Lanka",
  "continent": "Asia",
  "capital": "Sri Jayawardenepura Kotte",
  "surface": 65610,
  "population": 21763170,
  "code": "LK",
  "display": false,
  "borders": []
}, {
  "id": 130,
  "name": "Comoros",
  "continent": "Africa",
  "capital": "Moroni",
  "surface": 1862,
  "population": 919901,
  "code": "KM",
  "display": false,
  "borders": []
}, {
  "id": 131,
  "name": "Cuba",
  "continent": "Americas",
  "capital": "Havana",
  "surface": 109884,
  "population": 9748007,
  "code": "CU",
  "display": false,
  "borders": []
}, {
  "id": 132,
  "name": "Guam",
  "continent": "Oceania",
  "capital": "Hagåtña",
  "surface": 549,
  "population": 153836,
  "code": "GU",
  "display": false,
  "borders": []
}, {
  "id": 133,
  "name": "Argentina",
  "continent": "Americas",
  "capital": "Buenos Aires",
  "surface": 2780400,
  "population": 46735004,
  "code": "AR",
  "display": false,
  "borders": ["Bolivia", "Brazil", "Chile", "Paraguay", "Uruguay"]
}, {
  "id": 134,
  "name": "Wallis and Futuna",
  "continent": "Oceania",
  "capital": "Mata-Utu",
  "surface": 142,
  "population": 11620,
  "code": "WF",
  "display": false,
  "borders": []
}, {
  "id": 135,
  "name": "Bhutan",
  "continent": "Asia",
  "capital": "Thimphu",
  "surface": 38394,
  "population": 784043,
  "code": "BT",
  "display": false,
  "borders": ["China", "India"]
}, {
  "id": 136,
  "name": "Lebanon",
  "continent": "Asia",
  "capital": "Beirut",
  "surface": 10452,
  "population": 5490000,
  "code": "LB",
  "display": false,
  "borders": ["Israel", "Syria"]
}, {
  "id": 137,
  "name": "Heard Island and McDonald Islands",
  "continent": "Antarctic",
  "capital": "",
  "surface": 412,
  "population": 0,
  "code": "HM",
  "display": false,
  "borders": []
}, {
  "id": 138,
  "name": "Lesotho",
  "continent": "Africa",
  "capital": "Maseru",
  "surface": 30355,
  "population": 2116427,
  "code": "LS",
  "display": false,
  "borders": ["South Africa"]
}, {
  "id": 139,
  "name": "Somalia",
  "continent": "Africa",
  "capital": "Mogadishu",
  "surface": 637657,
  "population": 19655000,
  "code": "SO",
  "display": false,
  "borders": ["Djibouti", "Ethiopia", "Kenya"]
}, {
  "id": 140,
  "name": "Dominica",
  "continent": "Americas",
  "capital": "Roseau",
  "surface": 751,
  "population": 67408,
  "code": "DM",
  "display": false,
  "borders": []
}, {
  "id": 141,
  "name": "Hungary",
  "continent": "Europe",
  "capital": "Budapest",
  "surface": 93028,
  "population": 9539502,
  "code": "HU",
  "display": false,
  "borders": ["Austria", "Croatia", "Romania", "Serbia", "Slovakia", "Slovenia", "Ukraine"]
}, {
  "id": 142,
  "name": "Luxembourg",
  "continent": "Europe",
  "capital": "Luxembourg",
  "surface": 2586,
  "population": 681973,
  "code": "LU",
  "display": false,
  "borders": ["Belgium", "France", "Germany"]
}, {
  "id": 143,
  "name": "San Marino",
  "continent": "Europe",
  "capital": "City of San Marino",
  "surface": 61,
  "population": 34132,
  "code": "SM",
  "display": false,
  "borders": ["Italy"]
}, {
  "id": 144,
  "name": "Afghanistan",
  "continent": "Asia",
  "capital": "Kabul",
  "surface": 652230,
  "population": 43844000,
  "code": "AF",
  "display": false,
  "borders": ["Iran", "Pakistan", "Turkmenistan", "Uzbekistan", "Tajikistan", "China"]
}, {
  "id": 145,
  "name": "Mauritania",
  "continent": "Africa",
  "capital": "Nouakchott",
  "surface": 1030700,
  "population": 4927532,
  "code": "MR",
  "display": false,
  "borders": ["Algeria", "Mali", "Senegal", "Western Sahara"]
}, {
  "id": 146,
  "name": "Algeria",
  "continent": "Africa",
  "capital": "Algiers",
  "surface": 2381741,
  "population": 47400000,
  "code": "DZ",
  "display": false,
  "borders": ["Tunisia", "Libya", "Niger", "Western Sahara", "Mauritania", "Mali", "Morocco"]
}, {
  "id": 147,
  "name": "Guadeloupe",
  "continent": "Americas",
  "capital": "Basse-Terre",
  "surface": 1628,
  "population": 378561,
  "code": "GP",
  "display": false,
  "borders": []
}, {
  "id": 148,
  "name": "Croatia",
  "continent": "Europe",
  "capital": "Zagreb",
  "surface": 56594,
  "population": 3866233,
  "code": "HR",
  "display": false,
  "borders": ["Bosnia and Herzegovina", "Hungary", "Montenegro", "Serbia", "Slovenia"]
}, {
  "id": 149,
  "name": "Bulgaria",
  "continent": "Europe",
  "capital": "Sofia",
  "surface": 110879,
  "population": 6437360,
  "code": "BG",
  "display": false,
  "borders": ["Greece", "North Macedonia", "Romania", "Serbia", "Turkey"]
}, {
  "id": 150,
  "name": "Niue",
  "continent": "Oceania",
  "capital": "Alofi",
  "surface": 260,
  "population": 1681,
  "code": "NU",
  "display": false,
  "borders": []
}, {
  "id": 151,
  "name": "Indonesia",
  "continent": "Asia",
  "capital": "Jakarta",
  "surface": 1904569,
  "population": 284438782,
  "code": "ID",
  "display": false,
  "borders": ["Timor-Leste", "Malaysia", "Papua New Guinea"]
}, {
  "id": 152,
  "name": "Belgium",
  "continent": "Europe",
  "capital": "Brussels",
  "surface": 30528,
  "population": 11825551,
  "code": "BE",
  "display": false,
  "borders": ["France", "Germany", "Luxembourg", "Netherlands"]
}, {
  "id": 153,
  "name": "Nauru",
  "continent": "Oceania",
  "capital": "Yaren",
  "surface": 21,
  "population": 11680,
  "code": "NR",
  "display": false,
  "borders": []
}, {
  "id": 154,
  "name": "French Polynesia",
  "continent": "Oceania",
  "capital": "Papeetē",
  "surface": 4167,
  "population": 279500,
  "code": "PF",
  "display": false,
  "borders": []
}, {
  "id": 155,
  "name": "Iraq",
  "continent": "Asia",
  "capital": "Baghdad",
  "surface": 438317,
  "population": 46118793,
  "code": "IQ",
  "display": false,
  "borders": ["Iran", "Jordan", "Kuwait", "Saudi Arabia", "Syria", "Turkey"]
}, {
  "id": 156,
  "name": "Madagascar",
  "continent": "Africa",
  "capital": "Antananarivo",
  "surface": 587041,
  "population": 31727042,
  "code": "MG",
  "display": false,
  "borders": []
}, {
  "id": 157,
  "name": "Vietnam",
  "continent": "Asia",
  "capital": "Hanoi",
  "surface": 331212,
  "population": 101343800,
  "code": "VN",
  "display": false,
  "borders": ["Cambodia", "China", "Laos"]
}, {
  "id": 158,
  "name": "Mauritius",
  "continent": "Africa",
  "capital": "Port Louis",
  "surface": 2040,
  "population": 1243741,
  "code": "MU",
  "display": false,
  "borders": []
}, {
  "id": 159,
  "name": "American Samoa",
  "continent": "Oceania",
  "capital": "Pago Pago",
  "surface": 199,
  "population": 49710,
  "code": "AS",
  "display": false,
  "borders": []
}, {
  "id": 160,
  "name": "Ivory Coast",
  "continent": "Africa",
  "capital": "Yamoussoukro",
  "surface": 322463,
  "population": 31719275,
  "code": "CI",
  "display": false,
  "borders": ["Burkina Faso", "Ghana", "Guinea", "Liberia", "Mali"]
}, {
  "id": 161,
  "name": "Caribbean Netherlands",
  "continent": "Americas",
  "capital": "Kralendijk",
  "surface": 328,
  "population": 31980,
  "code": "BQ",
  "display": false,
  "borders": []
}, {
  "id": 162,
  "name": "Liechtenstein",
  "continent": "Europe",
  "capital": "Vaduz",
  "surface": 160,
  "population": 40900,
  "code": "LI",
  "display": false,
  "borders": ["Austria", "Switzerland"]
}, {
  "id": 163,
  "name": "Italy",
  "continent": "Europe",
  "capital": "Rome",
  "surface": 301336,
  "population": 58927633,
  "code": "IT",
  "display": false,
  "borders": ["Austria", "France", "San Marino", "Slovenia", "Switzerland", "Vatican City"]
}, {
  "id": 164,
  "name": "Saint Kitts and Nevis",
  "continent": "Americas",
  "capital": "Basseterre",
  "surface": 261,
  "population": 51320,
  "code": "KN",
  "display": false,
  "borders": []
}, {
  "id": 165,
  "name": "Qatar",
  "continent": "Asia",
  "capital": "Doha",
  "surface": 11586,
  "population": 3173024,
  "code": "QA",
  "display": false,
  "borders": ["Saudi Arabia"]
}, {
  "id": 166,
  "name": "Turkey",
  "continent": "Asia",
  "capital": "Ankara",
  "surface": 783562,
  "population": 85664944,
  "code": "TR",
  "display": false,
  "borders": ["Armenia", "Azerbaijan", "Bulgaria", "Georgia", "Greece", "Iran", "Iraq", "Syria"]
}, {
  "id": 167,
  "name": "United States Virgin Islands",
  "continent": "Americas",
  "capital": "Charlotte Amalie",
  "surface": 347,
  "population": 87146,
  "code": "VI",
  "display": false,
  "borders": []
}, {
  "id": 168,
  "name": "Angola",
  "continent": "Africa",
  "capital": "Luanda",
  "surface": 1246700,
  "population": 36170961,
  "code": "AO",
  "display": false,
  "borders": ["Republic of the Congo", "DR Congo", "Zambia", "Namibia"]
}, {
  "id": 169,
  "name": "Kenya",
  "continent": "Africa",
  "capital": "Nairobi",
  "surface": 580367,
  "population": 53330978,
  "code": "KE",
  "display": false,
  "borders": ["Ethiopia", "Somalia", "South Sudan", "Tanzania", "Uganda"]
}, {
  "id": 170,
  "name": "Saudi Arabia",
  "continent": "Asia",
  "capital": "Riyadh",
  "surface": 2149690,
  "population": 35300280,
  "code": "SA",
  "display": false,
  "borders": ["Iraq", "Jordan", "Kuwait", "Oman", "Qatar", "United Arab Emirates", "Yemen"]
}, {
  "id": 171,
  "name": "South Sudan",
  "continent": "Africa",
  "capital": "Juba",
  "surface": 619745,
  "population": 15786898,
  "code": "SS",
  "display": false,
  "borders": ["Central African Republic", "DR Congo", "Ethiopia", "Kenya", "Sudan", "Uganda"]
}, {
  "id": 172,
  "name": "Turks and Caicos Islands",
  "continent": "Americas",
  "capital": "Cockburn Town",
  "surface": 948,
  "population": 50828,
  "code": "TC",
  "display": false,
  "borders": []
}, {
  "id": 173,
  "name": "Canada",
  "continent": "Americas",
  "capital": "Ottawa",
  "surface": 9984670,
  "population": 41651653,
  "code": "CA",
  "display": false,
  "borders": ["United States"]
}, {
  "id": 174,
  "name": "Niger",
  "continent": "Africa",
  "capital": "Niamey",
  "surface": 1267000,
  "population": 26312034,
  "code": "NE",
  "display": false,
  "borders": ["Algeria", "Benin", "Burkina Faso", "Chad", "Libya", "Mali", "Nigeria"]
}, {
  "id": 175,
  "name": "Gibraltar",
  "continent": "Europe",
  "capital": "Gibraltar",
  "surface": 6,
  "population": 38000,
  "code": "GI",
  "display": false,
  "borders": ["Spain"]
}, {
  "id": 176,
  "name": "Kuwait",
  "continent": "Asia",
  "capital": "Kuwait City",
  "surface": 17818,
  "population": 4881254,
  "code": "KW",
  "display": false,
  "borders": ["Iraq", "Saudi Arabia"]
}, {
  "id": 177,
  "name": "Venezuela",
  "continent": "Americas",
  "capital": "Caracas",
  "surface": 916445,
  "population": 28517000,
  "code": "VE",
  "display": false,
  "borders": ["Brazil", "Colombia", "Guyana"]
}, {
  "id": 178,
  "name": "Gambia",
  "continent": "Africa",
  "capital": "Banjul",
  "surface": 10689,
  "population": 2422712,
  "code": "GM",
  "display": false,
  "borders": ["Senegal"]
}, {
  "id": 179,
  "name": "Paraguay",
  "continent": "Americas",
  "capital": "Asunción",
  "surface": 406752,
  "population": 6109644,
  "code": "PY",
  "display": false,
  "borders": ["Argentina", "Bolivia", "Brazil"]
}, {
  "id": 180,
  "name": "Chile",
  "continent": "Americas",
  "capital": "Santiago",
  "surface": 756102,
  "population": 20206953,
  "code": "CL",
  "display": false,
  "borders": ["Argentina", "Bolivia", "Peru"]
}, {
  "id": 181,
  "name": "North Macedonia",
  "continent": "Europe",
  "capital": "Skopje",
  "surface": 25713,
  "population": 1822612,
  "code": "MK",
  "display": false,
  "borders": ["Albania", "Bulgaria", "Greece", "Kosovo", "Serbia"]
}, {
  "id": 182,
  "name": "Macau",
  "continent": "Asia",
  "capital": "",
  "surface": 30,
  "population": 685900,
  "code": "MO",
  "display": false,
  "borders": ["China"]
}, {
  "id": 183,
  "name": "Armenia",
  "continent": "Asia",
  "capital": "Yerevan",
  "surface": 29743,
  "population": 3076200,
  "code": "AM",
  "display": false,
  "borders": ["Azerbaijan", "Georgia", "Iran", "Turkey"]
}, {
  "id": 184,
  "name": "Botswana",
  "continent": "Africa",
  "capital": "Gaborone",
  "surface": 582000,
  "population": 2359609,
  "code": "BW",
  "display": false,
  "borders": ["Namibia", "South Africa", "Zambia", "Zimbabwe"]
}, {
  "id": 185,
  "name": "Nepal",
  "continent": "Asia",
  "capital": "Kathmandu",
  "surface": 147181,
  "population": 29911840,
  "code": "NP",
  "display": false,
  "borders": ["China", "India"]
}, {
  "id": 186,
  "name": "São Tomé and Príncipe",
  "continent": "Africa",
  "capital": "São Tomé",
  "surface": 964,
  "population": 209607,
  "code": "ST",
  "display": false,
  "borders": []
}, {
  "id": 187,
  "name": "Benin",
  "continent": "Africa",
  "capital": "Porto-Novo",
  "surface": 112622,
  "population": 13224860,
  "code": "BJ",
  "display": false,
  "borders": ["Burkina Faso", "Niger", "Nigeria", "Togo"]
}, {
  "id": 188,
  "name": "Solomon Islands",
  "continent": "Oceania",
  "capital": "Honiara",
  "surface": 28896,
  "population": 750325,
  "code": "SB",
  "display": false,
  "borders": []
}, {
  "id": 189,
  "name": "Guinea",
  "continent": "Africa",
  "capital": "Conakry",
  "surface": 245857,
  "population": 14363931,
  "code": "GN",
  "display": false,
  "borders": ["Ivory Coast", "Guinea-Bissau", "Liberia", "Mali", "Senegal", "Sierra Leone"]
}, {
  "id": 190,
  "name": "Mayotte",
  "continent": "Africa",
  "capital": "Mamoudzou",
  "surface": 374,
  "population": 320901,
  "code": "YT",
  "display": false,
  "borders": []
}, {
  "id": 191,
  "name": "Greenland",
  "continent": "Americas",
  "capital": "Nuuk",
  "surface": 2166086,
  "population": 56542,
  "code": "GL",
  "display": false,
  "borders": []
}, {
  "id": 192,
  "name": "Monaco",
  "continent": "Europe",
  "capital": "Monaco",
  "surface": 2,
  "population": 38423,
  "code": "MC",
  "display": false,
  "borders": ["France"]
}, {
  "id": 193,
  "name": "Pakistan",
  "continent": "Asia",
  "capital": "Islamabad",
  "surface": 796095,
  "population": 241499431,
  "code": "PK",
  "display": false,
  "borders": ["Afghanistan", "China", "India", "Iran"]
}, {
  "id": 194,
  "name": "Malaysia",
  "continent": "Asia",
  "capital": "Kuala Lumpur",
  "surface": 330803,
  "population": 34231700,
  "code": "MY",
  "display": false,
  "borders": ["Brunei", "Indonesia", "Thailand"]
}, {
  "id": 195,
  "name": "Kosovo",
  "continent": "Europe",
  "capital": "Pristina",
  "surface": 10908,
  "population": 1585566,
  "code": "XK",
  "display": false,
  "borders": ["Albania", "North Macedonia", "Montenegro", "Serbia"]
}, {
  "id": 196,
  "name": "Moldova",
  "continent": "Europe",
  "capital": "Chișinău",
  "surface": 33847,
  "population": 2749076,
  "code": "MD",
  "display": false,
  "borders": ["Romania", "Ukraine"]
}, {
  "id": 197,
  "name": "Tuvalu",
  "continent": "Oceania",
  "capital": "Funafuti",
  "surface": 26,
  "population": 10643,
  "code": "TV",
  "display": false,
  "borders": []
}, {
  "id": 198,
  "name": "Saint Pierre and Miquelon",
  "continent": "Americas",
  "capital": "Saint-Pierre",
  "surface": 242,
  "population": 5819,
  "code": "PM",
  "display": false,
  "borders": []
}, {
  "id": 199,
  "name": "Senegal",
  "continent": "Africa",
  "capital": "Dakar",
  "surface": 196722,
  "population": 18593258,
  "code": "SN",
  "display": false,
  "borders": ["Gambia", "Guinea", "Guinea-Bissau", "Mali", "Mauritania"]
}, {
  "id": 200,
  "name": "Panama",
  "continent": "Americas",
  "capital": "Panama City",
  "surface": 75417,
  "population": 4064780,
  "code": "PA",
  "display": false,
  "borders": ["Colombia", "Costa Rica"]
}, {
  "id": 201,
  "name": "Malta",
  "continent": "Europe",
  "capital": "Valletta",
  "surface": 316,
  "population": 574250,
  "code": "MT",
  "display": false,
  "borders": []
}, {
  "id": 202,
  "name": "Uganda",
  "continent": "Africa",
  "capital": "Kampala",
  "surface": 241550,
  "population": 45905417,
  "code": "UG",
  "display": false,
  "borders": ["DR Congo", "Kenya", "Rwanda", "South Sudan", "Tanzania"]
}, {
  "id": 203,
  "name": "Albania",
  "continent": "Europe",
  "capital": "Tirana",
  "surface": 28748,
  "population": 2363314,
  "code": "AL",
  "display": false,
  "borders": ["Montenegro", "Greece", "North Macedonia", "Kosovo"]
}, {
  "id": 204,
  "name": "United Arab Emirates",
  "continent": "Asia",
  "capital": "Abu Dhabi",
  "surface": 83600,
  "population": 11294243,
  "code": "AE",
  "display": false,
  "borders": ["Oman", "Saudi Arabia"]
}, {
  "id": 205,
  "name": "Costa Rica",
  "continent": "Americas",
  "capital": "San José",
  "surface": 51100,
  "population": 5309625,
  "code": "CR",
  "display": false,
  "borders": ["Nicaragua", "Panama"]
}, {
  "id": 206,
  "name": "Saint Barthélemy",
  "continent": "Americas",
  "capital": "Gustavia",
  "surface": 21,
  "population": 10562,
  "code": "BL",
  "display": false,
  "borders": []
}, {
  "id": 207,
  "name": "Saint Helena, Ascension and Tristan da Cunha",
  "continent": "Africa",
  "capital": "Jamestown",
  "surface": 394,
  "population": 5651,
  "code": "SH",
  "display": false,
  "borders": []
}, {
  "id": 208,
  "name": "Israel",
  "continent": "Asia",
  "capital": "Jerusalem",
  "surface": 21937,
  "population": 10134800,
  "code": "IL",
  "display": false,
  "borders": ["Egypt", "Jordan", "Lebanon", "Palestine", "Syria"]
}, {
  "id": 209,
  "name": "Austria",
  "continent": "Europe",
  "capital": "Vienna",
  "surface": 83871,
  "population": 9200931,
  "code": "AT",
  "display": false,
  "borders": ["Czechia", "Germany", "Hungary", "Italy", "Liechtenstein", "Slovakia", "Slovenia", "Switzerland"]
}, {
  "id": 210,
  "name": "Laos",
  "continent": "Asia",
  "capital": "Vientiane",
  "surface": 236800,
  "population": 7647000,
  "code": "LA",
  "display": false,
  "borders": ["Myanmar", "Cambodia", "China", "Thailand", "Vietnam"]
}, {
  "id": 211,
  "name": "France",
  "continent": "Europe",
  "capital": "Paris",
  "surface": 543908,
  "population": 66351959,
  "code": "FR",
  "display": false,
  "borders": ["Andorra", "Belgium", "Germany", "Italy", "Luxembourg", "Monaco", "Spain", "Switzerland"]
}, {
  "id": 212,
  "name": "Papua New Guinea",
  "continent": "Oceania",
  "capital": "Port Moresby",
  "surface": 462840,
  "population": 11781559,
  "code": "PG",
  "display": false,
  "borders": ["Indonesia"]
}, {
  "id": 213,
  "name": "Dominican Republic",
  "continent": "Americas",
  "capital": "Santo Domingo",
  "surface": 48671,
  "population": 10771504,
  "code": "DO",
  "display": false,
  "borders": ["Haiti"]
}, {
  "id": 214,
  "name": "Tonga",
  "continent": "Oceania",
  "capital": "Nuku'alofa",
  "surface": 747,
  "population": 100179,
  "code": "TO",
  "display": false,
  "borders": []
}, {
  "id": 215,
  "name": "Jamaica",
  "continent": "Americas",
  "capital": "Kingston",
  "surface": 10991,
  "population": 2825544,
  "code": "JM",
  "display": false,
  "borders": []
}, {
  "id": 216,
  "name": "Bouvet Island",
  "continent": "Antarctic",
  "capital": "",
  "surface": 49,
  "population": 0,
  "code": "BV",
  "display": false,
  "borders": []
}, {
  "id": 217,
  "name": "Slovakia",
  "continent": "Europe",
  "capital": "Bratislava",
  "surface": 49037,
  "population": 5413813,
  "code": "SK",
  "display": false,
  "borders": ["Austria", "Czechia", "Hungary", "Poland", "Ukraine"]
}, {
  "id": 218,
  "name": "Kiribati",
  "continent": "Oceania",
  "capital": "South Tarawa",
  "surface": 811,
  "population": 120740,
  "code": "KI",
  "display": false,
  "borders": []
}, {
  "id": 219,
  "name": "Jordan",
  "continent": "Asia",
  "capital": "Amman",
  "surface": 89342,
  "population": 11734000,
  "code": "JO",
  "display": false,
  "borders": ["Iraq", "Israel", "Palestine", "Saudi Arabia", "Syria"]
}, {
  "id": 220,
  "name": "Maldives",
  "continent": "Asia",
  "capital": "Malé",
  "surface": 300,
  "population": 515132,
  "code": "MV",
  "display": false,
  "borders": []
}, {
  "id": 221,
  "name": "Montenegro",
  "continent": "Europe",
  "capital": "Podgorica",
  "surface": 13812,
  "population": 623327,
  "code": "ME",
  "display": false,
  "borders": ["Albania", "Bosnia and Herzegovina", "Croatia", "Kosovo", "Serbia"]
}, {
  "id": 222,
  "name": "Japan",
  "continent": "Asia",
  "capital": "Tokyo",
  "surface": 377930,
  "population": 123210000,
  "code": "JP",
  "display": false,
  "borders": []
}, {
  "id": 223,
  "name": "El Salvador",
  "continent": "Americas",
  "capital": "San Salvador",
  "surface": 21041,
  "population": 6029976,
  "code": "SV",
  "display": false,
  "borders": ["Guatemala", "Honduras"]
}, {
  "id": 224,
  "name": "Colombia",
  "continent": "Americas",
  "capital": "Bogotá",
  "surface": 1141748,
  "population": 53057212,
  "code": "CO",
  "display": false,
  "borders": ["Brazil", "Ecuador", "Panama", "Peru", "Venezuela"]
}, {
  "id": 225,
  "name": "Zimbabwe",
  "continent": "Africa",
  "capital": "Harare",
  "surface": 390757,
  "population": 17073087,
  "code": "ZW",
  "display": false,
  "borders": ["Botswana", "Mozambique", "South Africa", "Zambia"]
}, {
  "id": 226,
  "name": "Equatorial Guinea",
  "continent": "Africa",
  "capital": "Malabo",
  "surface": 28051,
  "population": 1668768,
  "code": "GQ",
  "display": false,
  "borders": ["Cameroon", "Gabon"]
}, {
  "id": 227,
  "name": "China",
  "continent": "Asia",
  "capital": "Beijing",
  "surface": 9706961,
  "population": 1408280000,
  "code": "CN",
  "display": false,
  "borders": ["Afghanistan", "Bhutan", "Myanmar", "Hong Kong", "India", "Kazakhstan", "Nepal", "North Korea", "Kyrgyzstan", "Laos", "Macau", "Mongolia", "Pakistan", "Russia", "Tajikistan", "Vietnam"]
}, {
  "id": 228,
  "name": "Honduras",
  "continent": "Americas",
  "capital": "Tegucigalpa",
  "surface": 112492,
  "population": 9892632,
  "code": "HN",
  "display": false,
  "borders": ["Guatemala", "El Salvador", "Nicaragua"]
}, {
  "id": 229,
  "name": "Isle of Man",
  "continent": "Europe",
  "capital": "Douglas",
  "surface": 572,
  "population": 84530,
  "code": "IM",
  "display": false,
  "borders": []
}, {
  "id": 230,
  "name": "Republic of the Congo",
  "continent": "Africa",
  "capital": "Brazzaville",
  "surface": 342000,
  "population": 6142180,
  "code": "CG",
  "display": false,
  "borders": ["Angola", "Cameroon", "Central African Republic", "DR Congo", "Gabon"]
}, {
  "id": 231,
  "name": "Myanmar",
  "continent": "Asia",
  "capital": "Naypyidaw",
  "surface": 676578,
  "population": 51316756,
  "code": "MM",
  "display": false,
  "borders": ["Bangladesh", "China", "India", "Laos", "Thailand"]
}, {
  "id": 232,
  "name": "Greece",
  "continent": "Europe",
  "capital": "Athens",
  "surface": 131990,
  "population": 10400720,
  "code": "GR",
  "display": false,
  "borders": ["Albania", "Bulgaria", "Turkey", "North Macedonia"]
}, {
  "id": 233,
  "name": "Samoa",
  "continent": "Oceania",
  "capital": "Apia",
  "surface": 2842,
  "population": 205557,
  "code": "WS",
  "display": false,
  "borders": []
}, {
  "id": 234,
  "name": "Falkland Islands",
  "continent": "Americas",
  "capital": "Stanley",
  "surface": 12173,
  "population": 3662,
  "code": "FK",
  "display": false,
  "borders": []
}, {
  "id": 235,
  "name": "Tanzania",
  "continent": "Africa",
  "capital": "Dodoma",
  "surface": 947303,
  "population": 68153004,
  "code": "TZ",
  "display": false,
  "borders": ["Burundi", "DR Congo", "Kenya", "Malawi", "Mozambique", "Rwanda", "Uganda", "Zambia"]
}, {
  "id": 236,
  "name": "Central African Republic",
  "continent": "Africa",
  "capital": "Bangui",
  "surface": 622984,
  "population": 6470307,
  "code": "CF",
  "display": false,
  "borders": ["Cameroon", "Chad", "DR Congo", "Republic of the Congo", "South Sudan", "Sudan"]
}, {
  "id": 237,
  "name": "Romania",
  "continent": "Europe",
  "capital": "Bucharest",
  "surface": 238391,
  "population": 19036031,
  "code": "RO",
  "display": false,
  "borders": ["Bulgaria", "Hungary", "Moldova", "Serbia", "Ukraine"]
}, {
  "id": 238,
  "name": "United States Minor Outlying Islands",
  "continent": "Americas",
  "capital": "Washington DC",
  "surface": 34,
  "population": 0,
  "code": "UM",
  "display": false,
  "borders": []
}, {
  "id": 239,
  "name": "Tajikistan",
  "continent": "Asia",
  "capital": "Dushanbe",
  "surface": 143100,
  "population": 10499000,
  "code": "TJ",
  "display": false,
  "borders": ["Afghanistan", "China", "Kyrgyzstan", "Uzbekistan"]
}, {
  "id": 240,
  "name": "Bahamas",
  "continent": "Americas",
  "capital": "Nassau",
  "surface": 13943,
  "population": 398165,
  "code": "BS",
  "display": false,
  "borders": []
}, {
  "id": 241,
  "name": "Nigeria",
  "continent": "Africa",
  "capital": "Abuja",
  "surface": 923768,
  "population": 223800000,
  "code": "NG",
  "display": false,
  "borders": ["Benin", "Cameroon", "Chad", "Niger"]
}, {
  "id": 242,
  "name": "Vatican City",
  "continent": "Europe",
  "capital": "Vatican City",
  "surface": 0,
  "population": 882,
  "code": "VA",
  "display": false,
  "borders": ["Italy"]
}, {
  "id": 243,
  "name": "Bahrain",
  "continent": "Asia",
  "capital": "Manama",
  "surface": 765,
  "population": 1594654,
  "code": "BH",
  "display": false,
  "borders": []
}, {
  "id": 244,
  "name": "Thailand",
  "continent": "Asia",
  "capital": "Bangkok",
  "surface": 513120,
  "population": 65859640,
  "code": "TH",
  "display": false,
  "borders": ["Myanmar", "Cambodia", "Laos", "Malaysia"]
}, {
  "id": 245,
  "name": "Sweden",
  "continent": "Europe",
  "capital": "Stockholm",
  "surface": 450295,
  "population": 10605098,
  "code": "SE",
  "display": false,
  "borders": ["Finland", "Norway"]
}, {
  "id": 246,
  "name": "British Virgin Islands",
  "continent": "Americas",
  "capital": "Road Town",
  "surface": 151,
  "population": 39471,
  "code": "VG",
  "display": false,
  "borders": []
}, {
  "id": 247,
  "name": "Guernsey",
  "continent": "Europe",
  "capital": "St. Peter Port",
  "surface": 78,
  "population": 64781,
  "code": "GG",
  "display": false,
  "borders": []
}, {
  "id": 248,
  "name": "Guatemala",
  "continent": "Americas",
  "capital": "Guatemala City",
  "surface": 108889,
  "population": 18079810,
  "code": "GT",
  "display": false,
  "borders": ["Belize", "El Salvador", "Honduras", "Mexico"]
}, {
  "id": 249,
  "name": "Syria",
  "continent": "Asia",
  "capital": "Damascus",
  "surface": 185180,
  "population": 25620000,
  "code": "SY",
  "display": false,
  "borders": ["Iraq", "Israel", "Jordan", "Lebanon", "Turkey"]
}, {
  "id": 250,
  "name": "Turkmenistan",
  "continent": "Asia",
  "capital": "Ashgabat",
  "surface": 488100,
  "population": 7057841,
  "code": "TM",
  "display": false,
  "borders": ["Afghanistan", "Iran", "Kazakhstan", "Uzbekistan"]
}]


export const flagData = transformCountriesToPhotoQuiz(input);
