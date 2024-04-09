// noinspection DuplicatedCode

'use strict';
/**
 * Manages routing for web applications by providing a high-level interface to handle URL changes,
 * state transitions, and event notifications. It leverages the RouterHandler for underlying operations.
 *
 * @module RouterInterface
 */

/**
 * Imports RouterHandler to manage routing operations and events.
 * @private
 */
import {RouterHandler} from "./routerHandle.js";
/**
 * Symbol to denote router initialization procedures.
 * @type {symbol}
 * @private
 */
const routerInitSymbol = Symbol("routerInit");
/**
 * Symbol to hold the singleton instance of the router.
 * @type {symbol}
 * @private
 */
const routerInstanceSymbol = Symbol("routerInstance");
/**
 * Symbol for accessing the router's internal store.
 * @type {symbol}
 * @private
 */
const routerStoreSymbol = Symbol("routerStore");
/**
 * Symbol for accessing the router's notification system.
 * @type {symbol}
 * @private
 */
const routerNofitySymbol = Symbol("routerNotify");
/**
 * Central storage for router-related data including instances and configuration settings.
 *
 * @type {object}
 * @private
 * @memberof module:RouterInterface
 */
const internalStore = {
    [routerInstanceSymbol]: undefined,
    [routerStoreSymbol]: {},
    [routerNofitySymbol]: RouterHandler.events,
    title: undefined
};
/**
 * Contains functions to handle registration of different data types to the router.
 *
 * @type {object}
 * @private
 * @memberof module:RouterInterface
 */
const registerDataTypes = {
    'object': (data) => {
        const {id} = data;
        if(typeof internalStore[routerStoreSymbol].register === "function" && internalStore[routerStoreSymbol].register(data)) {
            if (id === "home") RouterHandler.settings({home: id});
            return true;
        }
    },
    'string': (id) => {
        if(typeof internalStore[routerStoreSymbol].register === "function" && internalStore[routerStoreSymbol].register({id})) {
            if (id === "home") RouterHandler.settings({home: id});
            return true;
        }
    }
};
/**
 * Initializes the router, setting up necessary configurations and event listeners.
 *
 * @function routerInit
 * @memberof module:RouterInterface
 * @param {object} data - Initialization data for the router.
 */
const routerInit = (data) => {
    if(typeof internalStore.title === "undefined") internalStore.title = document.title;
    const {hashChange, syncRouter, settings} = RouterHandler;
    const {current, events} = internalStore[routerStoreSymbol];
    if(typeof settings === "function") settings({...data, title: internalStore.title});
    if(typeof events === "function") events(syncRouter);
    if(typeof current === "function" && typeof hashChange === "function") {
        window.addEventListener('hashchange', () => {
            hashChange({current});
        });
        window.addEventListener('load', () => {
            hashChange({current});
        });
    }
};
/**
 * Registers data with the router based on the type of data provided.
 *
 * @function routerRegister
 * @memberof module:RouterInterface
 * @param {object|string} data - Data to be registered with the router.
 * @returns {boolean} - True if the registration is successful, false otherwise.
 */
const routerRegister = (data) => {
    const typeOf = (typeof data).toString();
    if(registerDataTypes[typeOf]) {
        return registerDataTypes[typeOf](data);
    }
    return false;
};
/**
 * Unregisters data from the router based on the provided ID.
 *
 * @function routerUnRegister
 * @memberof module:RouterInterface
 * @param {string} id - The ID of the data to unregister.
 * @returns {boolean} - True if the unregistration is successful, false otherwise.
 */
const routerUnRegister = (id) => {
    if(typeof internalStore[routerStoreSymbol].unregister === "function" && internalStore[routerStoreSymbol].unregister({id})) {
        if (id === "home") RouterHandler.settings({home: "/"});
        return true;
    }
    return false;
};
/**
 * Navigates to a specified ID within the application.
 *
 * @function routerNavigate
 * @memberof module:RouterInterface
 * @param {string} id - The ID to navigate to.
 * @returns {boolean} - True if navigation is successful, false otherwise.
 */
const routerNavigate = (id) => {
    if(typeof internalStore[routerStoreSymbol].current === "function" && internalStore[routerStoreSymbol].current) {
        if (typeof id === "string" && id.trim().length >= 1) return internalStore[routerStoreSymbol].current(id.trim());
    }
    return false;
};
/**
 * Retrieves the current state of the router.
 *
 * @function routerState
 * @memberof module:RouterInterface
 * @returns {object} - The current state of the router.
 */
const routerState = () => {
    if(typeof internalStore[routerStoreSymbol].state === "function" && internalStore[routerStoreSymbol].state) {
        return internalStore[routerStoreSymbol].state();
    }
};
/**
 * Defines the SimplyBuilderRouterInterface class, which encapsulates router functionality.
 *
 * @class SimplyBuilderRouterInterface
 */
class SimplyBuilderRouterInterface {
    [routerInitSymbol](data = {}) {
        routerInit(data);
    }
    register(data) {
        return routerRegister(data);
    }
    unregister(id) {
        return routerUnRegister(id);
    }
    navigate(id) {
        return routerNavigate(id);
    }
    state() {
        return routerState();
    }
    /**
     * Constructs a new instance and initializes it.
     *
     * @param {object} [data={}] -  Initialization data for the router.
     */
    constructor(data = {}) {
        Object.defineProperty(this, 'instanceOf', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: new.target.name
        });
        Object.defineProperty(this, 'immutable', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: () => {
                if (!Object.isFrozen(this)) {
                    Object.freeze(this);
                }
                return true;
            }
        });
        Object.defineProperty(this, 'events', {
            enumerable: false,
            configurable: false,
            get: () => internalStore[routerNofitySymbol]
        });
        this[routerInitSymbol](data);
    }
}
/**
 * @private
 * @ignore
 */
Object.defineProperty(SimplyBuilderRouterInterface, Symbol.hasInstance, {
    get: () => (instance) => instance.constructor.name === instance.instanceOf
});
/**
 * Provides a global access point to get or create an instance of the router interface.
 *
 * @function getRouterInstance
 * @memberof module:RouterInterface
 * @param {object} [data={}] - Initialization data.
 * @param {object} [store={}] - Store configuration.
 * @returns {SimplyBuilderRouterInterface} - An instance of the router interface.
 */
const getRouterInstance = (data = {}, store = {}) => {
    if(internalStore[routerInstanceSymbol] && internalStore[routerInstanceSymbol].instanceOf === "SimplyBuilderRouterInterface") {
        return internalStore[routerInstanceSymbol];
    }
    internalStore[routerStoreSymbol] = store;
    const instance = new SimplyBuilderRouterInterface(data);
    instance.immutable();
    internalStore[routerInstanceSymbol] = instance;
    return instance;
};
/**
 * Exports the RouterInterface function, allowing initialization and configuration of the router interface.
 *
 * @type {function(Object=, Object=): SimplyBuilderRouterInterface}
 */
export const RouterInterface = Object.freeze(getRouterInstance);