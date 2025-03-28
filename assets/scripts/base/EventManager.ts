// EventManager.ts

export enum EventType {
    EvtPlayerDeath = "EvtPlayerDeath"
}

type EventCallback = (...args: any[]) => void;

export class EventManager {
    private static _instance: EventManager;
    private eventsMap: Map<string, { callback: EventCallback; target?: any }[]> = new Map();

    // 单例访问点
    public static get Instance(): EventManager {
        if (!this._instance) {
            this._instance = new EventManager();
        }
        return this._instance;
    }

    /**
     * 监听事件
     * @param eventName 事件名
     * @param callback 回调函数
     * @param target 绑定对象（可选，用于自动移除监听）
     */
    public on(eventName: string, callback: EventCallback, target?: any): void {
        if (!this.eventsMap.has(eventName)) {
            this.eventsMap.set(eventName, []);
        }
        this.eventsMap.get(eventName)!.push({ callback, target });
    }

    /**
     * 一次性监听（触发后自动移除）
     */
    public once(eventName: string, callback: EventCallback, target?: any): void {
        const onceWrapper = (...args: any[]) => {
            callback(...args);
            this.off(eventName, onceWrapper, target);
        };
        this.on(eventName, onceWrapper, target);
    }

    /**
     * 移除监听
     * @param eventName 事件名
     * @param callback 回调函数（可选，未传则移除该事件所有回调）
     * @param target 绑定对象（可选，需与注册时一致）
     */
    public off(eventName: string, callback?: EventCallback, target?: any): void {
        const listeners = this.eventsMap.get(eventName);
        if (!listeners) return;

        if (!callback) {
            this.eventsMap.delete(eventName);
        } else {
            this.eventsMap.set(eventName, listeners.filter(listener => 
                listener.callback !== callback || listener.target !== target
            ));
        }
    }

    /**
     * 触发事件
     * @param eventName 事件名
     * @param args 传递给回调的参数
     */
    public emit(eventName: string, ...args: any[]): void {
        const listeners = this.eventsMap.get(eventName);
        if (!listeners) return;

        listeners.forEach(({ callback, target }) => {
            callback.call(target, ...args);
        });
    }
}

// 导出单例
export const eventManager = EventManager.Instance;