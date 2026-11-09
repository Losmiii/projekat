(() => {
  const headerString = `
    <header class="search-and-notifications">
        <div>
        <form id="search-form" action="#">
            <div class="search-container" id="search-container">
            <input
                type="text"
                name="query"
                class="search-input"
                id="search-input"
                placeholder="Search..."
                autocomplete="off"
            />

            <button type="button" class="search-btn" id="search-btn">
                <img
                class="search-icon"
                src="./assets/imgs/magnifying-glass-solid-full.svg"
                alt="search icon"
                />
            </button>
            </div>
        </form>
        </div>

        <div class="notification">
        <button
            class="notification-button"
            id="bell-btn"
            aria-haspopup="true"
            aria-expanded="false"
        >
            <img
            class="notification-image"
            src="assets/imgs/bell-regular-full.svg"
            alt="notification icon"
            />
        </button>

        <div class="notification-dropdown" id="dropdown-menu">
            <div class="dropdown-header">
            <span>Notifications</span>
            </div>
            <ul class="notification-list">
            <li class="unread">New comment on your post</li>
            <li>Your profile was updated</li>
            </ul>
        </div>
        </div>

        <div class="profile">
        <img src="assets/imgs/user-regular-full.svg" alt="profile icon" />
        </div>
    </header>
`;

  const parser = new DOMParser();
  const headerHtml = parser.parseFromString(headerString, "text/html");

  const page = document.querySelector(".page");
  page.prepend(headerHtml.querySelector("header"));

  const myEvent = new Event("header");
  document.dispatchEvent(myEvent);
})();
