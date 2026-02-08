
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
      },
      {
        name: "Saber", translation: "알다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "sé" }, { pronoun: "Tú", form: "sabes" }, { pronoun: "Él/Ella/Ud.", form: "sabe" },
          { pronoun: "Nosotros", form: "sabemos" }, { pronoun: "Vosotros", form: "sabéis" }, { pronoun: "Ellos/Ellas/Uds.", form: "saben" }
        ]
      },
      {
        name: "Poder", translation: "할 수 있다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "puedo" }, { pronoun: "Tú", form: "puedes" }, { pronoun: "Él/Ella/Ud.", form: "puede" },
          { pronoun: "Nosotros", form: "podemos" }, { pronoun: "Vosotros", form: "podéis" }, { pronoun: "Ellos/Ellas/Uds.", form: "pueden" }
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
      },
      {
        name: "Estar + Leer", translation: "읽고 있다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "estoy leyendo" }, { pronoun: "Tú", form: "estás leyendo" }, { pronoun: "Él/Ella/Ud.", form: "está leyendo" },
          { pronoun: "Nosotros", form: "estamos leyendo" }, { pronoun: "Vosotros", form: "estáis leyendo" }, { pronoun: "Ellos/Ellas/Uds.", form: "están leyendo" }
        ]
      },
      {
        name: "Estar + Repetir", translation: "반복하고 있다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "estoy repitiendo" }, { pronoun: "Tú", form: "estás repitiendo" }, { pronoun: "Él/Ella/Ud.", form: "está repitiendo" },
          { pronoun: "Nosotros", form: "estamos repitiendo" }, { pronoun: "Vosotros", form: "estáis repitiendo" }, { pronoun: "Ellos/Ellas/Uds.", form: "están repitiendo" }
        ]
      },
      {
        name: "Estar + Decir", translation: "말하고 있다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "estoy diciendo" }, { pronoun: "Tú", form: "estás diciendo" }, { pronoun: "Él/Ella/Ud.", form: "está diciendo" },
          { pronoun: "Nosotros", form: "estamos diciendo" }, { pronoun: "Vosotros", form: "estáis diciendo" }, { pronoun: "Ellos/Ellas/Uds.", form: "están diciendo" }
        ]
      },
      {
        name: "Estar + Venir", translation: "오고 있다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "estoy viniendo" }, { pronoun: "Tú", form: "estás viniendo" }, { pronoun: "Él/Ella/Ud.", form: "está viniendo" },
          { pronoun: "Nosotros", form: "estamos viniendo" }, { pronoun: "Vosotros", form: "estáis viniendo" }, { pronoun: "Ellos/Ellas/Uds.", form: "están viniendo" }
        ]
      },
      {
        name: "Estar + Dormir", translation: "자고 있다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "estoy durmiendo" }, { pronoun: "Tú", form: "estás durmiendo" }, { pronoun: "Él/Ella/Ud.", form: "está durmiendo" },
          { pronoun: "Nosotros", form: "estamos durmiendo" }, { pronoun: "Vosotros", form: "estáis durmiendo" }, { pronoun: "Ellos/Ellas/Uds.", form: "están durmiendo" }
        ]
      },
      {
        name: "Estar + Morir", translation: "죽어가고 있다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "estoy muriendo" }, { pronoun: "Tú", form: "estás muriendo" }, { pronoun: "Él/Ella/Ud.", form: "está muriendo" },
          { pronoun: "Nosotros", form: "estamos muriendo" }, { pronoun: "Vosotros", form: "estáis muriendo" }, { pronoun: "Ellos/Ellas/Uds.", form: "están muriendo" }
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
      },
      {
        name: "Vivir", translation: "살았다",
        conjugations: [
          { pronoun: "Yo", form: "viví" }, { pronoun: "Tú", form: "viviste" }, { pronoun: "Él/Ella/Ud.", form: "vivió" },
          { pronoun: "Nosotros", form: "vivimos" }, { pronoun: "Vosotros", form: "vivisteis" }, { pronoun: "Ellos/Ellas/Uds.", form: "vivieron" }
        ]
      },
      {
        name: "Estar", translation: "있었다 (위치/상태)", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "estuve" }, { pronoun: "Tú", form: "estuviste" }, { pronoun: "Él/Ella/Ud.", form: "estuvo" },
          { pronoun: "Nosotros", form: "estuvimos" }, { pronoun: "Vosotros", form: "estuvisteis" }, { pronoun: "Ellos/Ellas/Uds.", form: "estuvieron" }
        ]
      },
      {
        name: "Tener", translation: "가졌다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "tuve" }, { pronoun: "Tú", form: "tuviste" }, { pronoun: "Él/Ella/Ud.", form: "tuvo" },
          { pronoun: "Nosotros", form: "tuvimos" }, { pronoun: "Vosotros", form: "tuvisteis" }, { pronoun: "Ellos/Ellas/Uds.", form: "tuvieron" }
        ]
      },
      {
        name: "Poder", translation: "할 수 있었다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "pude" }, { pronoun: "Tú", form: "pudiste" }, { pronoun: "Él/Ella/Ud.", form: "pudo" },
          { pronoun: "Nosotros", form: "pudimos" }, { pronoun: "Vosotros", form: "pudisteis" }, { pronoun: "Ellos/Ellas/Uds.", form: "pudieron" }
        ]
      },
      {
        name: "Poner", translation: "놓았다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "puse" }, { pronoun: "Tú", form: "pusiste" }, { pronoun: "Él/Ella/Ud.", form: "puso" },
          { pronoun: "Nosotros", form: "pusimos" }, { pronoun: "Vosotros", form: "pusisteis" }, { pronoun: "Ellos/Ellas/Uds.", form: "pusieron" }
        ]
      },
      {
        name: "Querer", translation: "원했다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "quise" }, { pronoun: "Tú", form: "quisiste" }, { pronoun: "Él/Ella/Ud.", form: "quiso" },
          { pronoun: "Nosotros", form: "quisimos" }, { pronoun: "Vosotros", form: "quisisteis" }, { pronoun: "Ellos/Ellas/Uds.", form: "quisieron" }
        ]
      },
      {
        name: "Saber", translation: "알았다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "supe" }, { pronoun: "Tú", form: "supiste" }, { pronoun: "Él/Ella/Ud.", form: "supo" },
          { pronoun: "Nosotros", form: "supimos" }, { pronoun: "Vosotros", form: "supisteis" }, { pronoun: "Ellos/Ellas/Uds.", form: "supieron" }
        ]
      },
      {
        name: "Venir", translation: "왔다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "vine" }, { pronoun: "Tú", form: "viniste" }, { pronoun: "Él/Ella/Ud.", form: "vino" },
          { pronoun: "Nosotros", form: "vinimos" }, { pronoun: "Vosotros", form: "vinisteis" }, { pronoun: "Ellos/Ellas/Uds.", form: "vinieron" }
        ]
      },
      {
        name: "Decir", translation: "말했다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "dije" }, { pronoun: "Tú", form: "dijiste" }, { pronoun: "Él/Ella/Ud.", form: "dijo" },
          { pronoun: "Nosotros", form: "dijimos" }, { pronoun: "Vosotros", form: "dijisteis" }, { pronoun: "Ellos/Ellas/Uds.", form: "dijeron" }
        ]
      },
      {
        name: "Dar", translation: "주었다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "di" }, { pronoun: "Tú", form: "diste" }, { pronoun: "Él/Ella/Ud.", form: "dio" },
          { pronoun: "Nosotros", form: "dimos" }, { pronoun: "Vosotros", form: "disteis" }, { pronoun: "Ellos/Ellas/Uds.", form: "dieron" }
        ]
      },
      {
        name: "Hacer", translation: "했다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "hice" }, { pronoun: "Tú", form: "hiciste" }, { pronoun: "Él/Ella/Ud.", form: "hizo" },
          { pronoun: "Nosotros", form: "hicimos" }, { pronoun: "Vosotros", form: "hicisteis" }, { pronoun: "Ellos/Ellas/Uds.", form: "hicieron" }
        ]
      },
      {
        name: "Haber (Hay)", translation: "있었다 (Hubo)", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "hube" }, { pronoun: "Tú", form: "hubiste" }, { pronoun: "Él/Ella/Ud.", form: "hubo" },
          { pronoun: "Nosotros", form: "hubimos" }, { pronoun: "Vosotros", form: "hubisteis" }, { pronoun: "Ellos/Ellas/Uds.", form: "hubieron" }
        ]
      },
      {
        name: "Ser / Ir", translation: "이었다 / 갔다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "fui" }, { pronoun: "Tú", form: "fuiste" }, { pronoun: "Él/Ella/Ud.", form: "fue" },
          { pronoun: "Nosotros", form: "fuimos" }, { pronoun: "Vosotros", form: "fuisteis" }, { pronoun: "Ellos/Ellas/Uds.", form: "fueron" }
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
      },
      {
        name: "Comer", translation: "먹곤 했다",
        conjugations: [
          { pronoun: "Yo", form: "comía" }, { pronoun: "Tú", form: "comías" }, { pronoun: "Él/Ella/Ud.", form: "comía" },
          { pronoun: "Nosotros", form: "comíamos" }, { pronoun: "Vosotros", form: "comíais" }, { pronoun: "Ellos/Ellas/Uds.", form: "comían" }
        ]
      },
      {
        name: "Vivir", translation: "살곤 했다",
        conjugations: [
          { pronoun: "Yo", form: "vivía" }, { pronoun: "Tú", form: "vivías" }, { pronoun: "Él/Ella/Ud.", form: "vivía" },
          { pronoun: "Nosotros", form: "vivíamos" }, { pronoun: "Vosotros", form: "vivíais" }, { pronoun: "Ellos/Ellas/Uds.", form: "vivían" }
        ]
      },
      {
        name: "Ser", translation: "이었다 (상태/본질)", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "era" }, { pronoun: "Tú", form: "eras" }, { pronoun: "Él/Ella/Ud.", form: "era" },
          { pronoun: "Nosotros", form: "éramos" }, { pronoun: "Vosotros", form: "erais" }, { pronoun: "Ellos/Ellas/Uds.", form: "eran" }
        ]
      },
      {
        name: "Ir", translation: "가곤 했다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "iba" }, { pronoun: "Tú", form: "ibas" }, { pronoun: "Él/Ella/Ud.", form: "iba" },
          { pronoun: "Nosotros", form: "íbamos" }, { pronoun: "Vosotros", form: "ibais" }, { pronoun: "Ellos/Ellas/Uds.", form: "iban" }
        ]
      },
      {
        name: "Ver", translation: "보곤 했다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "veía" }, { pronoun: "Tú", form: "veías" }, { pronoun: "Él/Ella/Ud.", form: "veía" },
          { pronoun: "Nosotros", form: "veíamos" }, { pronoun: "Vosotros", form: "veíais" }, { pronoun: "Ellos/Ellas/Uds.", form: "veían" }
        ]
      },
      {
        name: "Estar", translation: "있었다 (상태)",
        conjugations: [
          { pronoun: "Yo", form: "estaba" }, { pronoun: "Tú", form: "estabas" }, { pronoun: "Él/Ella/Ud.", form: "estaba" },
          { pronoun: "Nosotros", form: "estábamos" }, { pronoun: "Vosotros", form: "estabais" }, { pronoun: "Ellos/Ellas/Uds.", form: "estaban" }
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
      },
      {
        name: "Comer", translation: "먹을 것이다",
        conjugations: [
          { pronoun: "Yo", form: "comeré" }, { pronoun: "Tú", form: "comerás" }, { pronoun: "Él/Ella/Ud.", form: "comerá" },
          { pronoun: "Nosotros", form: "comeremos" }, { pronoun: "Vosotros", form: "comeréis" }, { pronoun: "Ellos/Ellas/Uds.", form: "comerán" }
        ]
      },
      {
        name: "Vivir", translation: "살 것이다",
        conjugations: [
          { pronoun: "Yo", form: "viviré" }, { pronoun: "Tú", form: "vivirás" }, { pronoun: "Él/Ella/Ud.", form: "vivirá" },
          { pronoun: "Nosotros", form: "viviremos" }, { pronoun: "Vosotros", form: "viviréis" }, { pronoun: "Ellos/Ellas/Uds.", form: "vivirán" }
        ]
      },
      {
        name: "Decir", translation: "말할 것이다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "diré" }, { pronoun: "Tú", form: "dirás" }, { pronoun: "Él/Ella/Ud.", form: "dirá" },
          { pronoun: "Nosotros", form: "diremos" }, { pronoun: "Vosotros", form: "diréis" }, { pronoun: "Ellos/Ellas/Uds.", form: "dirán" }
        ]
      },
      {
        name: "Hacer", translation: "할 것이다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "haré" }, { pronoun: "Tú", form: "harás" }, { pronoun: "Él/Ella/Ud.", form: "hará" },
          { pronoun: "Nosotros", form: "haremos" }, { pronoun: "Vosotros", form: "haréis" }, { pronoun: "Ellos/Ellas/Uds.", form: "harán" }
        ]
      },
      {
        name: "Poder", translation: "할 수 있을 것이다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "podré" }, { pronoun: "Tú", form: "podrás" }, { pronoun: "Él/Ella/Ud.", form: "podrá" },
          { pronoun: "Nosotros", form: "podremos" }, { pronoun: "Vosotros", form: "podréis" }, { pronoun: "Ellos/Ellas/Uds.", form: "podrán" }
        ]
      },
      {
        name: "Querer", translation: "원할 것이다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "querré" }, { pronoun: "Tú", form: "querrás" }, { pronoun: "Él/Ella/Ud.", form: "querrá" },
          { pronoun: "Nosotros", form: "querremos" }, { pronoun: "Vosotros", form: "querréis" }, { pronoun: "Ellos/Ellas/Uds.", form: "querrán" }
        ]
      },
      {
        name: "Saber", translation: "알 것이다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "sabré" }, { pronoun: "Tú", form: "sabrás" }, { pronoun: "Él/Ella/Ud.", form: "sabrá" },
          { pronoun: "Nosotros", form: "sabremos" }, { pronoun: "Vosotros", form: "sabréis" }, { pronoun: "Ellos/Ellas/Uds.", form: "sabrán" }
        ]
      },
      {
        name: "Salir", translation: "나갈 것이다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "saldré" }, { pronoun: "Tú", form: "saldrás" }, { pronoun: "Él/Ella/Ud.", form: "saldrá" },
          { pronoun: "Nosotros", form: "saldremos" }, { pronoun: "Vosotros", form: "saldréis" }, { pronoun: "Ellos/Ellas/Uds.", form: "saldrán" }
        ]
      },
      {
        name: "Tener", translation: "가질 것이다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "tendré" }, { pronoun: "Tú", form: "tendrás" }, { pronoun: "Él/Ella/Ud.", form: "tendrá" },
          { pronoun: "Nosotros", form: "tendremos" }, { pronoun: "Vosotros", form: "tendréis" }, { pronoun: "Ellos/Ellas/Uds.", form: "tendrán" }
        ]
      },
      {
        name: "Venir", translation: "올 것이다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "vendré" }, { pronoun: "Tú", form: "vendrás" }, { pronoun: "Él/Ella/Ud.", form: "vendrá" },
          { pronoun: "Nosotros", form: "vendremos" }, { pronoun: "Vosotros", form: "vendréis" }, { pronoun: "Ellos/Ellas/Uds.", form: "vendrán" }
        ]
      },
      {
        name: "Poner", translation: "놓을 것이다", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "pondré" }, { pronoun: "Tú", form: "pondrás" }, { pronoun: "Él/Ella/Ud.", form: "pondrá" },
          { pronoun: "Nosotros", form: "pondremos" }, { pronoun: "Vosotros", form: "pondréis" }, { pronoun: "Ellos/Ellas/Uds.", form: "pondrán" }
        ]
      },
      {
        name: "Haber", translation: "있을 것이다 (Habrá)", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "habré" }, { pronoun: "Tú", form: "habrás" }, { pronoun: "Él/Ella/Ud.", form: "habrá" },
          { pronoun: "Nosotros", form: "habremos" }, { pronoun: "Vosotros", form: "habréis" }, { pronoun: "Ellos/Ellas/Uds.", form: "habrán" }
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
      },
      {
        name: "Haber + Comer", translation: "먹었다(현재까지 영향)",
        conjugations: [
          { pronoun: "Yo", form: "he comido" }, { pronoun: "Tú", form: "has comido" }, { pronoun: "Él/Ella/Ud.", form: "ha comido" },
          { pronoun: "Nosotros", form: "hemos comido" }, { pronoun: "Vosotros", form: "habéis comido" }, { pronoun: "Ellos/Ellas/Uds.", form: "han comido" }
        ]
      },
      {
        name: "Haber + Vivir", translation: "살았다(현재까지 영향)",
        conjugations: [
          { pronoun: "Yo", form: "he vivido" }, { pronoun: "Tú", form: "has vivido" }, { pronoun: "Él/Ella/Ud.", form: "ha vivido" },
          { pronoun: "Nosotros", form: "hemos vivido" }, { pronoun: "Vosotros", form: "habéis vivido" }, { pronoun: "Ellos/Ellas/Uds.", form: "han vivido" }
        ]
      },
      {
        name: "Haber + Hacer", translation: "했다(현재까지 영향)", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "he hecho" }, { pronoun: "Tú", form: "has hecho" }, { pronoun: "Él/Ella/Ud.", form: "ha hecho" },
          { pronoun: "Nosotros", form: "hemos hecho" }, { pronoun: "Vosotros", form: "habéis hecho" }, { pronoun: "Ellos/Ellas/Uds.", form: "han hecho" }
        ]
      },
      {
        name: "Haber + Poner", translation: "놓았다(현재까지 영향)", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "he puesto" }, { pronoun: "Tú", form: "has puesto" }, { pronoun: "Él/Ella/Ud.", form: "ha puesto" },
          { pronoun: "Nosotros", form: "hemos puesto" }, { pronoun: "Vosotros", form: "habéis puesto" }, { pronoun: "Ellos/Ellas/Uds.", form: "han puesto" }
        ]
      },
      {
        name: "Haber + Escribir", translation: "썼다(현재까지 영향)", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "he escrito" }, { pronoun: "Tú", form: "has escrito" }, { pronoun: "Él/Ella/Ud.", form: "ha escrito" },
          { pronoun: "Nosotros", form: "hemos escrito" }, { pronoun: "Vosotros", form: "habéis escrito" }, { pronoun: "Ellos/Ellas/Uds.", form: "han escrito" }
        ]
      },
      {
        name: "Haber + Decir", translation: "말했다(현재까지 영향)", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "he dicho" }, { pronoun: "Tú", form: "has dicho" }, { pronoun: "Él/Ella/Ud.", form: "ha dicho" },
          { pronoun: "Nosotros", form: "hemos dicho" }, { pronoun: "Vosotros", form: "habéis dicho" }, { pronoun: "Ellos/Ellas/Uds.", form: "han dicho" }
        ]
      },
      {
        name: "Haber + Volver", translation: "돌아왔다(현재까지 영향)", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "he vuelto" }, { pronoun: "Tú", form: "has vuelto" }, { pronoun: "Él/Ella/Ud.", form: "ha vuelto" },
          { pronoun: "Nosotros", form: "hemos vuelto" }, { pronoun: "Vosotros", form: "habéis vuelto" }, { pronoun: "Ellos/Ellas/Uds.", form: "han vuelto" }
        ]
      },
      {
        name: "Haber + Abrir", translation: "열었다(현재까지 영향)", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "he abierto" }, { pronoun: "Tú", form: "has abierto" }, { pronoun: "Él/Ella/Ud.", form: "ha abierto" },
          { pronoun: "Nosotros", form: "hemos abierto" }, { pronoun: "Vosotros", form: "habéis abierto" }, { pronoun: "Ellos/Ellas/Uds.", form: "han abierto" }
        ]
      },
      {
        name: "Haber + Leer", translation: "읽었다(현재까지 영향)", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "he leído" }, { pronoun: "Tú", form: "has leído" }, { pronoun: "Él/Ella/Ud.", form: "ha leído" },
          { pronoun: "Nosotros", form: "hemos leído" }, { pronoun: "Vosotros", form: "habéis leído" }, { pronoun: "Ellos/Ellas/Uds.", form: "han leído" }
        ]
      },
      {
        name: "Haber + Romper", translation: "부수었다(현재까지 영향)", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "he roto" }, { pronoun: "Tú", form: "has roto" }, { pronoun: "Él/Ella/Ud.", form: "ha roto" },
          { pronoun: "Nosotros", form: "hemos roto" }, { pronoun: "Vosotros", form: "habéis roto" }, { pronoun: "Ellos/Ellas/Uds.", form: "han roto" }
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
      },
      {
        name: "Haber + Comer", translation: "먹었었었다",
        conjugations: [
          { pronoun: "Yo", form: "había comido" }, { pronoun: "Tú", form: "habías comido" }, { pronoun: "Él/Ella/Ud.", form: "había comido" },
          { pronoun: "Nosotros", form: "habíamos comido" }, { pronoun: "Vosotros", form: "habíais comido" }, { pronoun: "Ellos/Ellas/Uds.", form: "habían comido" }
        ]
      },
      {
        name: "Haber + Vivir", translation: "살았었었다",
        conjugations: [
          { pronoun: "Yo", form: "había vivido" }, { pronoun: "Tú", form: "habías vivido" }, { pronoun: "Él/Ella/Ud.", form: "había vivido" },
          { pronoun: "Nosotros", form: "habíamos vivido" }, { pronoun: "Vosotros", form: "habíais vivido" }, { pronoun: "Ellos/Ellas/Uds.", form: "habían vivido" }
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
    usage: "상대방에게 하지 말라고 금지할 때 사용합니다 (No + 접속법 현재).",
    verbs: [
      {
        name: "No + Hablar", translation: "말하지 마라",
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no hables" }, { pronoun: "Él/Ella/Ud.", form: "no hable" },
          { pronoun: "Nosotros", form: "no hablemos" }, { pronoun: "Vosotros", form: "no habléis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no hablen" }
        ]
      },
      {
        name: "No + Comer", translation: "먹지 마라",
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no comas" }, { pronoun: "Él/Ella/Ud.", form: "no coma" },
          { pronoun: "Nosotros", form: "no comamos" }, { pronoun: "Vosotros", form: "no comáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no coman" }
        ]
      },
      {
        name: "No + Vivir", translation: "살지 마라",
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no vivas" }, { pronoun: "Él/Ella/Ud.", form: "no viva" },
          { pronoun: "Nosotros", form: "no vivamos" }, { pronoun: "Vosotros", form: "no viváis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no vivan" }
        ]
      },
      {
        name: "No + Dar", translation: "주지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no des" }, { pronoun: "Él/Ella/Ud.", form: "no dé" },
          { pronoun: "Nosotros", form: "no demos" }, { pronoun: "Vosotros", form: "no deis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no den" }
        ]
      },
      {
        name: "No + Ser", translation: "이지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no seas" }, { pronoun: "Él/Ella/Ud.", form: "no sea" },
          { pronoun: "Nosotros", form: "no seamos" }, { pronoun: "Vosotros", form: "no seáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no sean" }
        ]
      },
      {
        name: "No + Ver", translation: "보지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no veas" }, { pronoun: "Él/Ella/Ud.", form: "no vea" },
          { pronoun: "Nosotros", form: "no veamos" }, { pronoun: "Vosotros", form: "no veáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no vean" }
        ]
      },
      {
        name: "No + Ir", translation: "가지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no vayas" }, { pronoun: "Él/Ella/Ud.", form: "no vaya" },
          { pronoun: "Nosotros", form: "no vayamos" }, { pronoun: "Vosotros", form: "no vayáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no vayan" }
        ]
      },
      {
        name: "No + Decir", translation: "말하지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no digas" }, { pronoun: "Él/Ella/Ud.", form: "no diga" },
          { pronoun: "Nosotros", form: "no digamos" }, { pronoun: "Vosotros", form: "no digáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no digan" }
        ]
      },
      {
        name: "No + Hacer", translation: "하지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no hagas" }, { pronoun: "Él/Ella/Ud.", form: "no haga" },
          { pronoun: "Nosotros", form: "no hagamos" }, { pronoun: "Vosotros", form: "no hagáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no hagan" }
        ]
      },
      {
        name: "No + Poner", translation: "놓지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no pongas" }, { pronoun: "Él/Ella/Ud.", form: "no ponga" },
          { pronoun: "Nosotros", form: "no pongamos" }, { pronoun: "Vosotros", form: "no pongáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no pongan" }
        ]
      },
      {
        name: "No + Salir", translation: "나가지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no salgas" }, { pronoun: "Él/Ella/Ud.", form: "no salga" },
          { pronoun: "Nosotros", form: "no salgamos" }, { pronoun: "Vosotros", form: "no salgáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no salgan" }
        ]
      },
      {
        name: "No + Tener", translation: "가지지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no tengas" }, { pronoun: "Él/Ella/Ud.", form: "no tenga" },
          { pronoun: "Nosotros", form: "no tengamos" }, { pronoun: "Vosotros", form: "no tengáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no tengan" }
        ]
      },
      {
        name: "No + Venir", translation: "오지 마라", isIrregular: true,
        conjugations: [
          { pronoun: "Yo", form: "-" }, { pronoun: "Tú", form: "no vengas" }, { pronoun: "Él/Ella/Ud.", form: "no venga" },
          { pronoun: "Nosotros", form: "no vengamos" }, { pronoun: "Vosotros", form: "no vengáis" }, { pronoun: "Ellos/Ellas/Uds.", form: "no vengan" }
        ]
      }
    ]
  }
];
