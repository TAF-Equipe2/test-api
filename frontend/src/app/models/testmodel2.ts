export interface testModel2 {
    id: number;
    method: string;
    apiUrl: string;
    headers: { [key: string]: string };
    responseTime?: number;
    expectedOutput?: string;
    statusCode?: number;
    expectedHeaders:  { [key: string]: string };
    responseStatus : string;
  }
