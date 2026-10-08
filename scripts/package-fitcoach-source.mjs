// Publish the buildable demo source, without environment files or connected user data.
import {mkdtemp,cp,writeFile,rm,readFile,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const temp=await mkdtemp(path.join(tmpdir(),'fitcoach-source-'));
try{
 const root=path.join(temp,'fitcoach-demo');await mkdir(root);await cp('src/fitcoach',path.join(root,'src'),{recursive:true});await cp('public/fitcoach',path.join(root,'public'),{recursive:true,filter:source=>!source.endsWith('source.zip')});
 await writeFile(path.join(root,'index.html'),(await readFile('fitcoach/index.html','utf8')).replace('../src/fitcoach/main.tsx','/src/main.tsx'));
 await writeFile(path.join(root,'package.json'),JSON.stringify({name:'fitcoach-portfolio-demo',private:true,type:'module',scripts:{dev:'vite',build:'vite build'},dependencies:{react:'18.3.1','react-dom':'18.3.1','lucide-react':'0.487.0'},devDependencies:{vite:'6.4.3','@vitejs/plugin-react':'4.7.0','@tailwindcss/vite':'4.1.12',tailwindcss:'4.1.12','tw-animate-css':'1.3.8'}},null,2));
 await writeFile(path.join(root,'vite.config.mjs'),"import {defineConfig} from 'vite';import react from '@vitejs/plugin-react';import tailwind from '@tailwindcss/vite';export default defineConfig({base:'./',plugins:[react(),tailwind()]});\n");
 await writeFile(path.join(root,'README.md'),'# FitCoach portfolio demo\n\nRun `npm install`, then `npm run dev`. Build with `npm run build`. Requires Node 22+. All edits stay in browser storage; there is no live backend or model connection. The public exercise catalog and pinned upstream media URLs are included. Preserve public/legal/LICENSE and NOTICE.md.\n\nThe FitCoach UI is adapted from CharlieDoesntSurf/Fitnesstrackingapp, with a phone frame from CharlieDoesntSurf/IPhone17ProMaxInterfacesCommunity. Exercise data and starter templates derive from DuarteSantos8/openGym, commit ce30c7304bdeb66a6eb4a3d14821a06035523b06. See the included upstream AGPL-3.0 license and detailed notices, including separate metadata and third-party-media terms.\n');
 const archive=path.resolve('public/fitcoach/source.zip');await rm(archive,{force:true});execFileSync('zip',['-qr',archive,'fitcoach-demo'],{cwd:temp});console.log('Packaged buildable FitCoach demo source.');
}finally{await rm(temp,{recursive:true,force:true});}
