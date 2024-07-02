export type TGetAllStatisticsResponse = TApiResponse<{
    activeAuthorizations: number;
    todayEntries: number;
    occupiedFacilities: number;
}>;
