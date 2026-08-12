import { type FC } from 'react';
import { Globe2, Moon, Sun } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const NavbarControls: FC = () => {
  const { lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <button
        className="theme-toggle-btn"
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle theme"
      >
        <span className="control-icon-orb" aria-hidden="true">
          {theme === 'dark' ? <Sun size={16} strokeWidth={2.2} /> : <Moon size={16} strokeWidth={2.2} />}
        </span>
      </button>
      <button
        className="lang-toggle-btn"
        onClick={() => setLang(lang === 'ID' ? 'EN' : 'ID')}
        title="Toggle Language"
        aria-label="Toggle language"
      >
        <Globe2 size={15} strokeWidth={2.1} aria-hidden="true" />
        <span>{lang === 'ID' ? 'EN' : 'ID'}</span>
      </button>
    </>
  );
};

export default NavbarControls;
