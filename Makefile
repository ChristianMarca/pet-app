REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha -r ./node_modules/ts-node/register test/* \
    --reporter $(REPORTER) \
    --recursive
.PHONY: test
