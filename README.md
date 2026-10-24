# www.stefandecker.org

Personal homepage of Stefan Decker, served by GitHub Pages under the custom
domain `www.stefandecker.org`. It was migrated from Google Sites in October 2026;
all old page URLs (`/home`, `/cv-and-publications`, `/for-students-and-staff/...`,
`/media-gallery`, `/blog`) still work.

## Editing

GitHub Pages builds the site with Jekyll on every push to `main`, so editing a file
on github.com or pushing a commit is all it takes to publish.

| File | Page |
| --- | --- |
| `index.html` | Home (profile, mission box, accomplishments, anecdotes) |
| `cv-and-publications.md` | CV page; embeds the Google Doc "CV-Stefan-Decker" (edit the Doc to update it) |
| `for-students-and-staff/*.md` | Student/staff guides |
| `media-gallery.html` | Soundbites and the "Media Gallery" Google Drive folder |
| `blog.md` | Blog (empty) |
| `_data/nav.yml` | Sidebar navigation |
| `_layouts/default.html` | Shared page frame (sidebar, `<head>`) |
| `assets/css/style.css` | Styles |
| `assets/js/mission.js` | Bouncing RDF logo on the home page |

A new page is a Markdown file with front matter, for example:

```markdown
---
layout: default
title: My new page
permalink: /my-new-page
---
# My new page

Text in **Markdown**.
```

Add it to `_data/nav.yml` to show it in the sidebar.

## Local preview

```sh
bundle install            # needs Ruby with headers (ruby-dev)
bundle exec jekyll serve  # http://localhost:4000
```

or, without a local Ruby setup:

```sh
docker run --rm -it -v "$PWD":/srv -w /srv -p 4000:4000 ruby:3.3 \
  sh -c 'bundle install && bundle exec jekyll serve --host 0.0.0.0'
```

## Domain and DNS

The `CNAME` file sets the custom domain. DNS for stefandecker.org is managed at
Squarespace Domains (formerly Google Domains):

| Host | Type | Value |
| --- | --- | --- |
| `www` | CNAME | `stefanjdecker.github.io.` |
| `@` | A | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| `@` | AAAA | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| `@` | MX | Google Workspace mail — unrelated to the website, leave as is |

GitHub redirects `stefandecker.org` to `www.stefandecker.org` and serves both over
HTTPS with a Let's Encrypt certificate.
