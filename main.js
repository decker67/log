
(function ( name, global, definition ) {

    'use strict';

    if( typeof module === 'object' && typeof require === 'function' ) {
       module.exports = definition( name, global ); /* commonJS */
    } else if( typeof define === 'function' && typeof define.amd === 'object' ) {
       define( definition ); /* AMD */
    } else {
       global[ name ] = definition( name, global );
    }

} ( 'Log', ( typeof window !== 'undefined' && window ) || this, function definition( name, global ) {

   'use strict';

   // logger object that will be returned as the API
   var logger = {
   };

   // regular expression to extract file, function and line number from stack trace
    //var findDetailsRegularExpression = /^\s*at\s*([\w<>\.]*)\s*\((.*?):(\d*):(\d*)\)$/; extracts line number and column
   var findDetailsRegularExpression = /^\s*at\s*([\w<>\.]*)\s*(.*)$/;

   var allLogLevel = [
      'NONE',
      'ERROR',
      'WARN',
      'INFO',
      'DEBUG',
      'TRACE',
      'DATA',
      'DEVELOP'
   ];

   // initial log level used
   var actualLogLevel = 3; //INFO

   // log method to consume logging messages
   var actualConsumerFunction = console.log.bind( console );

   // creates the api to log messages
   var currentLevel = null;
   var allLogLevelLength = allLogLevel.length;
   for ( currentLevel = 0; currentLevel < allLogLevelLength; currentLevel += 1 ) {
      if( allLogLevel[ currentLevel ] === 'NONE' ) { continue; }
      logger[ allLogLevel[ currentLevel ].toLowerCase() ] = function ( currentLevel ) {
          return function ( message ) {
             if ( actualLogLevel < currentLevel ) { return; }
             log( message );
          };
      } ( currentLevel );
   }

   // set consumer of the log messages
   function to( consumer ) {
      actualConsumerFunction = consumer;
   }

   // the function that logs using an error
   function log( message ) {
       var stackInfo = ( new Error() ).stack.split( '\n' )[ 3 ];
       var matches = findDetailsRegularExpression.exec( stackInfo );
       var callingFunction = null;
       var callingOccured = null;
       var logMessage = null;

       if( matches === null ) {
          console.log( stackInfo );
          throw new Error( 'InvalidStackError', 'Stacktrace is invalid' );
       } else {
          callingFunction = matches[ 1 ];
          callingOccured = matches[ 2 ];
          logMessage = new Date().toISOString() + ': ' + message + ' ' + callingOccured + ' in ' + callingFunction;
          actualConsumerFunction.call( this, logMessage );
       }
   }

   // set the actual log level or returns it
   function level( newLevel ) {
      if( newLevel ) {
         actualLogLevel = allLogLevel.indexOf( newLevel );
      } else {
         return allLogLevel[ actualLogLevel ];
      }
   }

   // API
   return {
      to:      to,
      //all:     allLogLevel,
      level:   level,

      error:   logger.error,
      warn:    logger.warn,
      info:    logger.info,
      debug:   logger.debug,
      trace:   logger.trace,
      data:    logger.data,
      develop: logger.develop

   };

} ) );
