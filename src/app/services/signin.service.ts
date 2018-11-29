import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient , HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SigninService implements CanActivate{

  constructor(private httpClient: HttpClient,  private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // if (localStorage.getItem('token')) {
     console.log("emp after logouit = "+localStorage.getItem("EmpName"));
    if ( localStorage.getItem("EmpName")!=null) {
      return true;
    } else {
      this.router.navigate(['login']);
    }
  }
}
