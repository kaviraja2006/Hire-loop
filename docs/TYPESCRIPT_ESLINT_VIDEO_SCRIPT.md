# TypeScript & ESLint Configuration - Video Script

## 🎬 Video Duration: 2-3 minutes

---

## [0:00-0:15] Introduction

**Script:**
"Hi! I'm [Your Name] from [Team Name]. Today I'll walk you through our Sprint 1 TypeScript and ESLint configuration for the Hire-Loop project. This setup ensures code quality, consistency, and reduces bugs across our entire team."

**Visual:**

- Show yourself on camera
- Display the project name in VS Code

---

## [0:15-0:45] Strict TypeScript Configuration

**Script:**
"Let's start with our TypeScript configuration. I'll open our tsconfig.json file."

[Open `tsconfig.json`]

"We've enabled strict mode with these key settings:

- `strict: true` - enables all strict type checking
- `noImplicitAny` - forces us to explicitly define types, preventing silent bugs
- `noUnusedLocals` and `noUnusedParameters` - catches dead code
- `forceConsistentCasingInFileNames` - prevents cross-platform issues

These settings catch about 60-70% of potential runtime errors during development, before they even reach production."

**Visual:**

- Scroll through `tsconfig.json` highlighting the strict options
- Point to each setting as you mention it

---

## [0:45-1:15] ESLint & Prettier Setup

**Script:**
"Next, let's look at our ESLint configuration. I'll open .eslintrc.json."

[Open `.eslintrc.json`]

"We've configured ESLint with Next.js best practices and custom rules:

- `no-console` warns about console logs to keep production clean
- We enforce semicolons and double quotes for consistency
- `prefer-const` catches variables that should be immutable
- And we discourage using 'any' type in TypeScript

We've also integrated Prettier for automatic code formatting."

[Open `.prettierrc`]

"Our Prettier config ensures everyone on the team writes code that looks identical - same indentation, same quote style, same everything. This eliminates all formatting debates in code reviews."

**Visual:**

- Show `.eslintrc.json` file
- Show `.prettierrc` file
- Briefly mention the rules

---

## [1:15-1:45] Pre-Commit Hooks Demo

**Say:**

> "Now here's the magic - we've set up Husky and lint-staged to automatically check our code before every commit. Let me demonstrate this.
>
> First, let me run our lint command to see if there are any issues."

**Run in terminal:**

```bash
npm run lint
```

**Say:**

> "As you can see, our codebase is currently clean and passes all strict linting rules.
>
> Now let me show you the format command."

**Run in terminal:**

```bash
npm run format
```

**Say:**

> "Prettier automatically ensures all our files match our standards."

**Visual:**

- Terminal showing `npm run lint` output (clean)
- Terminal showing `npm run format` output

---

## [1:45-2:15] Pre-Commit Hook in Action

**Script:**
"Let me show you what happens when someone tries to commit code that doesn't meet our standards."

[Create a test file with bad formatting or lint errors, or show the .husky/pre-commit file]

"We've configured Husky to run lint-staged before every commit. If the code doesn't pass our quality checks, the commit is blocked."

[Open `.husky/pre-commit`]

"This simple hook runs ESLint and Prettier on all staged files. If there are any errors, the commit fails and the developer has to fix them first."

[Open `package.json` and show the lint-staged configuration]

"In our package.json, we've configured lint-staged to run ESLint and Prettier on TypeScript and JavaScript files, and Prettier on JSON and Markdown files."

**Visual:**

- Show `.husky/pre-commit` file
- Show `lint-staged` configuration in `package.json`
- (Optional) Actually try to commit something to show the hook running

---

## [2:15-2:35] README Documentation

**Script:**
"All of this is thoroughly documented in our README file."

[Open README.md and scroll to the TypeScript & ESLint Configuration section]

"We've documented:

- Why we chose each TypeScript strict mode setting
- What each ESLint rule enforces
- How our pre-commit hooks work
- The commands available for running lint and format checks
- And the real-world benefits for our team"

**Visual:**

- Scroll through the TypeScript & ESLint Configuration section in README
- Show the tables, code examples, and documentation

---

## [2:35-2:50] Benefits Summary

**Script:**
"So what does all this give us?

For developers: Instant feedback and fewer bugs
For code reviews: Focus on logic, not formatting
For production: Higher quality code and fewer runtime errors

This setup ensures that every line of code committed to our repository meets professional standards."

**Visual:**

- Show the Impact Summary table from the README
- Show the Team Benefits section

---

## [2:50-3:00] Wrap Up

**Script:**
"This configuration sets the foundation for our entire project. As our team grows, these automated checks ensure consistency and quality from day one.

You can find all the details in our Pull Request titled '[Sprint-1] TypeScript & ESLint Configuration – [Your Team Name]'.

Thank you!"

**Visual:**

- Return to camera briefly
- Show the GitHub PR page (if available) or the project folder structure

---

## 📋 Preparation Checklist Before Recording

- [ ] Ensure all files are saved and formatted
- [ ] Run `npm run lint` to have output ready
- [ ] Run `npm run format` to show formatting in action
- [ ] Open all necessary files in VS Code tabs:
  - `tsconfig.json`
  - `.eslintrc.json`
  - `.prettierrc`
  - `.husky/pre-commit`
  - `package.json`
  - `README.md`
- [ ] Test screen recording software
- [ ] Close unnecessary browser tabs and applications
- [ ] Make sure VS Code font size is readable
- [ ] Practice the script once

---

## 🎥 Recording Tips

1. **Screen Resolution**: Use 1920x1080 for clarity
2. **Font Size**: Increase VS Code font size (14-16pt) for readability
3. **Pointer**: Enable mouse cursor highlight if possible
4. **Pace**: Speak clearly and not too fast
5. **Transitions**: Use smooth transitions between files
6. **Terminal**: Make sure terminal output is visible
7. **Zoom**: Zoom in on important code sections if needed

---

## 🎯 Key Points to Emphasize

- **Prevention is better than cure**: Catching bugs at compile-time vs runtime
- **Automation**: Pre-commit hooks enforce standards without manual effort
- **Team consistency**: Everyone writes code the same way
- **Professional standards**: Industry-standard tooling
- **Developer experience**: Auto-fixing makes development faster, not slower

---

## Alternative: Quick Version (1-2 minutes)

If you need a shorter video, use this condensed script:

**[0:00-0:10]** Introduction + project overview
**[0:10-0:30]** Show `tsconfig.json` and explain strict mode benefits
**[0:30-0:50]** Show `.eslintrc.json` and `.prettierrc`, run `npm run lint`
**[0:50-1:10]** Demonstrate pre-commit hooks and show `package.json` config
**[1:10-1:30]** Quick scroll through README documentation
**[1:30-2:00]** Summary of benefits and wrap up

---

Good luck with your recording! 🎬
