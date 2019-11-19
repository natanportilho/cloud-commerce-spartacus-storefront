import { of } from 'rxjs/internal/observable/of';
import { Injectable } from '@angular/core';
import { BaseSiteService, LanguageService, Product, RoutingService } from '@spartacus/core';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, filter, distinctUntilChanged, defaultIfEmpty, tap } from 'rxjs/operators';
import { StrategyRequest } from './../../cds-models/cds-strategy-request.model';
import { MerchandisingStrategyConnector } from './../connectors/strategy/merchandising-strategy.connector';
import { MerchandisingProducts } from './../model/merchandising.products.model';
import { CurrentProductService } from '@spartacus/storefront';

@Injectable({
  providedIn: 'root',
})
export class CdsMerchandisingProductService {
  constructor(
    protected strategyConnector: MerchandisingStrategyConnector,
    protected baseSiteService: BaseSiteService,
    protected languageService: LanguageService,
    protected currentProductService: CurrentProductService,
    private routingService: RoutingService
  ) {}

  loadProductsForStrategy(
    strategyId: string,
    numberToDisplay?: number
  ): Observable<MerchandisingProducts> {

    // this.currentProductService.getProduct()
    //     .subscribe(
    //         (product: string) => console.log(`******DEBUG product - ${product}`),
    //         (error: any) => console.log(`*****DEBUG - error - ${error}`),
    //         () => console.log(`******DEBUG - completed`)
    //     )

    // this.currentProductService
    //     .getProduct()
    //         .pipe(
    //             tap(thingy => console.log(`******DEBUG - thingy - ${thingy}`)),
    //         )
    //         .subscribe({
    //             next: (result: any) => console.log(`******DEBUG - onNext - result - ${result}`),
    //             error: (err: any) => console.log(`*****ERROR - error - ${err}`),
    //             complete: () => console.log(`******DEBUG - completed`)
    //         });


    this.getTrueObservable().pipe(
    ).subscribe(
        result => console.log(`*****DEBUG - getTrueObservable - result ${result}`),
        error => console.log(`*****DEBUG - getTrueObservable - error - ${error}`),
        () => console.log(`******DEBUG - getTrueObservable - completed`)
    )
    this.getFalseObservable().pipe(
    ).subscribe(
        result => console.log(`*****DEBUG - getFalseObservable - result ${result}`),
        error => console.log(`*****DEBUG - getFalseObservable - error - ${error}`),
        () => console.log(`******DEBUG - getFalseObservable - completed`)
    )
    this.getProduct()  
        .subscribe(
            result => console.log(`*****DEBUG - getProduct - ${result}`),
            error => console.log(`******DEBUG - getProduct error - ${error}`),
            () => console.log('*****DEBUG - getProduct - completed')
        );

    return combineLatest([
      this.baseSiteService.getActive(),
       this.languageService.getActive()
    //    ,
    //   this.currentProductService.getProduct()    
        // .pipe(
    //       distinctUntilChanged(),
    //       filter(product => product != null),
    //       map(product => product.code)
    //   )
    ]).pipe(
      map(([site, language]: [string, string]) => {
        
        // console.log(`*****DEBUG - productId - ${product}`);
        
        const strategyRequest: StrategyRequest = {
          site,
          language,
          pageSize: numberToDisplay
        //   ,
        //   productId: productId
        };
        return strategyRequest;
      }),
      switchMap(context =>
        this.strategyConnector.loadProductsForStrategy(strategyId, context)
      )
    );
  }

  private getFalseObservable(): Observable<Boolean>{
      return of(false).pipe(
          filter(Boolean));
  }
  private getTrueObservable(): Observable<Boolean>{
      return of(true).pipe(
        filter(Boolean)
      );
  }
  private getProduct(): Observable<string> {
    return this.routingService.getRouterState().pipe(
      map(state => state.state.params['productCode']),
      tap(something => console.log(`******DEBUG - something has been found - ${something}`)),
      //map(result => '12345'),
      filter(Boolean),
      switchMap((productCode: string) => of('product code found'))
    );
  }  
}
