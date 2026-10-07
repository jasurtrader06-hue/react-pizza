# React Pizza

Vite + React frontend, Express backend (`server/`).

## Lokal ishga tushirish
```bash
npm install
npm --prefix server install
npm run server        # 1-terminal: backend http://localhost:4000
npm run dev           # 2-terminal: frontend
```

## Ma'lumotlar
Pitsalar `server/db.json` da turadi, rasmlar Dodo CDN havolalari.

### mockapi.io ga yuklash (ixtiyoriy)
```bash
node scripts/seed-mockapi.mjs --clear
```
`.env` da `VITE_API_URL=https://6aaa775dff4dd5698b4e92c0.mockapi.io` qiling. Menyu va admin pitsalar ishlaydi,
buyurtmalar uchun mockapi'da `orders` resursi alohida kerak (status almashtirish ishlamaydi).

## GitHub
```bash
git init && git add . && git commit -m "React Pizza"
git branch -M main
git remote add origin https://github.com/USERNAME/react-pizza.git
git push -u origin main
```

## Deploy
1. **Backend (Render):** New > Blueprint (render.yaml) yoki Web Service, Root Directory = `server`,
   Build `npm install`, Start `node server.js`. Manzilni nusxalang (masalan https://react-pizza-api.onrender.com).
2. **Frontend (Vercel):** repo'ni import qiling, Framework = Vite.
   Environment Variables: `VITE_API_URL` = backend manzili. Deploy.

Eslatma: Render bepul rejasida `db.json` qayta ishga tushganda asl holiga qaytishi mumkin.
