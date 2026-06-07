# Domi

Domi is a small room-design workspace for turning inspiration into a practical
floor plan. Users can generate a moodboard from room preferences, arrange
furniture on a drag-and-drop canvas, and import product names from public URLs.

## Stack

- React, TypeScript, Vite, and Tailwind CSS
- React DnD for the furniture palette
- Python and Flask
- Unsplash API with a curated offline fallback

## Run locally

Start the API:

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Start the client in another terminal:

```bash
cd client
npm install
npm run dev
```

The client uses `VITE_APP_SERVER=http://localhost:5000` by default. Add an
`UNSPLASH_ACCESS_KEY` to `server/.env` for live moodboard results; otherwise
the API returns a curated set of interior images.

## Main flows

1. Choose a room and visual style on the moodboard page.
2. Generate a board from Unsplash or use the built-in fallback.
3. Drag furniture onto the floor plan and reposition, rotate, or delete it.
4. Paste a public product URL to extract its title into the furniture palette.

Layouts are saved automatically in browser storage.
