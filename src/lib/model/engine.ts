import { writable, type Writable } from 'svelte/store'
const pictures = import.meta.glob('../../pics/*.webp', {
	query: {
		enhanced: true,
		w: '1024;512;256;128;64',
	},
})

interface LessonRaw {
	title: string
	img: string
	hint: string
	exercises: {
		vocabulary?: Array<[string, string, string]>
		sentences?: Array<[string, string, string]>
	}
}

export interface ExerciseRaw {
	mne: string
	rus: string
	img: string
}

interface Lesson {
	title: string
	img: string
	hint: string
	exercises: {
		vocabulary: ExerciseRaw[]
		sentences: ExerciseRaw[]
	}
}

type UI = 'construct' | 'choose' | 'translate'
export interface Exercise {
	type: 'vocabulary' | 'sentences'
	index: number
	ui: UI
}

interface User {
	totalXP: number
	lessons: Array<{
		currentExercise: number
		plan: Exercise[]
	}>
	lessonScores: Array<{
		correct: number[]
	}>
}

export class Engine {
	lessons: Lesson[]
	user: User
	userXP: Writable<number>
	isReady: Writable<boolean> = writable(false)
	constructor(lessons: LessonRaw[]) {
		this.lessons = lessons.map((lesson) => ({
			title: lesson.title,
			img: lesson.img,
			hint: lesson.hint,
			done: false,
			exercises: {
				vocabulary:
					lesson.exercises.vocabulary?.map(([mne, rus, img]) => ({ mne, rus, img })) || [],
				sentences: lesson.exercises.sentences?.map(([mne, rus, img]) => ({ mne, rus, img })) || [],
			},
		}))
		this.user = {
			totalXP: 0,
			lessons: [],
			lessonScores: [],
		}
		this.userXP = writable(this.user.totalXP)
	}

	setUser(user: User) {
		if (!user) {
			this.isReady.set(true)
			return
		}
		this.user = user
		this.userXP.set(this.user.totalXP)
		this.isReady.set(true)
	}

	getLessons() {
		return this.lessons.map((lesson, i) => {
			const usersLesson = this.user.lessons[i] || 0
			const isCurrent = i === this.user.lessons.length - 1
			const isFuture = i > this.user.lessons.length
			let progress = 0
			if (usersLesson) {
				progress = usersLesson.currentExercise / (usersLesson.plan.length - 1)
			}
			return {
				title: lesson.title,
				img: loadImage(lesson.img),
				progress,
				isCurrent,
				isFuture,
				index: i,
			}
		})
	}

	getNextExercise(lesson: number): Exercise & ExerciseRaw {
		let usersLesson = this.user.lessons[lesson]
		if (!usersLesson || this.isLessonDone(lesson)) {
			usersLesson = this.initLesson(lesson)
		}
		const next = usersLesson.plan[usersLesson.currentExercise]
		if (!next) {
			return this.getNextExercise(lesson + 1)
		}
		const exercise = this.lessons[lesson].exercises[next.type][next.index]
		return { ...next, ...exercise }
	}

	private initLesson(lesson: number) {
		const plan = this.createLessonPlan(lesson)
		const usersLesson = {
			currentExercise: 0,
			plan,
		}
		this.user.lessons[lesson] = usersLesson
		const hasScores = this.user.lessonScores[lesson]
		if (!hasScores) {
			this.user.lessonScores[lesson] = {
				correct: [0],
			}
		} else {
			this.user.lessonScores[lesson].correct.push(0)
		}
		return usersLesson
	}

	private createLessonPlan(lesson: number) {
		// Take a lesson and create a plan for it; draw randomly from vocabulary and sentences
		// however, first all vocabulary, then all sentences. Each exercise is repeated three times,
		// however, the same exercise is not repeated in a row. Sentences can be mixed with vocabulary,
		// but all the vocabulary must be done before the sentences.
		const lessonData = this.lessons[lesson]
		const plan: Exercise[] = []
		const vocabulary: Exercise[] = lessonData.exercises.vocabulary.map(
			(ex, i) => ({ type: 'vocabulary', index: i, ui: 'choose' }) as const
		)
		const sentences: Exercise[] = lessonData.exercises.sentences.map(
			(ex, i) => ({ type: 'sentences', index: i, ui: 'choose' }) as const
		)
		// Shuffle the vocabulary
		const vocabularyShuffled = shuffle(vocabulary)
		plan.push(...vocabularyShuffled)
		const cont = [...vocabulary, ...vocabulary, ...sentences, ...sentences, ...sentences]
		shuffle(cont)

		plan.push(
			...cont.map((ex) => {
				let ui: UI = 'choose'
				if (ex.type === 'sentences') {
					ui = Math.random() > 0.5 ? 'translate' : 'construct'
				}
				return { ...ex, ui }
			})
		)
		return plan
	}

	isLessonDone(lesson: number) {
		let usersLesson = this.user.lessons[lesson]
		if (!usersLesson) {
			return false
		}
		return usersLesson.currentExercise >= usersLesson.plan.length - 1
	}

	checkAnswer(lesson: number, answer: string) {
		const usersLesson = this.user.lessons[lesson]
		const usersExercise = usersLesson.plan[usersLesson.currentExercise]
		const exerciseData = this.lessons[lesson].exercises[usersExercise.type][usersExercise.index]

		let isCorrect = false
		if (usersExercise.ui === 'translate' || usersExercise.ui === 'construct') {
			const allMne = this.lessons[lesson].exercises[usersExercise.type].map((ex) => ex.mne)
			isCorrect = allMne.some((mne) => strip(mne) === strip(answer))
		} else {
			isCorrect = strip(exerciseData.mne) === strip(answer)
		}
		if (isCorrect) {
			const last = this.user.lessonScores[lesson].correct.length - 1
			this.user.lessonScores[lesson].correct[last]++
		} else {
			usersLesson.plan.push(usersExercise)
		}

		usersLesson.currentExercise++
		return isCorrect
	}

	getScores(lesson: number) {
		const last = this.user.lessonScores[lesson].correct.length - 1
		const lastLessonScore = this.user.lessonScores[lesson].correct[last]
		const totalExercises = this.user.lessons[lesson].plan.length
		return { correct: lastLessonScore / totalExercises, xpGain: lastLessonScore }
	}

	updateUsersXP(xp: number) {
		this.user.totalXP += xp
		this.userXP.set(this.user.totalXP)
	}

	getXp() {
		return this.userXP
	}

	saveProgress() {
		localStorage.setItem('user', JSON.stringify(this.user))
	}

	getVocabularyChoices(lesson: number) {
		const lessonData = this.lessons[lesson]
		// find previous exercises with vocabulary
		let prevVocabulary: string[] = []
		for (let i = lesson - 1; i >= 0; i--) {
			if (i < 0) break
			const prevLesson = this.lessons[i]
			if (prevLesson.exercises.vocabulary.length) {
				prevVocabulary = prevLesson.exercises.vocabulary.map((ex) => ex.mne)
				break
			}
		}
		const vocabulary = lessonData.exercises.vocabulary.map((ex) => ex.mne)
		return vocabulary.concat(shuffle(prevVocabulary).slice(0, 4))
	}
}

function strip(str: string) {
	return stripDiacritics(str)
		.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
		.replace(/\s/g, '')
		.toLowerCase()
}

const replacements = {
	Ś: 'S',
	Č: 'C',
	Š: 'S',
	Ž: 'Z',
	Ć: 'C',
	Đ: 'D',
	č: 'c',
	ć: 'c',
	š: 's',
	ž: 'z',
	đ: 'd',
	ś: 's',
}

function stripDiacritics(str: string) {
	// @ts-ignore
	return str.replace(/[ŚČŠŽĆĐčćšžđś]/g, (match) => replacements[match])
}

export function loadImage(img: string) {
	const meta = pictures[`../../pics/${img}`]
	const wr = writable<string>('')
	if (meta) {
		meta().then((module) => {
			wr.set((module as any).default)
		})
	} else {
		const randomIndex = Math.floor(Math.random() * Object.keys(pictures).length)
		const randomKey = Object.keys(pictures)[randomIndex]
		pictures[randomKey]().then((module) => {
			wr.set((module as any).default)
		})
	}
	return wr
}

export function shuffle<T>(array: T[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array
}
