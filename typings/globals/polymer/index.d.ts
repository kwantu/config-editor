// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/c427b4ec7afc9724932458af1a50791d341cf41d/polymer/index.d.ts
declare namespace polymer {

  type PropConstructorType = StringConstructor | ObjectConstructor | BooleanConstructor | NumberConstructor | DateConstructor | ArrayConstructor;

  interface PropObjectType {
    type: PropConstructorType;
    value?: boolean | number | string | Function | Object;
    reflectToAttribute?: boolean;
    readOnly?: boolean;
    notify?: boolean;
    computed?: string;
    observer?: string;
  }

  interface Base {
    /** Need to allow all properties for callback methods. */
    [prop: string]: any;

    /* polymer-micro */

    // Attributes

    hostAttributes?: {[name:string]:any};

    reflectPropertiesToAttribute?(name: string): void;

    serializeValueToAttribute?(value: any, attribute: string, node?: Element): void;

    deserialize?(value: string, type: NumberConstructor): number;
    deserialize?(value: string, type: BooleanConstructor): boolean;
    deserialize?(value: string, type: ObjectConstructor): Object;
    deserialize?(value: string, type: ArrayConstructor): any[];
    deserialize?(value: string, type: DateConstructor): Date;
    deserialize?(value: string, type: StringConstructor): string;

    serialize?(value: any): string;

    // Behaviors

    behaviors?:Object[];

    // Constructors

    factoryImpl?(...args: any[]): void;

    // Debouncer

    debounce?(jobName: string, callback: Function, wait: number): void;

    isDebouncerActive?(jobName: string): boolean;

    flushDebouncer?(jobName: string): void;

    cancelDebouncer?(jobName: string): void;

    // Extends

    extends?: string;

    getNativePrototype?(tag: string): Object;

    // Properties

    properties?:{[prop:string]:(PropConstructorType|PropObjectType);};

    getPropertyInfo?(property: string): Object;

    // Tag

    is: string;

    /* polymer-mini */

    // Ready

    ready?(): void;

    attachedCallback?(): void;

    // Shady

    domHost?(): Element;

    distributeContent?(): void;

    elementMatches?(selector: string, node?: Element): boolean;

    // Template {

    instanceTemplate?(template: HTMLElement): DocumentFragment;

    /* polymer-standard */


    // Annotations

    $?: any;

    // Events

    listeners?: {[key:string]:string;};

    listen?(node: Element, eventName: string, methodName: string): void;

    unlisten?(node: Element, eventName: string, methodName: string): void;

    // Gestures

    setScrollDirection?(direction: string, node?: HTMLElement): void;

    // NotifyPath

    notifyPath?(path: string, value: any, fromAbove: any): void;

    set?(path: string|(string|number)[], value: any, root?: Object): void;

    get?(path: string|(string|number)[], root?: Object): any;

    linkPaths?(to: string, from?: string): void;

    unlinkPaths?(path: string): void;

    push?(path: string, ...item: any[]): number;

    pop?(path: string): any;

    splice?(path: string, index: number, removeCount: number, ...item: any[]):
        number;

    shift?(path: string): any;

    unshift?(path: string, ...item: any[]): number;

    // ResolveUrl

    resolveUrl?(url: string): string;

    // Styling

    scopeSubtree?(container: Element, shouldObserve: boolean): void;

    // Utils

    $$?(selector: string): Element;

    toggleClass?(name: string, bool?: boolean, node?: HTMLElement): void;

    toggleAttribute?(name: string, bool?: boolean, node?: HTMLElement): void;

    classFollows?(name: string, toElement: HTMLElement, fromElement: HTMLElement): void;

    attributeFollows?(name: string, toElement: HTMLElement, fromElement: HTMLElement): void;

    getContentChildNodes?(selector: string): Node[];

    getContentChildren?(selector: string): HTMLElement[];

    fire?(type: string, detail?: any, options?: Object): CustomEvent;

    async?(callback: ()=>void, waitTime?: number): number;

    cancelAsync?(handle: number): void;

    arrayDelete?(path: string|any[], item: any): any[];

    transform?(transform: string, node?: HTMLElement): void;

    translate3d?(x: number, y: number, z: number, node?: HTMLElement): void;

    importHref?(href: string, onload?: Function, onerror?: Function): HTMLLinkElement;

    create?(tag: string, props: Object): Element;

    isLightDescendant?(node: HTMLElement): boolean;

    isLocalDescendant?(node: HTMLElement): boolean

    // XStyling

    updateStyles?(): void;

    /* common api */

    registerCallback?():void;

    createdCallback?():void;

    attachedCallback?():void;

    detachedCallback?():void;

    attributeChangedCallback?(name: string):void;

    extend?(prototype: Object, api: Object):Object;

    mixin?(target: Object, source: Object):Object;

    copyOwnProperty?(name: string, source: Object, target: Object):void;

    observers?: string[];

    beforeRegister?(): void;

    registered?(): void;

    created?(): void;

    attached?(): void;

    detached?(): void;

    attributeChanged?(name: string, oldValue: any, newValue: any): void;

  }

  interface DomApiStatic {

    (obj: Node|Base):DomApi;

    (obj: Event):EventApi;

    flush():void;
  }

  interface DomApi {

    appendChild(node: Node): Node;

    insertBefore(node: Node, refNode?: Node):Node;

    removeChild(node: Node):Node;

    replaceChild(node: Node, refNode: Node):Node;

    getOwnerRoot():Node;

    querySelector(selector: string):Node;

    querySelectorAll(selector: string):Node[];

    getDestinationInsertionPoints():Node[];

    getDistributedNodes():Node[];

    queryDistributedElements(selector: string):Node[];

    setAttribute(name: string, value: any):void;

    removeAttribute(name: string):void;

    childNodes:Node[];

    children:Element[];

    parentNode:Node;

    firstChild:Node;

    lastChild:Node;

    nextSibling:Node;

    previousSibling:Node;

    firstElementChild:Element;

    lastElementChild:Element;

    nextElementSibling:Element;

    previousElementSibling:Element;

    textContent:string;

    innerHTML:string;
  }

  interface EventApi {

    rootTarget:EventTarget;

    localTarget:EventTarget;

    path:Node[];
  }

  interface Settings {
      hasNativeCSSProperties: boolean
      hasNativeImports: boolean
      hasShadow: boolean
      nativeShadow: boolean
      useNativeCSSProperties: boolean
      useNativeCustomElements: boolean
      useNativeImports: boolean
      useNativeShadow: boolean
      usePolyfillProto: boolean
      useShadow: boolean
      wantShadow: boolean
  }

  interface RenderStatus {
    afterNextRender(element: Element, fn: Function, args?: any): void;
    hasRendered(): boolean;
    whenReady(cb: Function): void;
  }

  interface ImportStatus extends RenderStatus {
    whenLoaded(cb: Function): void;
  }

  interface PolymerStatic {
    Settings: Settings;

    isInstance(element: string): boolean;
    Base: Base;
    dom: DomApiStatic;

    (prototype: Base | { new (): Base }): webcomponents.CustomElementConstructor;

    Class(prototype: Base | { new (): Base }): webcomponents.CustomElementConstructor;

    RenderStatus: RenderStatus

    /** @deprecated */
    ImportStatus: ImportStatus
  }
}

declare var Polymer: polymer.PolymerStatic;
