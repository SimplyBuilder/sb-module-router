// noinspection DuplicatedCode

'use strict';
/**
 * Handles routing for single-page applications by managing path redirections, state transitions,
 * and URL manipulations based on hash changes. It integrates with the NotifyModule to emit router-specific events.
 *
 * @module RouterHandle
 */
/**
 * Instance of NotifyModule used to manage and emit events related to router activities.
 *
 * @private
 */
import {NotifyModule} from "@jamilservices/sb-module-notify";
/**
 * Instance of NotifyModule for router events.
 *
 * @private
 */
const routerEvents = NotifyModule.instance("router");
/**
 * Internal storage for router configuration and state.
 *
 * @type {object}
 * @private
 * @memberof module:RouterHandle
 * @property {string} home - Default home path as a fallback.
 * @property {string|undefined} prefix - Optional URL prefix for all paths.
 * @property {string} title - Default title to use when no specific title is provided for a route.
 * @property {string|undefined} last - Last navigated path to avoid redundant navigation events.
 */
const internalStore = {
    home: '/',
    root: '/',
    prefix: undefined,
    title: "Home",
    last: undefined
};
/**
 * Validates if a given string is not empty and is properly trimmed.
 *
 * @private
 * @function isValidString
 * @memberof module:RouterHandle
 * @param {string} str - The string to validate.
 * @returns {boolean} - True if the string is non-empty after trimming, false otherwise.
 */
const isValidString = (str) => {
    return typeof str === "string" && str.trim().length >= 1;
};
/**
 * Removes the leading slash from a path string, if present.
 *
 * @private
 * @function removeFirstSlash
 * @memberof module:RouterHandle
 * @param {string} path - The path from which to remove the slash.
 * @returns {string|undefined} - The path without the leading slash, or undefined if the path is invalid.
 */
const removeFirstSlash = (path) => {
    if(isValidString(path)) {
        if (path.startsWith("/")) return path.trim().slice(1);
        return path.trim();
    }
    return undefined;
};
/**
 * Regular expression used to remove a set prefix from a path, initialized based on current prefix.
 *
 * @private
 * @type {RegExp|null}
 */
const removePrefixRegex = internalStore.prefix ? new RegExp(`^${internalStore.prefix}/?`) : null;

/**
 * Removes escaped_fragment from a given path.
 *
 * @private
 * @function removeEscapedFragment
 * @memberof module:RouterHandle
 * @param {string} path - The path to process.
 * @returns {string} - The path without escaped_fragment.
 */
const removeEscapedFragment = (path) => {
    if(path.startsWith("!")) return path.replace("!", "");
    return path;
};

/**
 * Removes an internally stored prefix from a given path.
 *
 * @private
 * @function removePrefix
 * @memberof module:RouterHandle
 * @param {string} path - The path to process.
 * @returns {string} - The path with the prefix removed, defaults to "home" if the path is invalid.
 */
const removePrefix = (path) => {
    const {prefix} = internalStore;
    const pathWithoutEscapedFragment= removeEscapedFragment(path);
    if(isValidString(pathWithoutEscapedFragment)) {
        let cleanPath = removeFirstSlash(pathWithoutEscapedFragment);
        if(prefix && removePrefixRegex) cleanPath = cleanPath.replace(removePrefixRegex, "");
        if (isValidString(cleanPath)) return cleanPath.toString();
    }
    return "home";
};
/**
 * Retrieves the formatted home path, ensuring it starts with a single slash.
 *
 * @private
 * @function getHomePath
 * @memberof module:RouterHandle
 * @returns {string} - The correctly formatted home path.
 */
const getHomePath = () => {
    const home = removeFirstSlash(internalStore.home);
    if(isValidString(home)) return "/"+ home;
    return "/";
};
/**
 * Adds an internal prefix to a target path, handling special cases for "404" and "home" paths.
 *
 * @private
 * @function addPrefix
 * @memberof module:RouterHandle
 * @param {string} target - The target path to prefix.
 * @returns {string|undefined} - The prefixed path, or undefined if the target path is invalid.
 */
const addPrefix = (target) => {
    const path = removePrefix(target);
    if(isValidString(path)) {
        if(path === "404") return path;
        if(path === "home") {
            const home = getHomePath();
            if(internalStore.prefix) return internalStore.prefix + home;
            return home;
        }
        if(internalStore.prefix) {
            return internalStore.prefix + "/"+ path;
        }
        return path;
    } else return undefined
};
/**
 * Constructs a complete hash path for a given target path, suitable for hash-based routing.
 *
 * @private
 * @function mountHashPath
 * @memberof module:RouterHandle
 * @param {string} target - The target path.
 * @returns {string} - The fully constructed hash URL.
 */
const mountHashPath = (target) => {
    const path = addPrefix(target);
    if(isValidString(path)) {
        if(path === "404") return internalStore.root + "#/404";
        return internalStore.root +"#/"+ removeFirstSlash(path);
    } else {
        const home = getHomePath();
        return internalStore.root +"#"+ home;
    }
};
/**
 * Extracts the path from the window location's hash, cleaning and validating the result.
 *
 * @private
 * @function getPath
 * @memberof module:RouterHandle
 * @returns {string} -  The extracted path, validated and formatted.
 */
const getPath = () => {
    const path = removePrefix(window.location.hash.slice(1));
    if(isValidString(path)) return path;
};
/**
 * Cleans the target path by removing any leading slashes and validating its content.
 *
 * @private
 * @function cleanTarget
 * @memberof module:RouterHandle
 * @param {string} target - The target path.
 * @returns {string} - The cleaned path, defaulting to "home" if invalid.
 */
const cleanTarget = (target) => {
    const path = removeFirstSlash(target);
    if(isValidString(path)) return path;
    return "home";
};
// noinspection JSUnusedLocalSymbols
/**
 * Object mapping types of router events to their handling functions, which manage URL state and document titles.
 *
 * @private
 * @memberof module:RouterHandle
 * @type {Object}
 */
const storeTypeEvents = {
    "not-found": (data = {}) => {
        const target ='404';
        window.history.pushState({}, null,  mountHashPath(target));
        window.document.title = "Error 404";
        if(internalStore.last !== target) {
            internalStore.last = target;
            routerEvents.emit({
                event: "not-found",
                target: cleanTarget(target)
            });
        }
    },
    "router-update": (data= {}) => {
        const {message, path} = data;
        let target;
        if(typeof message?.id === "string" && message.id !== path) {
            target = message.id;
            window.history.pushState({}, null, mountHashPath(target));
        } else if(path === "home" && window.location.hash.length === 0) {
            target = internalStore.home;
            window.history.pushState({}, null, mountHashPath(target));
        }
        if(typeof message?.id === "string" && typeof target === "undefined") {
            target = message.id;
        }
        if(message?.title?.toString()) {
            window.document.title = message.title.toString();
        } else window.document.title = internalStore.title;
        if(target && internalStore.last !== target) {
            internalStore.last = target;
            routerEvents.emit({
                event: "router-update",
                target: cleanTarget(target)
            });
        }
    }
};
/**
 * Responds to changes in the hash segment of the URL, adjusting router state and triggering appropriate events.
 *
 * @function hashRouterChange
 * @memberof module:RouterHandle
 * @param {object} [data={}] - The event data.
 */
const hashRouterChange = (data = {}) => {
    const {current} = data;
    const path = getPath();
    if(path) current(path);
};
/**
 * Synchronizes router state with changes in the hash segment of the URL, handling specific router events.
 *
 * @function syncRouterHash
 * @memberof module:RouterHandle
 * @param {object} [data={}] - The event data.
 */
const syncRouterHash = (data = {}) => {
    const {event, message} = data;
    if(event && storeTypeEvents[event]) {
        const path = getPath();
        if(path) storeTypeEvents[event]({message, path});
    }
};
/**
 * Updates internal router settings such as the home path, prefix, and default title based on provided data.
 *
 * @function routerSettings
 * @memberof module:RouterHandle
 * @param {object} [data={}] - The settings data.
 */
const routerSettings = (data = {}) => {
    const {home, prefix, title, subpath} = data;
    if(isValidString(home)) internalStore.home = home.trim();
    if(isValidString(prefix)) internalStore.prefix = prefix.trim();
    if(isValidString(title)) internalStore.title = title.trim();
    if(subpath) internalStore.root = "./";
};

/**
 * Provides a publicly accessible, immutable interface to the router handling functionality, ensuring interaction is controlled and predictable.
 *
 * @type {Readonly<Object>}
 */
export const RouterHandler = Object.freeze({
    settings: routerSettings,
    events: {
        subscribe: (data) => routerEvents.subscribe(data),
        unsubscribe: (id) => routerEvents.unsubscribe(id)
    },
    syncRouter: syncRouterHash,
    hashChange: hashRouterChange
});