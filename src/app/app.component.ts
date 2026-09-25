import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'churchwebsite';

  constructor() {
    if (typeof window !== 'undefined' && window.location.protocol === 'http:') {
      const host = window.location.hostname;
      // Auto-redirect to HTTPS on custom domains or CloudFront
      if (!['localhost', '127.0.0.1'].includes(host) && !host.includes('s3-website')) {
        window.location.href = window.location.href.replace('http:', 'https:');
      }
    }
  }
}
