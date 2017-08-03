// Global type definitions for custom implementations

// declare var utils: any;
declare function Draggabilly(elem: any, options: any): void;

interface Element extends Element {
    set?(path: string|(string|number)[], value: any, root?: Object): void;
    SDO_VIEWMODEL?: any;
    READ_MODEL?: Event;
    UPDATE_MODEL?: Event;
    UPDATE_TEMPLATE?: Event;
    ELEMENTS?: [];
}

interface Window extends Window {
    utils: any;
}
