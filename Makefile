
default:
	@

build: FORCE
	npx @11ty/eleventy

serve: FORCE build
	npx @11ty/eleventy --serve

FORCE:

default: serve
