export interface QuizQuestion {
  prompt: string
  /** optional code block shown under the prompt */
  code?: string
  options: string[]
  answer: number
  explanation: string
}

export interface CodeChallenge {
  /** markdown shown above the editor */
  prompt: string
  starterCode: string
  solution: string
  /** test code; has access to `test(name, fn)` and `assertEqual(actual, expected, msg?)` */
  tests: string
}

export type ChoiceQuality = 'best' | 'ok' | 'bad'

export interface ScenarioStage {
  /** markdown describing the situation */
  situation: string
  question: string
  options: {
    label: string
    quality: ChoiceQuality
    /** markdown feedback explaining the consequence of this choice */
    feedback: string
  }[]
}

export interface Scenario {
  /** markdown intro framing the case study */
  intro: string
  stages: ScenarioStage[]
  /** markdown shown after the final stage */
  debrief: string
}

export type VisualizerId = 'two-pointers' | 'sliding-window' | 'binary-search'

export type Step =
  | { kind: 'read'; title: string; markdown: string }
  | { kind: 'quiz'; title: string; questions: QuizQuestion[] }
  | { kind: 'code'; title: string; challenge: CodeChallenge }
  | { kind: 'scenario'; title: string; scenario: Scenario }
  | { kind: 'visualizer'; title: string; visualizer: VisualizerId; markdown?: string }

export interface Lesson {
  id: string
  title: string
  minutes: number
  xp: number
  steps: Step[]
}

export interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

export interface Subject {
  id: string
  title: string
  tagline: string
  icon: string
  /** tailwind-friendly accent, used inline */
  accent: string
  modules: Module[]
}
