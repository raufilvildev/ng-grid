export interface IColDef {
  field: string;
  headerName: string;
  type: 'string' | 'number' | 'date' | 'date-time' | 'boolean';
  width: number;
}
