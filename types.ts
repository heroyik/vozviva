
export enum Tense {
  PRESENT = 'Presente',
  PROGRESSIVE = 'P. Progresivo',
  PRETERITE = 'Indefinido',
  IMPERFECT = 'Imperfecto',
  FUTURE = 'Futuro',
  PRESENT_PERFECT = 'P. Perfecto',
  PAST_PERFECT = 'Pluscuamp.',
  AFFIRMATIVE_IMPERATIVE = 'Imp. Afirmativo',
  NEGATIVE_IMPERATIVE = 'Imp. Negativo'
}

export interface Conjugation {
  pronoun: string;
  form: string;
}

export interface Verb {
  name: string;
  translation: string;
  isIrregular?: boolean;
  conjugations: Conjugation[];
}

export interface TenseData {
  id: Tense;
  title: string;
  usage: string;
  verbs: Verb[];
}
