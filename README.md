![CanvasPixel](promotion/canvaspixel.png)

# PixelPlanet Admin API

This GitHub repository contains the JavaScript API for the admin-exclusive Socket interface of pixelplanet.fun, a  multiplayer pixel placement game. With this API, you can access player data, get information about the game world, monitor changes made on the map, and perform various administrative tasks.

I developed this interface for my own PixelPlanet website, CanvasPixel.net.

You can access the official open-source repository of the PixelPlanet project from this link: 

https://git.pixelplanet.fun/ppfun

## Getting Started

First of all, you need to have your own pixelplanet.fun clone that you can connect to using this interface. If you haven't set up the pixelplanet code yet, you can access the code from the original pixelplanet.fun repository I mentioned above.

To use this API, you can follow these steps:

* Find your ecosystem.yml in your dist folder and define the config variable "APISOCKET_KEY" as you wish.
* Create your Node project and install the package with: 
  ```console
  npm i ppfun-admin-api
  ```
* Paste the example code into your "index.js" file and you are ready to go!

## Example Usage

```js
const ppfun = require("ppfun-admin-api")
const config = require("./config.json");

const bot = new ppfun.Bot();

// Notify when connected
bot.addListener("open", () => {
    console.log("Connected to the server!")
})

// Log messages
bot.addListener("chatMessage", (message) => {
    console.log(`${message.getAuthor().getName()}: ${message.getContent()}`)
})

// Connect
bot.connect(
    config.url, 
    config.apiKey, 
    ppfun.Subscriptions.CHAT
)
```

## Contributions

We welcome contributions to this project. For more information, please refer to the [Contribution Guide](https://github.com/ByPikod/canvaspixel-chatbot/wiki/Contribution)

## License

This project is licensed under the terms of the MIT License.

You are free to use this project in compliance with the MIT License. If you decide to use, modify, or redistribute this software, you must include a copy of the original license and copyright notice in all copies or substantial portions of the software.

For more information about the MIT License, visit: [MIT License](LICENSE).
