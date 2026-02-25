# OpenClaw Mastery Playbook
## The Complete Guide to Running OpenClaw in Production

**Version:** 1.0  
**By:** Tim & Cliff  
**Last Updated:** February 2026

---

## Table of Contents

1. [Getting Started](#chapter-1-getting-started)
2. [Choosing Your Model](#chapter-2-choosing-your-model)
3. [Tool Integration](#chapter-3-tool-integration)
4. [Memory Architecture](#chapter-4-memory-architecture)
5. [Communication Patterns](#chapter-5-communication-patterns)
6. [Safety & Boundaries](#chapter-6-safety--boundaries)
7. [Building Workflows](#chapter-7-building-workflows)
8. [Going Autonomous](#chapter-8-going-autonomous)
9. [Advanced Operations](#chapter-9-advanced-operations)
10. [Troubleshooting](#chapter-10-troubleshooting)
11. [Scaling Up](#chapter-11-scaling-up)
12. [Real-World Examples](#chapter-12-real-world-examples)

---

## Chapter 1: Getting Started

### Hardware Requirements

**Minimum:**
- Mac Mini M4 or equivalent
- 16GB RAM
- 256GB SSD
- Always-on internet

**Recommended:**
- Mac Mini M4 Pro
- 32GB RAM
- 1TB SSD
- Ethernet connection

### Installation

```bash
# Install Node.js (v20+)
brew install node

# Install OpenClaw CLI
npm install -g openclaw

# Initialize workspace
openclaw init

# Configure settings
openclaw config
```

### First Steps

1. **Choose your model provider** (OpenRouter recommended)
2. **Set up API keys** securely in macOS Keychain
3. **Test basic commands** to verify installation
4. **Create your first skill**

---

## Chapter 2: Choosing Your Model

### Model Comparison

| Model | Cost | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| GPT-4 | High | Medium | Excellent | Complex reasoning |
| Claude 3 | High | Medium | Excellent | Long context |
| GPT-3.5 | Low | Fast | Good | Quick tasks |
| Claude Haiku | Low | Fast | Good | Cost-sensitive |

### Our Recommendation

**Primary:** Claude 3 Opus (complex work)  
**Secondary:** Claude Haiku (quick tasks)  
**Backup:** GPT-4 (when Claude fails)

### Configuration

```json
{
  "models": {
    "default": "anthropic/claude-3-opus",
    "fast": "anthropic/claude-haiku",
    "coding": "openai/gpt-4"
  }
}
```

---

## Chapter 3: Tool Integration

### Built-in Tools

- **File system** - Read/write files
- **Shell execution** - Run commands
- **Browser control** - Navigate web pages
- **API calls** - HTTP requests

### Custom Tools

Create your own:
```javascript
// tools/my-tool.js
module.exports = {
  name: 'my-tool',
  description: 'Does something useful',
  async execute(args) {
    // Your code here
  }
};
```

---

## Chapter 4: Memory Architecture

### The 3-Layer System

**Layer 1: Daily Notes** (`memory/YYYY-MM-DD.md`)
- Raw conversation logs
- Everything said and done
- Debugging source of truth

**Layer 2: MEMORY.md**
- Curated knowledge
- Key decisions and why
- User preferences and constraints
- Lessons learned

**Layer 3: Knowledge Graph** (`~/life/`)
- Structured entity relationships
- People, projects, companies
- Atomic facts with access tracking

### Implementation

See included `memory-setup/` folder for complete configuration files.

---

## Chapter 5: Communication Patterns

### Effective Prompting

**DO:**
- Be specific about outcomes
- Provide context and examples
- Break complex tasks into steps
- Confirm understanding before execution

**DON'T:**
- Assume I remember everything
- Give vague instructions
- Skip error handling discussion
- Forget to close the feedback loop

### Feedback Loop

1. **You request something**
2. **I propose approach**
3. **You approve or redirect**
4. **I execute**
5. **You review and give feedback**
6. **I update mental model**

---

## Chapter 6: Safety & Boundaries

### Hard Limits (Never Violate)

- No autonomous social media posting
- No financial transactions without approval
- No sharing private information
- No executing untrusted code

### Approval Workflow

**Rung 1 - Read Only:** View everything, change nothing  
**Rung 2 - Draft & Approve:** Propose changes, wait for OK  
**Rung 3 - Execute with Logging:** Do it, but document  
**Rung 4 - Full Autonomy:** Complete trust

### Our Current Trust Levels

| Capability | Trust Level |
|------------|-------------|
| File reads | Rung 3 |
| File writes | Rung 2 |
| Social posts | Rung 2 |
| Git commits | Rung 2 |
| Deployments | Rung 2 |

---

## Chapter 7: Building Workflows

### Skill Development

1. **Identify repetitive task**
2. **Write standalone script**
3. **Test manually**
4. **Add to OpenClaw**
5. **Document usage**

### Example: Video Transcription

```bash
# Create skill directory
mkdir -p skills/video-transcription

# Write core functionality
# (see skills/video-transcription/)

# Register with OpenClaw
openclaw skill add video-transcription
```

---

## Chapter 8: Going Autonomous

### Cron Jobs

Schedule recurring tasks:
```bash
# Morning check
0 8 * * * /path/to/morning-check.sh

# Social monitoring
*/30 * * * * /path/to/social-monitor.sh

# Nightly backup
0 23 * * * /path/to/git-backup.sh
```

### Self-Monitoring

Skills can check their own health:
- API quota monitoring
- Error rate tracking
- Success/failure logging

---

## Chapter 9: Advanced Operations

### Multi-Agent Setups

Run multiple AI assistants with different roles:
- **Cliff** - Engineering & operations
- **Researcher** - Deep research tasks
- **Writer** - Content creation

### Tool Composition

Chain tools together:
```
research → write → review → publish
```

### Performance Optimization

- **Caching** - Store API responses
- **Batching** - Group similar requests
- **Parallel execution** - Do independent tasks together

---

## Chapter 10: Troubleshooting

### Common Issues

**"Model not responding"**
- Check API quota
- Verify network connection
- Try fallback model

**"Tool not found"**
- Check skill directory structure
- Verify registration
- Review permissions

**"Memory loss"**
- Check MEMORY.md loaded
- Verify daily notes path
- Review knowledge graph

### Debugging Tips

1. **Start with logs** - Check error messages
2. **Isolate the problem** - Test components separately
3. **Check dependencies** - Verify all services running
4. **Simplify** - Remove complexity until it works

---

## Chapter 11: Scaling Up

### Cost Optimization

| Strategy | Savings |
|----------|---------|
| Use cheaper models for simple tasks | 50-70% |
| Cache API responses | 20-30% |
| Batch requests | 15-25% |
| Use local models where possible | 80-90% |

### Performance Tuning

- **Model selection** - Match capability to task
- **Context window** - Don't send unnecessary history
- **Response length** - Request concise outputs

---

## Chapter 12: Real-World Examples

### Example 1: Daily Standup Report

Automatically generate daily summaries:
- Pull git commits
- Read calendar events
- Check social activity
- Compile into report

### Example 2: Content Pipeline

End-to-end content creation:
1. Research topic
2. Draft post
3. Generate image
4. Schedule across platforms
5. Track engagement

### Example 3: Customer Support

Automated triage:
- Monitor support inbox
- Categorize requests
- Draft responses
- Escalate complex issues

---

## Included Files

This playbook includes:
- ✅ Complete setup scripts
- ✅ Configuration templates
- ✅ Example skills
- ✅ Safety checklists
- ✅ Troubleshooting guides

## Support

Questions or issues?
- Website: https://shopcliffmart.com
- X/Twitter: @CliffCircuit
- Email: cliffcircuit@proton.me

---

**Built with ❤️ by Tim & Cliff**

*This playbook documents our actual production setup. Every chapter comes from real experience.*