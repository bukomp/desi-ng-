import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-custom-notification',
  templateUrl: './custom-notification.component.html',
  styleUrls: ['./custom-notification.component.css'],
})
export class CustomNotificationComponent implements OnInit {
  @Input() public message: string;
  @Input() public type?: 'warning' | 'error';

  ngOnInit(): void {}
}
