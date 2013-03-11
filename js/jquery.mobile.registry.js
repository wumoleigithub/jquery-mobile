//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Orders enhancement hooks by dependency
//>>label: Registry of enhancers
//>>group: Widgets

define( [ "jquery", "./jquery.mobile.ns" ], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {

var doc = $( document );

function Enhancer() {
	this._callbacks = [],
	this._dependencies = {},
	this._document = doc;
}
/*
function callbackWrapper( widget, callback ) {
	var ret = function( target ) {
		console.log( "<Running " + widget + ">" );
		callback( target );
	}

	return ret;
}
*/
$.extend( Enhancer.prototype, {
	_addWidget: function( fullName ) {
		var idx,
			depinfo = this._dependencies[ fullName ];

		if ( depinfo && !depinfo.added ) {
			for ( idx in depinfo.deps ) {
				this._addWidget( depinfo.deps[ idx ] );
			}
			this._callbacks.push( depinfo.callback );
			depinfo.added = true;
		}
	},

	_defaultCallback: function( widget ) {
		var parts = widget.split( "." ),
			ns = parts[ 0 ],
			name = parts[ 1 ],
			ret = function( targetEl ) {
				$[ ns ][ name ].prototype.enhanceWithin( targetEl, true );
			};

		return ret;
	},

	add: function( widget, widgetDeps, callback ) {
		if ( !widgetDeps ) {
			widgetDeps = { dependencies: [] };
		}

		if ( !callback ) {
			callback = this._defaultCallback( widget );
		}

//		callback = callbackWrapper( widget, callback );

//		console.log( "<Binding " + widget + ">" );

		this._dependencies[ widget ] = {
			deps: widgetDeps.dependencies,
			callback: callback
		};

		return this;
	},

	enhance: function( targetEl ) {
		var idx,
			deps = this._dependencies,
			cbs = this._callbacks;

		if ( deps ) {
			for ( idx in deps ) {
				this._addWidget( idx );
			}
			this._dependencies = null;
		}

		for ( idx in cbs ) {
			cbs[ idx ]( targetEl );
		}

		return this;
	}
});

$.mobile._enhancer = new Enhancer();

// Support triggering "create" on an element
doc.bind( "create", function( e ) {
	$.mobile._enhancer.enhance( e.target );
});

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
