# Claude Cowork Training Guide for Karen

*A plain-language guide to understanding Projects, folders, and when to use what in Claude Cowork.*

---

## What is Cowork?

Cowork is a mode inside the Claude Desktop app (the app you download to your Mac or PC). It's different from regular Claude chat because it can **read and write files directly on your computer** -- no uploading or downloading needed.

Think of it like this:
- **Regular Claude chat** = texting a smart assistant (they can only see what you copy-paste to them)
- **Cowork** = having that assistant sitting at your desk with access to your files

---

## The Folder Rule (Most Important Concept)

**Claude can only see files inside folders you give it permission to access.** This is the single most important thing to understand.

When you point Cowork at a folder on your computer, Claude can read every file inside that folder (and its subfolders). But it **cannot** see anything outside that folder.

**Example:**
If you connect Cowork to a folder called `Healthy Paws Marketing` on your Desktop:

```
Desktop/
  Healthy Paws Marketing/     <-- Claude can see EVERYTHING in here
    posts/
      post-1.docx             <-- Claude can read this
      post-2.docx             <-- Claude can read this
    brand-guide.pdf            <-- Claude can read this
    competitor-notes.txt       <-- Claude can read this

  Personal Photos/             <-- Claude CANNOT see this
  Tax Documents/               <-- Claude CANNOT see this
```

**Key takeaway:** Put everything you want Claude to work with inside one folder. If a file isn't in that folder, Claude doesn't know it exists.

**Common mistake:** Dragging a file from your Downloads folder into the Cowork chat window won't work. The file needs to already be saved inside the connected folder.

---

## What is a Project?

A Project is a **workspace** inside Cowork. It bundles together:

1. **A connected folder** -- the files Claude can see
2. **Custom instructions** -- rules that apply to every conversation in that project (tone, format, what to focus on)
3. **Memory** -- Claude remembers things from past conversations in that project
4. **Scheduled tasks** -- things Claude can do automatically on a schedule (daily reports, weekly summaries, etc.)

Think of a Project like a **desk drawer** dedicated to one area of your work. Everything related to that topic lives in that drawer, and when you open it, Claude already knows the context.

---

## When to Create a NEW Project vs. Use the Same One

This is where most people get tripped up. Here's the simple rule:

### Use the SAME project when:
- The work is about the **same topic or client**
- You want Claude to **remember** what you talked about last time
- You're building on previous work (like adding to a content calendar you already started)
- The same files and instructions apply

### Create a NEW project when:
- The work is about a **completely different topic**
- You **don't want** context from one area bleeding into another
- Different rules or tone apply (a personal project vs. a business project)
- Different files are needed

### Practical Examples

| Situation | Same Project or New? |
|-----------|---------------------|
| Writing next month's GBP posts (already have a GBP project) | **Same project** -- Claude remembers your brand voice, past posts, and what topics you've covered |
| Starting a new email newsletter series for the practice | **Could go either way** -- same project if it uses the same brand files, new project if it needs totally different context |
| Helping your kid with a school project | **New project** -- completely unrelated, don't want vet clinic context mixed in |
| Analyzing competitor reviews (related to your SEO work) | **Same project** -- it's part of the same marketing effort |
| Working on a personal recipe collection | **New project** -- nothing to do with the business |

### Rule of Thumb

**If you'd put the files in the same folder on your computer, they probably belong in the same project.**

---

## How to Create a Project (Step by Step)

1. Open the Claude Desktop app
2. Click the **Cowork** tab (at the top, next to Chat)
3. Look at the bottom of the screen -- click the dropdown and find **Projects**
4. Click **Create New Project**
5. You'll see three options:

| Option | When to Use It |
|--------|---------------|
| **Start from scratch** | Brand new work -- Claude creates a fresh folder for you |
| **Use existing folder** | You already have a folder with your files organized |
| **Import from chat** | You set something up in regular Claude chat and want to move it to Cowork |

6. **Name your project** clearly -- something like "HPAH Marketing" or "GBP Content Calendar" (not "Project 1")
7. **Choose the folder location** -- defaults to Documents/Claude Projects, but you can pick anywhere
8. **Write instructions** -- a few lines telling Claude how to behave in this project. Example:

   > You are helping manage the marketing and SEO for Healthy Paws Animal Hospital, a veterinary practice in Lake in the Hills, IL. Use a warm, professional tone. Focus on dogs and cats only -- no exotics. When writing content, match the brand voice: empathetic, educational, and community-focused.

9. **Make sure memory is turned ON** (it is by default)
10. Click create -- you're done

---

## When Conversations Get Too Long

Claude doesn't lose context based on time -- it's based on how much text has accumulated in the conversation (your messages, Claude's responses, file contents loaded, etc.).

As a conversation gets very long, Claude automatically summarizes older parts to make room for new content. You won't see a hard cutoff, but you might notice Claude repeating itself or forgetting something from earlier in a long conversation.

**The easy fix: just start a new conversation inside the same project.** Your project instructions and memories carry over automatically -- you don't lose anything. Think of it like starting a fresh page in a notebook that's sitting on the same desk with all your reference materials.

There's no downside to starting new conversations frequently. Do it whenever a task is done or the conversation feels like it's getting long.

---

## Attached Files vs. Folder Files (What Goes Where)

There are two ways to give Claude access to files in a project. They serve different purposes:

| Type | Where It Lives | Best For | Example |
|------|---------------|----------|---------|
| **Attached to project** (in project settings) | Stays permanently loaded as background context | Reference material that rarely changes | Brand guide, processing rules, style instructions |
| **In the connected folder** | Claude reads it when you ask it to | Working files that change or get replaced regularly | Exported reports, new data files, drafts in progress |

### For Processing Exported Files (Karen's Workflow)

If you're exporting a file from your practice management software and want Claude to process it with a specific set of rules:

1. **Put the processing rules in the project instructions** (or attach them as a reference doc) -- these don't change
2. **Save each new export into the project's connected folder** -- just drop it in
3. Open the project, tell Claude something like: "Process the new file I just added"
4. Claude reads it from the folder, applies the rules, and saves the output right next to it

**Don't attach the export file to the project settings** -- that's for permanent reference material. The connected folder is where working files go.

---

## How Memory Works in Projects

Memory is one of the most useful features, but it only works **within** a project.

- Claude remembers things you tell it across conversations **in the same project**
- It does **NOT** carry memories between different projects
- You can ask Claude to "remember this" and it will save it for next time
- Memories are stored in a file called `memory.md` inside your project folder

**Example:**
- In your HPAH Marketing project, you tell Claude: "We never use the word 'cheap' -- always say 'affordable' or 'accessible'."
- Next time you open that project, Claude already knows this rule.
- But if you go to a different project, Claude has no idea about that rule.

---

## Chat vs. Cowork: When to Use Which

| Use Regular Chat When... | Use Cowork When... |
|--------------------------|-------------------|
| You have a quick question | You need Claude to work with files |
| You want to brainstorm | You want Claude to remember things between sessions |
| You're doing a one-off task | You have a recurring workflow |
| You don't need file access | You want to create or edit documents |

**Think of it this way:** Chat is for conversations. Cowork is for getting work done with your files.

---

## Setting Up Your Folder (Recommended Structure)

Before creating a project, organize your folder so Claude can find things easily:

```
HPAH Marketing/
  brand/
    voice-guide.txt            -- how the practice sounds
    about-the-practice.txt     -- basic info, services, location
    competitor-notes.txt       -- notes on nearby vets

  content/
    gbp-posts/                 -- all Google Business Profile posts
    emails/                    -- email drafts and templates
    social/                    -- social media content

  reference/
    reviews/                   -- patient reviews to reference
    seo-data/                  -- keyword research, analytics
```

You don't need to be this organized, but having some structure helps Claude find what it needs.

---

## Common Questions

**Q: Can Claude delete my files?**
A: Claude will always ask permission before deleting any file permanently. Start with "Ask before acting" mode (the default) so Claude confirms every action.

**Q: Does my computer need to be on for scheduled tasks?**
A: Yes. Your computer and the Claude Desktop app both need to be running when a scheduled task is supposed to run. If your computer is off, the task is skipped.

**Q: Can I share a project with someone else?**
A: Not currently. Projects live on your computer only. To share work, export the files and send them.

**Q: What happens if I move or rename the connected folder?**
A: Claude will lose access. Keep the folder in the same place, or update the project settings if you move it.

**Q: Is there a limit to how many files Claude can access?**
A: In Cowork, there's no hard file limit like there is in regular chat (which caps at 20 files). Cowork reads directly from your folder.

---

## Quick Start Checklist

- [ ] Download and install the Claude Desktop app
- [ ] Create a folder on your computer for the project (or use an existing one)
- [ ] Put all relevant files inside that folder
- [ ] Open Cowork and create a new Project
- [ ] Connect it to your folder
- [ ] Write 3-5 lines of instructions describing the project context
- [ ] Make sure memory is ON
- [ ] Start your first conversation -- try asking Claude to summarize what it sees in the folder

---

*Guide prepared May 18, 2026*
