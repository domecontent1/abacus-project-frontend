// import { bootstrapApplication } from '@angular/platform-browser';
// import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
// import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
//
// import { routes } from './app/app.routes';
// import { AppComponent } from './app/app.component';
//
// bootstrapApplication(AppComponent, {
//   providers: [
//     { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
//     provideIonicAngular(),
//     provideRouter(routes, withPreloading(PreloadAllModules)),
//   ],
// });


// If this fails, use @angular/platform-browser
import { bootstrapApplication as bootstrapStandalone } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapStandalone(AppComponent, appConfig)
  .catch((err) => console.error(err));
