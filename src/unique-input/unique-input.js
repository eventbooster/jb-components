angular
.module( 'jb.components' )
.directive( 'uniqueValue', [ '$q', 'APIWrapperService', function( $q, APIWrapperService) {

	return {
		require		: 'ngModel'
		, link		: function( scope, element, attrs, ctrl ) {
			


			if( !scope.endpoint || !scope.field ) {
				throw new Error( 'UniqueInput: Missing field or endpoint in scope. Please provide attributes «unique-value-endpoint» and «unique-value-field».' );
			}

			if( !element.val() ) {

			}

			ctrl.$asyncValidators[ scope.field ] = function( modelValue, viewValue ) {

				// Empty: Is not a duplicate value
				if( ctrl.$isEmpty( modelValue ) ) {
					return $q.when();
				}

				return APIWrapperService.request( {
					url			: scope.endpoint
					, method	: 'GET'
					, headers	: {
						filter	: scope.field + '=' + modelValue
					}
				} )
				.then( function( result ) {

					if( !result ) {
						return true;
					}

					if( result.length ) {
						return $q.reject();
					}

					return true;

				}, function( err ) {
					console.error( 'UniqueInput: Encountered a problem with the server: ' + err.message );
					return $q.reject( err.message );
				} );


			};



		}
		, scope: {
			endpoint		: '=uniqueValueEndpoint'
			, field			: '=uniqueValueField'
		}
	};

} ] );