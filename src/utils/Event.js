function Event() {
    this.events = new Map();
}

Event.prototype.on = function on(eventName, eventListener) {
    let evSet = this.events.get(eventName);

    if (!evSet) {
        evSet = new Set();
        this.events.set(eventName, evSet);
    }
    evSet.add(eventListener);
};

Event.prototype.emit = function emit(eventName, data) {
    const evSet = this.events.get(eventName);

    if (!evSet) {
        return;
    }
    for (const listener of evSet) {
        listener(data);
    }
};

Event.prototype.off = function emit(eventName, listener) {
    const evSet = this.events.get(eventName);

    if (!evSet) {
        return;
    }
    if (listener === undefined) {
        evSet.clear();
        return;
    }
    evSet.delete(listener);
};

Event.prototype.once = function once(eventName, listener) {
    let evSet = this.events.get(eventName);
    const onceListener = (data) => {
        listener(data);
        evSet.off(eventName, onceListener);
    };

    if (!evSet) {
        evSet = new Set();
        this.events.set(eventName, evSet);
    }
    evSet.add(onceListener);
};

export default new Event();
