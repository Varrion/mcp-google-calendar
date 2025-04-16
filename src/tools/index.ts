// Unified tool registration
import { CreateHotelBookingSchema, createHotelBooking } from './calendar/booking.js';
import { CreateServiceRequestSchema, createServiceRequest } from './calendar/services.js';



export function getAllHotelSpecificToolDefinitions() {
    return [
        {
            name: "create-hotel-booking",
            description: "Creates a boutique hotel reservation with guest details",
            inputSchema: {
                type: "object",
                properties: {
                    guestName: { type: "string", description: "Name of the guest" },
                    contact: { type: "string", description: "Contact info (email or phone)" },
                    roomNumber: { type: "string", description: "Room number" },
                    checkIn: { type: "string", format: "date-time", description: "Check-in time (ISO format)" },
                    checkOut: { type: "string", format: "date-time", description: "Check-out time (ISO format)" },
                    specialRequests: { type: "string", description: "Special requests (optional)" },
                    staffNotes: { type: "string", description: "Notes for staff (optional)" }
                },
                required: ["guestName", "contact", "roomNumber", "checkIn", "checkOut"]
            },
            handler: createHotelBooking
        },
        {
            name: "create-service-request",
            description: "Schedules hotel service tasks",
            inputSchema: {
                type: "object",
                properties: {
                    serviceType: { type: "string", description: "Type of service (e.g., Housekeeping, Maintenance)" },
                    roomNumber: { type: "string", description: "Room number" },
                    requestDetails: { type: "string", description: "Details of the request" },
                    scheduledTime: { type: "string", format: "date-time", description: "When to perform the service (ISO format)" },
                    staffNotes: { type: "string", description: "Notes for staff (optional)" }
                },
                required: ["serviceType", "roomNumber", "requestDetails", "scheduledTime"]
            },
            handler: createServiceRequest
        }
    ];
}


// export function getAllHotelSpecificToolDefinitions() {
//     return [
//         {
//             name: 'create-hotel-booking',
//             description: 'Creates boutique hotel reservation with guest details',
//             inputSchema: CreateHotelBookingSchema,
//             handler: createHotelBooking
//         },
//         {
//             name: 'create-service-request',
//             description: 'Schedules hotel service tasks',
//             inputSchema: CreateServiceRequestSchema,
//             handler: createServiceRequest
//         }
//     ];
// }
