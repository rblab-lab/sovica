# Technical Specifications for a Montenegrin Learning App (Russian Speakers)

## User Features
- Lessons List:
    - Displays a list of all lessons.
    - Current lesson is highlighted and shows progress bar indicating completed exercises.
    - Lessons before the current one are marked as "done".
    - User can revisit any completed lesson.

- Exercise Screen:
    - Presents a single exercise based on the current lesson.
    - Exercise types include:
        - Multiple Choice (Russian -> Montenegrin & Montenegrin -> Russian)
        - Sentence Construction
        - Translation (Russian -> Montenegrin & Montenegrin -> Russian)
    - Question text is displayed in Russian.
    - User provides answer in Montenegrin through text input.
    - "Grammar Hint" button displays the relevant grammar rule (in Russian) when clicked.
    - Progress bar at the top shows completion percentage for the current lesson.

- End of Lesson Screen:
    - Displayed after completing all exercises in a lesson.
    - Shows total XP gained, percentage of errors, and time spent.

## Entities:

    Lesson:
        Unique identifier
        List of exercises
        Grammar hint text (in Russian)

    Exercise:
        Unique identifier within a lesson
        Type (Multiple Choice, Sentence Construction, Translation)
        Question text (in Russian)
        Correct answer (in Montenegrin)
        Hint (list of translations for each word used in the exercise)
        XP awarded for correct answer

    User:
        Tracks progress through lessons (completed exercises per lesson)
        Tracks total XP earned
