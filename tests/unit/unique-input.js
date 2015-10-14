( function() {

	'use strict';

	describe( 'UniqueInput Directive', function() {

		var service
			, scope
			, httpBackend
			, element
			, compile;


		beforeEach( angular.mock.module( 'jb.components' ) );


		var elements = {
			unique: '<input type="text" unique-value unique-value-endpoint="\'/userProfile\'" unique-value-field="\'email\'" ng-model="model">'
			//, duplicate: '<input type="text" existing-value existing-value-endpoint="/userProfile" existing-value-field="email">'
		};




		// Compile element
		beforeEach( angular.mock.inject( function( $rootScope, $compile, $httpBackend ) {

			element = angular.element( '<div>' + elements.unique + '</div>' );
			$compile( element )( $rootScope );

			compile = $compile;

			scope = $rootScope;
			httpBackend = $httpBackend;


		} ) );



		afterEach( function() {
			httpBackend.verifyNoOutstandingExpectation();
			httpBackend.verifyNoOutstandingRequest();
		} );





		it( 'returns an error when attributes are missing', function() {

			// Remove necessary attribute
			var html = elements.unique.replace( 'unique-value-endpoint', 'test' );
			
			var elCompiler = function() {
				var el = compile( angular.element( html ) )( scope );
			};

			expect( elCompiler ).toThrow();

		} );


		function enterData( data ) {
			element
				.find( 'input' )
				.val( data )
				.triggerHandler( 'change' );
		}



		describe( 'Validity', function() {


			// VALID
			// - call to correct url
			// - correct headers
			// - pending class
			// - valdi class
			it( 'sets validity to invalid if value exists', function() {

				httpBackend.expect( 'GET', /\/userProfile.*/, {}, function( headers ) {
					if( headers.filter && headers.filter === 'email=test' ) {
						return true;
					}
					return false;
				} ).respond( 201, [{ email: 'valid@mail.com' }] );

				enterData( 'test' );

				// ng-pending
				expect( element.find( 'input' )[ 0 ].classList.contains( 'ng-pending' ) ).toBe( true );

				httpBackend.flush();

				// ng-valid
				expect( element.find( 'input' )[ 0 ].classList.contains( 'ng-valid' ) ).toBe( false );

			} );


			// INVALID
			it( 'sets validity to valid if value does not exist', function() {

				httpBackend.expect( 'GET', /\/userProfile.*/ ).respond( 201, [] );

				enterData( 'test' );

				httpBackend.flush();

				expect( element.find( 'input' )[ 0 ].classList.contains( 'ng-valid' ) ).toBe( true );

			} );


			// SERVER ERROR
			it( 'sets validity to valid if value does not exist', function() {

				httpBackend.expect( 'GET', /\/userProfile.*/ ).respond( 500 );

				enterData( 'test' );

				httpBackend.flush();

				expect( element.find( 'input' )[ 0 ].classList.contains( 'ng-valid' ) ).toBe( false );

			} );



		} );





	} );

} )();
