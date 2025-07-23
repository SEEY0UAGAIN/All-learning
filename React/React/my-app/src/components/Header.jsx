import "./Header.css";
import { IoSunny } from "react-icons/io5";
import { FaMoon } from "react-icons/fa6";

function Header({ title, theme, setTheme }) {
  function toggleTheme() {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  return (
    <nav>
      <h1>{title}</h1>
      <span onClick={toggleTheme}>
        {theme === "light" ? <IoSunny size={30} /> : <FaMoon size={30} />}
      </span>
    </nav>
  );
}
export default Header;
