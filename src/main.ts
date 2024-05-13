import { FileNode, WebContainer } from "@webcontainer/api";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

import { files } from "./files";
import "./style.css";

import "xterm/css/xterm.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="container">
    <div class="editor">
      <textarea>I am a textarea</textarea>
    </div>
    <div class="preview">
      <iframe src="loading.html"></iframe>
    </div>
  </div>
  <div class="terminal"></div>
`;

const iframeEl = document.querySelector<HTMLIFrameElement>("iframe");
const textareaEl = document.querySelector<HTMLTextAreaElement>("textarea");
const terminalEl = document.querySelector<HTMLTextAreaElement>(".terminal");

let webcontainerInstance: WebContainer;

async function startShell(terminal: Terminal) {
  const shellProcess = await webcontainerInstance!.spawn("jsh", {
    terminal: {
      cols: terminal.cols,
      rows: terminal.rows,
    },
  });
  shellProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data);
      },
    })
  );

  const input = shellProcess.input.getWriter();
  terminal.onData((data) => {
    input.write(data);
  });

  return shellProcess;
}

async function writeIndexJS(content: string): Promise<void> {
  await webcontainerInstance.fs.writeFile("/index.js", content);
}

window.addEventListener("load", async () => {
  textareaEl!.value = (files["index.js"] as FileNode).file.contents.toString();
  textareaEl!.addEventListener("input", (e) => {
    writeIndexJS((e.currentTarget as HTMLTextAreaElement).value);
  });

  const fitAddon = new FitAddon();

  const terminal = new Terminal({
    convertEol: true,
  });
  terminal.loadAddon(fitAddon);
  terminal.open(terminalEl!);

  fitAddon.fit();

  webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(files);

  webcontainerInstance.on("server-ready", (port, url) => {
    iframeEl!.src = url;
  });

  const shellProcess = await startShell(terminal);

  window.addEventListener("resize", () => {
    fitAddon.fit();
    shellProcess.resize({
      cols: terminal.cols,
      rows: terminal.rows,
    });
  });
});
