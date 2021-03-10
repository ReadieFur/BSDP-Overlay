export class EventDispatcher {
    constructor() {
        this.events = {};
    }
    addListener(event, callback) {
        if (this.events[event] !== undefined) {
            return false;
        }
        this.events[event] = { listeners: [] };
        this.events[event].listeners.push(callback);
        return true;
    }
    removeListener(event, callback) {
        if (this.events[event] === undefined) {
            return false;
        }
        for (let i = 0; i < this.events[event].listeners.length; i++) {
            if (this.events[event].listeners[i] === callback) {
                delete this.events[event].listeners[i];
            }
        }
        return true;
    }
    dispatch(event, data) {
        if (this.events[event] === undefined) {
            return false;
        }
        this.events[event].listeners.forEach((listener) => { listener(data); });
        return true;
    }
}
//# sourceMappingURL=eventDispatcher.js.map