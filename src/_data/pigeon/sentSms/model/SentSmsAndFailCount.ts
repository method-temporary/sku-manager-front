export interface SentSmsAndFailedCount {
  sentSms: {
    eventId: string;
    from: string;
    id: string;
    message: string;
    patronKey: {
      keyString: string;
    };
    time: number;
    to: [string];
  };
  smsRsltValMsgAndCountRoms: [
    {
      count: number;
      rsltValMsg: string;
    }
  ];
  totalCount: number;
  totalFailedCount: number;
}
