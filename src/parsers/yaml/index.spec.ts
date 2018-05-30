import { readFileSync } from 'fs';

import { YAMLParser } from '.';


describe('YAML Parser Test Suite', () => {

    const ymlParser = new YAMLParser();
    const ymlContent = readFileSync(`${__dirname}/test.yml`, 'utf8');
    const expectedJson = {
        library: {
            'The Prestige': {
                actors: [
                    'Christian Bale',
                    'Hugh Jackman',
                    'Scarlett Johansson',
                ],
                director: 'Christopher Nolan',
                duration: 130,
                watched: true,
                writers: [
                    'Jonathan Nolan',
                    'Christopher Nolan',
                ],
                year: 2006,
            },
            'Wind River': {
                actors: [
                    'Jeremy Renner',
                    'Elizabeth Olsen',
                    'Julia Jones',
                ],
                director: 'Taylor Sheridan',
                duration: '107 min',
                watched: true,
                writers: [
                    'Taylor Sheridan',
                ],
                year: 2017,
            },
        },
    };

    it('should parse a YAML content as expected', async () => {
        const obj = await ymlParser.parse(ymlContent);
        expect(obj).toEqual(expectedJson);
    });

    it('should throw an error when YAML content is faulty', async () => {
        await expect(ymlParser.parse(ymlContent.replace('year:', ''))).rejects.toThrowError();
    });

});
