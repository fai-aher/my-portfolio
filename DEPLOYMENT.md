# Deployment Guide for ahernandezt.com

This guide will help you deploy your portfolio website to GitHub Pages with your custom Cloudflare domain.

## Prerequisites

- GitHub account
- Cloudflare account with domain `ahernandezt.com`
- Git installed locally

---

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the **"+"** button in the top right → **"New repository"**
3. Name your repository (e.g., `my-portfolio` or `portfolio-website`)
4. Choose **Public** (required for free GitHub Pages)
5. **Do NOT** initialize with README, .gitignore, or license (we already have files)
6. Click **"Create repository"**

---

## Step 2: Push Your Code to GitHub

Open your terminal in the project directory and run:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Portfolio website"

# Add your GitHub repository as remote (replace with your actual repository URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace** `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

---

## Step 3: Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** tab
3. In the left sidebar, click **Pages**
4. Under **Build and deployment**:
   - **Source**: Select **"GitHub Actions"**
5. Save the settings

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically deploy your site when you push to the `main` branch.

---

## Step 4: Configure Cloudflare DNS

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your domain **ahernandezt.com**
3. Go to **DNS** → **Records**
4. **Delete any existing A or CNAME records** for `@` (root domain) and `www` if they exist
5. Add the following DNS records:

### For Root Domain (@):

Add **4 A records** pointing to GitHub Pages IP addresses:

| Type | Name | Content           | Proxy status | TTL  |
|------|------|-------------------|--------------|------|
| A    | @    | 185.199.108.153   | DNS only     | Auto |
| A    | @    | 185.199.109.153   | DNS only     | Auto |
| A    | @    | 185.199.110.153   | DNS only     | Auto |
| A    | @    | 185.199.111.153   | DNS only     | Auto |

### For WWW Subdomain:

Add **1 CNAME record**:

| Type  | Name | Content               | Proxy status | TTL  |
|-------|------|-----------------------|--------------|------|
| CNAME | www  | ahernandezt.com       | DNS only     | Auto |

6. Click **Save** for each record

**Important**: Set **Proxy status** to **DNS only** (gray cloud icon) for all records. This ensures GitHub Pages can properly verify your domain.

---

## Step 5: Configure Custom Domain in GitHub

1. Go back to your GitHub repository
2. Go to **Settings** → **Pages**
3. Under **Custom domain**, enter: `ahernandezt.com`
4. Click **Save**
5. Wait for DNS check (can take a few minutes)
6. Once verified, check **"Enforce HTTPS"** (recommended)

---

## Step 6: Wait for Deployment

1. Go to your repository's **Actions** tab
2. You should see a workflow running called **"Deploy to GitHub Pages"**
3. Wait for it to complete (usually 1-3 minutes)
4. Once complete, your site will be live at **https://ahernandezt.com**

---

## DNS Propagation Time

- DNS changes can take **5 minutes to 48 hours** to propagate globally
- Usually, it takes **15-30 minutes** with Cloudflare
- You can check DNS propagation at: [https://dnschecker.org/](https://dnschecker.org/)

---

## Troubleshooting

### Site not loading after deployment

1. **Check DNS propagation**: Use [dnschecker.org](https://dnschecker.org/) to verify your domain points to GitHub Pages IPs
2. **Verify CNAME file**: Make sure `public/CNAME` contains `ahernandezt.com`
3. **Check GitHub Actions**: Go to Actions tab and ensure deployment succeeded
4. **Clear browser cache**: Try opening in incognito/private window

### "Your site is having problems building" error

1. Check the **Actions** tab for error details
2. Ensure `npm run build` works locally without errors
3. Make sure all dependencies are listed in `package.json`

### Custom domain not verifying

1. Make sure Cloudflare DNS records are set to **DNS only** (not proxied)
2. Wait 10-15 minutes for DNS propagation
3. Try removing and re-adding the custom domain in GitHub Settings

### HTTPS certificate issues

1. After adding custom domain, wait 10-15 minutes
2. GitHub will automatically provision an SSL certificate
3. Once ready, enable **"Enforce HTTPS"** in Settings → Pages

---

## Future Updates

To update your website after making changes:

```bash
# Make your changes to the code
git add .
git commit -m "Description of your changes"
git push origin main
```

The GitHub Actions workflow will automatically rebuild and deploy your site!

---

## Optional: Cloudflare Page Rules

For better performance, you can enable Cloudflare proxy after initial setup:

1. Wait until GitHub Pages fully sets up HTTPS (24-48 hours recommended)
2. Go to Cloudflare DNS settings
3. Change A records proxy status from **DNS only** to **Proxied** (orange cloud)
4. This enables Cloudflare CDN for faster global loading

---

## Support

If you encounter issues:
- Check [GitHub Pages Documentation](https://docs.github.com/en/pages)
- Check [Cloudflare DNS Documentation](https://developers.cloudflare.com/dns/)
- Review GitHub Actions logs in your repository's Actions tab

---

**Your portfolio is now ready to deploy! 🚀**
