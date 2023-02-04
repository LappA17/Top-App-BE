import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {}

//мы сюда AuthGuard('jwt') передаём тип АусГарда
