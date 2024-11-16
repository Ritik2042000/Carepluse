import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.action";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { use } from "react";
import * as Sentry from '@sentry/nextjs'
import { getUser } from "@/lib/actions/patient.actions";

const Success = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const appoinmentId = (searchParams?.appointmentId as string) || "";
  const appoinment = await getAppointment(appoinmentId);
  const user = await getUser(userId);

  const doctor = Doctors.find(
    (data) => data.name === appoinment.primaryPhysician
  );
  // console.log(doctor);

  Sentry.metrics.set('user_view_appointment-success',user.name)

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            height={1000}
            width={1000}
            className="h-10 w-fit"
          />
        </Link>
        <section className="flex flex-col items-center justify-center">
          <Image
            src={"/assets/gifs/success.gif"}
            alt="success"
            height={300}
            width={280}
            className=""
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">Appoinment Request</span> has
            been successfully submitted!
          </h2>
          <p>We will be in tocuh shortly to confirm. </p>
        </section>

        <section className="request-detalis flex items-center gap-3">
          <p>Requested Appointment Detalis:</p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt={doctor?.name!}
              height={100}
              width={100}
              className="size-6"
            />
            <p className="whitespace-nowrap ">Dr.{doctor?.name!}</p>
          </div>
          <div className="flex gap-2">
            <Image
            src={'/assets/icons/calendar.svg'}
            alt="calendar"
            height={24}
            width={24}
            className=""
            />
            <p>{formatDateTime(appoinment.schedule).dateTime}</p>
          </div>
        </section>
        <Button variant='outline' className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment/`}>
          New Appointment
          </Link>
        </Button>
        <p className="copyright">
        &copy;2024 CarePulse
        </p>
      </div>
    </div>
  );
};

// http://localhost:3000/patients/671f942400274982df5d/new-appointment/success?appointmentId=67336e1e00385aec9232

export default Success;
