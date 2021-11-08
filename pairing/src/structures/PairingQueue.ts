import { Difficulty } from 'constants/difficulty';
import { User } from 'constants/user';

class PairingQueue {
  private queues: Map<Difficulty, User[]>;
  // Contains uids, cos a user might have multiple sockets
  private alreadyEnqueued: Set<string>;

  constructor() {
    this.queues = new Map();
    this.queues.set(Difficulty.EASY, []);
    this.queues.set(Difficulty.MEDIUM, []);
    this.queues.set(Difficulty.HARD, []);
    this.alreadyEnqueued = new Set();
  }

  public isInQueue(uid: string): boolean {
    return this.alreadyEnqueued.has(uid);
  }

  // Fails silently if user is already enqueued
  // In any case, once matched, the match will be broadcasted to all
  // sockets.
  public enqueue(user: User): [User, User] | undefined {
    if (this.isInQueue(user.uid)) {
      console.log('User already in queue, no change');
      throw new Error();
    }
    const queue = this.queues.get(user.difficulty)!;
    const index = queue.findIndex(
      (other) =>
        user.rating.count < 5 ||
        other.rating.count < 5 ||
        Math.abs(other.rating.average - user.rating.average) <= 0.5,
    );

    // No match found
    if (index === -1) {
      this.alreadyEnqueued.add(user.uid);
      queue.push(user);
      return;
    }

    const otherUsers = queue.splice(index);
    this.alreadyEnqueued.delete(otherUsers[0].uid);
    return [user, otherUsers[0]];
  }

  public remove(user: User): void {
    if (!this.alreadyEnqueued.has(user.uid)) {
      return;
    }
    const queue = this.queues.get(user.difficulty)!;
    const index = queue.findIndex((other) => other.uid === user.uid);
    if (index === -1) {
      // Inconsistent representation, but we'll fail silently.
      return;
    }
    queue.splice(index);
    this.alreadyEnqueued.delete(user.uid);
  }
}

export default new PairingQueue();
