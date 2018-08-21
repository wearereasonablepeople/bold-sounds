const audiosprite = require('audiosprite');
const fs = require('fs');

const SOUNDS_DIR = './sounds';
const SRC_DIR = './src';
const DIST_DIR = './dist';
const OUTPUT_FORMATS = ['webm', 'mp3'];
const OUTPUT_FILE_NAME = 'sprites';

const opts = {
  output: `${DIST_DIR}/${OUTPUT_FILE_NAME}`,
  format: 'howler',
  export: OUTPUT_FORMATS.join(','),
  channels: 2
};

const files = fs.readdirSync(SOUNDS_DIR)
.filter(file => file.includes('.mp3') || file.includes('.wav'))
.map(file => `${SOUNDS_DIR}/${file}`);

audiosprite(files, opts, (err, obj) => {
  if (err) {
    throw err;
  }
  obj.src = OUTPUT_FORMATS.map(format => `${OUTPUT_FILE_NAME}.${format}`);
  delete obj.urls;
  const data = `export default ${JSON.stringify(obj, null, '\t')}`;
  return fs.writeFileSync(`${SRC_DIR}/${OUTPUT_FILE_NAME}.js`, data);
});
