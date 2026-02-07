import { useTheme, ThemeName } from "../app/theme/ThemeProvider";

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
      <option value="purple" style={{ color: "black", fontWeight: "bold" }}>💜 Tema: Morado</option>
      <option value="teal" style={{ color: "black", fontWeight: "bold" }}>🐬 Tema: Turquesa</option>
      <option value="sunset" style={{ color: "black", fontWeight: "bold" }}>🌅 Tema: Atardecer</option>
    </select>
  );
}
