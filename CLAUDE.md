# ClaudeWatch Validation Instructions

## Overview
This project uses ClaudeWatch for automated validation and enabled mode. The system automatically validates your work after task completion using comprehensive testing and visual analysis.

## How It Works

1. **Automatic Triggering**: When you complete a task, validation runs automatically via Claude Code hooks
2. **Visual Analysis**: Captures screenshots and analyzes page structure and content alignment
3. **Comprehensive Testing**: Tests visual elements, accessibility, performance, forms, APIs, and more
4. **Multi-viewport**: Tests on desktop, tablet, and mobile viewports
5. **Detailed Reports**: Saves screenshots, validation results, and technical logs for review

{{#if SELF_HEALING}}
## Self-Healing Features

The system can automatically fix:
- Missing alt text on images
- Console errors and JavaScript issues
- Broken API endpoints
- Missing resources (creates placeholders)
- Performance issues
- Basic accessibility problems

{{/if}}

## Manual Commands

If needed, you can run validation manually:

```bash
# Run validation tests
claudewatch validate

{{#if SELF_HEALING}}
# Run self-healing validation (recommended)
claudewatch self-heal
{{/if}}

# Check system status
claudewatch status

# View validation reports
claudewatch report

# Clean up old files
claudewatch cleanup
```

## 🚨 CRITICAL: MANDATORY VALIDATION REQUIREMENTS 🚨

### ⚠️ CLAUDE CODE MUST VALIDATE ALL WORK ⚠️

**THIS IS NON-NEGOTIABLE. VALIDATION IS REQUIRED FOR ALL TASKS.**

ClaudeWatch is installed and MUST be used. You are REQUIRED to validate work:

1. **After ANY code changes** - MANDATORY: run `claudewatch validate` or `claudewatch self-heal`
2. **Before marking tasks complete** - MANDATORY: Validation MUST pass before completing work  
3. **When asked to "test" or "verify"** - MANDATORY: This means run ClaudeWatch validation
4. **After file edits** - MANDATORY: Always validate changes
5. **After implementing features** - MANDATORY: Validation required

### MANDATORY Commands

**After making ANY changes to code, HTML, CSS, or configuration:**

```bash
# For quick validation
claudewatch validate

# For automatic fixes (RECOMMENDED)
claudewatch self-heal
```

### Task Management Guidelines

### For ALL Development Tasks

You MUST include validation in your workflow:

1. **Bug Fixes**
   - MUST run: `claudewatch validate` after fix
   
2. **Feature Implementation** 
   - MUST run: `claudewatch self-heal` after implementation
   
3. **UI Changes**
   - MUST run: `claudewatch validate` to verify changes

### REQUIRED Todo Structure

```
1. Implement contact form
2. Add form validation  
3. Style the form components
4. ✅ MANDATORY: Run ClaudeWatch validation
5. ✅ MANDATORY: Fix any validation errors
6. ✅ MANDATORY: Verify all tests pass
```

### Validation Rules - NO EXCEPTIONS

- ❌ NEVER mark a task complete without running validation
- ❌ NEVER ignore validation failures  
- ❌ NEVER skip the validation step
- ✅ ALWAYS run `claudewatch validate` or `claudewatch self-heal`
- ✅ ALWAYS fix issues found by validation
- ✅ ALWAYS verify validation passes before completing work

## Configuration

Edit `.claudewatch/config.js` to customize:
- Pages to test
- Elements to validate
- Forms to test
- API endpoints to check
- Accessibility rules
- Performance thresholds

### Visual Analysis Features

ClaudeWatch provides comprehensive visual validation:
- Screenshot capture across all viewports
- Task completion assessment
- Layout and structure evaluation
- Element detection and verification
- Content alignment analysis

## Validation Types

ClaudeWatch checks:
- ✅ **Visual Analysis** - Screenshot capture and structural analysis
- ✅ **Visual Elements** - Required page elements exist and function properly
- ✅ **Task Alignment** - Compares page content against original request
- ✅ **Accessibility** - Alt text, headings, contrast, keyboard navigation
- ✅ **Performance** - Load times, Core Web Vitals
- ✅ **Forms** - Validation, error handling, submission
- ✅ **APIs** - Health checks, response codes
- ✅ **Console** - JavaScript errors and warnings
- ✅ **Links** - Broken link detection
- ✅ **Mobile** - Responsive design across viewports

## Output Files

- `validation-logs/` - Detailed JSON reports
- `validation-screenshots/` - Screenshots from all viewports
- `.claudewatch/logs/` - Self-healing logs (if enabled)

## Best Practices

1. **Let validation run automatically** - It's triggered after each task
2. **Review validation reports** - Check screenshots and logs
3. **Update configuration** - Customize for your project needs
4. **Keep server running** - Validation needs a live development server

## Troubleshooting

If validation fails:
1. Check that your dev server is running
2. Review the validation logs in `validation-logs/`
3. Look at screenshots in `validation-screenshots/`
4. Update `.claudewatch/config.js` if needed

{{#if SELF_HEALING}}
If self-healing gets stuck:
1. Check `validation-logs/self-healing-log.json`
2. Some issues may need manual fixes
3. Run `claudewatch validate` to see remaining issues
{{/if}}

## Exit Codes

- **0** = All validations passed ✅
- **1** = Some validations failed ❌

Remember: ClaudeWatch helps ensure high-quality, accessible, performant code. Trust the process and let it guide improvements!