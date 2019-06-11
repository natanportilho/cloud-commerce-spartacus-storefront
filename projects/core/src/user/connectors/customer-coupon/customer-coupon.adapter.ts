import { Observable } from 'rxjs';
import {
  CustomerCouponSearchResult,
  CustomerCouponNotification,
} from '../../../model/customer-coupon.model';

export abstract class CustomerCouponAdapter {
  abstract getCustomerCoupons(
    userId: string,
    pageSize: number,
    currentPage: number,
    sort: string
  ): Observable<CustomerCouponSearchResult>;

  abstract turnOnNotification(
    userId: string,
    couponCode: string
  ): Observable<CustomerCouponNotification>;

  abstract turnOffNotification(
    userId: string,
    couponCode: string
  ): Observable<{}>;
}
