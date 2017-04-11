/**
 * Test if a point is inside a polygon.
 * Input as GeoJSON geometries.
 *
 * No multi-geometries
 * (check individual components instead).
 */
export function pointInPolygon(point, polygon) {

  if (polygon.type !== 'Polygon' || polygon.coordinates.length == 0 || point.type !== 'Point') {
    return false;
  }

  var exteriorRing = polygon.coordinates[0];

  if (polygon.coordinates.length > 1) {
    if (pointInRing(point, exteriorRing)) {
      // Inside exterior ring
      // Do check for holes
      for (var i=1; i<polygon.coordinates.length; i++) {
        if (pointInRing(point, polygon.coordinates[i])) {
          return false;
        }
      }
      // Point is not in any hole
      return true;
    } else {
      // Outside exterior ring
      return false;
    }
  } else {
    return pointInRing(point, exteriorRing);
  }

}

function pointInRing(point, ring) {

  var nodes = ring.length;

  var node = function(i) {
    return {
      lon: ring[i][0],
      lat: ring[i][1]
    };
  };

  var cross = function(a, b, c) {
    var bx = b.lon - a.lon;
    var by = b.lat - a.lat;
    var cx = c.lon - a.lon;
    var cy = c.lat - a.lat;
    return (bx * cy - by * cx);
  };

  var p = {
    lon: point.coordinates[0],
    lat: point.coordinates[1]
  };

  var windingNumber = 0;

  for (var i=0; i<nodes-1; i++) {
    var e1 = node(i);
    var e2 = node(i+1);
    if (e1.lat <= p.lat) {
      if (e2.lat > p.lat) {
        if (cross(e1, e2, p) > 0) { // p left of edge (e1, e2)
          windingNumber++;
        }
      }
    } else {
      if (e2.lat <= p.lat) {
        if (cross(e1, e2, p) < 0) { // p right of edge (e1, e2)
          windingNumber--;
        }
      }
    }
  }

  return (windingNumber !== 0);

}
