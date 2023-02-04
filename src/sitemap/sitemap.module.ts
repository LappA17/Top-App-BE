import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TopPageModule } from 'src/top-page/top-page.module';
import { SitemapController } from './sitemap.controller';

@Module({
	controllers: [SitemapController],
	imports: [TopPageModule, ConfigModule],
})
export class SitemapModule {}

/*
  imports: [TopPageModel] потому что мы будем работать с TopPageModel в sitemap
  и теперь у нас TopPageModel будет доступен в конструкторе для работы с ним
*/

/*
  Ruslan Postoiuk, [19.10.2022, 08:55:44]:
  RuslanNestJS_bot

  BotFather, [19.10.2022, 08:55:45]:
  Done! Congratulations on your new bot. You will find it at t.me/RuslanNestJS_bot. You can now add a description, about section and profile picture for your bot, see /help for a list of commands. By the way, when you've finished creating your cool bot, ping our Bot Support if you want a better username for it. Just make sure the bot is fully operational before you do this.

  Use this token to access the HTTP API:
  5798767747:AAELwd_7HHxUEBRMQ1AzX0w575BQrWD-5x8
  Keep your token secure and store it safely, it can be used by anyone to control your bot.

  For a description of the Bot API, see this page: https://core.telegram.org/bots/api

  Я создал в телеграме в BotFather своего бота и сразу получил токен 5798767747:AAELwd_7HHxUEBRMQ1AzX0w575BQrWD-5x8
  +
  Я создал чат что бы была возможность туда отправлять уведомления RuslanNestJS_group
*/
