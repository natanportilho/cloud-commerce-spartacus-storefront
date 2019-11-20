import { Injectable } from '@angular/core';
import { BaseSiteService, LanguageService } from '@spartacus/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { CurrentProductService } from '../../../../storefrontlib/src/cms-components/product/current-product.service';
import { StrategyRequest } from '../../cds-models/cds-strategy-request.model';
import { MerchandisingStrategyConnector } from '../connectors/strategy/merchandising-strategy.connector';
import { MerchandisingProducts } from '../model/merchandising.products.model';

@Injectable({
  providedIn: 'root',
})
export class CdsMerchandisingProductService {
  constructor(
    protected strategyConnector: MerchandisingStrategyConnector,
    protected baseSiteService: BaseSiteService,
    protected languageService: LanguageService,
    protected currentProductService: CurrentProductService
  ) {}

  loadProductsForStrategy(
    strategyId: string,
    numberToDisplay?: number
  ): Observable<MerchandisingProducts> {
    return combineLatest([
      this.baseSiteService.getActive(),
      this.languageService.getActive(),
    ]).pipe(
      map(([site, language]: [string, string]) => {
        const strategyRequest: StrategyRequest = {
          site,
          language,
          pageSize: numberToDisplay,
        };
        return strategyRequest;
      }),
      switchMap(context =>
        this.strategyConnector.loadProductsForStrategy(strategyId, context)
      )
    );
  }

  getCurrentProduct(): Observable<MerchandisingProducts> {
    return (
      this.currentProductService
        .getProduct()
        // TODO: not sure if you need this filter?
        .pipe(
          filter(product => Boolean(product)),
          switchMap(_product =>
            // TODO: which endpoint you want to call here? is the strategy ID retrieved from `data.strategy` from the component?
            this.strategyConnector.loadProductsForStrategy(
              'another strategy id?',
              context
            )
          )
        )
    );
  }
}
