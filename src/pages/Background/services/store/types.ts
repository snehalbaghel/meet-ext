// Just for reference

interface RootState {
  users: {
    [id: string]: {
      name: string;
      email: string;
      img: string;
      authCode: string;
    };
  };
  history: {
    [id: string]: {
      content: string;
      executed_at: string;
      finished_at: string;
      share_link: string;
      user: string;
    };
  };
  //   TODO
  contacts: any;
}
