import fs from 'fs';

const patchController = (file, urlField, sourceName) => {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');

  if (!code.includes('syncHlsFromMediaFile')) {
    code = `import { syncHlsFromMediaFile } from '../lib/syncMediaFields';\n` + code;
    
    // Attempt to patch create/update
    code = code.replace(
      /const (?:audio|video) = await [A-Za-z]+Model\.create\(/g,
      `await syncHlsFromMediaFile(body, '${urlField}', '${sourceName}');\n    $&`
    );
    
    code = code.replace(
      /const update = buildRefUpdate\(body\);/g,
      `const update = buildRefUpdate(body);\n    if (update.$set) await syncHlsFromMediaFile(update.$set, '${urlField}', '${sourceName}');`
    );

    fs.writeFileSync(file, code);
  }
}

patchController('./src/controllers/audioController.ts', 'audioUrl', 'audio');
patchController('./src/controllers/contestVideoController.ts', 'videoUrl', 'contest-video');
