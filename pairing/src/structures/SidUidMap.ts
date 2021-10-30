import { User } from 'constants/user';

class SidUidMap {
  private sidToUidMap: Map<string, string>;
  private sidToUserMap: Map<string, User>;

  constructor() {
    this.sidToUidMap = new Map();
    this.sidToUserMap = new Map();
  }

  public insertUid(sid: string, uid: string): void {
    this.sidToUidMap.set(sid, uid);
  }

  public insertUser(sid: string, user: User): void {
    this.sidToUserMap.set(sid, user);
  }

  public retrieveUid(sid: string): string | undefined {
    return this.sidToUidMap.get(sid);
  }

  public retrieveUser(sid: string): User | undefined {
    return this.sidToUserMap.get(sid);
  }

  public remove(sid: string): [string, User | undefined] {
    const uid = this.retrieveUid(sid)!;
    const user = this.retrieveUser(sid);
    this.sidToUidMap.delete(sid);
    this.sidToUserMap.delete(sid);
    return [uid, user];
  }
}

export default new SidUidMap();
