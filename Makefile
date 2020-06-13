SHELL=/bin/bash

%:
	@:

args = `arg="$(filter-out $@,$(MAKECMDGOALS))" && echo $${arg:-${1}}`

dev:
	@live-server --host=0.0.0.0 --https=/home/stagas/.nvm/versions/node/v12.9.1/lib/node_modules/live-server-https .

# examples:
# $ make test
# $ make test test/unit
# $ make test test/unit/specific/file.js
# $ make test test/unit -- --with-errors
# $ make test test/unit -- --keep-alive
test:
	@mocha-headless $(call args)

coverage:
	@make test -- --coverage

.PHONY: dev test coverage