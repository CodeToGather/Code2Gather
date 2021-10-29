class SidToUid {
  sidToUidMap: Map<string, string>;

  constructor() {
    this.sidToUidMap = new Map();
  }

  public insert(sid: string, uid: string): void {
    this.sidToUidMap.set(sid, uid);
  }

  public retrieve(sid: string): string | undefined {
    return this.sidToUidMap.get(sid);
  }

  public remove(sid: string): void {
    this.sidToUidMap.delete(sid);
  }
}

export default new SidToUid();
