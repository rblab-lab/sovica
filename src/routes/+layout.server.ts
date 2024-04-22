import fs from 'fs'
import { parse } from 'yaml'

export async function load() {
	const fileContents = fs.readFileSync('src/lib/model/lessons.yml', 'utf8')
	const data = parse(fileContents, {})

	return {lessons: data}
}
