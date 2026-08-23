# Branching

Branching lets a scenario split into different paths based on how a user responds to prompts. A branch is called a **stem**: a named group of slides that hangs off a slide in the main scenario. Users are sent into a stem either automatically (a **branching trigger** evaluates their prompt answers when they press Submit) or manually (they choose a stem from buttons on the slide).

Every scenario has one root stem that contains all of its normal slides. Stems you create are one level deep — you cannot create a stem inside another stem.

## Key concepts

- **Stem** — a branch: an ordered set of slides attached to a specific slide (the branch point). Created from the slide navigation rail.
- **Branching trigger** — logic attached to a slide that runs when the user presses Submit. It evaluates the slide's prompt responses and navigates the user to the first slide of the matching stem.
- **Condition** — a rule on a stem describing which prompt answers should send the user there. A stem can have multiple conditions (OR). A condition can reference multiple prompts on the slide (all must match).
- **Fallback** — where users go when their answers match no condition. This is either a stem you leave without conditions, or the stem you pick in **If no condition is met, default to this stem**.

Branching triggers evaluate two prompt block types:

- **Multiple choice prompt** — matches when the user's selection is exactly the options set in the condition.
- **Input prompt** — free text, matched by AI. You write the condition in natural language and the AI scores how well the user's answer matches it.

## Creating a branch, step by step

### 1. Create a stem on the branch-point slide

1. In the scenario editor, find the slide where the path should split in the left slide navigation rail.
2. Open the slide's options menu (**Slide options**) and choose **Create stem**. This option only appears for slides in the main scenario — you cannot create a stem from inside another stem.
3. The editor switches into the new stem: the main rail collapses and a panel for the stem's slides opens. A first slide is created for you automatically. Use **Add slide** to add more slides to the stem, and the home button (**Back to parent**) to return to the main scenario.
4. Repeat **Create stem** on the same slide for each path you need. Stems attached to a slide are listed under its card in the navigation rail.

### 2. Name the stem

New stems are created without a name, and the name is what identifies the stem in the trigger editor (and is the button label if you use manual branching), so name it right away:

1. Back in the root stem, find the stem in the list under its slide.
2. Click the stem's edit button to open the **Edit stem** modal.
3. Fill in **Name** (and optionally **Description**) and press **Save**.

### 3. Add prompts to the branch-point slide

The branching trigger evaluates the prompts on the slide it belongs to, so the branch-point slide needs at least one **Multiple choice prompt** or **Input prompt** block. Add and configure these in the slide editor as usual.

### 4. Add the branching trigger

1. With the branch-point slide open, click **Edit triggers** in the bottom bar of the slide editor. The **Triggers** panel opens.
2. Click **Add trigger** and choose **Branch to a stem based on prompt responses**.

Notes:

- The branching option only appears in the picker if the slide already has at least one stem (step 1).
- On a slide with stems, branching is the only trigger offered — the feedback trigger is not available there.

### 5. Configure the branching rules

The trigger lists each stem attached to the slide under a **Stem** heading, with **Choose this stem if** beneath it.

For each stem that should be chosen based on answers:

1. Click **Add condition**.
2. The condition shows a row for every prompt on the slide. Click the edit (pencil) icon on a prompt row to open **Edit prompt condition**.
3. Set the value the user's answer must match:
   - **Multiple choice prompt** — select the option(s), exactly as the user would. The user's selection must match your selection exactly — no extra and no missing options. Use **Remove selection** to clear it.
   - **Input prompt** — type the condition in natural language (for example, "The user mentions talking to the student privately"). The AI checks whether the user's answer matches this description.
4. Press **Save**. Changes save automatically — there is no separate save button on the trigger.

How conditions combine:

- Within one condition, every prompt value you set must match (AND).
- Multiple conditions on the same stem are alternatives, shown separated by **OR** — any one of them sends the user to that stem.
- If several stems match, the first matching stem in the list wins.

### 6. Set the fallback

Every branching trigger needs somewhere to send users whose answers match nothing. You have two ways to provide one, and you must use one of them:

- **Leave a stem without conditions.** Any stem you never add a condition to becomes a catch-all, marked in the editor with **If the users prompt answers do not match anything.** Only one stem can be left this way.
- **Choose a default stem.** Once every stem has at least one condition, the trigger shows a **If no condition is met, default to this stem** dropdown listing the slide's stems (plus **None**). Pick the stem that should catch unmatched users.

The dropdown is hidden while any stem still has no conditions, because that stem is already the catch-all. A condition-less stem always wins over the default.

If neither is set, users whose answers match nothing simply continue to the next slide in the main scenario instead of branching.

### 7. Check the validation indicator

The **Triggers** panel header shows a validation indicator for the slide's trigger. Fix any warnings before publishing — **a trigger with validation errors is skipped when the scenario is played**, meaning no branching happens and users continue straight to the next slide. Branching triggers are checked for:

- The slide has no prompt blocks to base conditions on.
- A condition has no prompt values set, an input prompt condition has no text, or a multiple choice condition has no options selected.
- More than one stem has no conditions (only one stem can be the fallback).
- No fallback exists: every stem has conditions and no default stem is set, or the default stem has since been deleted.
- Two stems use the same condition, so one of them can never be reached.
- A condition references a prompt block, or a branch references a stem, that has since been deleted.

Slides are checked too: a slide that has stems but no branching trigger is flagged as **Slide with stems has no branching trigger**.

### 8. Test it

Preview or run the scenario. On the branch-point slide, answer the prompts and press **Submit**. You will see **Analyzing prompts** while conditions are evaluated (input prompts are scored by AI), then **Navigating...** as you are taken to the first slide of the matching stem.

## Manual branching (user chooses)

If a slide has stems but **no prompt blocks**, the user is not shown Back/Next buttons. Instead, one button per stem is shown, labelled with the stem's name, and the user picks their own path. This requires no trigger — just create and name the stems.

## How users move through a branch

- At the end of a stem, **Next** returns the user to the main scenario at the slide following the branch point.
- **Back** follows the user's actual history, so pressing Back after being branched returns to the branch-point slide.
- The branch decision is remembered on the run: if the user returns to the branch-point slide and presses **Next**, they are taken down the same stem they were originally sent to — the trigger is not re-evaluated.

## Editing and deleting

- **Edit a trigger** — reopen **Edit triggers** on the slide; all changes in the panel save automatically. Delete a condition with its **Delete condition** button.
- **Delete a trigger** — in the trigger's **Trigger options** menu, choose **Delete trigger**. This happens immediately, without a confirmation step.
- **Edit a stem** — use the stem's edit button in the slide navigation rail (**Edit stem** modal).
- **Delete a stem** — use the stem's delete button. This removes the stem **and all slides in it**, along with their blocks and triggers, after a confirmation dialog.
- **Delete a branch-point slide** — deleting a slide also deletes every stem branching off it, including all of their slides, blocks and triggers, and any stems nested below those. Deleting a branch point removes the whole branch, so check what hangs off a slide before removing it.

## Limitations

- One trigger per slide. On a slide with stems, branching is the only trigger available — you cannot also give that slide feedback.
- Stems cannot be nested — branches are one level deep.
- Branching evaluates Multiple choice prompt and Input prompt blocks only; Actions prompt responses are not evaluated.
