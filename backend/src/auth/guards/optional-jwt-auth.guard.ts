import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { isObservable, lastValueFrom } from 'rxjs';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const activation = super.canActivate(context);

    if (activation instanceof Promise) {
      return activation.catch(() => true);
    }

    if (isObservable(activation)) {
      return lastValueFrom(activation).catch(() => true);
    }

    return activation;
  }

  handleRequest<TUser>(err: Error | null, user: TUser): TUser | null {
    if (err || !user) {
      return null;
    }
    return user;
  }
}
