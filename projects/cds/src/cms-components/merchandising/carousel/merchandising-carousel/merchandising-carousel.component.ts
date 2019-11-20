import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Product } from '@spartacus/core';
import { CmsComponentData } from '@spartacus/storefront';
import { Observable, of } from 'rxjs';
import {
  distinctUntilKeyChanged,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';
import { CmsMerchandisingCarouselComponent } from '../../../../cds-models/cms.model';
import { CdsMerchandisingProductService } from './../../../../merchandising/facade/cds-merchandising-product.service';

@Component({
  selector: 'cx-merchandising-carousel',
  templateUrl: './merchandising-carousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchandisingCarouselComponent {
  private componentData$: Observable<
    CmsMerchandisingCarouselComponent
  > = this.componentData.data$.pipe(filter(Boolean));

  title$: Observable<string> = this.componentData$.pipe(
    map(data => data.title)
  );
  numberToDisplay$: Observable<string> = this.componentData$.pipe(
    map(data => data.numberToDisplay)
  );

  items$: Observable<Observable<Product>[]> = this.componentData$.pipe(
    distinctUntilKeyChanged('strategy'),
    switchMap(data => {
      return this.cdsMerchandisingProductService.loadProductsForStrategy(
        data.strategy,
        Number(data.numberToDisplay)
      );
    }),
    map(merchandisingProducts => merchandisingProducts.products),
    map(products => products.map(product => of(product)))
  );

  // TODO: delete this comments: let's keep the constructor after all properties
  constructor(
    protected componentData: CmsComponentData<
      CmsMerchandisingCarouselComponent
    >,
    protected cdsMerchandisingProductService: CdsMerchandisingProductService
  ) {}
}
