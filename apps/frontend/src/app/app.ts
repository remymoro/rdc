import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthFacade } from './application/facades/auth.facade';

@Component({
  imports: [RouterModule, ButtonModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  readonly auth = inject(AuthFacade);

  ngOnInit(): void {
    this.auth.init();
  }

  logout(): void {
    this.auth.logout();
  }
}
