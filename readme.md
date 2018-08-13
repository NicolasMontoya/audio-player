# Audio player - Angular +

Easy and small audio player for Angular 6. The actual support formats are mp3 or ogg.

## Quickstart

You need NodeJS to install the package.

```bash
    npm i -S audio-player
```
**Note:** NPM dowload is temporaly disabled.

Remember add the module in your app.module.

## Use

The audio player have two inputs track and disabled (default = false), you need to put the url of the song in the input track and it is done. 

```html
    <nm-audio-player [track]="http://your_host/toxicity.mp3"></nm-audio-player>
```



