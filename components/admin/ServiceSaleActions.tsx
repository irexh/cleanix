"use client";

export default function ServiceSaleActions({
  id,
  isActive,
  toggleAction,
  deleteAction
}: {
  id: string;
  isActive: boolean;
  toggleAction: (formData: FormData) => void;
  deleteAction: (formData: FormData) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 xl:justify-end">
      <form action={toggleAction}>
        <input type="hidden" name="id" value={id} />
        <label className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={isActive}
            onChange={(event) => event.currentTarget.form?.requestSubmit()}
          />
          Aktivno
        </label>
      </form>

      {!isActive ? (
        <form action={deleteAction}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="rounded-full bg-red-100 px-4 py-2 text-sm font-extrabold text-red-700 transition hover:bg-red-200"
          >
            Zbriši
          </button>
        </form>
      ) : null}
    </div>
  );
}
