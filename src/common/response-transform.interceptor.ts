import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, any>
{
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        if (data.results && data.pagination) {
          return {
            success: true,
            data: data.results,
            pagination: data.pagination,
          };
        } else {
          return {
            success: true,
            data,
          };
        }
      }),
    );
  }
}
