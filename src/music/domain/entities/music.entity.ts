export class Music {
  constructor(
    public readonly id: number,
    public readonly user_create_id: number,
    public readonly category_id: number,
    public readonly path: string,
    public readonly title: string,
    public readonly createdAt: Date,
  ) {}
}
