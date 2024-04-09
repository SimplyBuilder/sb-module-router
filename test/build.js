'use strict';

import { test, describe } from 'node:test';
import {ok, strictEqual, deepEqual} from 'node:assert';


import {JSDOM} from "jsdom";
const dom = new JSDOM(`<!DOCTYPE html><html lang="en"><head><title>test</title></head><body></body></html>`);
global['window'] = dom.window;
global['document'] = dom.window.document;


const { RouterModule } = await import('#sb-module-router');

describe('Build RouterModule should initialize correctly', () => {
    const router = RouterModule.instance('testEvent');
    test("check object", () => {
        ok(typeof RouterModule === "object");
        //
        deepEqual(Object.keys(RouterModule), ['name', 'version', 'instance']);
        //
        ok(typeof RouterModule.name === "string");
        ok(typeof RouterModule.version === "string");
        ok(typeof RouterModule.instance === "function");

        ok(typeof router === "object");

        ok(typeof router.register === "function");
        ok(typeof router.unregister === "function");
        ok(typeof router.navigate === "function");
        ok(typeof router.state === "function");

        ok(typeof router.immutable === "function");
        ok(typeof router.instanceOf === "string");
        ok(typeof router.events === "object");

        ok(router.instanceOf === "SimplyBuilderRouterInterface");

        ok(typeof router.events.subscribe === "function");
        ok(typeof router.events.unsubscribe === "function");

    });
});