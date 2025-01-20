export interface LsatAnswer {
  letter: string;
  text: string;
  isCorrect: boolean;
  reasoning: string;
}

export interface LsatStimulus {
  source: string;
}

export interface LsatQuestionData {
  stimulus: LsatStimulus;
  questionStem: string;
  answerChoices: LsatAnswer[];
}

export interface LsatResponse {
  question: LsatQuestionData;
}