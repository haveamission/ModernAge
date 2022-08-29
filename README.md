# Modern Age Project

This is an example for the Modern Age interview project.

- I Used a functional approach as this is pretty popular with React
- I used Typescript as the language as that's the language that is used in the position
- I probably would have renamed the keys for the object in a normal situation to camelCase, but I felt that added additional complexity that wasn't necessary for the exercise
- Tests are not super robust considering the amount of time for the task

## Installation

After cloning the repository from [], run `npm i` inside the root directory.

You will also need to have `ts-node` installed (`npm install -g ts-node`)

## Usage

To run the file and get all of the output to the console, merely type `ts-node index.ts`

To run the test suite, merely run `npm run test`. Tests are, due to the nature of the exercise, pretty tightly coupled to the actual functions. There wasn't a ton of time to write super robust tests, and many of the tests will fail unless they are run on Tuesday, August 29th to the `"Days Ago Shipped"` value.

In a real world scenario, rather than using keys like `"Last Name"`, I would instead opt for things like `lastName`, but I felt that making a mapper between the two was a bit of added complexity for the exercise.
