import csvWriter from 'csv-write-stream';
import { PassThrough } from 'stream';

export default (rows) => {
  return new Promise((resolve, reject) => {
    const headers = rows[0];
    const writer = csvWriter({ headers, sendHeaders: true });
    const passThrough = new PassThrough();
    const chunks = [];

    passThrough.on('data', (chunk) => chunks.push(chunk));
    passThrough.on('end', () => resolve(Buffer.concat(chunks)));
    passThrough.on('error', reject);

    writer.pipe(passThrough);

    for (let i = 1; i < rows.length; i++) {
      writer.write(rows[i]);
    }

    writer.end();
  });
};
