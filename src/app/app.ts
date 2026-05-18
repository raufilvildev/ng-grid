import { Component, signal } from '@angular/core';
import { NgGrid } from './ng-grid/ng-grid';
import { IPaginationData } from './ng-grid/interfaces/i-pagination-data';
import { IColDef } from './ng-grid/interfaces/i-col-def';

@Component({
  selector: 'app-root',
  imports: [NgGrid],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ng-grid');

  console = console;

  colDefs: IColDef[] = [
    { field: 'id', headerName: 'ID', type: 'number', width: 125 },
    { field: 'name', headerName: 'Nombre', type: 'string', width: 150 },
    { field: 'age', headerName: 'Edad', type: 'number', width: 125 },
    { field: 'email', headerName: 'Correo electrónico', type: 'string', width: 250 },
    { field: 'isActive', headerName: 'Activo', type: 'boolean', width: 125 },
    { field: 'role', headerName: 'Rol', type: 'string', width: 100 },
    { field: 'createdAt', headerName: 'Fecha de creación', type: 'date-time', width: 215 },
    { field: 'updatedAt', headerName: 'Fecha de actualización', type: 'date-time', width: 215 },
  ] as const;

  rows = [
    {
      id: 1,
      name: 'Ana',
      age: 28,
      email: 'ana@example.com',
      isActive: true,
      role: 'admin',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2025-03-10T08:15:00Z',
    },
    {
      id: 2,
      name: 'Luis',
      age: 34,
      email: 'luis@example.com',
      isActive: false,
      role: 'admin',
      createdAt: '2023-11-20T14:45:00Z',
      updatedAt: '2024-12-01T12:00:00Z',
    },
    {
      id: 3,
      name: 'María',
      age: 22,
      email: 'maria@example.com',
      isActive: true,
      role: 'user',
      createdAt: '2025-02-05T09:20:00Z',
      updatedAt: '2025-04-01T16:40:00Z',
    },
    {
      id: 4,
      name: 'Carlos',
      age: 45,
      email: 'carlos@example.com',
      isActive: true,
      role: 'admin',
      createdAt: '2024-05-12T11:00:00Z',
      updatedAt: '2025-03-20T13:30:00Z',
    },
    {
      id: 5,
      name: 'Sofía',
      age: 31,
      email: 'sofia@example.com',
      isActive: true,
      role: 'user',
      createdAt: '2023-09-18T15:25:00Z',
      updatedAt: '2025-02-14T10:45:00Z',
    },
    {
      id: 6,
      name: 'Diego',
      age: 29,
      email: 'diego@example.com',
      isActive: false,
      role: 'user',
      createdAt: '2024-07-30T08:50:00Z',
      updatedAt: '2025-01-25T14:20:00Z',
    },
    {
      id: 7,
      name: 'Elena',
      age: 38,
      email: 'elena@example.com',
      isActive: true,
      role: 'user',
      createdAt: '2024-03-22T12:15:00Z',
      updatedAt: '2025-04-05T09:35:00Z',
    },
    {
      id: 8,
      name: 'Roberto',
      age: 52,
      email: 'roberto@example.com',
      isActive: true,
      role: 'user',
      createdAt: '2023-12-10T16:40:00Z',
      updatedAt: '2025-03-15T11:50:00Z',
    },
    {
      id: 9,
      name: 'Isabel',
      age: 26,
      email: 'isabel@example.com',
      isActive: false,
      role: 'admin',
      createdAt: '2024-06-05T10:05:00Z',
      updatedAt: '2024-11-20T15:30:00Z',
    },
    {
      id: 10,
      name: 'Pedro',
      age: 41,
      email: 'pedro@example.com',
      isActive: true,
      role: 'admin',
      createdAt: '2024-02-14T13:20:00Z',
      updatedAt: '2025-03-25T12:00:00Z',
    },
    {
      id: 11,
      name: 'Valentina',
      age: 24,
      email: 'valentina@example.com',
      isActive: true,
      role: 'admin',
      createdAt: '2024-08-19T14:55:00Z',
      updatedAt: '2025-04-02T08:25:00Z',
    },
    {
      id: 12,
      name: 'Marcos',
      age: 36,
      email: 'marcos@example.com',
      isActive: false,
      role: 'admin',
      createdAt: '2023-10-25T09:30:00Z',
      updatedAt: '2025-02-28T17:10:00Z',
    },
    {
      id: 13,
      name: 'Gabriela',
      age: 33,
      email: 'gabriela@example.com',
      isActive: true,
      role: 'user',
      createdAt: '2024-04-08T11:45:00Z',
      updatedAt: '2025-03-30T14:55:00Z',
    },
  ];

  paginationData: IPaginationData = {
    totalNumberOfRows: 20,
    totalNumberOfFilteredRows: 20,
    numberOfResultsPerPage: 13,
  };

  values: { [key: string]: any } = {
    role: ['admin', 'user'],
    isActive: [true, false],
  };
}
