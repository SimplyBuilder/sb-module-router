/**
 * Represents the configuration for subscribing to router events.
 */
interface EventSubscriptionConfig {
    id: string; // A unique identifier for the subscription.
    fn: (data: any) => void; // The callback function to handle the event data.
}

/**
 * Defines methods for managing event subscriptions within the router.
 */
interface RouterEvents {
    /**
     * Subscribes to router events with a specific handler function.
     *
     * @param {EventSubscriptionConfig} config - The configuration for the event subscription.
     */
    subscribe(config: EventSubscriptionConfig): void;

    /**
     * Unsubscribes from router events using the subscription identifier.
     *
     * @param {string} id - The identifier of the subscription to remove.
     */
    unsubscribe(id: string): boolean;
}
/**
 * Defines the SimplyBuilderRouterInterface class, which encapsulates router functionality.
 *
 * @class SimplyBuilderRouterInterface
 */
declare class SimplyBuilderRouterInterface {
    /**
     * Constructs a new instance and initializes it with optional router configuration data.
     *
     * @param {RouterInitializationData} [data={}] - Initialization data for the router.
     */
    constructor(data?: RouterInitializationData);

    /**
     * Registers a route using either a simple string identifier or a more complex object
     * detailing the route configuration.
     *
     * @param {string | RouteConfig} data - Identifier for the route or an object with route details.
     * @returns {boolean} - True if the registration was successful, false otherwise.
     */
    register(data: string | RouteConfig): boolean;

    /**
     * Unregisters a previously registered route based on its string identifier.
     *
     * @param {string} id - The identifier of the route to unregister.
     * @returns {boolean} - True if the unregistration was successful, false otherwise.
     */
    unregister(id: string): boolean;

    /**
     * Navigates to a route identified by a string identifier.
     *
     * @param {string} id - The identifier of the route to navigate to.
     * @returns {boolean} - True if the navigation was successful, false otherwise.
     */
    navigate(id: string): boolean;

    /**
     * Retrieves the current and previous route states.
     *
     * @returns {RouterState} - An object containing the current and previous routes.
     */
    state(): RouterState;
    /**
     * Provides access to the router's event handling functionality.
     */
    events: RouterEvents;
}

/**
 * Type definitions for router initialization data.
 */
interface RouterInitializationData {
    home?: string;
    subpath?: boolean;
    prefix?: string;
}

/**
 * Type definitions for the route configuration object.
 */
interface RouteConfig {
    id: string;
    title?: string;
    redirect?: string;
}

/**
 * Type definitions for the router state.
 */
interface RouterState {
    current: string;
    previous: string;
}

/**
 * Defines the RouterModule with properties and methods to interact with the router system.
 * This export ensures that the module's integrity is maintained and prevents modifications.
 *
 * @type {Readonly<{instance: (data?: RouterInitializationData) => SimplyBuilderRouterInterface, name: string, version: string}>}
 */
export const RouterModule: Readonly<{
    instance: (data?: RouterInitializationData) => SimplyBuilderRouterInterface;
    name: string;
    version: string;
}>;
