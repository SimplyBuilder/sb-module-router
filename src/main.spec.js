// noinspection DuplicatedCode

'use strict';

import { it, describe } from 'node:test';
import {ok, strictEqual, deepEqual} from 'node:assert';

import {JSDOM} from "jsdom";
const dom = new JSDOM(`<!DOCTYPE html><html lang="en"><head><title>test</title></head><body></body></html>`);
global['window'] = dom.window;
global['document'] = dom.window.document;

const {RouterModule} = await import("./main.js");

describe('RouterModule functionality tests', () => {
    it('name and version properties should be accessible', () => {
        strictEqual(RouterModule.name, 'SimplyBuilderModuleLibName', 'The name property should match the expected value');
        strictEqual(RouterModule.version, 'SimplyBuilderModuleLibVersion', 'The version property should match the expected value');
    });
    it('getRouterInstance should return a router instance', () => {
        const routerInstance = RouterModule.instance({});
        ok(routerInstance, 'Should return a valid router instance');
        strictEqual(typeof routerInstance.navigate, 'function', 'The router instance should have a navigate method');
        strictEqual(typeof routerInstance.register, 'function', 'The router instance should have a register method');
        strictEqual(typeof routerInstance.unregister, 'function', 'The router instance should have an unregister method');
        strictEqual(typeof routerInstance.state, 'function', 'The router instance should have a state method');
    });
});

export default Object.freeze({})