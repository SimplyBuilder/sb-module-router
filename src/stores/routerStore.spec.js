// noinspection DuplicatedCode

'use strict';

import { it, describe } from 'node:test';
import {ok, deepEqual, strictEqual, notStrictEqual} from 'node:assert';
import {RouterStore} from "./routerStore.js";

describe('RouterStore functionality tests',() => {
    const testCall = (data) => data;
    it("check object", () => {
        ok(typeof RouterStore === "object");
        deepEqual(Object.keys(RouterStore), ['events', 'current', 'state', 'register', 'unregister']);
        ok(typeof RouterStore.events === "function");
        ok(typeof RouterStore.current === "function");
        ok(typeof RouterStore.state === "function");
        ok(typeof RouterStore.register === "function");
        ok(typeof RouterStore.unregister === "function");
        RouterStore.events(testCall);
    });
    it('should register a route successfully', () => {
        const result = RouterStore.register({ id: 'testRoute', title: 'Test Route' });
        strictEqual(result, true, 'Route should be registered successfully');
    });
    it('should update current route correctly', () => {
        RouterStore.current('testRoute');
        const state = RouterStore.state();
        strictEqual(state.current, 'testRoute', 'Current route should be updated to testRoute');
    });
    it('should handle home redirection correctly', () => {
        const result = RouterStore.current('home');
        const state = RouterStore.state();
        strictEqual(state.current, 'home', 'Should redirect to home correctly');
    });
    it('should handle 404 not found route correctly', () => {
        RouterStore.register({ id: '404', title: 'Not Found' });
        const result = RouterStore.current('nonExistentRoute');
        const state = RouterStore.state();
        strictEqual(state.current, '404', 'Should update to 404 not found route for non-existent routes');
    });
    it('should unregister a route successfully', () => {
        const unregisterResult = RouterStore.unregister('testRoute');
        strictEqual(unregisterResult, true, 'Route should be unregistered successfully');
        const updateResult = RouterStore.current('testRoute');
        const state = RouterStore.state();
        notStrictEqual(state.current, 'testRoute', 'Unregistered route should not be set as current');
    });
});

export default Object.freeze({})