# Slack deploy bot

> Use a Slack bot for deploy your apps for your team.


1. Create a new bot for your team in https://my.slack.com/services/new/bot
2. Clone this repostory.
3. Run `yarn` for install all dependencies.
4. Rename `.env.example` to `.env` and change *TOKEN* env to your Slack token.
5. Rename `apps.example.js` to `app.js` and define your production apps.
6. Run `yarn start` for execute bot.

In your application, create `deploy.sh` file in root dir. Inside this file, define your commands for deploy your app, e.g:

```
git pull
php artisan migrate
```

In Slack, invite your bot for an channel. Now, in channels with bot, the follow commands are added:

```
d:push <app-name> # run deploy.sh from app-name in your server
d:exec <app-name> <command> # run command from app-name in your server
```