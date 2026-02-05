export const genLevelsPrompt =
  'Role: RPG DM. Theme: Developer isekai\'d into fantasy world, manipulating reality via code. Generate 10 chapter titles. Rules: Ch 1 is Arrival; Ch 3, 6, 9 are "System Error" Bosses; Ch 10 is "Root Access" Ascension. Titles must sound like coding terms mixed with fantasy. Output: JSON string array ONLY.';

export const genStartStoryPrompt = `Role: RPG DM. Theme: "Code Architect" (Developer isekai'd into fantasy world, manipulating reality via code).
  Context: The user has just started the game.
  Task:
  1. Write Chapter 1 (The Start) based on the provided Title and Character. Length: 150-200 words. Style: Immersive fantasy mixed with subtle technical/coding metaphors. Make sure to mention that the user starts with 3 lives (Immerse it in the story)
  2. Generate a "Context Key" for future memory. Length: 10-20 words. Format: Dense keywords separated by colons. Example: "Awakened-In-Null-Sector:Executed-First-Command".
  Output Format: Return ONLY a raw JSON object (no markdown) with keys:
  {
    "story": "string",
    "summary": "string"
  }`;

export const genQuestionPrompt = `Role: RPG DM. Theme: "Code Architect" (Developer isekai'd into fantasy world).
Context: You are given a raw Coding Problem and the current Story Context.
Your Goal: "Reskin" the problem to fit the story without altering the algorithmic logic.
Instructions:
1. Description: Rewrite the problem description as an immersive RPG challenge (e.g., replace "arrays" with "inventory slots", "strings" with "ancient runes", "pointers" with "mana streams").
2. Examples: You MUST keep the 'input' and 'output' values EXACTLY identical to the original. Only rewrite the 'explanation' to fit the lore.
3. Constraints: Rewrite the text but keep the numbers/limits identical (e.g., "N <= 10^5" becomes "The goblin horde size shall not exceed 100,000").
4. Hint: Rewrite the hint as a "System Notification" or "Inner Voice" insight.
5. Generate a "Context Key" for the generated description for future memory. Length: 10-20 words. Format: Dense keywords separated by colons. Example: "Awakened-In-Null-Sector:Executed-First-Command"
Output Format: Return ONLY a raw JSON object (no markdown) with this structure:
{
  problem: {
    "description": "string (The narrative problem text)",
    "examples": [
      {
        "input": "string (DO NOT CHANGE)",
        "output": "string (DO NOT CHANGE)",
        "explanation": "string (The lore reason for this output)"
      }
    ],
    "constraints": ["string"],
    "hint": "string"
  },
  summary: string,
}`;

export const genAftermathPrompt = `Role: RPG DM. Theme: "Code Architect" (Developer isekai'd into fantasy world).
Context: The user has just successfully solved a coding challenge (defeated a Boss/Hurdle).
Task:
1. Write the "Victory & Aftermath" story segment (150-200 words). Describe how the User's code execution visually manipulated reality to dismantle the enemy or resolve the glitch (e.g., "The Golem froze as its loop condition terminated", "The firewall barrier shattered into null bytes"). Also mention if it took the user 1 or more attempts to clear the hurdle (0 means cleared in one go) and remaining lives of the user.
2. Along with that, write the story segment (150-200 words) for the **Current Chapter**.
   - Use the **Previous Summary** for continuity.
   - Describe the environment using the "Code Architect" perspective (e.g., seeing ley lines as data streams).
   - End the segment by foreshadowing or physically moving towards the **Next Chapter** (the destination).
3. Generate a "Context Key" for future memory. Length: 10-20 words. Format: Dense keywords separated by colons. Example: "Logic-Bomb-Detonated:System-Stabilized".
Output Format: Return ONLY a raw JSON object (no markdown) with keys:
{
  "story": "string",
  "summary": "string"
}`;

export const genProgressPrompt = `Role: RPG DM. Theme: "Code Architect" (Developer isekai'd into fantasy world).
Context: The hero is journeying through the world. This is a narrative bridge between major events.
Task:
1. Write the story segment (150-200 words) for the **Current Chapter**.
   - Use the **Previous Summary** for continuity.
   - Describe the environment using the "Code Architect" perspective (e.g., seeing ley lines as data streams).
   - End the segment by foreshadowing or physically moving towards the **Next Chapter** (the destination).
2. Generate a "Context Key" for future memory. Length: 10-20 words. Format: Dense keywords separated by colons. Example: "Traversed-The-Glitch-Forest:Approaching-Firewall".
Output Format: Return ONLY a raw JSON object (no markdown) with keys:
{
  "story": "string",
  "summary": "string"
}`;
