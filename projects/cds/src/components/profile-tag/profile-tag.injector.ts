import { Injectable } from '@angular/core';
import { BaseSiteService, WindowRef, AnonymousConsentsService } from '@spartacus/core';
import { filter } from 'rxjs/operators';
import { CdsConfig, ProfileTagConfig } from '../../config/config.model';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
<<<<<<< HEAD
export class ProfileTagInjector {
=======
export class ScriptService {
>>>>>>> 6a0469c59a3bb5d43f3c6c63b5f9b7a0d2bb5a93
  profiletagConfig: ProfileTagConfig
  bannerVisible$: Observable<boolean>
  constructor(
    private winRef: WindowRef,
    private config: CdsConfig,
    private baseSiteService: BaseSiteService,
    private router: Router,
    private anonymousConsentsService: AnonymousConsentsService
  ) {
    this.profiletagConfig = this.config.cds.profileTag;
    this.addTracker();
    this.addScript();
<<<<<<< HEAD
    this.bannerVisible$ = this.anonymousConsentsService.isBannerVisible();
=======
    this.bannerVisible$ = this.anonymousConsentsService.isAnonymousConsentsBannerVisible();
>>>>>>> 6a0469c59a3bb5d43f3c6c63b5f9b7a0d2bb5a93
  }

  private addTracker(): void {
    this.baseSiteService
      .getActive()
      .pipe(filter(Boolean))
      .subscribe((site: string) => {
        const newConfig: ProfileTagConfig = { ...this.profiletagConfig };
        newConfig.siteId = site;
        this.track(newConfig);
      });
  }

  private addScript(): void {
    const doc: Document = this.winRef.document;
    const profileTagScript: HTMLScriptElement = doc.createElement('script');
    profileTagScript.type = 'text/javascript';
    profileTagScript.async = true;
    profileTagScript.src = this.profiletagConfig.javascriptUrl;

    doc.getElementsByTagName('head')[0].appendChild(profileTagScript);
  }

  private track(options: ProfileTagConfig) {
    const w: any = this.winRef.nativeWindow;
    w.Y_TRACKING = function () {
      (w.Y_TRACKING.q = w.Y_TRACKING.q || []).push(arguments);
    };
    const spaOptions = {
      ...options, spa: true, profileTagEventReciever: this.profileTagEventTriggered.bind(this)
    }
    w.Y_TRACKING(spaOptions);
  }

  private profileTagEventTriggered(profileTagEvent) {
    switch (profileTagEvent.eventName) {
      case 'Loaded':
        this.addProfileTagListeners();
        break;
      default:
        //add logger from spartacus. this.logger.info(`Unsupported Event ${profileTagEvent.eventName}`)
        break;
    }
  }

  private addProfileTagListeners() {
    {
      const w: any = this.winRef.nativeWindow;
      this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
        w.Y_TRACKING.push({ event: 'Navigated' });
      });
      this.bannerVisible$.subscribe((visible: Boolean) => {
        w.Y_TRACKING.push({ event: 'ConsentChanged', granted: !visible });
      });
    }
  }
}