import { useTheme, ThemeName } from "../theme/ThemeProvider";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <select
      className="select"
      value={theme}
      onChange={(e) => setTheme(e.target.value as ThemeName)}
      aria-label="Cambiar tema"
      title="Cambiar tema"
    >
      <option value="purple">Tema: Morado</option>
      <option value="teal">Tema: Turquesa</option>
      <option value="sunset">Tema: Atardecer</option>
    </select>
  );
}
