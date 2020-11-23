export interface HistoryItem {
  content: string;
  executed_at: string;
  finished_at: string;
  share_link: string;
  user: string;
}

// TODO
export interface HistoryState {
  [id: string]: HistoryItem;
}
