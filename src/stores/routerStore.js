// noinspection DuplicatedCode

'use strict';
/**
 * Provides a comprehensive routing management system for single-page applications.
 * This module tracks navigation states such as current and previous paths, handles redirection,
 * and facilitates state transitions based on predefined routing configurations. The module
 * encapsulates its logic and state management through private symbols and internal storage structures,
 * ensuring encapsulation and modularization of routing logic.
 *
 * @module RouterStore
 */

/**
 * @private
 */
const listenerComponentSymbol = Symbol("listenerComponent");
/**
 * Maintains the state of the router, including the current and previous paths, using a symbol to secure the listener.
 * @private
 * @memberof module:RouterStore
 * @type {Object}
 * @property {string|undefined} current - The current path of the router.
 * @property {string|undefined} previous - The previous path of the router.
 */
const internalStore = {
    [listenerComponentSymbol]: undefined,
    current: undefined,
    previous: undefined
};
/**
 * Key-value store mapping path strings to their respective configuration objects,
 * facilitating quick lookups and updates to routing paths and their properties.
 *
 * @private
 * @memberof module:RouterStore
 * @type {Object}
 */
const routerPathStore = {};
/**
 * Registers a single listener function that will be notified of routing updates.
 * This function sets up the listener for state changes within the router, ensuring that
 * the listener is only set once and is not overwritten.
 *
 * @function listenerEvent
 * @memberof module:RouterStore
 * @param {Function} listener - The function to call when the route changes.
 */
const listenerEvent = (listener) => {
    if(typeof listener === 'function' && typeof internalStore[listenerComponentSymbol] === "undefined") {
        internalStore[listenerComponentSymbol] = listener;
    }
};
/**
 * Updates the router's state by setting the current and previous path variables
 * and then invokes the registered listener to handle the transition. This method is central
 * to the functionality of routing, enabling dynamic response to path changes.
 *
 * @private
 * @function updateStoreAndPublish
 * @memberof module:RouterStore
 * @param {Object} data - Contains path and event details for the update.
 * @returns {boolean} - Returns true on successful update.
 */
const updateStoreAndPublish = (data = {}) => {
    const {path, event} = data;
    internalStore.previous = internalStore.current;
    internalStore.current = path;
    internalStore[listenerComponentSymbol]({
        event,
        message: routerPathStore[path.toString()]
    });
    return true;
};
/**
 * Forces a redirection to the 'home' path, commonly used as a fallback route.
 * This method simplifies the process of resetting the router to a default state.
 *
 * @private
 * @function forceHomeWithoutId
 * @memberof module:RouterStore
 * @returns {boolean} - Returns true on successful redirection to home.
 */
const forceHomeWithoutId = () => {
    internalStore.previous = internalStore.current;
    internalStore.current = "home";
    internalStore[listenerComponentSymbol]({
        event: "router-update",
        message:{event: "router-update", id: "/"}
    });
    return true;
};
/**
 * Handles conditional path redirection based on the provided data. This function
 * checks for a valid redirection path and performs the redirection if applicable, providing a
 * flexible mechanism for dynamic route management.
 *
 * @private
 * @function pathRedirect
 * @memberof module:RouterStore
 * @param {Object} data - Contains path and potential redirect information.
 * @returns {boolean} - Returns true on successful redirection or update.
 */
const pathRedirect = (data = {}) => {
    const {path, redirect} = data;
    if(typeof redirect === "string") {
        if (routerPathStore[redirect]) return currentUpdate(redirect);
        if(redirect === "home") return forceHomeWithoutId();
    }
    return updateStoreAndPublish({...data, event: "router-update", path});
}
/**
 * Directs the router to handle non-existent routes by either navigating to 'home'
 * or setting the router to a 404 Not Found state based on configuration. This method ensures
 * robust handling of undefined paths and errors in routing.
 *
 * @private
 * @function forceHomeOrSetNotFound
 * @memberof module:RouterStore
 * @param {string} path - The path to evaluate.
 * @returns {boolean} - Returns true if handled successfully, otherwise handles 404 state.
 */
const forceHomeOrSetNotFound = (path) => {
    if(typeof path === "string" && path === "home") return forceHomeWithoutId();
    if (routerPathStore["404"]) {
        const data = routerPathStore["404"];
        if(data.redirect) return pathRedirect({...data, path: "404"});
        return updateStoreAndPublish({...data, event: "router-update", path: "404"});
    }
    return updateStoreAndPublish({event: "not-found", path: "404",});
};

/**
 * Retrieves the current and previous router states as an object, providing a snapshot
 * of the routing history which can be useful for debugging or conditional rendering logic in the application.
 *
 * @function getState
 * @memberof module:RouterStore
 * @returns {{current: string|undefined, previous: string|undefined}}
 */
const getState = () => {
    const {current, previous} = internalStore;
    return {current, previous};
};
/**
 * Prepares and validates path data for registration, ensuring that paths are stored
 * with necessary metadata and are readily available for routing logic.
 *
 * @private
 * @function preparePathData
 * @memberof module:RouterStore
 * @param {Object} data - The path data containing an ID, title, and optional redirect.
 * @returns {Object} - Returns an object with validated path data or an empty object if invalid.
 */
const preparePathData = (data = {}) => {
    const {id, title, redirect} = data;
    if(typeof id === "string" && id.trim().length >= 1) {
        const schema = {
            id: id.trim(),
            redirect: undefined,
            title: undefined,
            maintenance: {}
        };
        if (typeof title === "string" && title.trim().length >= 1) schema.title = title.trim();
        if (typeof redirect === "string") schema.redirect = redirect;
        return schema;
    }
    return {};
};
/**
 * Registers a new path with its configuration to the router store, enabling
 * the router to manage this new path along with its associated routing logic.
 *
 * @function storeRegister
 * @memberof module:RouterStore
 * @param {Object} data - The data for the path to storeRegister.
 * @returns {boolean} - Returns true on successful registration.
 */
const storeRegister = (data = {}) => {
    const {id} = data;
    const pathData = preparePathData(data);
    if(pathData?.id) {
        routerPathStore[id.toString()] = pathData;
        return true;
    }
    return false;
};
/**
 * Removes a previously registered path from the router store, ensuring that the
 * router does not process any more route changes associated with this path.
 *
 * @function storeUnRegister
 * @memberof module:RouterStore
 * @param {string} id - The ID of the path to storeUnRegister.
 * @returns {boolean} - Returns true on successful unregistration.
 */
const storeUnRegister = (id) => {
    if(routerPathStore[id.toString()]) delete routerPathStore[id.toString()];
    return true;
};

const backendSync = (req = {}) => {
    const {path, backend} = req;
    return backend(path).then(res => {
        const {id, redirect} = res;
        if (id && typeof routerPathStore[id.toString()] === "undefined" && storeRegister(res)) {
            const data = routerPathStore[id.toString()];
            if(redirect) return pathRedirect({...data, path: id});
            return updateStoreAndPublish({...data, event: "router-update", path: id});
        }
        return forceHomeOrSetNotFound('404');
    });
}

const currentUpdate = (data = {}) => {
    const {path, backend} = data;
    if(path) {
        if(typeof backend === "function") return backendSync(data);
        if (routerPathStore[path.toString()]) {
            const data = routerPathStore[path.toString()];
            if(data.redirect) return pathRedirect({...data, path});
            return updateStoreAndPublish({...data, event: "router-update", path});
        }
        return forceHomeOrSetNotFound(path);
    } else return forceHomeOrSetNotFound('404');
};

/**
 * Provides a publicly accessible, immutable interface to the router's functionality,
 * encapsulating internal methods and allowing controlled interaction through exposed functions.
 *
 * @type {Readonly<Object>}
 */
export const RouterStore = Object.freeze({
    events: listenerEvent,
    current: currentUpdate,
    state: getState,
    register: storeRegister,
    unregister: storeUnRegister
});