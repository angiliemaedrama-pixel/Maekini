MAEKINI.COM - COMPLETE ONLINE STORE + DATABASE

1. HOW TO RUN THE WEBSITE
------------------------------------------------
The storefront includes an introduction page, product zoom and reviews, and
working All, Two Piece / One Piece, and Modest collections.

Accounts use the SQLite database when the Node server is running. If the
account server is unavailable, new accounts can still be created and used in
the current browser. Browser-local accounts do not sync to another browser or
the SQLite database.

In VS Code, open the Run and Debug panel, select
`MaeKini: Store (port 3000)`, and press F5. This starts `server.js` and opens
the storefront at `http://localhost:3000/`.

Alternatively, double-click `start-maekini.bat`. It checks for Node.js 22+,
starts the account server in a separate window, waits for it to respond, and
opens the storefront. Keep the account-server window open while using the
store.

VS Code Live Server uses port 5500 for its static preview. That is a separate
server from `server.js`, which runs the account database and API on port 3000.
If you use Live Server, the admin page can call the API only while `server.js`
is running. For database-backed accounts and the admin page, use the F5
configuration above or open `http://localhost:3000/admin.html`.

Alternatively, open the Maekini folder in VS Code, then open the VS Code
Terminal and run:

    node server.js

Then open this address in your browser for shared, database-backed accounts:

    http://localhost:3000

If your computer uses a different Node version, use Node.js 22 or newer because this project uses Node's built-in SQLite support.

2. HOW TO SEE WHO REGISTERED
------------------------------------------------
Open:

    http://localhost:3000/admin.html

Keep the server window open while using the admin page. If you open
admin.html through Live Server (port 5500), the admin page sends its customer
request to the account server on port 3000. If that server is not running,
start it with the F5 configuration or `start-maekini.bat`.

Sign in with the default school-project admin account:

Username:
    admin

Password:
    maekini-admin

The page shows registered customer details:
- Customer ID
- Full name
- Email
- Date/time registered
- Last login

IMPORTANT: These are demo credentials. Change them before use beyond a local
demo, and do not expose this development server directly to the internet.
Configure the admin username and password using environment variables when
starting the server.

Windows PowerShell:
    $env:MAEKINI_ADMIN_USERNAME="your-admin-name"; $env:MAEKINI_ADMIN_KEY="use-a-long-unique-password"; node server.js

Windows Command Prompt:
    set MAEKINI_ADMIN_USERNAME=your-admin-name && set MAEKINI_ADMIN_KEY=use-a-long-unique-password && node server.js

3. DATABASE FILE
------------------------------------------------
After the server starts for the first time, it creates:

    %LOCALAPPDATA%\MaeKini\maekini.db

On Windows, this is usually inside your user AppData\Local folder. This keeps
the database writable even when the project was opened from a read-only
Downloads or extracted archive folder. Set MAEKINI_DATABASE_FILE to choose a
different database path.

This is the SQLite database containing registered customer records.
Passwords are NOT stored as plain text. The server stores a password hash instead.

4. IMPORTANT CODE FILES
------------------------------------------------
index.html
    The website structure and pages.

style.css
    The website design.

script.js
    The website functions: search, cart, favorites, checkout, reviews, orders, login, registration, etc.

server.js
    The backend and SQLite database functions.

admin.html
    Store-owner page for viewing registered customers.

maekini.db
    Automatically created database file.

5. PRODUCT PHOTOS
------------------------------------------------
Put your product photos inside:

    assets/products/

The current 57 photos are already supplied in numbered folders:

    assets/products/1/product.jpg
    assets/products/2/product.jpg
    ...
    assets/products/57/product.jpg

The storefront displays photos in the All, Two Piece / One Piece, and Modest
collections. Photos 1-55 are small crops from the supplied collages; they are
kept at their native size in product cards to avoid extra blur. Photos 56-57
are high-resolution feature images. Replace a small photo with a larger
original in the same folder and filename to get a sharper product zoom.

6. SOCIAL MEDIA
------------------------------------------------
The home page displays:

Facebook · MaeKini.com
Instagram · MaeKini.com
LinkedIn · MaeKini.com
X · MaeKini.com

To add the real URLs, edit STORE_INFO at the top of script.js.

7. FLOATING 3D DECOR
------------------------------------------------
The page includes `effects.css` from the document head. Floating shapes are
defined in `floating3d.js`. Three.js 0.180.0 is
loaded from `https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js`
only after the first page interaction. No package install is needed. Both
the 3D effect respects reduced-motion preferences, and the canvas never
captures clicks.

8. IMPORTANT
------------------------------------------------
This is a school-project/demo e-commerce system.
The payment choices are demonstration options only and do not process real Maya, GCash, COD, or credit-card transactions.
The order tracker is also a demo unless you later connect it to a real courier/API.


PRODUCT PHOTOS — UPDATED EASY METHOD
------------------------------------------------
You do NOT need to type image code anymore.

Inside assets/products/ there are folders named:
1, 2, 3, 4, 5, 6, 7, 8

Put the photo for Product 1 into:
assets/products/1/

Put the photo for Product 2 into:
assets/products/2/

and so on.

You can use JPG, JPEG, PNG, WEBP, or GIF. The server automatically finds the first image in each product folder and displays it on the store.

Example:
assets/products/1/my-bikini-photo.jpg

No JavaScript or HTML editing is required for the photo.

ADMIN PAGE — IMPORTANT
------------------------------------------------
Do NOT double-click admin.html. That opens it as a file and the browser cannot fetch the database API, which causes “Failed to fetch.”

Instead:
1. Open the folder in VS Code.
2. Open Terminal.
3. Run: node server.js
4. Open: http://localhost:3000/admin.html
5. Sign in with username `admin` and password `maekini-admin`.

The database file maekini.db is created automatically when the server starts.
