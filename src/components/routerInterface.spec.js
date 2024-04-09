// noinspection DuplicatedCode

'use strict';

import { it, describe } from 'node:test';
import {ok, strictEqual, deepEqual, deepStrictEqual} from 'node:assert';

import {JSDOM} from "jsdom";
const dom = new JSDOM(`<!DOCTYPE html><html lang="en"><head><title>test</title></head><body></body></html>`);
global['window'] = dom.window;
global['document'] = dom.window.document;

const {RouterInterface} = await import("./routerInterface.js");

describe('RouterInterface functionality tests', () => {
    const mockStore = {
        register: ({id}) => true,
        unregister: ({id}) => true,
        current: (id) => "navigated to " + id,
        state: () => ({current: 'home', previous: null})
    };
    const router = RouterInterface({}, mockStore);
    it('register method should register routes correctly', () => {
        const result = router.register({id: 'testRoute'});
        ok(result, 'Route should be registered successfully');
    });
    it('unregister method should unregister routes correctly', () => {
        const result = router.unregister('testRoute');
        ok(result, 'Route should be unregistered successfully');
    });
    it('navigate method should handle navigation correctly', () => {
        const result = router.navigate('testRoute');
        strictEqual(result, 'navigated to testRoute', 'Navigate should return correct navigation status');
    });
    it('state method should retrieve the state correctly', () => {
        const state = router.state();
        deepStrictEqual(state, {current: 'home', previous: null}, 'State should be retrieved correctly');
    });
});

export default Object.freeze({})