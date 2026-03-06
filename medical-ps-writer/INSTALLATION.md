# Installation Guide

## Quick Start

1. **Locate your Claude skills directory:**

   **Windows:**
   ```
   C:\Users\YourUsername\.claude\skills\
   ```

   **Mac/Linux:**
   ```
   ~/.claude/skills/
   ```

2. **Copy the entire `medical-ps-writer` folder into your skills directory**

3. **Restart Claude Code** (if using CLI) or **refresh Claude.ai** (if using web)

4. **Test the skill** by asking:
   ```
   Help me write my medical school personal statement
   ```

## Detailed Installation Steps

### For Claude Code (CLI)

1. Open your terminal

2. Navigate to the skills directory:
   ```bash
   # Windows
   cd C:\Users\YourUsername\.claude\skills\

   # Mac/Linux
   cd ~/.claude/skills/
   ```

3. If the skills directory doesn't exist, create it:
   ```bash
   mkdir -p ~/.claude/skills/  # Mac/Linux
   mkdir %USERPROFILE%\.claude\skills\  # Windows
   ```

4. Copy the medical-ps-writer folder:
   ```bash
   # If you're in the award-winning-website directory
   cp -r medical-ps-writer ~/.claude/skills/  # Mac/Linux
   xcopy medical-ps-writer %USERPROFILE%\.claude\skills\medical-ps-writer\ /E /I  # Windows
   ```

5. Verify the installation:
   ```bash
   ls ~/.claude/skills/medical-ps-writer/  # Mac/Linux
   dir %USERPROFILE%\.claude\skills\medical-ps-writer\  # Windows
   ```

   You should see:
   - SKILL.md
   - README.md
   - references/ folder
   - assets/ folder

### For Claude.ai (Web Interface)

1. Go to Settings → Skills

2. Click "Add Skill" or "Upload Skill"

3. Select the entire `medical-ps-writer` folder

4. Confirm the upload

5. The skill will be available immediately

## Verification

To verify the skill is working:

1. Start a new conversation

2. Type any of these trigger phrases:
   - "Help me with my medical school personal statement"
   - "Review my AMCAS essay"
   - "I need help writing my personal statement"

3. The skill should activate and provide guided assistance

## File Structure (What You Should See)

```
medical-ps-writer/
├── SKILL.md                           # Main skill file (required)
├── README.md                          # Documentation
├── INSTALLATION.md                    # This file
├── SKILL-SUMMARY.md                   # Quick reference
├── assets/                            # Empty (for future templates)
└── references/                        # Detailed guidance
    ├── show-vs-tell.md               # SHOWING vs TELLING examples
    ├── common-mistakes.md            # Pitfalls to avoid
    ├── examples.md                   # Real student examples
    └── quick-reference.md            # One-page cheat sheet
```

## Troubleshooting

### Skill Not Triggering

**Problem:** You mention "personal statement" but the skill doesn't activate.

**Solutions:**
1. Check that SKILL.md exists and is exactly named (case-sensitive)
2. Verify the frontmatter has the correct format
3. Try being more explicit: "Use the medical-ps-writer skill"
4. Restart Claude Code or refresh Claude.ai

### File Not Found Errors

**Problem:** Error messages about missing files.

**Solutions:**
1. Verify all files copied correctly
2. Check file permissions (should be readable)
3. Ensure folder name is exactly: `medical-ps-writer` (with hyphen, lowercase)

### Skill Loads But Doesn't Work Well

**Problem:** Skill activates but provides poor guidance.

**Solutions:**
1. Verify all reference files are present in references/ folder
2. Check that file contents weren't corrupted during copy
3. Try asking specific questions like "Show me an example of showing vs telling"

## Usage Tips

### Getting Started
- Begin with: "I need help writing my medical school personal statement"
- Let the skill guide you through the discovery questions
- Be honest and thorough in your responses

### Reviewing a Draft
- Say: "Review my personal statement draft" then paste your draft
- The skill will identify specific issues and provide examples

### Specific Help
- "How do I show instead of tell in my personal statement?"
- "What are common mistakes to avoid?"
- "Review this opening paragraph"

## Updating the Skill

If a new version is released:

1. Backup your current version (if you made custom changes)
2. Delete the old medical-ps-writer folder
3. Copy the new version to your skills directory
4. Restart Claude

## Uninstalling

To remove the skill:

1. Navigate to your skills directory
2. Delete the medical-ps-writer folder
3. Restart Claude

```bash
# Mac/Linux
rm -rf ~/.claude/skills/medical-ps-writer

# Windows
rmdir /s %USERPROFILE%\.claude\skills\medical-ps-writer
```

## Getting Help

If you encounter issues:

1. Check the README.md for documentation
2. Review SKILL-SUMMARY.md for overview
3. Consult references/quick-reference.md for usage guide
4. Open an issue on GitHub (if distributed via GitHub)

## Next Steps

Once installed, try:

1. **Start from scratch:**
   ```
   I'm applying to medical school and need help writing my personal statement.
   I'm not sure where to start.
   ```

2. **Review existing work:**
   ```
   Can you review my personal statement draft? Here it is:
   [paste your draft]
   ```

3. **Get specific help:**
   ```
   How do I make my opening more engaging?
   ```

---

**Enjoy writing your compelling personal statement!**

For more resources, visit:
- [Medical School HQ](https://medicalschoolhq.net/)
- [The Premed Years Podcast](https://mshq.co/pmy)
- [Free Personal Statement Examples](https://personalstatementbook.com/bonusessays)
