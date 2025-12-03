import type { Room as DbRoom } from '../generated/prisma';

export type Room = DbRoom;
  
  export interface RoomSearchParams {
    name?: string;
    location?: string;
    capacity?: number;
    checkIn?: string;  
    checkOut?: string; 
    page?: number;
    pageSize?: number;
  }
  
  export interface PaginatedRoomsResult {
    items: Room[];
    page: number;
    pageSize: number;
    total: number;
  }
  