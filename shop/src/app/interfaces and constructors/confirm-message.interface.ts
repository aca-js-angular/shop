

export interface ConfirmMessage {
  message: string[];
  accept: Function;
  skipCancel?: boolean;
  sticky?: boolean;

  checkBox?: {  
    text: string,
    fn: Function,
  }
}