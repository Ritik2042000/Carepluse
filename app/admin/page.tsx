import {DataTable} from "@/components/table/DataTable";
import StartCard from "@/components/StartCard";
import { getRecentAppointmentList } from "@/lib/actions/appointment.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {columns} from "@/components/table/Colums";

const Admin = async () => {

  const appointments = await getRecentAppointmentList()
  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src={"/assets/icons/logo-full.svg"}
            alt="logo"
            height={32}
            width={162}
            className="h-8 w-fit"
          />
        </Link>
        <p className="text-16-semibold">Admin Dashboard</p>
      </header>
      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the Day with managing new appointments
          </p>
        </section>
        <section className="admin-stat">
          <StartCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Schedule Appointment "
            icon="assets/icons/appointments.svg"
          />
          <StartCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending Appointment "
            icon="assets/icons/pending.svg"
          />
          <StartCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled Appointment "
            icon="assets/icons/cancelled.svg"
          />
        </section>
        <DataTable columns={columns} data={appointments.documents} />
      </main>
    </div>
  );
};

export default Admin;
