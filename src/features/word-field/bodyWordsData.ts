import type { ColorToken } from '@/styles/tokens'

export type CategoryId = 'muscle' | 'pain' | 'cycle' | 'energy'

export interface Category {
  id: CategoryId
  emoji: string
  label: string
  /** design-token color (see src/styles/tokens.css) this category's shapes are drawn in */
  color: ColorToken
}

export const CATEGORIES: Record<CategoryId, Category> = {
  muscle: { id: 'muscle', emoji: '💪', label: 'Muscle signals', color: 'anchor' },
  pain: { id: 'pain', emoji: '⚡', label: 'Pain types', color: 'signals' },
  cycle: { id: 'cycle', emoji: '🌙', label: 'Cycle & hormones', color: 'cycle' },
  energy: { id: 'energy', emoji: '🔋', label: 'Energy & fuel', color: 'energy' },
}

/** 🟢 normal — 🟡 monitor / pay attention — 🔴 stop / seek support */
export type Signal = 'green' | 'yellow' | 'red'

export const SIGNAL_EMOJI: Record<Signal, string> = {
  green: '🟢',
  yellow: '🟡',
  red: '🔴',
}

export interface WordCard {
  id: string
  category: CategoryId
  word: string
  tagline: string
  metaphor: string
  description: string
  feelsLike: string
  /** 0 = mild/blunt, 1 = medium, 2 = intense/sharp — shapes get more extreme with this */
  intensity: 0 | 1 | 2
  /** how urgently this sensation should be treated, shown on the check-in summary */
  signal: Signal
  /** short, practical advice shown right after a check-in for this word */
  recommendation: string
  /** position on the pannable word-cloud grid, filled in below */
  col: number
  row: number
}

type WordCardInput = Omit<WordCard, 'col' | 'row'>

const WORD_CARDS_RAW: WordCardInput[] = [
  // Muscle signals
  {
    id: 'strong',
    category: 'muscle',
    word: 'strong',
    tagline: 'Notice how ready you feel',
    metaphor: 'Your body has power to give.',
    description:
      'A strong feeling can mean your muscles feel powerful, capable and ready to put in work.',
    feelsLike:
      'Your legs before a sprint when they feel solid, powerful and ready to drive you forward.',
    intensity: 1,
    signal: 'green',
    recommendation:
      'Your body is ready. Warm up well and enjoy the session. Remember this feeling for comparison on harder days.',
  },
  {
    id: 'light',
    category: 'muscle',
    word: 'light',
    tagline: 'Notice how fluid your movements feel',
    metaphor: 'Like gravity has lost its grip.',
    description:
      'Your body feels agile, fluid and free to move. Without tension, as if gravity has lost its grip.',
    feelsLike:
      'Bouncing on your toes and feeling your body move with ease: fresh, fluid and springy.',
    intensity: 0,
    signal: 'green',
    recommendation:
      "Great sign — you're well recovered. A good day for speed, skill work, or anything that needs freshness.",
  },
  {
    id: 'sore',
    category: 'muscle',
    word: 'sore',
    tagline: 'Notice how sensitive it feels',
    metaphor: 'The day-after receipt.',
    description:
      "The bill your muscles send 24–48 hours after new or harder work. A deep, ongoing and hard-to-pinpoint sensation that feels like a constant, widespread discomfort. It often affects more than one part of the body. Spread across a whole muscle, usually both sides, worse on the first move, better once you're warm.",
    feelsLike: 'More sensitive and tender than usual when you touch it, move it or use it.',
    intensity: 1,
    signal: 'green',
    recommendation:
      "Normal after hard or new work (DOMS). Gentle movement, stretching, and foam rolling help. If it's one-sided or lasts more than 3 days, tell your coach.",
  },
  {
    id: 'achy',
    category: 'muscle',
    word: 'achy',
    tagline: 'Notice how deep it feels',
    metaphor: "A radio hum you can't turn off.",
    description:
      'A deep, heavy-ish feeling spread through the muscles rather than one specific spot. Dull and vague without clear edges. Often it concerns several body parts at once.',
    feelsLike:
      'A dull and deep feeling that lingers. A muscle saying, "I\'ve done a lot today and I want you to know."',
    intensity: 1,
    signal: 'green',
    recommendation:
      'Your muscles are processing a lot. Stretch, hydrate, eat well, and sleep enough. If it keeps coming back, check your recovery with your coach.',
  },
  {
    id: 'tight',
    category: 'muscle',
    word: 'tight',
    tagline: 'Notice what happens when you move it',
    metaphor: 'Like a muscle is being pulled shorter.',
    description:
      "A tight feeling can make a body part feel tense, restricted, or as though it doesn't have its usual range of motion and freedom to move.",
    feelsLike:
      "Something tense that is limiting your movement and holding you back. Trying to stretch a rubber band that doesn't want to stretch any further.",
    intensity: 2,
    signal: 'green',
    recommendation:
      'Stretch and warm up a little longer today. If tightness is always in the same place, mention it to your coach or physio.',
  },
  {
    id: 'stiff',
    category: 'muscle',
    word: 'stiff',
    tagline: 'Give it time to loosen',
    metaphor: 'A stuck zip.',
    description:
      'A stiff body part can feel harder to move or to extend all the way than usual. It may worsen in the first minutes of the morning or after sitting still, and loosen as you gently move, warm up, or change position.',
    feelsLike:
      'A block that opens up with gentle movement. Your legs when you first get out of bed after sleeping in one position for a long time.',
    intensity: 1,
    signal: 'green',
    recommendation:
      'Normal, especially in the morning or after sitting still. It usually loosens with gentle movement and warming up.',
  },
  {
    id: 'unstable',
    category: 'muscle',
    word: 'unstable',
    tagline: 'Avoid pushing through it',
    metaphor: 'A wobbly table leg.',
    description:
      "A body part feels wobbly, shaky or less secure than usual. The muscles that hold it steady aren't keeping up with your asks, usually when you're tired, landing or changing direction. It might give way and be unreliable under load.",
    feelsLike:
      "You can't fully trust it to support you or move the way you expect. Like stepping onto a chair with one loose leg.",
    intensity: 2,
    signal: 'yellow',
    recommendation:
      "Your body can't fully trust this area right now. Don't push through it. Reduce load and tell your coach. If it gives way, seek assessment.",
  },

  // Pain types
  {
    id: 'crampy',
    category: 'pain',
    word: 'crampy',
    tagline: 'Notice the rhythm',
    metaphor: 'Like something inside is tightening and relaxing.',
    description:
      'A crampy feeling often comes in waves, with a squeezing or tightening sensation that builds, holds for a couple of seconds, eases, and may come back again.',
    feelsLike:
      'Making a fist, holding it tight for a moment, then letting it open, except the squeezing is happening inside your body.',
    intensity: 1,
    signal: 'green',
    recommendation:
      "A squeezing that comes in waves. If it's in your belly and around your period, gentle movement and warmth can help. If it's in a muscle (like your calf or foot), stop, stretch it gently, and drink water. Muscle cramps often mean you're dehydrated or your muscles are fatigued. If cramps regularly stop you from training, talk to a doctor/coach/carer.",
  },
  {
    id: 'gripping',
    category: 'pain',
    word: 'gripping',
    tagline: 'Notice how long it holds',
    metaphor: 'A hand holding on.',
    description:
      'A constant clench in one precise spot. It forces you to hold a certain position and you find yourself guarding it. Often a muscle protecting something.',
    feelsLike:
      'A strong squeezing feeling that can feel as though something inside your body is grabbing or clenching.',
    intensity: 2,
    signal: 'yellow',
    recommendation:
      "Something is clenching to protect an area. Don't force through it. Rest, apply gentle heat, and if it doesn't ease in a day or two, get it checked.",
  },
  {
    id: 'sharp',
    category: 'pain',
    word: 'sharp',
    tagline: 'Can you point exactly where you feel it?',
    metaphor: 'A paper cut.',
    description:
      "Sudden, precise, and you can point to exactly where it is with one finger. It can arrive at a specific moment in a movement. A sharp feeling makes you change what you're doing.",
    feelsLike: 'A quick, pointed feeling that makes you immediately notice that one spot.',
    intensity: 2,
    signal: 'red',
    recommendation:
      "Stop the movement that caused it. If you can point to the exact spot with one finger, that's important information. Don't test it again — tell your coach and seek support if it returns.",
  },
  {
    id: 'stabbing',
    category: 'pain',
    word: 'stabbing',
    tagline: 'Pause and pay attention',
    metaphor: 'A sudden needle-like jab.',
    description:
      'A stabbing sensation feels pointed and piercing, as if something briefly poked or jabbed you from inside. If sharp says "not like that", stabbing says "not at all."',
    feelsLike:
      'A quick needle-like jab that makes you stop and notice exactly where it happened.',
    intensity: 2,
    signal: 'red',
    recommendation:
      "This is your body's strongest stop signal. Pause all activity on that area. Tell your coach and a trusted adult. Seek physio or medical assessment — do not try to push through.",
  },
  {
    id: 'burning',
    category: 'pain',
    word: 'burning',
    tagline: 'Notice if it fades',
    metaphor: 'A match, not a fire.',
    description:
      "A hot, stinging feeling inside a muscle that can build during hard exercise. When it's from working hard, it usually eases soon after you slow down or stop.",
    feelsLike:
      "Your thighs on a long flight of stairs. It builds while you're climbing and eases after you reach the top.",
    intensity: 1,
    signal: 'green',
    recommendation:
      "Normal during hard effort — it should fade within minutes of stopping. If it doesn't fade, or it happens at low intensity or at rest, stop and get it checked.",
  },
  {
    id: 'tingling',
    category: 'pain',
    word: 'tingling',
    tagline: 'Observe the little sparks',
    metaphor: 'Fizzy drink under the skin.',
    description:
      'Often a nerve being squeezed or irritated. Some girls may experience tingling in their hands or feet before their period.',
    feelsLike:
      "Your foot after you've sat on it too long. A fizzy sensation that travels along a line.",
    intensity: 1,
    signal: 'yellow',
    recommendation:
      'Often a nerve being squeezed. Change position, loosen anything tight (shoes, straps). If it keeps happening in the same spot, mention it to a healthcare provider.',
  },
  {
    id: 'numb',
    category: 'pain',
    word: 'numb',
    tagline: "Notice what's changed",
    metaphor: 'The volume turned to zero.',
    description:
      'Numbness means you feel less sensation than usual, or almost none. Touch, pressure or temperature might feel muted or distant.',
    feelsLike:
      'Like a body part has gone quiet. You can tell you are touching it, but only faintly, such as the skin behind a glove or a layer of clothing.',
    intensity: 0,
    signal: 'red',
    recommendation:
      "If brief and from position, just move. If it happens during exercise, is spreading, or doesn't go away — stop and seek assessment. Numbness during sport is always worth checking.",
  },

  // Cycle & hormones
  {
    id: 'bloated',
    category: 'cycle',
    word: 'bloated',
    tagline: "Notice if it's from the inside",
    metaphor: 'A balloon being slowly inflated.',
    description:
      'A feeling of fullness, pressure or tightness from inside. Your body part may feel tighter or swollen without anything visibly changing.',
    feelsLike:
      'Like your stomach has puffed up from the inside. A stretched, pressured feeling that sitting down can make worse.',
    intensity: 1,
    signal: 'green',
    recommendation:
      'Very common around your period. Drink water (it helps!), eat smaller meals, wear comfortable clothing. It will pass.',
  },
  {
    id: 'tender',
    category: 'cycle',
    word: 'tender',
    tagline: 'Notice if touch makes it worse',
    metaphor: 'A bruise you cannot see.',
    description:
      "A part of your body feels more sensitive or painful than usual when touched, pressed or bumped, even though you didn't injure it.",
    feelsLike: "Your body's sensitivity dial has been turned up.",
    intensity: 1,
    signal: 'green',
    recommendation:
      "Sensitivity without injury is common before your period. Wear supportive clothing. It's not a sign something is wrong.",
  },
  {
    id: 'nauseous',
    category: 'cycle',
    word: 'nauseous',
    tagline: 'Notice if it comes in waves',
    metaphor: 'A boat rocking.',
    description: 'A queasy, unsettled feeling, that can come and go in waves.',
    feelsLike:
      'That wavy, uncomfortable feeling on a long car ride, where everything feels to move a bit too much.',
    intensity: 1,
    signal: 'yellow',
    recommendation:
      "Sip water slowly. Eat something small and bland. Don't train on an empty stomach. If it happens a lot with dizziness or shaking, check your eating patterns.",
  },
  {
    id: 'swollen',
    category: 'cycle',
    word: 'swollen',
    tagline: 'Notice the change',
    metaphor: 'A water balloon under the skin.',
    description:
      "Like there's extra space being taken up. A swollen area can feel fuller, puffier, tighter or heavier than usual. Sometimes you can see the difference; sometimes you mainly feel it.",
    feelsLike: "A finger after you've worn a ring that's suddenly become too tight.",
    intensity: 2,
    signal: 'green',
    recommendation:
      'If both sides and around your period: normal fluid retention. If one side and after an injury: ice, elevate, and seek assessment.',
  },
  {
    id: 'hot',
    category: 'cycle',
    word: 'hot',
    tagline: 'Warm from the inside or the outside?',
    metaphor: "The back of a laptop that's been running long.",
    description:
      'A warm sensation can be superficial, like skin that feels warmer than usual to the touch, or deeper inside the body. Hot pain is a deep burning sensation that spreads through the tissues like hot liquid.',
    feelsLike: 'A dull, heavy fire that seems to melt your muscles from the inside.',
    intensity: 1,
    signal: 'green',
    recommendation:
      "Drink more water to stay hydrated and take breaks in shade (if you're under the sun). If you feel very hot with dizziness, confusion, or you stopped sweating — seek help immediately.",
  },

  // Energy & fuel
  {
    id: 'heavy',
    category: 'energy',
    word: 'heavy',
    tagline: 'Notice how much effort everything takes',
    metaphor: 'Gravity has been turned up.',
    description:
      'Your whole body feels weighed down, sluggish and slow to respond. Every movement costs more effort than usual, as though gravity has been turned up.',
    feelsLike:
      "Moving through waist-deep water. Your legs, arms and even your head feel like they're made of something heavier than usual.",
    intensity: 2,
    signal: 'green',
    recommendation:
      'Everything costs more effort today. Your body needs fuel, sleep, or recovery. Go lighter. If this happens often, review your eating and rest.',
  },
  {
    id: 'dizzy',
    category: 'energy',
    word: 'dizzy',
    tagline: 'Pause. Let the world catch up',
    metaphor: 'A spinning top slowing down.',
    description:
      'The room tilts, your balance wavers, or everything feels slightly off-centre. It can come unexpectedly, in a flash.',
    feelsLike:
      'Standing up too fast after lying down and the floor seeming to tilt for a second or two.',
    intensity: 2,
    signal: 'yellow',
    recommendation:
      "Stop and sit down. Drink water, eat something. Don't return to training until it fully passes. If it keeps happening, talk to a healthcare provider.",
  },
  {
    id: 'headachy',
    category: 'energy',
    word: 'headachy',
    tagline: 'Notice where the pressure sits',
    metaphor: 'A too-tight headband.',
    description:
      'Pressure, pounding or aching around your forehead, temples, or the back of your head.',
    feelsLike:
      'A band of pressure squeezing around your head, or a dull thud behind your eyes that gets louder when you bend over.',
    intensity: 1,
    signal: 'green',
    recommendation:
      "Drink water first — dehydration is the most common cause. Eat if you've skipped a meal. Rest in a quiet spot. Common around your period too.",
  },
  {
    id: 'foggy',
    category: 'energy',
    word: 'foggy',
    tagline: 'Notice if your thinking feels slower',
    metaphor: 'A steamed-up window.',
    description:
      "Your brain feels cloudy, slow or disconnected. Decisions that are normally instant take extra time, you miss cues you'd usually catch, or you find yourself staring into space.",
    feelsLike:
      'Reading the same sentence three times and still not taking it in. Knowing the answer but not being able to reach it.',
    intensity: 0,
    signal: 'yellow',
    recommendation:
      'Your brain needs fuel or sleep. Eat, hydrate, and keep training simple today. If it happens a lot, check your sleep and eating patterns.',
  },
  {
    id: 'shaky',
    category: 'energy',
    word: 'shaky',
    tagline: 'Notice if your body needs fuel',
    metaphor: 'A phone on 3% battery.',
    description:
      "An internal trembling or wobbliness from your system telling you it's running low.",
    feelsLike: 'The trembly, hollow feeling that makes you feel weak and unstable',
    intensity: 2,
    signal: 'yellow',
    recommendation:
      'Your body needs energy. Eat something now — a banana, a cereal bar, a sports drink. Always eat before training. If this keeps happening, you may not be eating enough overall.',
  },
]

// Lay every word out on one flat, continuous field — no quadrants — in a fixed
// number of columns, filling row by row in the order the words are listed above.
export const GRID_COLS = 4

export const WORD_CARDS: WordCard[] = WORD_CARDS_RAW.map((card, i) => ({
  ...card,
  col: i % GRID_COLS,
  row: Math.floor(i / GRID_COLS),
}))
