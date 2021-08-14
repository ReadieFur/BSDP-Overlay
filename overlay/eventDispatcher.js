export class EventDispatcher {
    events = {};
    AddEventListener(event, callback) {
        if (this.events[event] !== undefined) {
            return false;
        }
        this.events[event] = { listeners: [] };
        this.events[event].listeners.push(callback);
        return true;
    }
    RemoveEventListener(event, callback) {
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
    DispatchEvent(event, data) {
        if (this.events[event] === undefined) {
            return false;
        }
        this.events[event].listeners.forEach((listener) => { listener(data); });
        return true;
    }
}
//# sourceMappingURL=eventDispatcher.js.map