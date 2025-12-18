export class Goal {
  constructor(
    public id: number,
    public userId: number,
    public title: string,
    public description: string,
    public status: string,
    public progress: number,
    public createdAt: Date | null,
    public updatedAt: Date | null
  ) {}

  static fromApi(dto: any): Goal {
    return new Goal(
      dto.id,
      dto.userId,
      dto.title,
      dto.description,
      dto.status,
      dto.progress,
      dto.createdAt ? new Date(dto.createdAt) : null,
      dto.updatedAt ? new Date(dto.updatedAt) : null
    );
  }
}