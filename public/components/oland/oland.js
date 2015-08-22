window.consi = window.consi || {};
window.consi.oland = {};

(function() {
  var c = window.consi.oland;
  c.init = function init(elem) {
    c.mapContainer  = elem.querySelector('.map-container');
    c.map           = elem.querySelector('.map');
    c.bg            = elem.querySelector('.bg');
    basket.require(
      { url: 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js', key: 'd3', unique: '1' },
      { url: 'https://cdnjs.cloudflare.com/ajax/libs/topojson/1.6.19/topojson.js', key: 'topojson', unique: '1' },
      { url: 'bower_components/textures/textures.min.js', key: 'textures', unique: '1' }
    ).then(scriptCallback.bind(c));
  }

  function scriptCallback() {
    var self    = this;
    var aspect  = 1 / 4;
    var h       = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) * 0.6;
    var w       = h * aspect;
    self.d3mapContainer = d3.select(self.mapContainer);
    self.d3map          = d3.select(self.map);
    self.d3bg           = d3.select(self.bg);
    self.d3mapContainer
        .attr('width', w)
        .attr('height', h);

        d3.json('components/oland/oland.topo.json', function(error, data) {
          if (error) return console.error(error);
          var features    = topojson.feature(data, data.objects['oland.geo']);
          var projection  = d3.geo.albers()
              .scale(1)
              .rotate([10, 0])
              .translate([0, 0]);

          // Create a path generator.
          var path = d3.geo.path()
              .projection(projection);

          features.features.splice(1);

          // Compute the bounds of a feature of interest, then derive scale & translate.
          var b = path.bounds(features);
          var s = 0.95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h);
          var t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];

          // Update the projection to use computed scale & translate.
          projection
              .scale(s)
              .translate(t);

          var texture = textures.lines()
              .size(6)
              .strokeWidth(1)
              .stroke('#ddd');

          // var texture = textures.circles()
          //   .size(4)
          //   .radius(1)
          //   .fill('#ccc');

          self.d3mapContainer.call(texture);

          self.d3map.selectAll('.path')
              .data(features.features)
            .enter().append('path')
              .attr('d', path)
              .attr('class', 'path')
              .style("fill", texture.url());
              return;

          self.d3bg
            .append('rect')
              .attr('width', w)
              .attr('height', h)
              .style("fill", texture.url());

          return;

          self.d3bg.selectAll('.bg-path')
              .data(features.features)
            .enter().append('path')
              .attr('d', path)
              .attr('class', 'bg-path')
              .style("fill", texture.url());



          var segments = self.mapContainer.querySelector('.bg-path').pathSegList;

          var i;
          var segment;
          var isOver;
          var isLeft;
          var alfa;
          var deltaX;
          var deltaY;
          var x;
          var y;
          var hypotenuse;

          for (i = 0; i < segments.length; i++) {
            segment = segments[i];
            isLeft  = segment.x < (w / 2);
            isOver  = segment.y < (h / 2);

            if (isOver && isLeft) {
              console.log('======');
              console.log('(w / 2)', (w / 2));
              console.log('(h / 2)', (h / 2));
              console.log('segment.x', segment.x);
              console.log('segment.y', segment.y);
              deltaX      = (w / 2) - segment.x;
              deltaY      = (h / 2) - segment.y;
              alfa        = Math.atan(deltaY / deltaX);
              hypotenuse  = 50 + Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
              console.log('hypotenuse', hypotenuse);
              console.log('alfa', alfa);
              console.log('deltaX', deltaX);
              console.log('deltaY', deltaY);
              console.log('radians * (180/pi)', alfa * (180/Math.PI))
              x           = hypotenuse * Math.cos(alfa);
              y           = hypotenuse * Math.sin(alfa);
              console.log('x', x);
              console.log('y', y);
              console.log('(w / 2) - x', (w / 2) - x);
              console.log('(h / 2) - y', (h / 2) - y);
              segment.x = (w / 2) - x;
              segment.y = (h / 2) - y;
            }

            if (isOver && !isLeft) {
              deltaX      = segment.x - (w / 2);
              deltaY      = (h / 2) - segment.y;
              alfa        = Math.atan(deltaY / deltaX);
              hypotenuse  = 50 + Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
              x           = hypotenuse * Math.cos(alfa);
              y           = hypotenuse * Math.sin(alfa);
              segment.x = (w / 2) + x;
              segment.y = (h / 2) - y;
            }

            if (!isOver && isLeft) {
              deltaX      = (w / 2) - segment.x;
              deltaY      = segment.y - (h / 2);
              alfa        = Math.atan(deltaY / deltaX);
              hypotenuse  = 50 + Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
              x           = hypotenuse * Math.cos(alfa);
              y           = hypotenuse * Math.sin(alfa);
              segment.x = (w / 2) - x;
              segment.y = (h / 2) + y;
            }

            if (!isOver && !isLeft) {
              deltaX      = segment.x - (w / 2);
              deltaY      = segment.y - (h / 2);
              alfa        = Math.atan(deltaY / deltaX);
              hypotenuse  = 50 + Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
              x           = hypotenuse * Math.cos(alfa);
              y           = hypotenuse * Math.sin(alfa);
              segment.x = (w / 2) + x;
              segment.y = (h / 2) + y;
            }


          }


          // s = 1 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h);
          // t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];
          //
          // projection
          //     .scale(s)
          //     .translate(t);
          //
          // d3.select(self.bg).selectAll('.bg-path')
          //     .data(features.features)
          //   .enter().append('path')
          //     .attr('d', path)
          //     .style("fill", texture.url());
          //

        });

  }

})();