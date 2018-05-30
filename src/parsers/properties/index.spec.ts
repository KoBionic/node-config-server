import { readFileSync } from 'fs';

import { PropertiesParser } from '.';


describe('Properties Parser Test Suite', () => {

    const propertiesParser = new PropertiesParser();
    const propertiesContent = readFileSync(`${__dirname}/test.properties`, 'utf8');
    const expectedJson = {
        'key with spaces': 'This is the value that could be looked up with the key \"key with spaces\".',
        language: 'English',
        message: 'Welcome to Wikipedia!',
        path: 'c:\\wiki\\templates',
        tab: 0,
        website: 'https://en.wikipedia.org/',
    };

    it('should parse a Properties content as expected', async () => {
        const obj = await propertiesParser.parse(propertiesContent);
        expect(obj).toEqual(expectedJson);
    });

});
