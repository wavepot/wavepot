SHELL=/bin/bash

%:
	@:

args = `arg="$(filter-out $@,$(MAKECMDGOALS))" && echo $${arg:-${1}}`

dev:
	@live-server --host=0.0.0.0 --https=/home/stagas/.nvm/versions/node/v12.9.1/lib/node_modules/live-server-https .

test:
	@mocha-headless $(call args)

coverage:
	@make test -- --coverage

.PHONY: dev test coverage