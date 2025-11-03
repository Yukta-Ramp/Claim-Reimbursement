# Translation System Documentation

## Overview

The application uses a YAML-based translation system with support for 4 languages:
- **English (en)** - Default language
- **Hindi (hi)** - हिन्दी
- **Spanish (es)** - Español  
- **French (fr)** - Français

## File Structure

```
locales/
├── en.yaml    # English translations
├── hi.yaml    # Hindi translations
├── es.yaml    # Spanish translations
└── fr.yaml    # French translations

lib/
└── i18n.ts    # Translation utility functions

contexts/
└── LanguageContext.tsx    # Language context provider
```

## YAML File Format

Each YAML file follows the same structure to ensure consistency across languages:

```yaml
# Top-level keys
appName: "ClaimFlow"
email: "Email"
entity: "Entity"

# Nested sections
nav:
  myClaims: "My Claims"
  pendingApprovals: "Pending Approvals"
  administration: "Administration"

# Deeply nested
admin:
  userManagement:
    title: "User Management"
    addUser: "Add User"
    table:
      name: "Name"
      email: "Email"
```

## Translation Keys Structure

### Top-Level Keys
- `appName`, `appSubtitle`
- `switchRole`, `myAccount`
- `email`, `entity`, `department`
- `logout`

### Main Sections
- **`languages`** - Language names
- **`roles`** - User role translations
- **`nav`** - Navigation menu items
- **`actions`** - Common action buttons (save, cancel, delete, etc.)
- **`myClaims`** - My Claims page and status filters
- **`claimCreation`** - Claim creation form
- **`billForm`** - Bill form with expense types
- **`claimDetails`** - Claim details page
- **`declaration`** - Declaration page
- **`pendingApprovals`** - Pending approvals page
- **`admin`** - Admin section
  - `userManagement` - User management panel
  - `mileageRates` - Mileage rates panel
  - `reports` - Reports panel

## Usage

### Basic Usage

```typescript
import { useLanguage } from '../contexts/LanguageContext';

export const MyComponent = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('appName')}</h1>
      <button>{t('actions.save')}</button>
    </div>
  );
};
```

### With Dot Notation

Access nested translations using dot notation:

```typescript
// Simple nested
t('nav.myClaims')              // "My Claims"
t('roles.supervisor')          // "Supervisor"

// Deeply nested
t('admin.userManagement.title')           // "User Management"
t('admin.userManagement.table.name')      // "Name"
t('billForm.expenseTypes.generic')        // "Generic"
```

### Language Switching

```typescript
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <select 
      value={language} 
      onChange={(e) => setLanguage(e.target.value)}
    >
      <option value="en">{t('languages.en')}</option>
      <option value="hi">{t('languages.hi')}</option>
      <option value="es">{t('languages.es')}</option>
      <option value="fr">{t('languages.fr')}</option>
    </select>
  );
};
```

### Dynamic Keys

For dynamic keys, use template literals:

```typescript
const { language, t } = useLanguage();

// Dynamic language key
t(`languages.${language}`)

// Note: This works because the t() function is called with
// the final computed string like 'languages.en'
```

## API Reference

### `getTranslation(language, key)`

The core translation function defined in `/lib/i18n.ts`:

**Parameters:**
- `language` (Language): Language code - 'en', 'hi', 'es', or 'fr'
- `key` (string): Translation key with dot notation

**Returns:** `string` - Translated text or the key itself if not found

**Examples:**
```typescript
import { getTranslation } from '../lib/i18n';

getTranslation('en', 'login.title')              // "Login"
getTranslation('fr', 'home.welcome')             // "Bienvenue..."
getTranslation('es', 'admin.userManagement.addUser')  // "Agregar Usuario"
```

### `useLanguage()` Hook

React hook that provides language context:

**Returns:**
```typescript
{
  language: Language;           // Current language code
  setLanguage: (lang) => void;  // Function to change language
  t: (key: string) => string;   // Translation function
}
```

**Example:**
```typescript
const { language, setLanguage, t } = useLanguage();

// Get current language
console.log(language); // 'en'

// Change language
setLanguage('fr');

// Translate
const title = t('myClaims.title'); // Uses current language
```

## Adding New Translations

### Step 1: Add to All YAML Files

Add the same key to all 4 YAML files to maintain consistency:

**en.yaml:**
```yaml
settings:
  profile: "Profile Settings"
  security: "Security"
```

**hi.yaml:**
```yaml
settings:
  profile: "प्रोफ़ाइल सेटिंग्स"
  security: "सुरक्षा"
```

**es.yaml:**
```yaml
settings:
  profile: "Configuración del Perfil"
  security: "Seguridad"
```

**fr.yaml:**
```yaml
settings:
  profile: "Paramètres du Profil"
  security: "Sécurité"
```

### Step 2: Use in Components

```typescript
const { t } = useLanguage();

return (
  <div>
    <h2>{t('settings.profile')}</h2>
    <p>{t('settings.security')}</p>
  </div>
);
```

## Best Practices

### 1. Consistent Keys
Always use the same keys across all language files:
```yaml
# ✅ Good - Same structure in all files
actions:
  save: "Save"
  cancel: "Cancel"

# ❌ Bad - Different structures
# en.yaml has 'actions.save'
# fr.yaml has 'buttons.save'  (inconsistent)
```

### 2. Meaningful Key Names
Use descriptive, hierarchical key names:
```yaml
# ✅ Good
admin:
  userManagement:
    confirmDelete: "Are you sure you want to delete this user?"

# ❌ Bad
admin:
  um:
    cd: "Are you sure?"  # Unclear abbreviations
```

### 3. Group Related Translations
Organize translations logically by feature or page:
```yaml
# ✅ Good - Grouped by feature
billForm:
  expenseName: "Expense Name"
  expenseType: "Expense Type"
  amount: "Amount"

# ❌ Bad - Scattered
expenseName: "Expense Name"
someOtherKey: "..."
expenseType: "Expense Type"
```

### 4. Avoid Hardcoded Text
Always use the translation function:
```typescript
// ✅ Good
<button>{t('actions.save')}</button>

// ❌ Bad
<button>Save</button>  // Hardcoded, won't translate
```

### 5. Handle Missing Translations
The system returns the key if translation is missing:
```typescript
// If 'newFeature.title' doesn't exist in YAML
t('newFeature.title')  // Returns 'newFeature.title'

// Console warning: "Translation key not found: newFeature.title in language en"
```

## Testing Translations

### Manual Testing Checklist
- [ ] Test all 4 languages (en, hi, es, fr)
- [ ] Verify language switcher works
- [ ] Check all pages display correctly
- [ ] Ensure no hardcoded text remains
- [ ] Test forms and error messages
- [ ] Verify toast notifications translate
- [ ] Check console for missing key warnings

### Quick Test Script
```typescript
// Test all keys in a section
const testKeys = [
  'nav.myClaims',
  'nav.pendingApprovals',
  'nav.administration'
];

const languages = ['en', 'hi', 'es', 'fr'];

languages.forEach(lang => {
  console.log(`\n${lang.toUpperCase()}:`);
  testKeys.forEach(key => {
    console.log(`${key}: ${getTranslation(lang, key)}`);
  });
});
```

## Troubleshooting

### Translation Not Appearing
1. Check if key exists in YAML file
2. Verify correct dot notation syntax
3. Ensure LanguageProvider wraps your component
4. Check browser console for warnings

### Language Not Switching
1. Verify `setLanguage()` is called correctly
2. Check if component is using `t()` function
3. Ensure useLanguage() hook is used (not direct import)

### YAML Parse Errors
1. Check YAML syntax (indentation must be consistent)
2. Escape special characters in strings
3. Use quotes for strings with colons or special chars

## Migration from Old System

If migrating from the old `getCopy()` function:

```typescript
// Old way
getCopy(language, 'section', 'key')

// New way  
t('section.key')

// Example
getCopy(language, 'actions', 'save')  // Old
t('actions.save')                      // New
```

## Performance Considerations

- YAML files are parsed once at startup
- Translations are stored in memory
- The `t()` function performs object traversal (O(n) where n = nesting depth)
- Recommended: Keep nesting depth ≤ 3 levels

## Future Enhancements

Potential improvements to consider:
- [ ] Add more languages
- [ ] Implement translation pluralization
- [ ] Add date/number formatting per locale
- [ ] Create translation management UI
- [ ] Add translation validation tests
- [ ] Generate TypeScript types from YAML

## Support

For questions or issues with translations:
1. Check this documentation
2. Review YAML files in `/locales` folder
3. Check implementation in `/lib/i18n.ts`
4. Review LanguageContext in `/contexts/LanguageContext.tsx`
