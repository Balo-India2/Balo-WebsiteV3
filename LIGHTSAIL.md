# Host BALO on AWS Lightsail (beginner guide)

This puts the whole school website — including **BALO AI** and **admin login** — on a small always-on computer at Amazon.

You do **not** need to know Linux already. Copy each command exactly. If something looks different on your screen, stop and re-read that step.

---

## What you will have at the end

- A public website on your own domain (or a temporary Amazon address)
- BALO AI answering questions
- `/admin-login` working for school staff

Budget: about **$10 / month** for the server, plus a domain if you buy one.

---

## Before you start, collect these 4 things

Do this on your laptop, in a notes file. You will paste them onto the server later.

### 1. Supabase keys

Open [https://supabase.com/dashboard](https://supabase.com/dashboard) → your project → **Project Settings** (gear) → **API**.

Copy:

| Name | Where it is | Secret? |
|---|---|---|
| Project URL | `https://….supabase.co` | No |
| `anon` / publishable key | under Project API keys | No (public) |
| `service_role` key | click **Reveal** | **Yes — never share** |

### 2. Gemini key (BALO AI)

1. Open [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with Google
3. **Create API key** → copy it

You can use one key for both Assistant and Student modes.

### 3. Your domain (optional on day 1)

Example: `www.yourschool.org`. You can skip this at first and use the Amazon IP address, then add a domain later.

### 4. This code on GitHub

The Lightsail computer will download the project from GitHub. Make sure the latest code is pushed.

---

## Step 1 — Create the Lightsail computer

1. Sign in at [https://lightsail.aws.amazon.com](https://lightsail.aws.amazon.com)
2. Top-right region: choose **Mumbai (ap-south-1)** (closest to Kolkata / Howrah)
3. Click **Create instance**
4. Platform: **Linux/Unix**
5. Blueprint: **OS Only** → **Ubuntu 24.04 LTS**
6. Instance plan: pick the **$10 USD** plan (2 GB RAM).  
   Smaller plans often crash while the site is building.
7. Name it `balo-website`
8. Click **Create instance**
9. Wait until the status is **Running** (1–2 minutes)

### Give it a fixed address

1. On the instance page, open the **Networking** tab
2. Click **Create static IP** → attach it to `balo-website`
3. Copy the IP, e.g. `13.xxx.xxx.xxx` — this is your site address until you add a domain

### Open the website ports

Still on **Networking**:

1. Under **IPv4 Firewall**, click **Add rule**
2. Application **HTTP**, port **80** → Create
3. Add another rule: **HTTPS**, port **443** → Create

SSH (port 22) is already open.

---

## Step 2 — Log in to the computer

On the instance page click **Connect using SSH**. A black terminal window opens in your browser. That is the computer. You type commands there.

First command — paste this whole block, then press Enter:

```bash
sudo apt-get update && sudo apt-get install -y nginx git curl
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
node -v
```

You should see a Node version like `v22.x.x`. If you do, this step worked.

---

## Step 3 — Download the website

Still in the SSH window:

```bash
cd ~
git clone https://github.com/rehanjamil825-hub/Balo-2.git
cd Balo-2
```

If GitHub asks for a password and the repo is private, create a **Personal access token** on GitHub (Settings → Developer settings → Tokens) and use that as the password.

If you are deploying a branch other than `main`:

```bash
git checkout arena/a5697b8a-balo-2
```

---

## Step 4 — Put your secrets on the server

```bash
cd ~/Balo-2
cp .env.example .env
nano .env
```

`nano` is a simple text editor.

- Arrow keys to move
- Type the real values (no spaces around `=`)
- Replace `YOUR_DOMAIN` with your domain, or with `http://YOUR_STATIC_IP` if you have no domain yet
- Put the same Supabase URL and publishable key on **both** the `VITE_` lines and the plain `SUPABASE_` lines
- Paste `SUPABASE_SERVICE_ROLE_KEY` and the Gemini keys
- Save: **Ctrl+O**, Enter, then exit: **Ctrl+X**

Example of `SITE_URL`:

```
SITE_URL=http://13.xxx.xxx.xxx
```

Later, when you have HTTPS and a domain:

```
SITE_URL=https://www.yourschool.org
```

---

## Step 5 — Build and start the app

```bash
cd ~/Balo-2
npm install
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

The last command prints one extra `sudo …` line. Copy that line and run it. That makes the site start again if Amazon reboots the computer.

Check it is running:

```bash
pm2 status
```

`balo` should say **online**.

---

## Step 6 — Put nginx in front (so visitors use port 80)

```bash
sudo cp ~/Balo-2/deploy/nginx.conf /etc/nginx/sites-available/balo
sudo nano /etc/nginx/sites-available/balo
```

Change `YOUR_DOMAIN` to your domain, **or** to your static IP if you have no domain yet.

```bash
sudo ln -s /etc/nginx/sites-available/balo /etc/nginx/sites-enabled/balo
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

In your laptop browser open:

```
http://YOUR_STATIC_IP
```

You should see the Balo school site.

---

## Step 7 — Tell Supabase about the live address

This is what makes **admin login** and verification emails work.

1. Supabase dashboard → **Authentication** → **URL configuration**
2. **Site URL** = `http://YOUR_STATIC_IP` (or `https://www.yourschool.org` once you have HTTPS)
3. **Redirect URLs** — add:
   - `http://YOUR_STATIC_IP/**`
   - `http://YOUR_STATIC_IP/admin-login`
   - (when you have a domain) `https://www.yourschool.org/**` and `https://www.yourschool.org/admin-login`
4. Save

---

## Step 8 — Try BALO AI and admin

- Open `http://YOUR_STATIC_IP/balo-ai` and ask a question
- Open `http://YOUR_STATIC_IP/admin-login` and sign in

If AI says it is “not configured”, the Gemini keys in `.env` are missing. Fix `.env`, then:

```bash
cd ~/Balo-2
pm2 restart balo
```

If you **changed any `VITE_` value**, you must rebuild (those are baked in at build time):

```bash
cd ~/Balo-2
npm run build
pm2 restart balo
```

---

## Step 9 — Domain + HTTPS (when you are ready)

1. At your domain registrar, add an **A record**:
   - Name: `@` and `www`
   - Value: your Lightsail **static IP**
2. Wait 10–30 minutes
3. In nginx, set `server_name` to your domain
4. Then:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourschool.org -d www.yourschool.org
```

Follow the prompts (email, agree to terms). Certbot turns on HTTPS for you.

5. Update `.env`:

```
SITE_URL=https://www.yourschool.org
```

6. Update the same URL in Supabase **Site URL** and **Redirect URLs**
7. Rebuild if you changed `VITE_` values, then `pm2 restart balo`

---

## Everyday commands

| What you want | Command |
|---|---|
| See if the site is up | `pm2 status` |
| Read errors | `pm2 logs balo` |
| Restart after an `.env` change | `pm2 restart balo` |
| Pull new code and go live | see below |

Update to the latest code:

```bash
cd ~/Balo-2
git pull
npm install
npm run build
pm2 restart balo
```

---

## If something is wrong

| You see | Likely cause | Fix |
|---|---|---|
| Browser: “can’t connect” | Firewall ports 80/443 closed, or nginx not running | Step 1 firewall + `sudo systemctl status nginx` |
| Site loads, AI says “not configured” | Missing `BALO_ASSISTANT_API_KEY` or `GEMINI_API_KEY` | Edit `.env`, `pm2 restart balo` |
| Admin login fails / “Missing Supabase” | Missing `SUPABASE_SERVICE_ROLE_KEY` | Edit `.env`, `pm2 restart balo` |
| Verification email sends you to localhost | `SITE_URL` or Supabase Site URL still wrong | Step 7 |
| `npm run build` killed / out of memory | Plan is too small | Use the $10 plan, or add swap |

Add 2 GB of swap (only if build runs out of memory):

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## What not to do

- Do **not** host this as “static files” in S3. BALO AI and admin need the Node server.
- Do **not** put `SUPABASE_SERVICE_ROLE_KEY` or Gemini keys on any line that starts with `VITE_`.
- Do **not** commit a filled-in `.env` to GitHub.
