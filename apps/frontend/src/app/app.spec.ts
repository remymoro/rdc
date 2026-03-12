import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { AuthRepository } from './application/ports/auth.repository';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: AuthRepository,
          useValue: {
            login: () => of({ auth: { accessToken: '', tokenType: 'Bearer', expiresIn: 0 }, user: { id: '', email: '', role: 'ADMIN' } }),
            refresh: () => of({ auth: { accessToken: '', tokenType: 'Bearer', expiresIn: 0 }, user: { id: '', email: '', role: 'ADMIN' } }),
            logout: () => of(void 0),
            me: () => of({ id: '', email: '', role: 'ADMIN' as const }),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render router outlet', () => {
    const fixture = TestBed.createComponent(App);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });
});
