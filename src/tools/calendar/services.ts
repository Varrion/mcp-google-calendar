import {z} from "zod";
import {google} from "googleapis";
import {OAuth2Client} from "google-auth-library";

// 1. Define the schema for a service request
export const CreateServiceRequestSchema = z.object({
    serviceType: z.string(), // e.g., "Housekeeping", "Maintenance"
    roomNumber: z.string(),
    requestDetails: z.string(),
    scheduledTime: z.string(), // ISO date string
    staffNotes: z.string().optional(),
});

export type ServiceRequest = z.infer<typeof CreateServiceRequestSchema>;

// 2. Implement the handler function
export async function createServiceRequest(
    params: ServiceRequest,
    oauthClient: OAuth2Client
) {
    const {
        serviceType,
        roomNumber,
        requestDetails,
        scheduledTime,
        staffNotes,
    } = params;

    const calendar = google.calendar({version: 'v3', auth: oauthClient});

    const event = {
        summary: `${serviceType} for Room ${roomNumber}`,
        description: [
            `Details: ${requestDetails}`,
            staffNotes ? `Staff Notes: ${staffNotes}` : null
        ].filter(Boolean).join('\n'),
        start: {dateTime: scheduledTime},
        end: {dateTime: scheduledTime}, // or add a duration if needed
    };

    const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event
    });

    return {
        content: [
            {
                type: "text",
                text: `Service request created: ${response.data.summary} (${response.data.id})`,
                link: response.data.htmlLink
            }
        ]
    };
}
