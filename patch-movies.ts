import fs from 'fs';

const controllerFile = './src/controllers/movieController.ts';
let code = fs.readFileSync(controllerFile, 'utf8');

if (!code.includes('syncHlsFromMediaFile')) {
  code = `import { syncHlsFromMediaFile } from '../lib/syncMediaFields';\n` + code;
  
  // Patch createMovie
  code = code.replace(
    /const isLocalPath = body\.hlsUrl/g,
    `await syncHlsFromMediaFile(body, 'videoUrl', 'movie');\n    const isLocalPath = body.hlsUrl`
  );
  
  // Patch updateMovie
  code = code.replace(
    /const movie = await MovieModel\.findByIdAndUpdate\(/,
    `await syncHlsFromMediaFile(body, 'videoUrl', 'movie');\n\n    const movie = await MovieModel.findByIdAndUpdate(`
  );

  fs.writeFileSync(controllerFile, code);
}
