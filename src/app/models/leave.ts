export class Leave {
    constructor(
      public fromDate?: Date,
      public toDate?: Date,
      public totalLeaves?: number,
      public reason?: string,
      public leaveType?:string,

    ) {}
  }