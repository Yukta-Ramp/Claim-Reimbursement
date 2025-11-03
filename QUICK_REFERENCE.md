# Translation System - Quick Reference

## 🚀 Quick Start

```typescript
import { useLanguage } from '../contexts/LanguageContext';

export const MyComponent = () => {
  const { t } = useLanguage();
  
  return <h1>{t('appName')}</h1>;
};
```

## 📝 Common Patterns

### Simple Translation
```typescript
const { t } = useLanguage();

t('appName')           // "ClaimFlow"
t('email')             // "Email"
t('logout')            // "Logout"
```

### Nested Translation
```typescript
t('nav.myClaims')                // "My Claims"
t('roles.supervisor')            // "Supervisor"
t('actions.save')                // "Save"
```

### Deep Nested
```typescript
t('admin.userManagement.title')             // "User Management"
t('admin.userManagement.table.name')        // "Name"
t('billForm.expenseTypes.generic')          // "Generic"
```

### Language Switcher
```typescript
const { language, setLanguage, t } = useLanguage();

<button onClick={() => setLanguage('fr')}>
  {t('languages.fr')}  // "Français"
</button>
```

### Dynamic Keys
```typescript
const { language, t } = useLanguage();

// Current language name
t(`languages.${language}`)

// Dynamic status
const status = 'submitted';
t(`myClaims.status.${status}`)
```

## 📋 Common Translation Keys

### Actions
```
actions.new         → "New"
actions.save        → "Save"
actions.cancel      → "Cancel"
actions.delete      → "Delete"
actions.edit        → "Edit"
actions.submit      → "Submit"
actions.approve     → "Approve"
actions.reject      → "Reject"
actions.back        → "Back"
```

### Navigation
```
nav.myClaims              → "My Claims"
nav.pendingApprovals      → "Pending Approvals"
nav.administration        → "Administration"
```

### Roles
```
roles.user               → "User"
roles.supervisor         → "Supervisor"
roles.financeApprover    → "Finance Approver"
roles.superAdmin         → "Super Admin"
```

### My Claims
```
myClaims.title           → "My Claims"
myClaims.newClaim        → "New Claim"
myClaims.noResults       → "No claims found"
myClaims.status.drafted  → "Drafted"
myClaims.status.paid     → "Paid"
```

### Claim Creation
```
claimCreation.title              → "Create New Claim"
claimCreation.claimTitle         → "Claim Title"
claimCreation.addBill            → "Add Bill"
claimCreation.total              → "Total"
claimCreation.proceedToDeclaration → "Proceed to Declaration"
```

### Bill Form
```
billForm.expenseName      → "Expense Name"
billForm.amount           → "Amount"
billForm.vat              → "VAT"
billForm.merchantName     → "Merchant Name"
```

### Admin
```
admin.title                        → "Administration"
admin.userManagement.addUser       → "Add User"
admin.userManagement.table.email   → "Email"
admin.mileageRates.title           → "Mileage Rates"
admin.reports.download             → "Download"
```

## 🌍 Supported Languages

```typescript
'en'  // English (default)
'hi'  // हिन्दी (Hindi)
'es'  // Español (Spanish)
'fr'  // Français (French)
```

## ⚡ Tips

### ✅ DO
```typescript
// Use t() function
<button>{t('actions.save')}</button>

// Access context once
const { t } = useLanguage();

// Use dot notation
t('nav.myClaims')
```

### ❌ DON'T
```typescript
// Don't hardcode text
<button>Save</button>

// Don't call useLanguage multiple times
const { t: t1 } = useLanguage();
const { t: t2 } = useLanguage();

// Don't use inconsistent keys
t('navigation.my_claims')  // Wrong structure
```

## 🐛 Debugging

### Missing Translation
If you see the key instead of translated text:
1. Check YAML file has the key
2. Verify dot notation syntax
3. Check console for warnings

### Language Not Switching
1. Ensure component uses `useLanguage()` hook
2. Verify `setLanguage()` is called correctly
3. Check LanguageProvider wraps your app

### Console Warnings
```
Translation key not found: xyz.abc in language en
```
→ Add the key to `/locales/en.yaml` (and all other files)

## 📚 Full Documentation

See `/TRANSLATION_SYSTEM.md` for complete documentation including:
- Detailed API reference
- File structure
- Best practices
- Troubleshooting guide
- Migration instructions

## 📁 File Locations

- **Translation Files**: `/locales/*.yaml`
- **Translation Utils**: `/lib/i18n.ts`
- **Language Context**: `/contexts/LanguageContext.tsx`
- **Documentation**: `/TRANSLATION_SYSTEM.md`

## 🔧 Adding New Translation

1. Add to ALL 4 YAML files (en, hi, es, fr)
2. Use same key structure in each file
3. Test with language switcher

**Example:**
```yaml
# en.yaml
settings:
  theme: "Theme"

# hi.yaml
settings:
  theme: "थीम"

# es.yaml
settings:
  theme: "Tema"

# fr.yaml
settings:
  theme: "Thème"
```

Then use:
```typescript
t('settings.theme')
```

## 🎯 Examples by Component Type

### Button
```typescript
<Button>{t('actions.save')}</Button>
```

### Heading
```typescript
<h1>{t('myClaims.title')}</h1>
```

### Input Placeholder
```typescript
<Input placeholder={t('myClaims.searchPlaceholder')} />
```

### Toast
```typescript
toast.success(t('myClaims.deleteSuccess'));
toast.error(t('declaration.error'));
```

### Select Options
```typescript
<option value="en">{t('languages.en')}</option>
<option value="hi">{t('languages.hi')}</option>
```

---

**Need Help?** Check `/TRANSLATION_SYSTEM.md` or `/IMPLEMENTATION_SUMMARY.md`
