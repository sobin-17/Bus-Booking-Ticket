// auth.guard.ts
export class AuthGuard {
  router: any;
  canActivate(): boolean {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}