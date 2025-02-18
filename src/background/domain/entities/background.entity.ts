export class Background {
  constructor(
    public background_id: number,
    public user_create_id: number,
    public category_id: number,
    public thumbnail_path: string,
    public title: string,
    public description: string,
    public created_at: Date,
  ) {}
}
