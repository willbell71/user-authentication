import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ContentResponse } from '../core/content-services/content-response';
import { ContentService } from '../core/content-services/content.service';
import { LogoutService } from '../core/logout-services/logout.service';

/**
 * Dashboard component class.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // @member {string} title - content title.
  public title: string;
  // @member {string} body - content body.
  public body: string;

  /**
   * Constructor.
   */
  constructor(private contentService: ContentService,
              private logoutService: LogoutService,
              private router: Router) {}

  /**
   * On init lifecycle callback.
   */
  public ngOnInit(): void {}

  /**
   * Get some data that requires authentication.
   */
  public getSomething(): void {
    this.contentService
      .getContent()
      .subscribe((content: ContentResponse) => {
        this.title = content.title;
        this.body = content.body;
      }, () => {
        // TODO - handle errors
      });
  }

  /**
   * Log out the user.
   */
  public logout(): void {
    this.logoutService
      .logout()
      .subscribe(() => this.router.navigate(['/login']),
      () => {
        // TODO - handle error
      });
  }
}
