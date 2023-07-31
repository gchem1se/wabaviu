const ThemeChanger = () => {
  const handle = () => {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.theme === "dark" ? localStorage.theme = "light" : localStorage.theme = "dark"
  };

  return <button onLoad={handle} onClick={handle}>cambia tema</button>;
};

export default ThemeChanger;