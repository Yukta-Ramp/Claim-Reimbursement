import en from '../locales/en.json';
import hi from '../locales/hi.json';
import fr from '../locales/fr.json';
import es from '../locales/es.json';

const locales = { en, hi, fr, es };

export function translate(lang, label) {
  const dict = locales[lang] || locales['en'];
  // Support nested keys using dot notation
  const keys = label.split('.');
  let value = dict;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return label;
    }
  }
  return typeof value === 'string' ? value : label;
}
