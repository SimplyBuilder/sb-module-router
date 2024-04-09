# @jamilservices/sb-module-router

The `@jamilservices/sb-module-router` is designed to provide a robust and flexible routing system for web applications built with SimplyBuilder. It integrates seamlessly with the SimplyBuilder environment, allowing developers to manage route changes, state transitions, and navigation events efficiently.

#    
[![SimplyBuilder](https://img.shields.io/badge/Author-Gerv%C3%A1sio_J%C3%BAnior-brightgreen?style=flat-square&color=%23fedcba)](https://github.com/jamilservicos)
[![SimplyBuilder](https://img.shields.io/badge/SimplyBuilder-Module-brightgreen?style=flat-square&label=SimplyBuilder&color=%23fedcba)](https://simplybuilder.github.io)
[![SimplyBuilder - sb-module-router](https://img.shields.io/static/v1?label=SimplyBuilder&message=sb-module-router&color=blue&logo=github)](https://github.com/SimplyBuilder/sb-module-router/tree/main)
[![GitHub License](https://img.shields.io/github/license/SimplyBuilder/sb-module-router)](https://github.com/SimplyBuilder/sb-module-router/tree/main/LICENSE)


## Features

- **Dynamic Routing**: Easily manage your app's routes with support for sound path matching.
- **State Management**: Easily obtain the status of your routes and navigations.
- **Event Notifications**: Receive route change events during navigation activities.
- **Simplified API**: Offers a simple API for subscribing to events, registering routes, cleaning listeners, and navigating between registered routes with minimal code.
- **Module Integrity**: The API is frozen to prevent runtime modifications, ensuring the reliability and security of the module.

## Installation

Install this module using pnpm, npm, or yarn:

### pnpm

```bash
pnpm add @jamilservices/sb-module-router
```

### yarn


```bash
npm install @jamilservices/sb-module-router
```

### yarn

```bash
yarn add @jamilservices/sb-module-router
```            

> [!NOTE]
> This will add the `@jamilservices/sb-module-router` as a development dependency in your project.

### ESM Import Module

#### CDN:
You can use the following CDN links to include the module:

~~~text
https://cdn.skypack.dev/@jamilservices/sb-module-router@latest/lib/main.min.js

https://cdn.jsdelivr.net/npm/@jamilservices/sb-module-router@latest/lib/main.min.js

https://unpkg.com/@jamilservices/sb-module-router@latest/lib/main.min.js
~~~  

#

## Usage

### Importing the Module


- From install (pnpm/npm/yarn):
```javascript
import { RouterModule } from '@jamilservices/sb-module-router';
```


- From CDN:
```javascript
import { RouterModule } from 'https://cdn.jsdelivr.net/npm/@jamilservices/sb-module-router@latest/lib/main.min.js';
```

### Creating/Retrieving the Router Instance

```javascript
const router = RouterModule.instance();
```

### Subscribe to Router Events

```javascript
router.events.subscribe({
    id: "uniqueListenerId",
    fn: data => console.log("Router data:", data)
});
```

### Unsubscribe from Router Events

```javascript
router.events.unsubscribe("uniqueListenerId");
```

### Register a Route

```javascript
router.register("home");
```          
OR           
```javascript
router.register({
    id: "home",
    title: "Test Home Router Title"
});
```          

### UnRegister a Route

```javascript
router.unregister("home");
```          

### Redirect a Route

```javascript
router.register({
    id: "404",
    redirect: "home"
});
```                   

### Navigate to a Route

```javascript
router.navigate("home");
```          

### Get the Current and Previous Route

```javascript
router.state();
```                   


## API Documentation

### `RouterModule.instance({home: string, prefix: string}): SimplyBuilderRouterInterface`

- **Description**: Creates/retrieves and returns a new/existing router instance.
- **Object propertie**:
    - `home`: Optional - Default route for the application. Defaults to `/` if not specified.    
    - `prefix`: Optional - A prefix to include between the route and the hash.


### `instance.state(): Object`

- **Description**: Returns an object with the keys: `current` and `previous`.

### `instance.navigate(id: string): Boolean`

- **Description**: Navigates to a registered route.


### `instance.register(id: string| {id: string, title: string, redirect: string}): Boolean`

- **Description**: Registers a route using either a string or an object for more options.
- **Object Properties**:
    - `id`: Required - URL route, e.g., "home" or "contact".
    - `title`: Optional - Title to set if the route is called successfully.
    - `redirect`: Optional - Internal route redirection for internal and/or SEO purposes.              



### `instance.unregister(id: string): Boolean`

- **Description**: Removes a registered route for maintenance or private purposes.         


### `instance.events.subscribe({id: string, fn: function}): Void`

- **Description**: Subscribes to router events.  
- **Evemt Data**: Returns an object with the `id` property (event identifier values `router-update` or `not-found`) and `target`, which is the registered ID of the final route.
- **Object Properties**:
    - `id`: Required - Unique identifier for the function receiving the event.
    - `fn`: Required - Function that will receive the event.


### `instance.events.unsubscribe(id: string): Boolean`

- **Description**: Unsubscribes from router events for the given ID.



### Contribution Guidelines

Interested in contributing? We welcome your contributions to enhance the frontend capabilities of `@jamilservices/sb-module-router`.     
Please check our [Contribution Guidelines](https://github.com/SimplyBuilder/sb-module-router/tree/main/CONTRIBUTING.md) for more details.

### License

`@jamilservices/sb-module-router` is available under the [MIT License](https://github.com/SimplyBuilder/sb-module-router/tree/main/LICENSE) by [@jamilservicos](https://github.com/jamilservicos).

- You are free to modify and reuse the code.
- The original license must be included with copies of this software.
- We encourage linking back to this repository if you use a significant portion of the source code.