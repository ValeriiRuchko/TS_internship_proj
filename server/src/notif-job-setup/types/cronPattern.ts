export interface CronPatternPart {
  cronPatternHours: string;
  cronPatternMinutes: string;
  notificationTimeId: string;
}

export interface CronPattern {
  cronPattern: string;
  notificationTimeId: string;
}
