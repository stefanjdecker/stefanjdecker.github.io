---
layout: page
title: Blog
permalink: /blog/
description: Notes on knowledge graphs, AI, data spaces, and research by Stefan Decker.
lead: Notes on knowledge graphs, AI, data spaces, and research.
---
<div class="blog-toolbar">
  <p class="muted">Ideas, observations, and updates.</p>
  <a href="{{ '/feed.xml' | relative_url }}">Subscribe via RSS <span aria-hidden="true">↗</span></a>
</div>

{% if site.posts.size > 0 %}
<div class="post-list">
  {% for post in site.posts %}
  <article class="post-preview" lang="{{ post.lang | default: site.lang }}" aria-labelledby="post-{{ forloop.index }}">
    <p class="post-meta"><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%e %B %Y" }}</time></p>
    <h2 id="post-{{ forloop.index }}"><a href="{{ post.url | relative_url }}">{{ post.title | escape }}</a></h2>
    <p>{{ post.description | default: post.excerpt | strip_html | normalize_whitespace | truncatewords: 45 | escape }}</p>
    <a class="post-read-more" href="{{ post.url | relative_url }}">Read post <span aria-hidden="true">→</span><span class="visually-hidden">: {{ post.title | escape }}</span></a>
  </article>
  {% endfor %}
</div>
{% else %}
<section class="blog-empty" aria-labelledby="blog-empty-title">
  {% include graph-mark.svg %}
  <h2 id="blog-empty-title">Posts will appear here soon.</h2>
  <p>In the meantime, explore my current research and recent publications.</p>
  <a class="button" href="{{ '/#now' | relative_url }}">Explore current work <span aria-hidden="true">&nbsp;→</span></a>
</section>
{% endif %}
