import './style.css'
import { WebContainer } from '@webcontainer/api';
import { files } from './files';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <div class="editor">
      <textarea>I am a textarea</textarea>
    </div>
    <div class="preview">
      <iframe src="loading.html"></iframe>
    </div>
  </div>
`;

const iframeEl = document.querySelector<HTMLIFrameElement>('iframe');

const textareaEl = document.querySelector<HTMLTextAreaElement>('textarea');

let webcontainerInstance: WebContainer;

window.addEventListener('load', async () => {
  webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(files);

  const packageJSON = await webcontainerInstance.fs.readFile('package.json', 'utf-8');
  console.log(packageJSON);
})