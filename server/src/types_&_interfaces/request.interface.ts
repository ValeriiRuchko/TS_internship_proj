export interface ReqWithToken {
  user: {
    sub: string;
    isPremium: boolean;
  };
}
