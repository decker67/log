
(function testSuite( Log ) {
   'use strict';

   describe( "A Logger ", function() {
      var lastLogMessage = null;
      var logConsumer = function consume( message ) { lastLogMessage = message; };
      Log.to( logConsumer );

      it( "has log level INFO as default.", function() {
         expect( Log.level() ).toEqual( Log.all.INFO );
      });

      it( "logs Hello", function() {
         Log.level( Log.all.DEVELOP );
         Log.develop( 'Hello' );
         expect( lastLogMessage ).toMatch( 'Hello' );
      });

       it( "does not log debug messages if run on level INFO", function() {
           Log.level( Log.all.INFO );
           Log.debug( 'not logged' );
           expect( lastLogMessage ).not.toMatch( 'not logged' );
       });

       it( "does log error messages if run on level INFO", function() {
           Log.level( Log.all.INFO );
           Log.error( 'logged' );
           expect( lastLogMessage ).toMatch( 'logged' );
       });

       it( "can be set to log level WARN", function() {
           Log.level( Log.all.WARN );
           expect( Log.level() ).toEqual( Log.all.WARN );
       });

       it( "can be called to log something to console.", function() {
           Log.level( Log.all.INFO );
           Log.to( console.log, console );
           Log.info( 'Hello' );
           // back to internal consumer
           Log.to( logConsumer );
       });

   });

} ) ( Log );