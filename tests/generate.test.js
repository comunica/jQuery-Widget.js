import { existsSync, readFileSync } from 'fs';
import { execSync } from 'child_process';

describe('Build test: generate.js', () => {
    beforeAll(() => {
    });

    describe('generate.js', () => {
        describe('command line arguments', () => {
            beforeEach(() => {
                execSync('rm -rf testBuildOutput');
            });

            afterEach(() => {
                execSync('rm -rf testBuildOutput');
            });

            it('should correctly handle option -d', async() => {
                execSync('node bin/generate.js -d testBuildOutput', { encoding: 'utf-8' });  // the default is 'buffer'
                expect(existsSync('testBuildOutput')).toEqual(true);
            });

            it('should correctly handle option -q', async() => {
                execSync('node bin/generate.js -d testBuildOutput -q tests/test-queries', { encoding: 'utf-8' });  // the default is 'buffer'
                let buildQueries = JSON.parse(readFileSync("./build/queries.json")).queries;
                expect(buildQueries).toEqual(
                    [
                        {
                            "name":"1",
                            "datasources":[],
                            "queryFormat":"sparql",
                            "query":"prefix ex: <http://example.org/>\nSELECT ?a ?b WHERE {\n  ?a ex:example ?b.\n}"
                        }
                    ]);
            });
        });
    });
});
