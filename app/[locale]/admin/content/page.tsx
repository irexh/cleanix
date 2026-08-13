import {updateSiteContentAction} from "@/app/[locale]/admin/content/actions";
import {getSiteContentItems} from "@/lib/site-content";

export default async function AdminContentPage() {
  const contentItems = await getSiteContentItems();

  return (
    <main className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#4d8dff]">
          CLEANIX ADMIN
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-[#123b7a] sm:text-5xl">
          Content
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5d716a]">
          Tukaj urejas glavne tekste na spletni strani brez VS Code.
        </p>

        <form
          action={updateSiteContentAction}
          className="mt-8 rounded-[32px] bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-5">
            {contentItems.map((item) => (
              <label key={item.key} className="grid gap-2">
                <span className="text-sm font-extrabold text-[#123b7a]">
                  {item.label}
                </span>
                <textarea
                  name={item.key}
                  defaultValue={item.value}
                  rows={item.key.endsWith("_text") ? 4 : 2}
                  maxLength={item.key.endsWith("_text") ? 500 : 120}
                  className="resize-none rounded-2xl border border-[#dbe7fb] px-4 py-3 text-[#123b7a] outline-none focus:border-[#4d8dff]"
                />
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="admin-blue-button mt-7 px-7 py-3 text-sm"
          >
            Shrani spremembe
          </button>
        </form>
      </div>
    </main>
  );
}
