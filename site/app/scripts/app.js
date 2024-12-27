((window, document) => {
  'use strict';

  const app = () => {
    // Grab a reference to our auto-binding template
    // and give it some initial binding values
    // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
    let app = document.querySelector('#app');

    app.categoryStartCards = {};
    // Tags which should always be kept for filtering,
    // no matter what.
    // Populated in the reconstructFromURL.
    app.kioskTags = [];

    // template is="dom-bind" has stamped its content.
    app.addEventListener('dom-change', function(e) {
      // Use element's protected _readied property to signal if a dom-change
      // has already happened.
      if (app._readied) {
        return;
      }

      // Calculate category offsets.
      var cards = document.querySelectorAll('.codelab-card');
      Array.prototype.forEach.call(cards, function(card, i) {
        var category = card.getAttribute('data-category');
        if (app.categoryStartCards[category] === undefined) {
          app.categoryStartCards[category] = card;
        }
      });
    });

    app.codelabUrl = function(view, codelab) {
      var codelabUrlParams = 'index=' + encodeURIComponent('../..' + view.url);
      if (view.ga) {
        codelabUrlParams += '&viewga=' + view.ga;
      }
      return codelab.url + '?' + codelabUrlParams;
    };

    app.sortBy = function(e, detail) {
      var order = detail.item.textContent.trim().toLowerCase();
      globalThis.cards.sort(order);
    };

    app.filterBy = function(e, detail) {
      if (detail.hasOwnProperty('selected')) {
        globalThis.cards.filterByCategory(detail.selected);
        return;
      }
      detail.kioskTags = app.kioskTags;
      globalThis.cards.filter(detail);
    };

    app.onCategoryActivate = function(e, detail) {
      var item = e.target.selectedItem;
      if (item && item.getAttribute('filter') === detail.selected) {
        detail.selected = null;
      }
      if (!detail.selected) {
        setTimeout(function() { e.target.selected = null; }, 0);
      }
      this.filterBy(e, { selected: detail.selected });

      // Update URL deep link to filter.
      var params = new URLSearchParams(window.location.search.slice(1));
      params.delete('cat'); // delete all cat params
      if (detail.selected) {
        params.set('cat', detail.selected);
      }

      // record in browser history to make the back button work
      var url = window.location.pathname;
      var search = '?' + params;
      if (search !== '?') {
        url += search;
      }
      window.history.pushState({}, '', url);

      updateLuckyLink();
    };

    function updateLuckyLink() {
      var luckyLink = document.querySelector('.js-lucky-link');
      if (!luckyLink) {
        return;
      }
      var cards = app.$.cards.querySelectorAll('.codelab-card');
      if (cards.length < 2) {
        luckyLink.href = '#';
        luckyLink.parentNode.style.display = 'none';
        return;
      }
      var i = Math.floor(Math.random() * cards.length);
      luckyLink.href = cards[i].href;
      luckyLink.parentNode.style.display = null;
    }

    var chips = document.querySelector('#chips');

    /**
     * Highlights selected chips identified by tags.
     * @param {!string|Array<!string>}
     */
    function selectChip(tags) {
      if (!chips) {
        return;
      }
      tags = Array.isArray(tags) ? tags : [tags];
      var chipElems = chips.querySelectorAll('.js-chips__item');
      for (var i = 0; i < chipElems.length; i++) {
        var el = chipElems[i];
        if (tags.indexOf(el.getAttribute('filter')) != -1) {
          el.classList.add('selected');
        } else {
          el.classList.remove('selected');
        }
      }
    }

    if (chips) {
      chips.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Make sure the click was on a chip.
        var tag = e.target.getAttribute('filter');
        if (!tag) {
          return;
        }
        // Remove or add the selected class.
        e.target.classList.toggle('selected');
        // Collect all selected chips.
        var tags = [];
        var chipElems = chips.querySelectorAll('.js-chips__item.selected');
        for (var i = 0; i < chipElems.length; i++) {
          var t = chipElems[i].getAttribute('filter');
          if (t) {
            tags.push(t);
          }
        }
        // Re-run the filter and select a new random codelab
        // from the filtered subset.
        app.filterBy(null, { tags: tags });
        updateLuckyLink();
      });
    }

    app.reconstructFromURL = function() {
      var params = new URLSearchParams(window.location.search.slice(1));
      var cat = params.get('cat');
      var tags = params.getAll('tags');
      var filter = params.get('filter');
      var i = tags.length;
      while (i--) {
        if (tags[i] === 'kiosk' || tags[i].substr(0, 6) === 'kiosk-') {
          app.kioskTags.push(tags[i]);
          tags.splice(i, 1);
        }
      }

      if (globalThis.categorylist) {
        globalThis.categorylist.selected = cat;
      }
      if (globalThis.sidelist) {
        globalThis.sidelist.selected = cat;
      }
      if (tags) {
        selectChip(tags);
      }
      this.filterBy(null, { cat: cat, tags: tags });
      if (filter) {
        app.onSearchKeyDown({ target: { value: filter } });
      }
      updateLuckyLink();
    };

    // Prevent immediate link navigation.
    app.navigate = function(event) {
      event.preventDefault();

      var go = function(href) {
        window.location.href = href;
      };

      var target = event.target.closest('a');
      var wait = target.hasAttribute('data-wait-for-ripple');
      if (wait) {
        target.addEventListener('transitionend', go.bind(target, target.href));
      } else {
        go(target.href);
      }
    };

    app.debounce = function(func, timeout) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        setTimeout(() => func(...args), timeout)
      };
    }

    app.onSearchKeyDown = app.debounce(function(e) {
      globalThis.cards.filterByText(e.target.value);
    }, 250);

    return app;
  };

  // unregisterServiceWorker removes the service worker. We used to use SW, but
  // now we don't. This is for backwards-compatibility.
  const unregisterServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.unregister();
      });
    }
  }

  // loadWebComponents checks if web components are supported and loads them if
  // they are not present.
  const loadWebComponents = () => {
    let supported = (
      'registerElement' in document &&
      'import' in document.createElement('link') &&
      'content' in document.createElement('template')
    );

    // If web components are supported, we likely missed the event since it
    // fires before the DOM is ready. Re-fire that event.
    if (supported) {
      document.dispatchEvent(new Event('WebComponentsReady'));
    } else {
      let script = document.createElement('script');
      script.async = true;
      script.src = '/bower_components/webcomponentsjs/webcomponents-lite.js';
      document.head.appendChild(script);
    }
  }

  const init = () => {
    // Unload legacy service worker
    unregisterServiceWorker();

    // load the web components - this will emit WebComponentsReady when finished
    loadWebComponents();
  }

  // Wait for the app to be ready and initialized, and then remove the class
  // hiding the unrendered components on the body. This prevents the FOUC as
  // cards are shuffled into the correct order client-side.
  document.addEventListener('AppReady', () => {
    document.body.classList.remove('loading');
  })


  // Wait for web components to be ready and then load the app.
  document.addEventListener('WebComponentsReady', () => {
    const a = app();

    // TODO: handle forward/backward and filter cards
    window.addEventListener('popstate', () => {
      a.reconstructFromURL();
    })

    document.addEventListener('iron-activate', (event) => {
      if (event.target.matches('#categorylist')) {
        a.onCategoryActivate(event, event.detail)
      }
      if (event.target.matches('paper-tabs')) {
        a.sortBy(event, event.detail)
      }
    })

    document.addEventListener('tap', (event) => {
      if (event.target.closest('card-sorter')) {
        a.navigate(event)
      }
    })

    document.addEventListener('keydown', (event) => {
      if (!event.target.matches('input') && !event.target.closest('#searchbar')) return;

      a.onSearchKeyDown(event)
    })

    // Rebuild and sort cards based on the URL
    a.reconstructFromURL();

    // Notify the app is ready
    document.dispatchEvent(new Event('AppReady'));
  });

  // This file is loaded asyncronously, so the document might already be fully
  // loaded, in which case we can drop right into initialization. Otherwise, we
  // need to wait for the document to be loaded.
  if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})(window, document);
