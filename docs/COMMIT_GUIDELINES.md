# Commit Message Guidelines

## 🚨 Important: Cloudflare Pages UTF-8 Compatibility

**ALWAYS use English for commit messages** to avoid Cloudflare Pages deployment failures.

### ❌ **Avoid These**
```bash
# Korean text causes UTF-8 errors
git commit -m "feat: 사용자 로그 시스템 추가"

# Emojis can cause issues
git commit -m "feat: ✨ Add user logs 🎉"

# Special characters might fail
git commit -m "feat: Add logs → database"
```

### ✅ **Use These Instead**
```bash
# Simple English only
git commit -m "feat: Add user activity logging system"

# Clear and descriptive
git commit -m "fix: Resolve database connection timeout"

# Use conventional commits
git commit -m "docs: Update API documentation"
```

## 📝 **Conventional Commit Format**

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### **Types**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### **Examples**
```bash
# Feature
git commit -m "feat: Add user authentication system"

# Bug fix
git commit -m "fix: Resolve login validation error"

# Documentation
git commit -m "docs: Add database migration guide"

# Database migration
git commit -m "feat: Add user_logs table for activity tracking"

# Deployment
git commit -m "chore: Update GitHub Actions workflow"
```

## 🔧 **Multi-line Commit Messages**

For detailed commits, use English throughout:

```bash
git commit -m "feat: Add user activity logging system

New Features:
- Add user_logs table for activity tracking  
- Track login, view, and system activities
- Performance optimization with indexes
- IP address and User Agent tracking

Migration:
- Add 004_add_user_logs_table.sql migration
- Local and remote testing completed
- GitHub Actions auto-deployment ready"
```

## 🚀 **Deployment-Safe Commits**

When creating commits that trigger deployments:

1. **Use only English**
2. **Avoid special characters**
3. **No emojis**
4. **Keep it simple and descriptive**

### **Migration Commits**
```bash
# Good
git commit -m "feat: Add user_logs table migration"

# Good with details
git commit -m "feat: Add user activity tracking

- Add user_logs table with indexes
- Track user actions and IP addresses  
- Include sample data for testing
- Ready for automatic deployment"
```

## 🛡️ **Why This Matters**

- **Cloudflare Pages** fails with non-ASCII characters in commit messages
- **GitHub Actions** deployment gets interrupted  
- **Development workflow** breaks due to deployment failures
- **Team productivity** decreases with failed deployments

## 📋 **Quick Checklist**

Before committing:
- [ ] Message is in English only
- [ ] No emojis or special characters
- [ ] Descriptive and clear
- [ ] Follows conventional commit format
- [ ] Ready for automatic deployment

## 🔄 **Fixing Bad Commits**

If you accidentally commit with problematic characters:

```bash
# Fix the last commit message
git commit --amend -m "feat: Add user activity logging system"

# Force push to update remote
git push --force origin main
git push --force origin dev
```

---

**Remember: Simple English commits = Successful deployments! 🎯**
