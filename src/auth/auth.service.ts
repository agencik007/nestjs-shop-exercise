import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/user/user.entity';
import { hashPwd } from 'src/utils/hash-pwd';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtPayload } from './jwt.strategy';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { id: currentTokenId }
    const expiresIn = 60 * 60 * 24;
    // ten sam klucz co w jwt.strategy.ts
    // normalnie nie udostępniamy takiego klucza, powinien być np. w zmiennych środowiskowych
    const accessToken = sign(payload, 'R:R:@)^,s%DeN/Yo:kuXt}W8_veoE^E=aEg>_[$!*azo.KJ{WB', { expiresIn })

    return {
        accessToken,
        expiresIn,
    }
  }

  private async generateToken(user: User): Promise<string> {
    let token;
    let userWithThisToken = null;
    do {
        token = uuid()
        userWithThisToken = await User.findOne({ where: { currentTokenId: token }})
    } while (!!userWithThisToken);
    user.currentTokenId = token;
    await user.save();

    return token;
  }

  async login(req: AuthLoginDto, res: Response): Promise<any> {
    try {
      const user = await User.findOne({
        where: {
          email: req.email,
          pwdHash: hashPwd(req.pwd),
        },
      });

      if (!user) {
        return res.json({ error: 'Invalid login data!' });
      }

      const token = this.createToken(await this.generateToken(user));

      return res
        .cookie('jwt', token.accessToken, {
          // jeżeli jest używane HTTPS to true, inaczej false
          secure: false,
          domain: 'localhost',
          httpOnly: true,
        })
        .json({ ok: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }

  async logout(user: User, res: Response) {
    try {
      user.currentTokenId = null;
      await user.save();

      res.clearCookie(
        'jwt', 
        {
          secure: false,
          domain: 'localhost',
          httpOnly: true,
        }
      );
      return res.json({ ok: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }
}
