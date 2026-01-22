---
layout: publication.html
tags: publication

title: "Eliminating Hardware Interrupts with Dispersed Interrupt Polling"
authors:
 - Kirill Nagaitsev
 - Kevin McAfee
 - Kevin Hayes
 - Justin Dong
 - Nadharm Dhiantravan
 - Peter Dinda
type: Tech Report
date: 2025-09
doi: "NU-CS-2025-36"
pdflink: "https://www.mccormick.northwestern.edu/computer-science/documents/nu-cs-2025-36.pdf"
---

## Abstract
Each CPU on a modern architecture can receive thousands
of hardware interrupts/second due to networking, I/O,
and other events. In operating systems like Linux,
interrupts cause expensive, hardware-driven context switches
to the kernel and unexpected disruptions to caches and
other hardware state. In HPC and database applications,
for example, this results in significant performance impacts and
unnecessary nondeterminism. Is it time to reconsider the
alternative to interrupts, namely polling?

