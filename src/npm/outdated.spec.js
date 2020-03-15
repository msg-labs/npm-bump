
const mockOutdated = body => {
    const util = require( 'util' );

    jest.mock( 'util' );
    jest.spyOn( util, 'promisify' ).mockImplementation( () => body );
    return require( './outdated.js' );
};

describe( 'getOutdatedPackages', () => {

    beforeEach( () => {
        jest.resetModules();
    } );

    describe( 'arguments', () => {

        let exec = jest.fn();
        let outdated = () => undefined;

        beforeEach( () => {
            exec = jest.fn( () => Promise.resolve( { stdout: '{}' } ) );
            outdated = mockOutdated( exec );
        } );

        it( 'gets the long version of the output', async () => {

            expect.assertions( 1 );

            await outdated();

            expect( exec ).toHaveBeenCalledWith(
                expect.stringContaining( '--json' ),
                expect.anything()
            );
        } );

        it( 'gets the JSON version of the output', async () => {

            expect.assertions( 1 );

            await outdated();

            expect( exec ).toHaveBeenCalledWith(
                expect.stringContaining( '--long' ),
                expect.anything()
            );
        } );
    } );


    it( 'returns an empty array if no outdated packages were found', async () => {

        expect.assertions( 1 );

        const outdated = mockOutdated( () => Promise.resolve( {
            stdout: JSON.stringify( {} )
        } ) );

        const result = await outdated();

        expect( result ).toStrictEqual( [] );

    } );

    it( 'returns a list of dependencies to be updated', async () => {

        expect.assertions( 1 );

        const outdated = mockOutdated( () => Promise.resolve( {
            stdout: JSON.stringify( {
                '@msg-labs/cli-prompt-list': {
                    current: '1.1.0',
                    latest: '1.1.1',
                    location: 'node_modules/@msg-labs/cli-prompt-list',
                    wanted: '1.1.0'
                }
            } )
        } ) );

        const result = await outdated();

        expect( result ).toStrictEqual( [ {
            current: '1.1.0',
            id: '@msg-labs/cli-prompt-list',
            latest: '1.1.1',
            location: 'node_modules/@msg-labs/cli-prompt-list',
            wanted: '1.1.0'
        } ] );
    } );

} );

