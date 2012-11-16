
(function( name, global, definition ) {

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

   var allLogLevel = {
      NONE:    0,
      ERROR:   1,
      WARN:    2,
      INFO:    3,
      DEBUG:   4,
      TRACE:   5,
      DATA:    6,
      DEVELOP: 7
   };

   // initial log level used
   var actualLogLevel = 'INFO';

   // log method to consume logging messages
   var actualConsumerFunction = console.log;
   var actualConsumerSelf = console;

   // creates the api to log messages
   var currentLevel = null;
   for ( currentLevel in allLogLevel ) {
      if( currentLevel === 'NONE' ) continue;
      logger[ currentLevel.toLowerCase() ] = function( currentLevel ) {
          return function( message ) {
             if ( allLogLevel[ actualLogLevel ] < allLogLevel[ currentLevel ] ) return;
             log( message );
          }
      } ( currentLevel );
   }

   // set consumer of the log messages
   function to( consumer, self ) {
      actualConsumerFunction = consumer;
      actualConsumerSelf = self;
   }

   // the function that logs using an error
   function log( message ) {
       var stackInfo = (new Error).stack.split('\n')[ 3 ];
       var matches = findDetailsRegularExpression.exec( stackInfo );
       var callingFunction = null;
       var callingOccured = null;
       var logMessage = null;

       if( matches === null ) {
          console.log( stackInfo );
          throw Error( 'InvalidStackError', 'Stacktrace is invalid' );
       } else {
          callingFunction = matches[ 1 ];
          callingOccured = matches[ 2 ];
          logMessage = new Date().toISOString() + ': ' + message + ' ' + callingOccured + ' in ' + callingFunction;
          actualConsumerFunction.call( actualConsumerSelf, logMessage );
       }
   }

   // helper to find a level with a given number
   function findLevel( number ) {
      var level = null;
      for ( level in allLogLevel ) {
        if( allLogLevel[ level ] === number )
        {
           return level;
        }
      }
   }

   // set the actual log level or returns it
   function level( newLevel ) {
      if( newLevel ) {
         actualLogLevel = findLevel( newLevel );
      } else {
         return allLogLevel[ actualLogLevel ];
      }
   }

   // API
   return {
      to:      to,
      all:     allLogLevel,
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
