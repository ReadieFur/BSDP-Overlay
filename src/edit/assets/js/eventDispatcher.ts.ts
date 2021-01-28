/**
 * Tweaked from https://gist.github.com/eitanavgil/1c7f6e442476948ea7230523c2919bfe
 * Simple (Event)Dispatcher class
 * Inspiered by https://medium.com/@LeoAref/simple-event-dispatcher-implementation-using-javascript-36d0eadf5a11
 */
export class eventDispatcher
{
    private events: Events = {};

    public addListener(event: string, callback: (data?: any) => any): boolean
    {
        if (this.events[event] !== undefined) { return false; }
        this.events[event] = { listeners: [] };
        this.events[event].listeners.push(callback);
        return true;
    }
  
    public removeListener(event: string, callback: (data?: any) => any): boolean
    {
        if (this.events[event] === undefined) { return false; }
        for (let i = 0; i < this.events[event].listeners.length; i++) //Modified to what I understand
        { if (this.events[event].listeners[i] === callback) { delete this.events[event].listeners[i]; } }
        return true;
    }
  
    public dispatch(event: string, data?: any): boolean
    {
        if (this.events[event] === undefined) { return false; }
        this.events[event].listeners.forEach((listener: any) => { listener(data); });
        return true;
    }
}

type Events =
{
    [eventName: string]:
    {
        listeners: { (data?: any): any; } []
    }
}