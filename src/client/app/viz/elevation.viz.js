import * as d3 from 'd3';
import React from 'react';
import {export_as_image} from '../tools/export-viz.coffee';
import {saveAs} from 'file-saver';
import {logger} from '../logging.coffee';
require('./elevation.viz.css');

// Useful example which inspired this viz :
// Animate path on Leaflet map using D3
// http://bl.ocks.org/zross/6a31f4ef9e778d94c204

export class ElevationProfileViz extends React.Component {

    static propTypes = {
        data: React.PropTypes.object.isRequired,
        map: React.PropTypes.object
    };

    worldToMapTransform(x, y) {
        return this.props.map.latLngToLayerPoint(new L.LatLng(y, x));
    }

    overlayPane() {
        return this.props.map.getPanes().overlayPane;
    }

    plot(data) {

        var width = 600, height = 400, padding = 40 ;
        var margin = {top: 50, right: 55, bottom: 22, left: 40};
        var coords = data.geometry.coordinates; 
        var dist = data.properties.axis.length;
        
        var svg = d3.select('.elevation-profile-viz')
          .append('svg')
          .attr("width", '100%') //(width + margin.left + margin.right + padding))
          .attr("height", '100%') //(height + margin.top + margin.bottom + 2*padding))
          .attr('viewBox','0 0 '+ (width + margin.left + margin.right + padding) +' '+ (height + margin.top + margin.bottom + 2*padding))
          .attr('preserveAspectRatio','xMinYMin')
          .style("margin-top", 10 - margin.top + "px")
          .append("g")
          .attr("transform", "translate(" + (margin.left+padding) + "," + (margin.top+0.5*padding) + ")");

        var x = d3.scaleLinear()
          .domain([ -0.05*dist, 1.05*dist ])
          .range([ 0, width ]);
        var altitudes = coords.map(function(d) { return d[2] });
        var alt_min = d3.min(altitudes), alt_max = d3.max(altitudes);
        var y = d3.scaleLinear()
          .domain([ Math.floor(alt_min - 0.05*(alt_max - alt_min)), Math.ceil(alt_max + 0.05*(alt_max - alt_min)) ])
          .range([ height, 0 ]);

        var profile = d3.line()
                        .x(function(d) { return x(dist*d[3]); })
                        .y(function(d) { return y(d[2]); });

        var xAxis = d3.axisBottom(x)
            .tickSize(4)
            .tickPadding(2);

        var yAxis = d3.axisLeft(y)
            // .ticks(10)
            .tickPadding(10)
            .tickSize(4);

        svg.append("g")
             .attr("class", "x axis")
             .attr("transform", "translate(0," + height + ")")
             .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            //.attr("transform", "translate(-" + width + ",0)")
            .call(yAxis);

        // add the X gridlines
        svg.append("g")     
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis
                .tickSize(-height)
                .tickFormat("")
            );

        // add the Y gridlines
        svg.append("g")     
            .attr("class", "grid")
            .call(yAxis
                .tickSize(-width)
                .tickFormat("")
            );

        var xLabel = svg.append("g")
              .attr("class", "x axis label")
              .attr("transform", "translate(" + (width/2) + "," + (height+padding) + ")");
        xLabel.append('text')
              .attr('dx', "-10px")
              .text('distance (m)')
              .attr("text-anchor", "middle")
        var yLabel = svg.append("g")
              .attr("class", "y axis label")
              .attr("transform", "translate(" + (-padding) + "," + (height/2) + ")rotate(-90)");
        yLabel.append('text')
              .attr('dy', "-10px")
              .text('altitude (m)')
              .attr("text-anchor", "middle");

        var plot = svg.append('g')
          .selectAll('.g-data')
          .data([ data ])
          .enter();

        plot.append('path')
          .attr("d", function(d) { return profile(d.geometry.coordinates); })
          .style("stroke", "navy")
          .style("stroke-width", 1.5)
          .style("fill", 'none');

        var voronoi = d3.voronoi().extent([[ 0,0 ], [ width, height ]]);
        var crosshair = svg.append("g")
          .attr('class', 'crosshair')
          .attr('display', 'none');
        var xline = crosshair.append('path')
          .attr('d', 'M0,0L0,' + height + 'Z');
        var yline = crosshair.append('path')
          .attr('d', 'M0,0L' + width + ',0Z');
        var tooltip = crosshair.append('text')
          .attr('dx', '10px')
          .attr('dy', '-10px');
        var circle = crosshair.append('circle')
          .attr('r', '5px')

        var updateProfileMarker;
        if (this.props.map !== undefined) {
            var marker_svg = d3.select(this.overlayPane()).append('svg')
                .attr('class', 'd3-map-overlay');
            var marker = marker_svg.append('g')
                .attr("class", "leaflet-zoom-hide")
                .append('circle')
                .attr('id', 'elevation-profile-marker')
                .attr('display', 'none')
                .attr('r', 5)
                .attr('stroke', 'orange')
                .attr('stroke-width', 1.5)
                .attr('fill', 'orange')
                .attr('fill-opacity', 0.3);
            updateProfileMarker = (d,i) => {
                if (d) {
                    var p = component.worldToMapTransform(d.data[0], d.data[1]);
                    marker.attr('display', null)
                    .attr("transform", "translate(" + p.x + "," + p.y + ")");
                } else {
                    marker.attr('display', 'none');
                }
            }
            this.marker_svg = marker_svg;
        } else {
            updateProfileMarker = (d,i) => {};
            this.marker_svg = undefined;
        }

        var component = this;
        var displayValue = function(d,i) {
          if (d) {
            crosshair.attr('display', null);
            circle.attr('transform', 'translate('+ x(dist*d.data[3]) + ',' + y(d.data[2]) + ')');
            xline.attr('transform', 'translate('+ x(dist*d.data[3]) + ',0)');
            yline.attr('transform', 'translate(0,' + y(d.data[2]) + ')');
            tooltip.attr('transform', 'translate('+ x(dist*d.data[3]) + ',' + y(d.data[2]) + ')')
              .text(Math.round(d.data[2]*10)/10);
            if (x(dist*d.data[3]) > (width/2)) {
              tooltip.attr('text-anchor', 'end')
                .attr('dx', '-10px');
            } else {
              tooltip.attr('text-anchor', 'start')
                .attr('dx', '10px');
            }
          } else {
            crosshair.attr('display', 'none');
          }
          updateProfileMarker(d, i);
        }; 

        svg.append('g')
        .attr('class', 'overlay')
        .selectAll('.voronoi')
        .data(voronoi.polygons(coords.map(function(d) { return [ x(dist*d[3]), y(d[2]) + Math.random() - .5 ]; }))
        .map(function(d, i) {
            d.path = "M" + d.join("L") + "Z";
            d.data = coords[i];
            return d;
        }))
        .enter()
        .append('path')
        .attr('class', 'voronoi')
        .attr("d", function(d) { return d.path; })
        .on("mouseout", function(d, i) { displayValue(null); })
        .on("mouseover", function(d, i) { displayValue(d,i); });

        this.svg = svg;

        this.resetMap();

    }

    resetMap() {
        var component = this;
        var transform = d3.geoTransform({
            point: function(x, y) {
                var point = component.worldToMapTransform(x, y);
                return this.stream.point(point.x, point.y);
            }
        });
        var bounds = d3.geoPath().projection(transform).bounds(this.props.data);
        var topLeft = bounds[0], bottomRight = bounds[1];
        this.marker_svg.attr("width", bottomRight[0] - topLeft[0] + 120)
                .attr("height", bottomRight[1] - topLeft[1] + 120)
                .attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")")
                .style("left", topLeft[0] - 50 + "px")
                .style("top", topLeft[1] - 50 + "px");
    }

    componentDidMount() {
        this.plot(this.props.data);
        if (this.props.map != undefined) {
            this.props.map.on('zoomend', this.resetMap, this);
            this.props.map.on('viewreset', this.resetMap, this);
        }
    }

    componentWillUnmount() {
        if (this.props.map !== undefined) {
            this.props.map.off('zoomend', this.resetMap, this);
            this.props.map.off('viewreset', this.resetMap, this);
            d3.selectAll('.d3-map-overlay').remove();
            this.marker_svg = undefined;
        }
        this.svg = undefined;
    }

    saveAsImage(event) {
        logger.debug('Saving chart to image ...');
        event.preventDefault();
        export_as_image(this.svg.node(), 800, 600, 'png', (blob) => {
            saveAs( blob, 'D3 vis exported to PNG.png' );
        });
        return false;
    }

    render() {
        return (
            <div className="elevation-profile-viz"></div>
        );
    }

}