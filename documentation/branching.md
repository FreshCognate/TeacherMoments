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

Do not put an **Actions prompt** on a branch-point slide. Branching cannot evaluate it, but the condition editor still shows a row for it — and opening that row errors. A condition that includes an Actions prompt can never match, and nothing flags it.

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
- An input prompt has to score at least 0.7 against your description for the AI to count it as a match.
- Write conditions so that only one stem can match a given answer. If two stems both match, the winner is the stem that received its first condition earliest — not the one shown highest in the list — so overlapping conditions are effectively unpredictable. The validation indicator flags two stems sharing an identical condition, but it cannot catch conditions that merely overlap.

### 6. Set the fallback

Every branching trigger needs somewhere to send users whose answers match nothing. You have two ways to provide one, and you must use one of them:

- **Leave a stem without conditions.** Any stem you never add a condition to becomes a catch-all, marked in the editor with **If the users prompt answers do not match anything.** Only one stem can be left this way.
- **Choose a default stem.** Once every stem has at least one condition, the trigger shows an **If no condition is met, default to this stem** dropdown listing the slide's stems (plus **None**). Pick the stem that should catch unmatched users.

The dropdown is hidden while any stem still has no conditions, because that stem is already the catch-all. A condition-less stem always wins over the default.

If neither is set, an unmatched user does not branch: they stay on the branch-point slide, and the button becomes **Next**, which takes them to the following slide in the main scenario. Nothing tells them a branch was skipped, which is why the validation indicator treats a missing fallback as an error.

### 7. Check the validation indicator

Trigger issues appear in the header of the **Triggers** panel and in the scenario's validation indicator, which lists every issue across the scenario and jumps to the one you click. Slide and block issues also appear on the slide's own card in the navigation rail, but trigger issues do not — check the scenario indicator for the full picture.

These are not advisory. **A scenario with any validation issue cannot be published**: the **Publish** button stays disabled, and where there are unpublished changes it explains why with "Scenarios cannot be published whilst there are issues". While you are still testing, an invalid branching trigger is skipped — the user is left on the branch-point slide with a **Next** button and no branching happens.

Branching triggers are checked for:

- The slide has no prompt blocks to base conditions on.
- A condition has no prompts set, no prompt selected, an input prompt condition with no text, or a multiple choice condition with no options selected.
- A branch has no stem to route to.
- More than one stem has no conditions (only one stem can be the fallback).
- No fallback exists: every stem has conditions and no default stem is set, or the default stem has since been deleted.
- Two stems use the same condition, so one of them can never be reached.
- A condition references a prompt block, or a branch references a stem, that has since been deleted.

Slides are checked too, and two slide-level issues come up routinely when building a branch:

- **Slide with stems has no branching trigger** — the stems exist but nothing routes users into them.
- **Slide has no blocks** — every new stem starts with one empty slide, so this appears the moment you create a stem and clears once you add content to that slide.

### 8. Test it

Preview or run the scenario. On the branch-point slide, answer the prompts and press **Submit**. You will see **Analyzing prompts** while conditions are evaluated (input prompts are scored by AI), then **Navigating...** as the matching stem is worked out, and then the stem's first slide.

Test each path, including the fallback, and answer free-text prompts the way a real user might rather than in the words you used in the condition — that is what the AI scoring has to cope with.

## Manual branching (user chooses)

If a slide has stems but **no prompt blocks**, the user is not shown Back/Next buttons. Instead, one button per stem is shown, labelled with the stem's name, and the user picks their own path. No trigger is involved — the buttons come from the stems themselves.

Note that this currently conflicts with validation: a slide that has stems but no branching trigger is flagged as **Slide with stems has no branching trigger**, and that blocks publishing. Adding a branching trigger does not resolve it either, because a trigger on a prompt-less slide is itself flagged as having no prompts to base conditions on. Manual branching therefore works in preview but cannot be published yet.

## How users move through a branch

- At the end of a stem, **Next** returns the user to the main scenario at the slide following the branch point. Give every branch point at least one slide after it in the main scenario: if the branch point is the last slide, a user reaching the end of a stem has nowhere to return to and finishes the scenario without seeing the summary.
- **Back** from the first slide of a stem returns to the branch-point slide. Anywhere else, **Back** follows the slides the user actually visited rather than their position in the scenario.
- The branch a user took is recorded on their run. If they go back to the branch-point slide and press **Next**, that recorded branch is used again rather than the linear next slide.

## Editing and deleting

- **Edit a trigger** — reopen **Edit triggers** on the slide; all changes in the panel save automatically. Delete a condition with its **Delete condition** button.
- **Delete a trigger** — in the trigger's **Trigger options** menu, choose **Delete trigger**. This happens immediately, without a confirmation step.
- **Edit a stem** — use the stem's edit button in the slide navigation rail (**Edit stem** modal).
- **Delete a stem** — use the stem's delete button. This removes the stem **and all slides in it**, along with their blocks and triggers, after a confirmation dialog.
- **Delete a branch-point slide** — deleting a slide also deletes every stem branching off it, including all of their slides, blocks and triggers, and any stems nested below those. Deleting a branch point removes the whole branch, so check what hangs off a slide before removing it.
- **Duplicate a branch-point slide** — **Duplicate slide** copies the slide and its blocks but not its stems, so the copy is an ordinary slide with no branches. Rebuild the stems on the copy, or duplicate the whole scenario instead, which does carry stems across.

## Limitations

- One trigger per slide. On a slide with stems, branching is the only trigger available — you cannot also give that slide feedback.
- Stems cannot be nested — branches are one level deep.
- Branching evaluates Multiple choice prompt and Input prompt blocks only. Actions prompts cannot be used in a condition (see step 3).
- Manual branching cannot be published. A slide with stems and no branching trigger fails validation, and adding a trigger to a prompt-less slide fails validation too, so user-chosen branches work in preview only.
- **Duplicate slide** does not copy a slide's stems.
