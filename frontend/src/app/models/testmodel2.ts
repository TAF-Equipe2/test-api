export interface testModel2 {
    method: string;
    apiUrl: string;
    headers: { [key: string]: string };
    responseTime?: number;
    expectedOutput?: string;
    statusCode?: number;
    expectedHeaders?: string;
  }