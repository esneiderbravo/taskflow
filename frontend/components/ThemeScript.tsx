import { THEME_STORAGE_KEY } from "@/lib/theme";

const themeScript = `(function(){try{var key=${JSON.stringify(THEME_STORAGE_KEY)};var stored=localStorage.getItem(key);var prefersDark=window.matchMedia("(prefers-color-scheme: dark)").matches;var dark=stored==="dark"||(stored!=="light"&&prefersDark);if(dark){document.documentElement.classList.add("dark");document.documentElement.dataset.theme="dark"}else{document.documentElement.dataset.theme="light"}}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
