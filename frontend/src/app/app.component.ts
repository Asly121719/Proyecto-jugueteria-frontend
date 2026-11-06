import { Component } from '@angular/core';
import { ShellComponent } from './layouts/shell/shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShellComponent],
  template: `<app-shell></app-shell>`,
  styles: []
})
export class AppComponent {
  title = 'ToyStore Admin';
}