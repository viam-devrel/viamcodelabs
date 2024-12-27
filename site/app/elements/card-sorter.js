/*
 Copyright 2016 Google Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
/*
`card-sorter` dynamically manages its light dom children, providing sorting
and filtering hooks.
*/

(function(window1, document1) {
  function f(a) {
    this.o = "a-z";
    this.g = {
      tags: []
    };
    this.m = a;
    this.i = a.querySelectorAll(".codelab-card");
    for (var d = a = 0; d < this.i.length; d++) {
      var b = this.i[d];
      b.s = (b.dataset.title || "").trim().toLowerCase();
      b.l = g((b.dataset.category || "").split(","));
      b.tags = g((b.dataset.tags || "").split(","));
      b.j = new Date(b.dataset.updated);
      b.duration = parseInt(b.dataset.duration, 10);
      b.dataset.pin && (a += 1, b.h = a);
    }
  }
  f.prototype.sort = function(a) {
    this.o = a;
    h(this);
  };
  f.prototype.filter = function(a) {
    this.g.cat = k(a.cat);
    this.g.text = k(a.text);
    this.g.tags = g(a.tags);
    this.g.kioskTags = g(a.kioskTags);
    h(this);
  };
  f.prototype.filterByCategory = function(a) {
    this.g.cat = k(a);
    h(this);
  };
  f.prototype.filterByText = function(a) {
    this.g.text = k(a);
    h(this);
  };
  f.prototype.filterByTags = function(a, d) {
    this.g.tags = g(a);
    this.g.kioskTags = g(d);
    h(this);
  };
  f.prototype.clearFilters = function() {
    this.filter({
      tags: [],
      kioskTags: []
    });
  };
  function h(a) {
    for (var d = Array.prototype.slice.call(a.i, 0), b = d.length; b--;) {
      var c = a;
      var e = d[b];
      if (c.g.kioskTags && 0 < c.g.kioskTags.length && !m(c.g.kioskTags, e.tags)) c = !1;
      else {
        var p = !c.g.cat;
        if (c.g.cat) for (var l = 0; l < e.l.length; l++)c.g.cat === e.l[l] && (p = !0);
        c = !p || c.g.text && -1 === e.s.indexOf(c.g.text) || 0 < c.g.tags.length && !m(c.g.tags, e.tags) ? !1 : !0;
      }
      c || d.splice(b, 1);
    }
    n(a, d);
    for (b = 0; b < a.i.length; b++)c = a.i[b], c.parentNode && c.parentNode.removeChild(c);
    d.forEach(a.m.appendChild.bind(a.m));
  }
  function n(a, d) {
    switch (a.o) {
      case "duration":
        d.sort(function(b, c) {
          var e = q(b, c);
          return null !== e ? e : b.duration - c.duration;
        });
        break;
      case "recent":
        d.sort(function(b, c) {
          var e = q(b, c);
          return null !== e ? e : c.j < b.j ? -1 : c.j > b.j ? 1 : 0;
        });
        break;
      default:
        d.sort(function(b, c) {
          var e = q(b, c);
          return null !== e ? e : b.dataset.title < c.dataset.title ? -1 : b.dataset.title > c.dataset.title ? 1 : 0;
        });
    }
  }
  function k(a) {
    return (a || "").trim().toLowerCase();
  }
  function g(a) {
    a = a || [];
    for (var d = [], b = 0; b < a.length; b++) {
      var c = k(a[b]);
      c && d.push(c);
    }
    d.sort();
    return d;
  }
  function q(a, d) {
    return a.h && !d.h ? -1 : !a.h && d.h ? 1 : a.h && d.h ? a.h - d.h : null;
  }
  function m(a, d) {
    for (var b = 0, c = 0; b < a.length && c < d.length;)if (a[b] < d[c]) b++;
    else if (a[b] > d[c]) c++;
    else return !0;
    return !1;
  }
  ;
  window1.CardSorter = f;
})(window, document);

class CardSorterEl extends HTMLElement {
  connectedCallback() {
    this.sorter = new CardSorter(this);
  }

  sort(o) {
    o = (o || '').trim().toLowerCase();
    this.sorter.sort(o);
  }

  filter(f) {
    this.sorter.filter(f);
  }

  filterByCategory(category) {
    this.sorter.filterByCategory(category);
  }

  filterByTags(tags) {
    this.sorter.filterByTags(tags);
  }

  filterByText(text) {
    this.sorter.filterByText(text);
  }

  clearFilters() {
    this.sorter.clearFilter();
  }
}

customElements.define('card-sorter', CardSorterEl);
