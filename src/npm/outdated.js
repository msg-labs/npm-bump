// Node.js
const { promisify } = require( 'util' );
const exec = promisify( require( 'child_process' ).exec );


const COMMAND = 'npm outdated --json --long';

const options = {
    cwd: process.cwd(),
    encoding: 'utf8'
};

const outdated = () => exec( COMMAND, options )
    .then( ( {
        stdout,
        stderr
    } ) => {
        if ( stderr ) {
            throw new Error( stderr );
        }
        return Object.entries( JSON.parse( stdout ) )
            .map( ( [ key, value ] ) => ( {
                id: key,
                ...value
            } ) );
    } );

module.exports = outdated;

