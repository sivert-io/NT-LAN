export type EventType = {
    name: string;
    id: number;
    startDate: Date;
    endDate: Date;
};

export interface EventData {
    events: EventType[];
};