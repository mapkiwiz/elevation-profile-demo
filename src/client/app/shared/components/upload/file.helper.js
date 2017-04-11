import parse from 'csv-parse';

export function parseAsObject(data, options, callback) {
  parse(data, options, (err, out) => {
    if (err) {
      callback(err);
      return;
    }
    let header = out.shift();
    callback(undefined, out.map(item => {
      return item.reduce((res, value, index) => {
        res[header[index]] = value;
        return res;
      }, {});
    }));
  });
}

export function parseFile(file, data, callback) {

  if (file.name.match(/\.csv$/)) {
    console.log('Upload CSV');
    parseAsObject(data, { comment: '#', delimiter: ';' }, callback);
  } else if (file.name.match(/\.tsv$/)) {
    console.log('Upload TSV');
    parseAsObject(data, { comment: '#', delimiter: '\t' }, callback);
  } else if (file.name.match(/\.geojson$/)) {
    console.log('Upload GeoJSON');
    callback(JSON.parse(data));
  } else if (file.name.match(/\.json$/)) {
    console.log('Upload JSON');
    callback(JSON.parse(data));
  } else {
    console.log('Upload unknown file type');
    // TODO Try CSV ?
    callback([]);
  }

}
