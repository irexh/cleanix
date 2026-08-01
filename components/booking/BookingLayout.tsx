import { ReactNode } from "react";

type BookingLayoutProps = {
  summary: ReactNode;
  children: ReactNode;
};

export default function BookingLayout({
  summary,
  children,
}: BookingLayoutProps) {
  return (
    <section className="max-w-7xl mx-auto -mt-10 relative z-10 px-6">
      <div className="grid lg:grid-cols-3 gap-10">

        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-2xl p-10">
            {children}
          </div>
        </div>

        <div>
          {summary}
        </div>

      </div>
    </section>
  );
}