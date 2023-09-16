# Takatak

You can try it here: https://takatatak.vercel.app/.

This application aims at helping the user to improve its accuracy and speed on
typing by :

- Showing incremental progress
- Making the user focus on weak spots

## How

The user can define any preset he like.

Each preset is composed of:

- words to learn typing `W`
- a speed (in WPM) `S`
- a repetition factor `R`
- a session length `L`.

The app proposed session of `L` random words to type. For each word, the app
check if the lowest speed of the last `R` times the word was typed is above `S`.
If so the word is considered validated and is not proposed.

The analytics for the words are shared between all presets.

## Screenshots

#### Practice

<img width="600" alt="practice" src="https://github.com/Alounv/takatak/assets/34238160/8a0130ae-9b07-4f3c-9ac3-a71a5ce61ed3">

#### Settings

<img width="600" alt="settings" src="https://github.com/Alounv/takatak/assets/34238160/c3975a0b-5ac5-4207-a5ee-e405c325df27">
