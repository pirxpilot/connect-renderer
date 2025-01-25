check: lint test

lint:
	./node_modules/.bin/biome check

format:
	./node_modules/.bin/biome format --write

test:
	node --test

.PHONY: check lint format test
