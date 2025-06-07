import { HttpHandlerFn, HttpEvent, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { firstValueFrom, from, lastValueFrom, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  // Skip the interceptor for requests to other APIs
  if (!req.url.startsWith(environment.apiBaseUrl)) {
    return next(req);
  }

  // Skip the interceptor for requests to the auth endpoint
  if (req.url.includes('/auth/') || (req.url.endsWith('/users') && req.method === 'POST')) {
    return next(req);
  }

  return from(handle(req, next));
};

const handle = async (req: HttpRequest<unknown>, next: HttpHandlerFn): Promise<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  let accessToken: string;
  try {
    accessToken = await firstValueFrom(authService.getAccessToken());
  }
  catch (error) {
    if (req.url.includes('/riddles/')) {
      // If the request is for riddles and we don't have a valid access token, we can skip the request
      // because authentication is optional for riddles
      return lastValueFrom(next(req));
    }
    console.error(error);
    throw new Error('No valid access token found');
  }

  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
  });

  return lastValueFrom(next(authReq));
};
