

export interface ConfirmMessage {
  
  message: string[];
  accept: Function;

  checkBox?: {
    text: string,
    fn: Function,
  }
}