class UidCallbackMap {
  private uidToCallbackMap: Map<string, NodeJS.Timeout>;

  constructor() {
    this.uidToCallbackMap = new Map();
  }

  public insert(uid: string, callback: NodeJS.Timeout): void {
    this.uidToCallbackMap.set(uid, callback);
  }

  public remove(uid: string): void {
    this.uidToCallbackMap.delete(uid);
  }

  public stopAndRemove(uid: string): void {
    const callback = this.uidToCallbackMap.get(uid);
    if (callback) {
      clearTimeout(callback);
    }
    this.remove(uid);
  }
}

export default new UidCallbackMap();
