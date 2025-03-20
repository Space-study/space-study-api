export class Room {
  constructor(
    private readonly id: number,
    private readonly name: string,
    private readonly privacy: 'public' | 'private',
    private readonly maxMembers: number,
    private readonly imageUrl: string,
    private readonly category: string,
    private readonly createdAt: Date,
    private readonly status: 'active' | 'ban' | 'pending' = 'pending',
    private readonly invite_link: string,
  ) {}

  getPrivacy(): 'public' | 'private' {
    return this.privacy;
  }

  getInviteLink(): string {
    return this.invite_link;
  }

  getMaxMembers(): number {
    return this.maxMembers;
  }
}
