import type { Entity, ListResponse } from './common';

export interface Place extends Entity {
  name: string;
  rating: number | null;
}

export interface PlaceCreateInput {
  name: string;
  rating: number | null;
}

export interface PlaceUpdateInput extends PlaceCreateInput {}

export interface CreatePlaceRequest extends PlaceCreateInput {}
export interface UpdatePlaceRequest extends PlaceUpdateInput {}

export interface GetAllPlacesResponse extends ListResponse<Place> {}
export interface GetPlaceByIdResponse extends Place {}
export interface CreatePlaceResponse extends GetPlaceByIdResponse {}
export interface UpdatePlaceResponse extends GetPlaceByIdResponse {}
