import * as AppUtil from '.';


describe('Fs Util Test Suite', () => {

    it('should list the directory and return the correct number of files', async () => {
        const dirs = await AppUtil.ls(__dirname);
        expect(dirs.length).toBe(2);
    });

});
