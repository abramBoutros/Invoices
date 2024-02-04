import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(@Inject('JwtService') private readonly jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    try {
      const token = request.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('JWT token missing');
      }

      console.log('Received token:', token);

      const decoded = this.jwtService.decode(token);

      if (decoded) {
        request.user = decoded;
        return super.canActivate(context);
      } else {
        throw new UnauthorizedException('Invalid JWT token');
      }
    } catch (error) {
      console.error('JWT decoding error:', error);
      throw new UnauthorizedException('Invalid JWT token');
    }
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
