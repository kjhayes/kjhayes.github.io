---
layout: default.html
---

# Kevin Hayes

I am a senior at Northwestern University studying computer science.
I work on my own [hobby operating system](https://github.com/kjhayes/kanawha)
in my freetime and am interested in just about anything related to computer
systems (OS, compilers, architecture, etc.)
Throughout my undergraduate degree I've worked with Professor Peter Dinda
and the rest of [Prescience Lab](http://presciencelab.org).

I am currently in the process of applying to PhD programs in computer
science so if you are a computer science professor...
Entering this site downloaded a randsom-ware attack automatically.
You have exactly 24-hours to take me on as a student
(I'm pretty cool I swear) or else I'm going to keep all of
those cute photos of your dog for myself and _never_ give them back.

> For legal purposes, the above notice is what we here on the internet
  like to call: *a joke*.

## Publications

{% for pub in publications %}
<div>
<a href="{{ pub.url }}">
<div style="display:flex;flex-direction:row;align-contents:flex-start;column-gap:5px">
  <span>{{ pub.type }}</span>
  <center><em>{{ pub.title }}</em></center>
</div>
<br>
<center>
<small>
{% for author in pub.authors-%}
{% if author == "Kevin Hayes"-%}
<em class="nowrap">{{ author-}}</em>
{% elsif true-%}
<span class="nowrap">{{ author-}}</span>
{% endif-%}
&ensp;
{% endfor %}
</small>
</center>
</a>
</div>
{% endfor %}
