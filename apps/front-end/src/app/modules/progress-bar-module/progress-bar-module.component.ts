import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar-module',
  templateUrl: './progress-bar-module.component.html',
  styleUrls: ['./progress-bar-module.component.css'],
})
export class ProgressBarModuleComponent implements OnInit {
  @Input() public show: boolean;
  constructor() {}

  ngOnInit(): void {}
}
