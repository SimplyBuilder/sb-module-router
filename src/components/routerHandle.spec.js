// noinspection DuplicatedCode
'use strict';

import { it, describe } from 'node:test';
import {ok, strictEqual, deepEqual} from 'node:assert';

import {JSDOM} from "jsdom";
const dom = new JSDOM(`<!DOCTYPE html><html lang="en"><head><title>test</title></head><body></body></html>`);
global['window'] = dom.window;
global['document'] = dom.window.document;

const {RouterHandler} = await import("./routerHandle.js");

describe('RouterHandler exported functionality tests', () => {
    it("check object", () => {
        ok(typeof RouterHandler === "object");
        deepEqual(Object.keys(RouterHandler), ['settings', 'events', 'syncRouter', 'hashChange']);
        ok(typeof RouterHandler.settings === "function");
        ok(typeof RouterHandler.syncRouter === "function");
        ok(typeof RouterHandler.hashChange === "function");

        ok(typeof RouterHandler.events === "object");
        deepEqual(Object.keys(RouterHandler.events), ['subscribe', 'unsubscribe']);
        ok(typeof RouterHandler.events.subscribe === "function");
        ok(typeof RouterHandler.events.unsubscribe === "function");
        RouterHandler.settings({ home: '/home', prefix: 'app', title: 'Test App' });
    });
    it('subscribe and unsubscribe functionality', async () => {
        const callback = () => {};
        RouterHandler.events.subscribe({ id: 'testEvent', fn: callback });
        const unsubscribeResult = RouterHandler.events.unsubscribe('testEvent');
        ok(unsubscribeResult, 'unsubscribe should successfully remove the subscription');
    });
    it('hashChange should process hash changes correctly', () => {
        RouterHandler.hashChange({
            current: (path) => {
                strictEqual(path, 'home', 'hashChange should correctly process the hash to path');
            }
        });
        window.location.hash = '#/app/home';
    });
    it('syncRouter should synchronize based on provided data', () => {
        const data = { event: 'router-update', message: { path: 'home', title: 'Home Page' } };
        RouterHandler.syncRouter(data);
        strictEqual(document.title, 'Home Page', 'syncRouter should update the document title based on event data');
    });
});

export default Object.freeze({})