# ineeda

[![npm version](https://img.shields.io/npm/v/ineeda.svg)](https://img.shields.io/npm/v/ineeda.svg)

Auto-mocking with [Proxies](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy)! Works best with TypeScript, but works just as well with JavaScript!

# Installation:

```
npm install ineeda --save-dev
```

# Mocking:

### To get a mock of a concrete class:

```typescript
import { Hero } from './Hero';

import { ineeda } from 'ineeda';

let hero: Hero = ineeda<Hero>();
console.log(hero.age); // [IneedaProxy] (truthy!)
console.log(hero.weapon.isMagic); // [IneedaProxy] (truthy!)
console.log(hero.weapon.sharpen()); // Error('"sharpen" is not implemented.');

let bonnie: Hero = ineeda<Hero>({ name: 'Bonnie' });
console.log(bonnie.name); // 'Bonnie'
```

### To get a mock of an interface:

```typescript
import { IHorse } from './IHorse';

import { ineeda } from 'ineeda';

let horse: IHorse = ineeda<IHorse>();
horse.hero.weapon.sharpen(); // Error('"sharpen" is not implemented.');
```

### To get a mock of a concrete class that is an actual instance of that class:

```typescript
import { Hero } from './Hero';

import { ineeda } from 'ineeda';

let realHero: Hero = ineeda.instanceof<Hero>(Hero);
console.log(realHero instanceof Hero); // true;
```

### To get a factory that produces mocks of a concrete class:

```typescript
import { Hero } from './Hero';

import { ineeda, IneedaFactory } from 'ineeda';

let heroFactory: IneedaFactory<Hero> = ineeda.factory<Hero>();
let heroMock: Hero = heroFactory();
```

# Intercepting:

### Overriding proxied values:

Since the result of a call to `ineeda` is a proxy, it will happily pretend to be any kind of object you ask it to be! That can cause some issues, such as when dealing with `Promises` or `Observables`. To get around that, you can use `intercept`.

When you need a fake `Promise` or `Observable`:

```typescript
let mockObject = ineeda<MyObject>();

function looksLikePromise (obj) {
    return !!obj.then;
}

looksLikePromise(mockObject); // true;
looksLikePromise(mockObject.intercept({ then: null })); // false;

let mockObject = ineeda<MyObject>();
let myObservable$ = Observable.of(mockObject.intercept({ schedule: null }));
```

Remembering which properties need to be intercepted can be a pain, and rather error prone. Alternatively, you can assign a `key`, which you can use to set up specific values that should be intercepted. In your test config you might do something like the following:

```typescript
// Prevent Bluebird from thinking ineeda mocks are Promises:
ineeda.intercept<Promise<any>>(Promise, { then: null });

// Prevent RxJS from thinking ineeda mocks are Schedulers:
ineeda.intercept<Scheduler>(Observable, { schedule: null });

// Prevent jasmine from thinking ineeda mocks already have the fields 'and' and 'calls'
ineeda.intercept((value: any, key: string, values: any, target: any) => {
    if (key === 'and' || key === 'calls') {
        Object.defineProperty(target, key, {
            enumerable: false
        });
    }
    return value;
});
```

Then later, in your tests, you could do the following:

```typescript
let mockObject = ineeda<MyObject>();

function looksLikePromise (obj) {
    return !!obj.then;
}

looksLikePromise(mockObject); // true;
looksLikePromise(mockObject.intercept(Promise)); // false;

let mockObject = ineeda<MyObject>();
let myObservable$ = Observable.of(mockObject.intercept(Observable));
```

You can also *globally* intercept something on all objects, by using the `intercept` method without the `key`:

```typeScript
ineeda.intercept({
    // Prevent zone.js from thinking ineeda mocks are unconfigurable:
    __zone_symbol__unconfigurables: null
});
```

### Adding behaviour to proxied values:

`intercept` can also be used to augment the behaviour of all mocks. One example might be to make every mocked function a `spy`.

```typescript
// Prevent sinon from thinking ineeda mocks are already spies:
ineeda.intercept({
    restore: null,
    calledBefore: null
});

// Intercept all values that are functions and turn it into a stub:
ineeda.intercept((value, key: string, values, target) => {
    if (value instanceof Function) {
        target[key] = () => { };
        return sinon.stub(target, key, values[key]);
    }
    return value;
});

let mockObject = ineeda<MyObject>();
mockObject.someMethod(1, 2, 3);

// Using sinon-chai:
expect(mockObject.someMethod).to.have.been.calledWith(1, 2, 3);
```
