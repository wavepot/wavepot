build:
	@./node_modules/.bin/browserify \
	--global-transform [ babelify --presets [ latest ] ] \
	--verbose \
	--standalone studio \
	--entry index.js \
	--outfile studio.js
