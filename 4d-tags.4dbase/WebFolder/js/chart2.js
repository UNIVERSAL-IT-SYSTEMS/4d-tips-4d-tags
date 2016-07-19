(function() {

  function getData(url, cb){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        if (typeof cb === 'function') {
          var data = JSON.parse(xhr.responseText);
          cb.call(xhr, data);
        }
      }
    };
    xhr.open('GET', url, true);
    xhr.send();
  };

  function drawChart(name) {

    getData('data2.shtm?name='+encodeURIComponent(name), function(data) {

      var bar = new Chartist.Bar('#bar-' + name.replace(/ /g, "_"), data.totals, {
          axisY: {
              onlyInteger: true
            },
          chartPadding: {
            top:70,
            bottom:70,
            right: 70
          }
        }
      );
      var seq_bar = 0;
      var offset_bar = 1;
      var turningPoint_bar = data.totals.labels.length;
      bar.on('draw', function(data) {
        if(data.type === 'bar') {

          var _class = data.element._node.getAttribute("class");
          _class += " c-" + name.replace(/ /g, "_");
          data.element._node.setAttribute("class", _class);

          seq_bar += offset_bar;
          if(seq_bar > turningPoint_bar) {seq_bar = offset_bar}
          data.element.animate({
            opacity: {
              begin: 30 * seq_bar,
              dur: 400,
              from: 0,
              to: 1
            }
          });
        };
      });

      var line = new Chartist.Line('#line-' + name.replace(/ /g, "_"), data.counts, {
          axisX: {
            showLabel: false,
            showGrid: false
          },
          axisY: {
            position: 'end',
            showLabel: true,
            showGrid: false
          },
          chartPadding: {
            top:70,
            bottom:70,
            left: 75
          }
        }
      );
      var seq_line = 0;
      var offset_line = 1;
      var turningPoint_line = data.counts.labels.length;
      line.on('draw', function(data) {
        if(data.type === 'line') {

          var _class = data.element._node.getAttribute("class");
          _class += " c-" + name.replace(/ /g, "_");
          data.element._node.setAttribute("class", _class);

          data.element.animate({
            opacity: {
              begin: 300,
              dur: 400,
              from: 0,
              to: 1
            }
          });
        } else if(data.type === 'point') {

          var _class = data.element._node.getAttribute("class");
          _class += " c-" + name.replace(/ /g, "_");
          data.element._node.setAttribute("class", _class);
                    
          seq_line += offset_line;
          if(seq_line > turningPoint_line) {seq_line = offset_line}
          data.element.animate({
            x1: {
              begin: 30 * seq_line,
              dur: 400,
              from: data.x - 10,
              to: data.x,
              easing: 'easeOutQuart'
            },
            x2: {
              begin: 30 * seq_line,
              dur: 400,
              from: data.x - 10,
              to: data.x,
              easing: 'easeOutQuart'
            },
            opacity: {
              begin: 30 * seq_line,
              dur: 400,
              from: 0,
              to: 1,
              easing: 'easeOutQuart'
            }
          });
        }
      });

    });
  };

  var addEventListener =  window.addEventListener || function(n,f) { window.attachEvent('on'+n, f); },
      removeEventListener = window.removeEventListener || function(n,f,b) { window.detachEvent('on'+n, f); };

  function addObservers(f) {
    addEventListener('scroll', f);
    addEventListener('resize', f);
  }

  function removeObservers(f) {
    removeEventListener('scroll', f, false);
    removeEventListener('resize', f, false);
  }

  // For IE7 compatibility
  // Adapted from http://www.quirksmode.org/js/findpos.html
  function getOffsetTop(el) {
    var val = 0;
    if (el.offsetParent) {
      do {
        val += el.offsetTop;
      } while (el = el.offsetParent);
      return val;
    }
  }

  function lazyLoad() {

    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var pageHeight = window.innerHeight || document.documentElement.clientHeight;
    var range = {
      min: scrollY - 200,
      max: scrollY + pageHeight + 200
    };

    var i = 0;
    while (i < cache.length) {
      var chartDiv = cache[i];
      var chartPosition = getOffsetTop(chartDiv);
      var chartHeight = chartDiv.height || 0;
      if ((chartPosition >= range.min - chartHeight) && (chartPosition <= range.max)) {
        drawChart(chartDiv.getAttribute('data-chart'));
        cache.splice(i, 1);
        continue;
      }
    i++;
    }
    if (cache.length === 0) {
      removeObservers();
    }
  }

  var cache = [];
  var chartDivs = document.querySelectorAll('div[data-chart]');
  for (var i = 0; i < chartDivs.length; i++) {
    cache.push(chartDivs[i]);
  }

  addObservers(lazyLoad);

  lazyLoad();

})();
