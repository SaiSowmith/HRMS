import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { NavItem } from './nav-item';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { WebDriverLogger } from 'blocking-proxy/built/lib/webdriver_logger';

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.css'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})

export class MenuListItemComponent {
  expanded: boolean;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem;
  @Input() depth: number;

  constructor(
    public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  onItemSelected(item: NavItem) {

    if (!item.children || !item.children.length) {
      console.log("data= " + item.route)
      if (item.route == "employeeleaves") {
        this.router.navigate(['main/employeeleaves']);

      } else if (item.route == "second") {
        this.router.navigate(['main/leaves']);
      }
      else if (item.route == "reports") {
        this.router.navigate(['main/reports']);
      }
      else if (item.route == "dashboard") {
        this.router.navigate(['main/dashboard']);
      }
      else if (item.route == "leaves") {
        this.router.navigate(['admin/leaves']);
      }
      else if (item.route == "reports") {
        this.router.navigate(['reports']);
      }
      else if (item.route == "logout") {
        localStorage.clear();
        this.router.navigate(['']);
      }
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }
}

