
node_modules: package.json
	@npm install

clean:
	@rm -fr node_modules

test: node_modules
	@./node_modules/.bin/mocha test/test.js --reporter spec

.PHONY: clean test
