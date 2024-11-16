"use server";
import { ID, Query } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
  messaging,
} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.type";
import { revalidatePath } from "next/cache";

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );
    return parseStringify(newAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId
    );
    return parseStringify(appointment);
  } catch (error) {
    console.log(error);
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const count = (appointments.documents as Appointment[]).reduce(
      (accum, appointment) => {
        if (appointment.status === "scheduled") {
          accum.scheduledCount += 1;
        } else if (appointment.status === "pending") {
          accum.pendingCount += 1;
        } else if (appointment.status === "cancelled") {
          accum.cancelledCount += 1;
        }

        return accum;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...count,
      documents: appointments.documents,
    };

    return parseStringify(data);
  } catch (error) {
    console.log(error);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  appointment,
  type,
}: UpdateAppointmentParams) => {

  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) {
      throw new Error("Appointment Not Found");
    }
    // SMS notification
    const smsMessage = `Hi,it's CarePluse,
    ${type === 'schedule' ? `Your appointment has been scheduled for ${formatDateTime(appointment.schedule!).dateTime} with Dr.${appointment.primaryPhysician} ` : `We regrate to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}`   }
    `

await sendSMSNotification(userId,smsMessage)

    revalidatePath("/admin");
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const sendSMSNotification = async (userID: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userID]
    );
    return parseStringify(message);
  } catch (error) {
    console.log(error);
  }
};
