---
pagination: 
  data: publications
  size: 1
  alias: pub

layout: article.html
permalink: "publication/{{ pub.shortname | slugify }}.html"
eleventyComputed:
  title: "{{ pub.title }}{% if pub.type %} - {{ pub.type }}{% endif %}"
---

{% if pub.type %}
## {{ pub.type }}
{% endif %}

# *{{ pub.title }}*

<div><center>
{% for author in pub.authors-%}
{% if author == "Kevin Hayes"-%}
<em class="nowrap">{{ author-}}</em>
{% elsif true-%}
<span class="nowrap">{{ author-}}</span>
{% endif-%}
&ensp;
{% endfor %}
</center></div>

{% if pub.has_abstract %}
## Abstract
{{ abstracts[ pub.shortname ].content }}
{% endif %}

{% if pub.url %}
<a href="{{ pub.url }}">
<center>
PDF Available Online
</center>
</a>
{% endif %}

