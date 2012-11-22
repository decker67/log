
(function testSuite( Log ) {
   'use strict';

   describe( "A Logger ", function() {
      var lastLogMessage = null;
      var logConsumer = function consume( message ) { lastLogMessage = message; };
      Log.to( logConsumer );
      //console.log( Log );

      it( "has log level INFO as default.", function() {
         expect( Log.level() ).toEqual( 'INFO' );
      });

      it( "logs Hello.", function() {
         Log.level( 'DEVELOP' );
         Log.develop( 'Hello' );
         expect( lastLogMessage ).toMatch( 'Hello' );
      });

       it( "does not log debug messages if run on level INFO.", function() {
           Log.level( 'INFO' );
           Log.debug( 'not logged' );
           expect( lastLogMessage ).not.toMatch( 'not logged' );
       });

       it( "does log error messages if run on level INFO.", function() {
           Log.level( 'INFO' );
           Log.error( 'logged' );
           expect( lastLogMessage ).toMatch( 'logged' );
       });

       it( "can be set to log level WARN.", function() {
           Log.level( 'WARN' );
           expect( Log.level() ).toEqual( 'WARN' );
       });

       it( "can be called to log something to console.", function() {
           Log.level( 'INFO' );
           Log.to( console.log.bind( console ) );
           Log.info( 'Hello' );
           // back to internal consumer
           expect( function () { Log.to( logConsumer ); } ).not.toThrow( 'TypeError: Illegal invocation' );
       });

       it( "can handle more than one argument.", function() {
           Log.level( 'INFO' );
           Log.info( 'Hello', 'You', 123 );
           expect( lastLogMessage ).toMatch( 'Hello You 123' );
       });



   });

} ) ( Log );