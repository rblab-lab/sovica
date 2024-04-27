import { describe, it } from 'vitest'
import fs from 'fs'
import { parse } from 'yaml'
import Ajv from 'ajv'

describe('Lessons YAML file', () => {
	it('passes json schema validation', () => {
		const lessonsFile = fs.readFileSync('src/lib/model/lessons.yml', 'utf8')
		const schemaFile = fs.readFileSync('src/lib/model/lessons-schema.json', 'utf8')
		const lessons = parse(lessonsFile, {})
		const schema = JSON.parse(schemaFile)
		const ajv = new Ajv()
		const validate = ajv.compile(schema)
		const valid = validate(lessons)
		if (!valid) {
			console.error(validate.errors)
			throw new Error('Expected lessons.yaml to pass json schema validation, but it did not.')
		}
	})
})
