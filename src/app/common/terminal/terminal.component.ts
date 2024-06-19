import {
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import { TerminalSize } from './terminal-size';

@Component({
  selector: 'homework-terminal',
  standalone: true,
  template: '',
  styles: `
    :host {
      display: block;
      border: var(--border);
    }
  `,
})
export class TerminalComponent implements OnInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly data = input<string>();

  readonly sizeChange = output<TerminalSize>();
  readonly dataChange = output<string>();

  private readonly terminal = new Terminal({
    convertEol: true,
    theme: {
      background: '#fefdfc',
      cursor: '#010003',
      cursorAccent: '#fefdfc',
      foreground: '#010003',
      selectionBackground: '#d6e5f3',
      selectionInactiveBackground: '#dfe5eb',
    },
  });
  private readonly fitAddon = new FitAddon();

  constructor() {
    effect(() => {
      const data = this.data();
      if (data != null) {
        this.terminal.write(data);
      }
    });
  }

  @HostListener('window:resize') resize(): void {
    this.fitAddon.fit();
    this.sizeChange.emit({
      cols: this.terminal.cols,
      rows: this.terminal.rows,
    });
  }

  ngOnInit(): void {
    this.terminal.loadAddon(this.fitAddon);
    this.terminal.open(this.elementRef.nativeElement);

    this.terminal.onData(data => this.dataChange.emit(data));

    this.resize();
  }

  ngOnDestroy(): void {
    this.fitAddon.dispose();
    this.terminal.dispose();
  }
}
