
if(typeof window.jstag !== 'object'){
    // if jstag object doesnt exist we are loading sync
    // set master variable so we can block the outlio load
    window.liosetup = window.liosetup || {};
    window.liosetup.sync = true;

    // continue loading the main collection tag
    window.jstag = function() {
      var t = {
              _q: [],
              _c: {},
              ts: (new Date()).getTime(),
              ver: "2.0.0"
          },
          w = window,
          d = document,
          l = false,
          async = true,
          as = Array.prototype.slice;
      t.init = function(c) {
          t._c = c;

          // begin load of core tag
          // in > 2.0.0 this tag will handle loading io based on account
          // and no longer require changes to async tag
          if(!c.synchronous){
            t.loadtagmgr(c);
          }

          return this;
      };
      t.loadtagmgr = function(c){
        var newtag = document.createElement("script");
        newtag.type = "text/javascript", newtag.async = !0, newtag.src = c.url + "/api/tag/" + c.cid + "/lio.js";
        var i = document.getElementsByTagName("script")[0];
        i.parentNode.insertBefore(newtag, i)
      };

      function chainable(fn) {
        return function() {
          fn.apply(this, arguments);
          return this;
        };
      }

      function queueStub() {
        var args = [ "ready" ].concat(as.call(arguments));
        return chainable(function() {
          args.push(as.call(arguments));
          this._q.push(args);
        });
      }

      t.ready = queueStub();
      t.send = queueStub("send");
      t.mock = queueStub("mock");
      t.identify = queueStub("identify");
      t.pageView = queueStub("pageView");
      t.bind = chainable(function() { t._q.push([e, as.call(arguments, 1)]); });
      t.block = chainable(function() { t._c.blockload = true; });
      t.unblock = chainable(function() { t._c.blockload = false; });

      return t;
    }();

    var initObj = {
        "cid": "77d15ed790ca7c40480a6ca95b39fdb0",
        "url": "//api.lytics.io" || "//c.lytics.io",
        "synchronous":true,
        "min": false
    };

    // check for the cross domain cookie setting param
    if(typeof window.liosetup !== 'undefined' && window.liosetup.loadid !== undefined){
        initObj.loadid = window.liosetup.loadid;
    }

    // validate that we have url and cid or fail
    if( initObj.cid == "" || initObj.url == "" ){
        console.log("lytics javascript tag configured incorrectly, missing required url or cid")
    }else{
        window.jstag.init(initObj);
    }
}

// load the core collection library
// upon moving to >= 2.0.0 the jstag.load method was removed from the async tag
// so that the tag endpoint would control the loading, if that function exists we
// need to fallback to the legacy io.js
if(window.jstag && !window.jstag.isLoaded && window.jstag._c && typeof window.jstag.load !== 'function'){
    (function(d, w) {
        var filename,
            filepath,
            eventblock = false,
            majorversion = 1 || 1,
            minified = !!((w.jstag._c.min)),
            url = w.jstag._c.url || '//c.lytics.io';

        // determine filepath
        if(majorversion >= 2){
            filepath = '/static/v'+majorversion+'/';
        }else{
            filepath = '/static/';
        }

        // determine file output
        if(minified){
            filename = 'io.min.js';
        }else{
            filename = 'io.js';
        }

        // apply account level overrides
        if(eventblock){
            w.jstag._c.blockload = true;
        }

        var ioloader = d.createElement('script');
        ioloader.type = 'text/javascript';
        ioloader.src = url + filepath + filename;
        d.getElementsByTagName('head')[0].appendChild(ioloader);
    }(document, window));
}

// set the stream and fire the first event
window.jstag.ready(function(){
    if(typeof window.liosetup !== 'undefined' && window.liosetup.stream !== undefined){
        window.jstag.config.stream = window.liosetup.stream;
    }

    // in the case of segment we need to avoid firing the initial page view twice, let them handle it
    if (window.analytics && window.analytics.Integrations && typeof window.analytics.Integrations.Lytics !== 'undefined') {
      return;
    }
    window.jstag.send();
})

console.log("Public audiences must be enabled before passing segments to your tools.");