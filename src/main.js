'use strict';
/**
 * Manages routing capabilities for web applications by integrating RouterInterface
 * and RouterStore. It provides a unified access point to routing functionalities, encapsulating
 * internal configurations such as module name and version.
 *
 * @module RouterModule
 */

/**
 * @ignore
 */
import {RouterInterface} from "./components/routerInterface.js";
/**
 * @ignore
 */
import {RouterStore} from "./stores/routerStore.js";
/**
 *  Contains metadata about the  RouterModule, including its name and version,
 *  which are used internally and possibly displayed in diagnostics or logging.
 *
 * @private
 * @memberof module:RouterModule
 * @type {{app: {name: string, version: string}}}
 */
const internalStore = {
    app: {
        name: 'SimplyBuilderModuleLibName',
        version: 'SimplyBuilderModuleLibVersion'
    }
};
/**
 * Extracts the name and version of the module from the internal store,
 * making them available for other functions or export within the module.
 *
 * @private
 * @ignore
 */
const {name, version} = internalStore.app;
/**
 * Provides a function to get an instance of the router interface, configured with the RouterStore.
 * This function facilitates the initialization of the router with necessary data and store configuration,
 * encapsulating the complexities of router setup.
 *
 * @function getRouterInstance
 * @memberof module:RouterModule
 * @param {object} [data={}] -  Initialization data for the router.
 * @returns {SimplyBuilderRouterInterface} - An instance of the router interface, ready for use.
 */
const getRouterInstance = (data = {}) => {
    return RouterInterface(data, RouterStore);
};
/**
 * Exports the RouterModule as an immutable object, providing access to the module's name,
 * version, and the ability to get a router interface instance. This structure ensures that
 * the module's integrity is maintained while being used, preventing modifications to its properties.
 *
 * @type {Readonly<{instance: (function({}=): SimplyBuilderRouterInterface), name: string, version: string}>}
 */
export const RouterModule = Object.freeze({
    name, version,
    instance: getRouterInstance
});