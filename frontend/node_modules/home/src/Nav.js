import './css/nav_styles.css';

export default function Nav() {
  return (
    <div>
      <nav class="navbar">
        <div class="navbar-left">
            <a class="navbar-brand">Book<span class="brand-color-shift">worm</span></a>
            <button class="nav-link">
                {
                  // this will take you to the start reading page for the most recently read book
                }
                Start Reading
            </button>
            <button class="nav-link">
                {
                  // this will take you to the book log
                }
                Book Log
            </button>
        </div>
        <div class="navbar-right">
            <span class="coins">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="3 -6 24 24"><path fill="#FFCC4D" d="M17 3.34A10 10 0 1 1 2 12l.005-.324A10 10 0 0 1 17 3.34M12 6a1 1 0 0 0-1 1a3 3 0 1 0 0 6v2a1.02 1.02 0 0 1-.866-.398l-.068-.101a1 1 0 0 0-1.732.998a3 3 0 0 0 2.505 1.5H11a1 1 0 0 0 .883.994L12 18a1 1 0 0 0 1-1l.176-.005A3 3 0 0 0 13 11V9c.358-.012.671.14.866.398l.068.101a1 1 0 0 0 1.732-.998A3 3 0 0 0 13.161 7H13a1 1 0 0 0-1-1m1 7a1 1 0 0 1 0 2zm-2-4v2a1 1 0 0 1 0-2"/></svg>
                2,300
            </span>
            <button href="#" class="home-btn">Shop</button>
            <button href="#" class="home-btn" id="logout">Logout</button>
            {
              // this will take you to the shop
            }
        </div>
      </nav>
    </div>
  );
}
