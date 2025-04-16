import { z } from "zod";
import { google } from "googleapis";
import {OAuth2Client} from "google-auth-library";

export const CreateHotelBookingSchema = z.object({
        guestName: z.string(),
        contact: z.string().email(),
        roomNumber: z.string(),
        checkIn: z.string().datetime(),
        checkOut: z.string().datetime(),
        specialRequests: z.string().optional(),
        staffNotes: z.string().optional(),
});

export type HotelBooking = z.infer<typeof CreateHotelBookingSchema>;

export async function createHotelBooking(
    params: HotelBooking,
    oauthClient: OAuth2Client
) {

    const calendar = google.calendar({ version: 'v3', auth: oauthClient });

    const event = {
        summary: `Booking: ${params.guestName} (Room ${params.roomNumber})`,
        description: formatBookingDescription(params),
        start: { dateTime: params.checkIn },
        end: { dateTime: params.checkOut },
        location: `Room ${params.roomNumber}`,
        guestsCanSeeOtherGuests: false,
        extendedProperties: {
            private: {
                'hotel-room': params.roomNumber,
                'hotel-guest': params.guestName,
            }
        }
    };

    const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event
    });

    return {
        content: [
            {
                type: "text",
                text: `Hotel booking created: ${response.data.summary} (${response.data.id})`,
                link: response.data.htmlLink
            }
        ]
    };
}

function formatBookingDescription(booking: HotelBooking): string {
    return [
        `Guest: ${booking.guestName}`,
        `Room: ${booking.roomNumber}`,
        `Check-in: ${booking.checkIn}`,
        `Check-out: ${booking.checkOut}`,
        ...(booking.specialRequests ? [`Special Requests: ${booking.specialRequests}`] : []),
        ...(booking.staffNotes ? [`Staff Notes: ${booking.staffNotes}`] : [])
    ].join('\n\n');
}
