
import { Tense, TenseData } from './types';

export const SPANISH_VERB_DATA: TenseData[] = [
  {
    id: Tense.PRESENT,
    title: "Presente (현재 시제)",
    usage: "현재의 사실, 습관, 보편적 진리를 나타냅니다.",
    verbs: [
      {
        name: "Hablar", translation: "말하다",
        conjugations: [
          { pronoun: "Yo", form: "hablo" }, { pronoun: "Tú", form: "hablas" }, { pronoun: "Él/Ella/Ud.", form: "habla" },
          { pronoun: "Nosotros", form: "hablamos" }, { pronoun: "Vosotros", form: "habláis" }, { pronoun: "Ellos/Ellas/Uds.", form: "hablan" }
        ]
      },
      {
        name: "Comer", translation: "먹다",
        conjugations: [
          { pronoun: "Yo", form: "como" }, { pronoun: "Tú", form: "comes" }, { pronoun: "Él/Ella/Ud.", form: "come" },
          { pronoun: "Nosotros", form: "comemos" }, { pronoun: "Vosotros", form: "coméis" }, { pronoun: "Ellos/Ellas/Uds.", form: "comen" }
        ]
      },
      {
        name: "Vivir", translation: "살다",
        conjugations: [
          { pronoun: "Yo", form: "vivo" }, { pronoun: "Tú", form: "vives" }, { pronoun: "Él/Ella/Ud.", form: "vive" },
          { pronoun: "Nosotros", form: "vivimos" }, { pronoun: "Vosotros", form: "vivís" }, { pronoun: "Ellos/Ellas/Uds.", form: "viven" }
        ]
      },
      {
        name: "Ser", translation: "이다 (본질)", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "soy" }, { pronoun: "Tú", form: "eres" }, { pronoun: "Él/Ella/Ud.", form: "es" },
          { pronoun: "Nosotros", form: "somos" }, { pronoun: "Vosotros", form: "sois" }, { pronoun: "Ellos/Ellas/Uds.", form: "son" }
        ]
      },
      {
        name: "Estar", translation: "이다 (상태)", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "estoy" }, { pronoun: "Tú", form: "estás" }, { pronoun: "Él/Ella/Ud.", form: "está" },
          { pronoun: "Nosotros", form: "estamos" }, { pronoun: "Vosotros", form: "estáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "están" }
        ]
      },
      {
        name: "Ir", translation: "가다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "voy" }, { pronoun: "Tú", form: "vas" }, { pronoun: "Él/Ella/Ud.", form: "va" },
          { pronoun: "Nosotros", form: "vamos" }, { pronoun: "Vosotros", form: "vais" }, { pronoun: "Ellos/Ellas/Uds.", form: "van" }
        ]
      },
      {
        name: "Tener", translation: "가지다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "tengo" }, { pronoun: "Tú", form: "tienes" }, { pronoun: "Él/Ella/Ud.", form: "tiene" },
          { pronoun: "Nosotros", form: "tenemos" }, { pronoun: "Vosotros", form: "tenéis" }, { pronoun: "Ellos/Ellas/Uds.", form: "tienen" }
        ]
      }
    ]
  },
  {
    id: Tense.PROGRESSIVE,
    title: "Presente Progresivo (현재 진행)",
    usage: "현재 진행 중인 동작을 나타냅니다 (Estar + 현재분사).",
    verbs: [
      {
        name: "Estar + Hablar", translation: "말하고 있다",
        conjugations: [
          { pronoun: "Yo", form: "estoy hablando" }, { pronoun: "Tú", form: "estás hablando" }, { pronoun: "Él/Ella/Ud.", form: "está hablando" },
          { pronoun: "Nosotros", form: "estamos hablando" }, { pronoun: "Vosotros", form: "estáis hablando" }, { pronoun: "Ellos/Ellas/Uds.", form: "están hablando" }
        ]
      },
      {
        name: "Estar + Comer", translation: "먹고 있다",
        conjugations: [
          { pronoun: "Yo", form: "estoy comiendo" }, { pronoun: "Tú", form: "estás comiendo" }, { pronoun: "Él/Ella/Ud.", form: "está comiendo" },
          { pronoun: "Nosotros", form: "estamos comiendo" }, { pronoun: "Vosotros", form: "estáis comiendo" }, { pronoun: "Ellos/Ellas/Uds.", form: "están comiendo" }
        ]
      },
      {
        name: "Estar + Vivir", translation: "살고 있다",
        conjugations: [
          { pronoun: "Yo", form: "estoy viviendo" }, { pronoun: "Tú", form: "estás viviendo" }, { pronoun: "Él/Ella/Ud.", form: "está viviendo" },
          { pronoun: "Nosotros", form: "estamos viviendo" }, { pronoun: "Vosotros", form: "estáis viviendo" }, { pronoun: "Ellos/Ellas/Uds.", form: "están viviendo" }
        ]
      },
      {
        name: "Estar + Ir", translation: "가고 있다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "estoy yendo" }, { pronoun: "Tú", form: "estás yendo" }, { pronoun: "Él/Ella/Ud.", form: "está yendo" },
          { pronoun: "Nosotros", form: "estamos yendo" }, { pronoun: "Vosotros", form: "estáis yendo" }, { pronoun: "Ellos/Ellas/Uds.", form: "están yendo" }
        ]
      }
    ]
  },
  {
    id: Tense.PRETERITE,
    title: "Pretérito Indefinido (단순 과거)",
    usage: "과거의 특정 시점에 완료된 동작을 나타냅니다.",
    verbs: [
      {
        name: "Hablar", translation: "말했다",
        conjugations: [
          { pronoun: "Yo", form: "hablé" }, { pronoun: "Tú", form: "hablaste" }, { pronoun: "Él/Ella/Ud.", form: "habló" },
          { pronoun: "Nosotros", form: "hablamos" }, { pronoun: "Vosotros", form: "hablasteis" }, { pronoun: "Ellos/Ellas/Uds.", form: "hablaron" }
        ]
      },
      {
        name: "Comer", translation: "먹었다",
        conjugations: [
          { pronoun: "Yo", form: "comí" }, { pronoun: "Tú", form: "comiste" }, { pronoun: "Él/Ella/Ud.", form: "comió" },
          { pronoun: "Nosotros", form: "comimos" }, { pronoun: "Vosotros", form: "comisteis" }, { pronoun: "Ellos/Ellas/Uds.", form: "comieron" }
        ]
      }
    ]
  },
  {
    id: Tense.IMPERFECT,
    title: "Pretérito Imperfecto (불완료 과거)",
    usage: "과거의 반복적 행동이나 상태, 배경 묘사를 나타냅니다.",
    verbs: [
      {
        name: "Hablar", translation: "말하곤 했다",
        conjugations: [
          { pronoun: "Yo", form: "hablaba" }, { pronoun: "Tú", form: "hablabas" }, { pronoun: "Él/Ella/Ud.", form: "hablaba" },
          { pronoun: "Nosotros", form: "hablábamos" }, { pronoun: "Vosotros", form: "hablabais" }, { pronoun: "Ellos/Ellas/Uds.", form: "hablaban" }
        ]
      }
    ]
  },
  {
    id: Tense.FUTURE,
    title: "Futuro Simple (단순 미래)",
    usage: "미래의 일이나 현재의 추측을 나타냅니다.",
    verbs: [
      {
        name: "Hablar", translation: "말할 것이다",
        conjugations: [
          { pronoun: "Yo", form: "hablaré" }, { pronoun: "Tú", form: "hablarás" }, { pronoun: "Él/Ella/Ud.", form: "hablará" },
          { pronoun: "Nosotros", form: "hablaremos" }, { pronoun: "Vosotros", form: "hablaréis" }, { pronoun: "Ellos/Ellas/Uds.", form: "hablarán" }
        ]
      }
    ]
  },
  {
    id: Tense.PRESENT_PERFECT,
    title: "Pretérito Perfecto (현재 완료)",
    usage: "과거에 시작되어 현재와 연관된 동작을 나타냅니다.",
    verbs: [
      {
        name: "Haber + Hablar", translation: "말했다(현재까지 영향)",
        conjugations: [
          { pronoun: "Yo", form: "he hablado" }, { pronoun: "Tú", form: "has hablado" }, { pronoun: "Él/Ella/Ud.", form: "ha hablado" },
          { pronoun: "Nosotros", form: "hemos hablado" }, { pronoun: "Vosotros", form: "habéis hablado" }, { pronoun: "Ellos/Ellas/Uds.", form: "han hablado" }
        ]
      }
    ]
  },
  {
    id: Tense.PAST_PERFECT,
    title: "Pretérito Pluscuamperfecto (과거 완료)",
    usage: "과거의 어느 시점보다 더 이전에 일어난 일을 나타냅니다 (Haber + 과거분사).",
    verbs: [
      {
        name: "Haber + Hablar", translation: "말했었었다",
        conjugations: [
          { pronoun: "Yo", form: "había hablado" }, { pronoun: "Tú", form: "habías hablado" }, { pronoun: "Él/Ella/Ud.", form: "había hablado" },
          { pronoun: "Nosotros", form: "habíamos hablado" }, { pronoun: "Vosotros", form: "habíais hablado" }, { pronoun: "Ellos/Ellas/Uds.", form: "habían hablado" }
        ]
      }
    ]
  },
  {
    id: Tense.AFFIRMATIVE_IMPERATIVE,
    title: "Imperativo Afirmativo (긍정 명령형)",
    usage: "상대방에게 무엇을 하라고 명령하거나 권유할 때 사용합니다.",
    verbs: [
      {
        name: "Hablar", translation: "말해라",
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "habla" }, { pronoun: "Él/Ella/Ud.", form: "hable" },
          { pronoun: "Nosotros", form: "hablemos" }, { pronoun: "Vosotros", form: "hablad" }, { pronoun: "Ellos/Ellas/Uds.", form: "hablen" }
        ]
      },
      {
        name: "Comer", translation: "먹어라",
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "come" }, { pronoun: "Él/Ella/Ud.", form: "coma" },
          { pronoun: "Nosotros", form: "comamos" }, { pronoun: "Vosotros", form: "comed" }, { pronoun: "Ellos/Ellas/Uds.", form: "coman" }
        ]
      },
      {
        name: "Vivir", translation: "살아라",
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "vive" }, { pronoun: "Él/Ella/Ud.", form: "viva" },
          { pronoun: "Nosotros", form: "vivamos" }, { pronoun: "Vosotros", form: "vivid" }, { pronoun: "Ellos/Ellas/Uds.", form: "vivan" }
        ]
      },
      {
        name: "Dar", translation: "주어라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "da" }, { pronoun: "Él/Ella/Ud.", form: "dé" },
          { pronoun: "Nosotros", form: "demos" }, { pronoun: "Vosotros", form: "dad" }, { pronoun: "Ellos/Ellas/Uds.", form: "den" }
        ]
      },
      {
        name: "Ser", translation: "이어라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "sé" }, { pronoun: "Él/Ella/Ud.", form: "sea" },
          { pronoun: "Nosotros", form: "seamos" }, { pronoun: "Vosotros", form: "sed" }, { pronoun: "Ellos/Ellas/Uds.", form: "sed" }
        ]
      },
      {
        name: "Ver", translation: "보아라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "ve" }, { pronoun: "Él/Ella/Ud.", form: "vea" },
          { pronoun: "Nosotros", form: "veamos" }, { pronoun: "Vosotros", form: "ved" }, { pronoun: "Ellos/Ellas/Uds.", form: "vean" }
        ]
      },
      {
        name: "Ir", translation: "가라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "ve" }, { pronoun: "Él/Ella/Ud.", form: "vaya" },
          { pronoun: "Nosotros", form: "vayamos" }, { pronoun: "Vosotros", form: "id" }, { pronoun: "Ellos/Ellas/Uds.", form: "vayan" }
        ]
      },
      {
        name: "Decir", translation: "말해라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "di" }, { pronoun: "Él/Ella/Ud.", form: "diga" },
          { pronoun: "Nosotros", form: "digamos" }, { pronoun: "Vosotros", form: "decid" }, { pronoun: "Ellos/Ellas/Uds.", form: "digan" }
        ]
      },
      {
        name: "Hacer", translation: "해라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "haz" }, { pronoun: "Él/Ella/Ud.", form: "haga" },
          { pronoun: "Nosotros", form: "hagamos" }, { pronoun: "Vosotros", form: "haced" }, { pronoun: "Ellos/Ellas/Uds.", form: "hagan" }
        ]
      },
      {
        name: "Poner", translation: "놓아라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "pon" }, { pronoun: "Él/Ella/Ud.", form: "ponga" },
          { pronoun: "Nosotros", form: "pongamos" }, { pronoun: "Vosotros", form: "poned" }, { pronoun: "Ellos/Ellas/Uds.", form: "pongan" }
        ]
      },
      {
        name: "Salir", translation: "나가라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "sal" }, { pronoun: "Él/Ella/Ud.", form: "salga" },
          { pronoun: "Nosotros", form: "salgamos" }, { pronoun: "Vosotros", form: "salid" }, { pronoun: "Ellos/Ellas/Uds.", form: "salgan" }
        ]
      },
      {
        name: "Tener", translation: "가져라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "ten" }, { pronoun: "Él/Ella/Ud.", form: "tenga" },
          { pronoun: "Nosotros", form: "tengamos" }, { pronoun: "Vosotros", form: "tened" }, { pronoun: "Ellos/Ellas/Uds.", form: "tengan" }
        ]
      },
      {
        name: "Venir", translation: "와라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "ven" }, { pronoun: "Él/Ella/Ud.", form: "venga" },
          { pronoun: "Nosotros", form: "vengamos" }, { pronoun: "Vosotros", form: "venid" }, { pronoun: "Ellos/Ellas/Uds.", form: "vengan" }
        ]
      }
    ]
  },
  {
    id: Tense.NEGATIVE_IMPERATIVE,
    title: "Imperativo Negativo (부정 명령형)",
    usage: "상대방에게 무엇을 하지 말라고 명령할 때 사용합니다 (No + 접속법 현재).",
    verbs: [
      {
        name: "Hablar", translation: "말하지 마라",
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no hables" }, { pronoun: "Él/Ella/Ud.", form: "no hable" },
          { pronoun: "Nosotros", form: "no hablemos" }, { pronoun: "Vosotros", form: "no habléis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no hablen" }
        ]
      },
      {
        name: "Comer", translation: "먹지 마라",
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no comas" }, { pronoun: "Él/Ella/Ud.", form: "no coma" },
          { pronoun: "Nosotros", form: "no comamos" }, { pronoun: "Vosotros", form: "no comáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no coman" }
        ]
      },
      {
        name: "Vivir", translation: "살지 마라",
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no vivas" }, { pronoun: "Él/Ella/Ud.", form: "no viva" },
          { pronoun: "Nosotros", form: "no vivamos" }, { pronoun: "Vosotros", form: "no viváis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no vivan" }
        ]
      },
      {
        name: "Dar", translation: "주지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no des" }, { pronoun: "Él/Ella/Ud.", form: "no dé" },
          { pronoun: "Nosotros", form: "no demos" }, { pronoun: "Vosotros", form: "no deis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no den" }
        ]
      },
      {
        name: "Ser", translation: "이지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no seas" }, { pronoun: "Él/Ella/Ud.", form: "no sea" },
          { pronoun: "Nosotros", form: "no seamos" }, { pronoun: "Vosotros", form: "no seáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no sean" }
        ]
      },
      {
        name: "Ver", translation: "보지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no veas" }, { pronoun: "Él/Ella/Ud.", form: "no vea" },
          { pronoun: "Nosotros", form: "no veamos" }, { pronoun: "Vosotros", form: "no veáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no vean" }
        ]
      },
      {
        name: "Ir", translation: "가지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no vayas" }, { pronoun: "Él/Ella/Ud.", form: "no vaya" },
          { pronoun: "Nosotros", form: "no vayamos" }, { pronoun: "Vosotros", form: "no vayáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no vayan" }
        ]
      },
      {
        name: "Decir", translation: "말하지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no digas" }, { pronoun: "Él/Ella/Ud.", form: "no diga" },
          { pronoun: "Nosotros", form: "no digamos" }, { pronoun: "Vosotros", form: "no digáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no digan" }
        ]
      },
      {
        name: "Hacer", translation: "하지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no hagas" }, { pronoun: "Él/Ella/Ud.", form: "no haga" },
          { pronoun: "Nosotros", form: "no hagamos" }, { pronoun: "Vosotros", form: "no hagáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no hagan" }
        ]
      },
      {
        name: "Poner", translation: "놓지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no pongas" }, { pronoun: "Él/Ella/Ud.", form: "no ponga" },
          { pronoun: "Nosotros", form: "no pongamos" }, { pronoun: "Vosotros", form: "no pongáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no pongan" }
        ]
      },
      {
        name: "Salir", translation: "나가지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no salgas" }, { pronoun: "Él/Ella/Ud.", form: "no salga" },
          { pronoun: "Nosotros", form: "no salgamos" }, { pronoun: "Vosotros", form: "no salgáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no salgan" }
        ]
      },
      {
        name: "Tener", translation: "가지지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no tengas" }, { pronoun: "Él/Ella/Ud.", form: "no tenga" },
          { pronoun: "Nosotros", form: "no tengamos" }, { pronoun: "Vosotros", form: "no tengáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no tengan" }
        ]
      },
      {
        name: "Venir", translation: "오지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no vengas" }, { pronoun: "Él/Ella/Ud.", form: "no venga" },
          { pronoun: "Nosotros", form: "no vengamos" }, { pronoun: "Vosotros", form: "no vengáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no vengan" }
        ]
      }
    ]
  }
];
