(() => {
  const sideBarString = `
    <aside class="sidebar">
        <div class="logo">
            <p>UI</p>
        </div>
 
        <div class="icons">
            <a href="index.html" class="icon-link">
              <img class="home-picture" src="./assets/imgs/house-solid-full.svg" alt="home icon" />
            </a>
            <img class="home-picture" src="./assets/imgs/chart-bar-solid-full.svg" alt="chart icon" />
            <img class="home-picture" src="./assets/imgs/chart-pie-solid-full.svg" alt="chart pie icon" />
            <img class="home-picture" src="./assets/imgs/inbox-solid-full.svg" alt="inbox icon" />
            <img class="home-picture" id="theme-btn" src="./assets/imgs/moon-regular-full.svg" alt="change theme icon" />
            <a href="settings.html" class="icon-link">
              <img class="home-picture" src="./assets/imgs/gear-solid-full.svg" alt="settings icon" />
            </a>
        </div>
    </aside>
    `;

  const parser = new DOMParser();
  const sidebarHtml = parser.parseFromString(sideBarString, "text/html");

  const container = document.querySelector(".container");
  container.prepend(sidebarHtml.querySelector("aside"));

  //tema (dark/light) - ovde je da radi na SVIM stranicama
  const themeBtn = document.getElementById("theme-btn");
  const moonIcon = "./assets/imgs/moon-regular-full.svg";
  const sunIcon = "./assets/imgs/sun-regular-full.svg";

  function setTheme(dark) {
    document.body.classList.toggle("dark", dark);
    themeBtn.src = dark ? sunIcon : moonIcon;
    localStorage.setItem("theme", dark ? "dark" : "light");
  }

  themeBtn.addEventListener("click", () => {
    setTheme(!document.body.classList.contains("dark"));
  });

  //pri ucitavanju vracam sacuvanu temu
  setTheme(localStorage.getItem("theme") === "dark");

  const myEvent = new Event("sidebar");
  document.dispatchEvent(myEvent);
})();
