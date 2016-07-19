(function() {

  function SVGMenu( el, options ) {
    this.el = el;
    this.init();
  }

  SVGMenu.prototype.init = function() {
    this.trigger = this.el.querySelector( 'button.trigger' );
    this.shapeEl = this.el.querySelector( 'span.morph-shape' );

    var s = Snap( this.shapeEl.querySelector( 'svg' ) );
    this.pathEl = s.select( 'path' );
    this.paths = {
      reset : this.pathEl.attr( 'd' ),
      active : this.shapeEl.getAttribute( 'data-morph-active' )
    };

    this.isOpen = false;

    this.initEvents();
  };

  SVGMenu.prototype.initEvents = function() {
    this.trigger.addEventListener( 'click', this.toggle.bind(this) );
  };

  SVGMenu.prototype.toggle = function() {
    var self = this;

    if( this.isOpen ) {
      classie.remove( this.el, 'menu--open' );
    }
    else {
      setTimeout( function() { classie.add( self.el, 'menu--open' ); }, 175 );
    }

    this.pathEl.stop().animate( { 'path' : this.paths.active }, 150, mina.easein, function() {
      self.pathEl.stop().animate( { 'path' : self.paths.reset }, 800, mina.elastic );
    } );

    this.isOpen = !this.isOpen;
  };

  new SVGMenu( document.getElementById( 'menu' ) );

})();
