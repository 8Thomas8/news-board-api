import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UsersService {
  async getUserInformations(req: Request) {
    const cookie = req.cookies['Authentication'];
    console.log(cookie);

    // TODO : Il faut vérifier que le token est valide et récupérer les info de l'user pour les retourner dans le body de la réponse.
    return 'test';
  }
}
